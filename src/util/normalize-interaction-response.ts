export enum Tag {
  ERROR,
  LOG,
  VALUE,
  UNKNOWN,
}

export type Line = {
  tag: Tag;
  value: string | object;
  timestamp: string;
  label?: string;
};

export const is = (tag: Tag) => (line: Line): Boolean => line.tag === tag;
export const isError = is(Tag.ERROR);
export const isLog = is(Tag.LOG);
export const isValue = is(Tag.VALUE);
export const isUnknown = is(Tag.UNKNOWN);

const makeLine = (tag: Tag, value: string): Line => ({
  timestamp: new Date().toLocaleTimeString([], { hour12: false }),
  tag,
  value,
});

const respIsDeployContract = (response: any): boolean => {
  return response?.data?.deployContract != null;
};

const respIsCreateTransactionExecution = (response: any): boolean => {
  return response?.data?.createTransactionExecution != null;
};

const respIsCreateScriptExecution = (response: any): boolean => {
  return response?.data?.createScriptExecution != null;
};

export const normalizeInteractionResponse = (response: any): Array<Line> => {
  if (response == null) return [];

  if (typeof response === 'string') {
    return [makeLine(Tag.ERROR, response)];
  }

  if (typeof response !== 'object') {
    return [makeLine(Tag.UNKNOWN, response)];
  }

  if (respIsDeployContract(response)) {
    const scoped = response.data.deployContract;
    return [
      makeLine(Tag.LOG, `Deployed Contract "${scoped.title}" To: 0x0${scoped.index + 1}`),
    ];
  }

  if (respIsCreateTransactionExecution(response)) {
    const scoped = response.data.createTransactionExecution;
    const lines = [];
    for (let d of scoped.logs) lines.push(makeLine(Tag.LOG, d));
    if (scoped.errors && scoped.errors.length)
      lines.push(
        makeLine(
          Tag.ERROR,
          scoped.errors.map((err: any) => err.message).join('\r\n'),
        ),
      );
    return lines;
  }

  if (respIsCreateScriptExecution(response)) {
    const scoped = response.data.createScriptExecution;
    const lines = [];
    for (let d of scoped.logs) lines.push(makeLine(Tag.LOG, d));
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
