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
export interface IData {
  data: IPhotographer;
  photographer_icon_url: string;
}

export interface IPhotographer {
  label: string;
  name: string;
  value?: string;
  location: string;
  event: string;
  available_time: { [date: string]: string[] };
  stats: { [date: string]: { [hour: string]: number } };
  photographer_icon_url?: string;
}

export interface IImage {
  name: string;
  time: string;
  date: string;
  hour: string;
  minute: string;
  second: string;
  url?: string;
}
