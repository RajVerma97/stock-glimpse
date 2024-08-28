import dayjs from "dayjs";

export const DATE_FORMAT = "DD-MM-YYYY";
export const formatDate = (date: Date) => {
  return dayjs(date).format(DATE_FORMAT);
};
