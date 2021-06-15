const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * @param {Date | string} date
 * @returns {string} formatted date
 */
const formatDate = (date) => {
  const asDate = new Date(date);

  const dow = days[asDate.getDay()];
  const month = months[asDate.getMonth()];
  const day = asDate.getDate();
  const hour = asDate.getHours();
  const isPm = hour > 11;

  let time;

  if (hour === 0) {
    time = "midnight";
  } else if (hour === 12) {
    time = "noon";
  } else if (hour === 3) {
    time = "3 am (you must be lonely)";
  } else {
    time = isPm ? `${hour % 12}pm` : `${hour}am`;
  }

  return `${dow}, ${month} ${day}, ${time}`;
};

module.exports = formatDate;
