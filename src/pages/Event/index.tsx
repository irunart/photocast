import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  ClockCircleOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  SyncOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Flex, Input } from "antd";
import type { MultiImageViewerRef } from "antd-mobile";
import { Button, CascadePicker, CheckList, Image, ImageViewer, Popup } from "antd-mobile";
import * as _ from "lodash-es";

import { getPhotoDateHourData, getPhotographers } from "@/services/googleApis";

import type { IData, IImage, IPhotographer } from "./type";

import { getEventPhotoGrapher, grapherDateToCascadeOptions } from "./common";

import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import styles from "./index.module.scss";

const latestFirstPhoto = (a: IImage, b: IImage) => {
  if (a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }
  return b.time.localeCompare(a.time);
};

const Event: React.FC = () => {
  const navigate = useNavigate();
  const { event } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const imageViewerRefs = useRef<MultiImageViewerRef>(null);
  const [photoGraphers, setPhotoGraphers] = useState<IPhotographer[]>([]);
  const [grapher, setGrapher] = useState<IPhotographer>();
  const [grapherPopupVisible, setGraperPopupVisible] = useState(false);
  const [images, setImages] = useState<IImage[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<[string, string]>(["", ""]);
  const [dateTimePopVisible, setDateTimePopVisible] = useState(false);
  const [imagePopVisible, setImagePopVisible] = useState(false);

  // page start
  useEffect(() => {
    if (!event) return navigate("/home", { replace: true });

    getPhotographers().then((res: CommonResponse<IData[]>) => {
      const grapherLists = getEventPhotoGrapher(res.data, event);

      if (grapherLists.length === 0) return navigate("/home", { replace: true });

      const photoGrapherFromSearch = _.find(grapherLists, ["value", searchParams.get("photographer")]);
      const timesFromSearch = searchParams.get("time")?.split("-");
      const currentGrapher = photoGrapherFromSearch || grapherLists[0];
      const currentTime = getGrapherAvaliableTime(currentGrapher, timesFromSearch?.[0], timesFromSearch?.[1]);

      setCurrentDateTime(currentTime);
      setPhotoGraphers(grapherLists);
      setGrapher(currentGrapher);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshToLatest = useCallback(() => {
    if (!grapher || !grapher.value) {
      return;
    }
    setCurrentDateTime(getGrapherAvaliableTime(grapher));
  }, [grapher, currentDateTime]);

  useEffect(() => {
    if (autoRefresh) {
      const t = setInterval(refreshToLatest, 60000);
      return () => clearInterval(t);
    }
  }, [autoRefresh]);

  /**
   * Retrieves the available time for a photographer.
   *
   * @param grapher - The photographer object.
   * @param date - The selected date (optional).
   * @param time - The selected time (optional).
   *
   * @returns An array containing the selected date and time, or the first available date and time.
   */
  const getGrapherAvaliableTime = (grapher: IPhotographer, date?: string, time?: string): [string, string] => {
    const dates: string[] = Object.keys(grapher.available_time);

    if (date && dates.includes(date)) {
      const hours: string[] = grapher.available_time[date];
      const hour: string = time && hours.includes(time) ? time : hours[0];
      return [date, hour];
    }
    const latestDate = dates[dates.length - 1];
    const availableTime = grapher.available_time[latestDate];
    const latestTime = availableTime[availableTime.length - 1];
    return [latestDate, latestTime];
  };

  const navGrapherAvaliableTime = (
    grapher: IPhotographer,
    [date, time]: [string, string],
    action: "prev" | "next"
  ): [string, string] | undefined => {
    const dates: string[] = Object.keys(grapher.available_time);
    const dateIndex = dates.indexOf(date);
    let times = grapher.available_time[dates[dateIndex]];
    const timeIndex = times.indexOf(time);
    let targetTimeIndex = action === "prev" ? timeIndex - 1 : timeIndex + 1;
    if (targetTimeIndex >= 0 && targetTimeIndex < times.length) {
      return [date, times[targetTimeIndex]];
    }
    let targetDateIndex = dateIndex;
    while (true) {
      targetDateIndex = action === "prev" ? targetDateIndex - 1 : targetDateIndex + 1;
      if (targetDateIndex < 0 || targetDateIndex >= dates.length) {
        return;
      }
      times = grapher.available_time[dates[targetDateIndex]];
      if (times.length) {
        targetTimeIndex = action === "prev" ? times.length - 1 : 0;
        return [dates[targetDateIndex], times[targetTimeIndex]];
      }
    }
  };

  const prevTime = grapher && navGrapherAvaliableTime(grapher, currentDateTime, "prev");
  const nextTime = grapher && navGrapherAvaliableTime(grapher, currentDateTime, "next");
  const navTime = useCallback((t: [string, string]) => {
    scrollTo({ top: 0, behavior: "smooth" });
    setAutoRefresh(false);
    setCurrentDateTime(t);
  }, []);

  useEffect(() => {
    if (!grapher?.value) return;
    getPhotoDateHourData(grapher?.value, currentDateTime[0], currentDateTime[1]).then(
      (res: CommonResponse<IImage[]>) => {
        setImages(res.data.toSorted(latestFirstPhoto));
      }
    );
    stateToUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDateTime]);

  // 选择摄影师
  const handlePhotoGrapherChange = (nextGrapher: string) => {
    const selectedGrapher = photoGraphers.find((item) => item.value === nextGrapher);
    const currentGrapherTime = getGrapherAvaliableTime(selectedGrapher as IPhotographer, undefined, undefined);

    setGrapher(selectedGrapher as IPhotographer);
    setCurrentDateTime(currentGrapherTime);
  };

  const openImageViewer = (index: number) => {
    setImagePopVisible(true);
    imageViewerRefs.current?.swipeTo(index);
  };

  // TODO: 抽离组件外部
  const stateToUrl = () => {
    setSearchParams(
      (params) => ({
        ...Object.fromEntries(params),
        photographer: grapher?.value as string,
        time: currentDateTime.join("-"),
      }),
      { replace: true }
    );
  };

  return (
    <div>
      <p>current photographer below:</p>
      <div onClick={() => setGraperPopupVisible(true)}>
        <Input
          prefix={<TeamOutlined />}
          value={grapher?.label}
          placeholder="Select a photographer"
          readOnly
          suffix={<DownOutlined />}
        />
      </div>
      <p>current photo date time:</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div onClick={() => setDateTimePopVisible(true)} style={{ flex: 1 }}>
          <Input
            prefix={<ClockCircleOutlined />}
            value={currentDateTime.join("-")}
            placeholder="Select date and time"
            readOnly
            suffix={<DownOutlined />}
          />
        </div>
        <Button
          size="small"
          color={autoRefresh ? "primary" : "default"}
          style={{ borderColor: "#d9d9d9", width: 157, marginLeft: 5 }}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <SyncOutlined spin={autoRefresh} style={{ marginRight: 5 }} />
          Auto Refresh
        </Button>
      </div>
      <p></p>

      <Masonry
        column={3}
        gap={8}
        initailHeight={150}
        items={images.map((image, index) => (
          <div key={image.name} onClick={() => openImageViewer(index)}>
            <ResponsiveImage minHeight={150} lazy src={image?.url} fit="cover" />
          </div>
        ))}
      />
      <div className={styles.timeNavButtons}>
        {(prevTime && (
          <Button size="large" onClick={() => navTime(prevTime)}>
            <LeftOutlined style={{ marginRight: 20 }} />
            Earlier
          </Button>
        )) || <div />}
        {(nextTime && (
          <Button size="large" onClick={() => navTime(nextTime)}>
            Newer
            <RightOutlined style={{ marginLeft: 20 }} />
          </Button>
        )) || <div />}
      </div>
      <Popup visible={grapherPopupVisible} onMaskClick={() => setGraperPopupVisible(false)} destroyOnClose>
        <p className="text-center"> Select a photographer below:</p>
        <CheckList
          defaultValue={grapher?.value ? [grapher.value] : []}
          onChange={(val) => {
            handlePhotoGrapherChange(val[0] as string);
            setGraperPopupVisible(false);
          }}
          className={styles.photographers}
        >
          {photoGraphers.map((item) => (
            <CheckList.Item key={item?.value} value={item?.value as string} className={styles.photoGraperItem}>
              <Flex align="center">
                <Image src={item?.photographer_icon_url} width={40} height={40} fit="cover" />
                <span>&nbsp;{item?.label}</span>
              </Flex>
            </CheckList.Item>
          ))}
        </CheckList>
      </Popup>
      <CascadePicker
        title="select date time"
        options={grapherDateToCascadeOptions(grapher)}
        visible={dateTimePopVisible}
        value={currentDateTime}
        onClose={() => setDateTimePopVisible(false)}
        onConfirm={(val) => setCurrentDateTime(val as [string, string])}
      />
      <ImageViewer.Multi
        ref={imageViewerRefs}
        images={images.map((i) => i.url)}
        visible={imagePopVisible}
        defaultIndex={1}
        onClose={() => setImagePopVisible(false)}
      />
    </div>
  );
};

export default Event;
