

export const dateOnly = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};
export const dateAndTime = (date: Date) => {
  const d = new Date(date);
  const timeDate = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return timeDate;
};

export const timeOnly = (date: Date) => {
  const d = new Date(date);
  const timeDate = `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return timeDate;
}

export const dateYearMonthDay = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${(d.getMonth() + 1)}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

export const dateMondayDayYear = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${(d.getMonth() + 1)}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${month}-${day}-${year}`;
}
