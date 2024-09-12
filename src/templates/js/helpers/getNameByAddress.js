module.exports = (address) => {
  const addressBook = {
    '0x06': 'Alice',
    '0x07': 'Bob',
    '0x08': 'Charlie',
    '0x09': 'Dave',
  };

  return addressBook[address];
};
