const transformDate = (date) => {
  return new Date(date).toISOString();
};

module.exports = { transformDate };
