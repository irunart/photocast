import * as _ from "lodash-es";

import type { IPhotographer, IData } from "./type";

export const getEventPhotoGrapher = (datas: IData[], event: string) =>
  _.chain(datas)
    .map((item) => ({
      ...item.data,
      label: `${item.data.name}(${countPhotoAmount(item.data)}张)`,
      photographer_icon_url: item.photographer_icon_url,
      value: item.data.label,
    }))
    .filter({ event })
    .value();

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
