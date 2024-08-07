export interface IEventLists {
  [event: string]: IEventDetail[];
}
interface IEventDetail {
  // label: string;
  event: string;
  name: string;
  category: string;
  country: string;
  city: string;
  location: string;
  date_start: string;
  date_end: string;
  event_icon_url: string;
  website: string;
}
