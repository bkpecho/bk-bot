import date from "date-and-time";

export const getCurrentTime = () => {
  const now = new Date();
  const currentTime = date.format(now, "hh:mm:ss A");
  return currentTime;
};
