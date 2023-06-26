const FLOW_ACCOUNT_CONTRACT_ADDED_EVENT = 'flow.AccountContractAdded';

export enum Tag {
  ERROR,
  LOG,
  VALUE,
  UNKNOWN,
  EVENT,
}

export type Line = {
  tag: Tag;
  value: string | object;
  timestamp: string;
  label?: string;
};

export const is =
  (tag: Tag) =>
  (line: Line): Boolean =>
    line.tag === tag;
export const isError = is(Tag.ERROR);
export const isLog = is(Tag.LOG);
export const isValue = is(Tag.VALUE);
export const isUnknown = is(Tag.UNKNOWN);

const makeLine = (tag: Tag, value: string): Line => ({
  timestamp: new Date().toLocaleTimeString([], { hour12: false }),
  tag,
  value,
});

const respIsCreateContractDeployment = (response: any): boolean => {
  return response?.data?.createContractDeployment != null;
};

const respIsCreateTransactionExecution = (response: any): boolean => {
  return response?.data?.createTransactionExecution != null;
};

const respIsCreateScriptExecution = (response: any): boolean => {
  return response?.data?.createScriptExecution != null;
};

const makeEventValues = (events: any[]): Line[] => {
  const collection = [];
  for (let d of (events || []).filter(
    (event: { type: string }) =>
      event.type !== FLOW_ACCOUNT_CONTRACT_ADDED_EVENT,
  )) {
    const values = d.values.map((v: any) => JSON.parse(v));
    collection.push(
      makeLine(
        Tag.EVENT,
        `${d.type}\n${values.map(
          (v: any) => `value: "${v.value}", type: ${v.type}`,
        )}`,
      ),
    );
  }
  return collection;
};

export const normalizeInteractionResponse = (response: any): Line[] => {
  if (response == null) return [];

  if (typeof response === 'string') {
    return [makeLine(Tag.ERROR, response)];
  }

  if (typeof response !== 'object') {
    return [makeLine(Tag.UNKNOWN, response)];
  }

  if (respIsCreateContractDeployment(response)) {
    const lines = [];
    const scoped = response.data.createContractDeployment;
    const addresses = scoped.events
      .filter(
        (event: { type: string }) =>
          event.type === FLOW_ACCOUNT_CONTRACT_ADDED_EVENT,
      )
      .map((event: { values: string[] }) => {
        const addressValue = event.values.find(
          (value: string) => JSON.parse(value)['type'] === 'Address',
        );
        if (addressValue) return JSON.parse(addressValue)['value'];
        return null;
      })
      .filter(Boolean);

    const items = makeEventValues(scoped.events);
    for (let d of scoped.logs || []) lines.push(makeLine(Tag.LOG, d));
    addresses.forEach((address: string) =>
      lines.push(
        makeLine(Tag.LOG, `Deployed Contract To: 0x${address.slice(-2)}`),
      ),
    );

    return [...items, ...lines];
  }

  if (respIsCreateTransactionExecution(response)) {
    const scoped = response.data.createTransactionExecution;
    const lines = [];
    for (let d of scoped.logs || []) lines.push(makeLine(Tag.LOG, d));
    const items = makeEventValues(scoped.events);
    if (scoped.errors && scoped.errors.length)
      lines.push(
        makeLine(
          Tag.ERROR,
          scoped.errors.map((err: any) => err.message).join('\r\n'),
        ),
      );
    return [...lines, ...items];
  }

  if (respIsCreateScriptExecution(response)) {
    const scoped = response.data.createScriptExecution;
    const lines = [];
    for (let d of scoped.logs || []) lines.push(makeLine(Tag.LOG, d));
    if (scoped.errors && scoped.errors.length)
      lines.push(
        makeLine(
          Tag.ERROR,
          scoped.errors.map((err: any) => err.message).join('\r\n'),
        ),
      );
    if (scoped.value != null) lines.push(makeLine(Tag.VALUE, scoped.value));
    return lines;
  }

  return [];
};
