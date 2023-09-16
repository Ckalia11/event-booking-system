const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default formatDate;
