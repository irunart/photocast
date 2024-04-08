import request from "@/utils/request";

const urlPhotographers = "/photographers.json";
const urlEvents = "/events.json";
const urlEventDateRename = "/event_date_rename.json";
const urlEventDetail = "/event_detail.json";
const urlDefault = "/defaults.json";

export const getEventLists = () => request.get(urlEvents);

export const getPhotographers = () => request.get(urlPhotographers);

export const getEventDateRename = () => request.get(urlEventDateRename);

export const getEventDetail = () => request.get(urlEventDetail);

// 默认 event
export const getDefault = () => request.get(urlDefault);

export const getPhotoDateHourData = (
	photoGrapher: string,
	date: string,
	hour: string
) => request.get(`/${photoGrapher}/${date}/${hour}.json`);
