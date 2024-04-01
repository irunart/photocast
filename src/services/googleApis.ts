import request from '@/utils/request';


  

const urlPhotographers = '/photographers.json';
const urlEvents = '/events.json';
const urlEventDateRename = '/event_date_rename.json';
const urlEventDetail = '/event_detail.json';
const urlDefault = '/defaults.json';


export const getEventLists = ()=>{
    return request.get(urlEvents);
}