module.exports = (address) => {
  const addressBook = {
    '0x01': 'Alice',
    '0x02': 'Bob',
    '0x03': 'Charlie',
    '0x04': 'Dave',
  };

  return addressBook[address];
}