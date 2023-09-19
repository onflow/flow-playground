module.exports = (address) => {
  const addressBook = {
    '0x05': 'Alice',
    '0x06': 'Bob',
    '0x07': 'Charlie',
    '0x08': 'Dave',
  };

  return addressBook[address];
};
