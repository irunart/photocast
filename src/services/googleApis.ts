import request from "@/utils/request";

const urlPhotographers = "/photographers.json";
const urlEventDateRename = "/event_date_rename.json";
const urlEventDetail = "/event_detail.json";

const withNounce = (url: string) => `${url}?${Math.random()}`;

export const getPhotographers = () => request.get(withNounce(urlPhotographers));

export const getEventDateRename = () => request.get(withNounce(urlEventDateRename));

export const getEventDetail = () => request.get(withNounce(urlEventDetail));

export const getPhotoDateHourData = (photoGrapher: string, date: string, hour: string) =>
  request.get(withNounce(`/${photoGrapher}/${date}/${hour}.json`));
