export interface IEventLists {
  [event: string]: IEventDetail[];
}
interface IEventDetail {
  label: string;
  evnet: string;
  name: string;
}
