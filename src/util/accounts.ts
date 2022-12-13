const accountAddresses = ['0x01', '0x02', '0x03', '0x04', '0x05'];
export const storageMapByIndex = (index: number): string => {
  if (index < 0) return null;
  return accountAddresses[index];
};

export const storageMapByAddress = (address: string): number => {
  if (!address) return 0;
  return accountAddresses.indexOf(address);
};
