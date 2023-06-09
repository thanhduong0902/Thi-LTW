import moment from "moment";

export function ConvertDayTime(time) {
  return time
    ? moment(time, "YYYY-MM-DD hh:mm:ss")
        .tz("Asia/Ho_Chi_Minh")
        .format("DD-MM-YYYY")
    : "";
}
