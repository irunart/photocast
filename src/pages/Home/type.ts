export interface IEventLists {
  [event: string]: IEventDetail;
}
export interface IEventDetail {
  event: string;
  category: string;
  country: string;
  city: string;
  location: string;
  date_start: string;
  date_end: string;
  event_icon_url: string;
  website: string;
}
