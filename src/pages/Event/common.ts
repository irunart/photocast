import * as _ from "lodash-es";

import type { IData, IPhotographer } from "./type";

export const getEventPhotoGrapher = (data: IData[], event: string) => {
  // 扁平数据
  const flatDatas = _.map(data, (item) => ({
    ...item.data,
    label: `${item.data.name}${item.data.location === "N/A" ? "" : " @" + item.data.location}(${countPhotoAmount(item.data)} photos)`,
    photographer_icon_url: item.photographer_icon_url,
    value: item.data.label,
  }));

  return _.filter(flatDatas, { event });
};

export const getPhotosCount = (data: IData[], event: string) => {
  // 扁平数据
  let flatDatas = _.map(data, (item) => ({
    ...item.data,
    count: countPhotoAmount(item.data),
  }));
  flatDatas = _.filter(flatDatas, { event });
  let c = 0;
  for (let index = 0; index < flatDatas.length; index++) {
    c = c + flatDatas[index].count;
  }
  return c;
};

export const getPhotoGrapherCount = (data: IData[], event: string) => {
  const flatDatas = _.map(data, (item) => ({
    ...item.data,
  }));
  return _.filter(flatDatas, { event }).length;
};

export function countPhotoAmount(photographer: IPhotographer, date?: string, hour?: string) {
  let count = 0;
  if (hour != undefined) {
    return photographer["stats"][date as string][hour];
  }
  if (date != undefined) {
    for (const key in photographer["stats"][date]) {
      count += photographer["stats"][date][key];
    }
    return count;
  }

  for (const date in photographer["stats"]) {
    for (const key in photographer["stats"][date]) {
      count += photographer["stats"][date][key];
    }
  }
  return count;
}

export function grapherDateToCascadeOptions(grapher: IPhotographer | undefined) {
  if (!grapher) return [];
  const { available_time = {} } = grapher;
  return Object.keys(available_time).map((date: string) => {
    return {
      label: date,
      value: date,
      children: (available_time[date] as string[]).map((hour: string) => ({
        label: hour,
        value: hour,
      })),
    };
  });
}
