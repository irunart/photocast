/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClockCircleOutlined, DownOutlined, SyncOutlined, TeamOutlined } from "@ant-design/icons";
import { Flex, Input, Carousel } from "antd";
import type { MultiImageViewerRef } from "antd-mobile";
import { FloatButton } from "antd";
import useMediaQuery from "use-media-antd-query";
import { Action } from "antd-mobile/es/components/popover";

import {
  Button,
  CascadePicker,
  CheckList,
  Image,
  ImageViewer,
  Popup,
  Divider,
  DotLoading,
  Checkbox,
  List,
  Modal,
} from "antd-mobile";
import * as _ from "lodash-es";

import { getPhotoDateHourData, getPhotographers } from "@/services/googleApis";

import type { IData, IImage, IPhotographer, IEventDetail } from "./type";

import { getEventPhotoGrapher, grapherDateToCascadeOptions } from "./common";
import { ShoppingCartOutlined } from "@ant-design/icons";

import { Popover } from "antd-mobile";

import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import styles from "./index.module.scss";
const PHOTOS_MAX_SIZE = 100;
const latestFirstPhoto = (a: IImage, b: IImage) => {
  if (a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }
  return b.time.localeCompare(a.time);
};

const Event: React.FC = () => {
  const navigate = useNavigate();
  const { event } = useParams();
  const [eventInfo, setEventInfo] = useState<IEventDetail>();
  const [searchParams, setSearchParams] = useSearchParams();

  const imageViewerRefs = useRef<MultiImageViewerRef>(null);
  const [photographers, setPhotographers] = useState<IPhotographer[]>([]);
  const [grapher, setGrapher] = useState<IPhotographer>();
  const [grapherPopupVisible, setGrapherPopupVisible] = useState(false);
  const [images, setImages] = useState<IImage[]>([]);
  const [topImages, setTopImages] = useState<IImage[]>([]);
  const [imagesRemain, setImagesRemain] = useState<IImage[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<[string, string]>(["", ""]);
  const [dateTimePopVisible, setDateTimePopVisible] = useState(false);
  const [imagePopVisible, setImagePopVisible] = useState(false);
  const [isImagePush, setIsImagePush] = useState(false);
  const [shoppingValue, setShoppingValue] = useState<string[]>([]);
  const [isOnLoad, setIsOnload] = useState(false);

  const colSize = useMediaQuery();
  const colSize2ColumnsPhotos = {
    // "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
    xs: 3,
    sm: 3,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 5,
  };
  const columnsPhotos = colSize2ColumnsPhotos[colSize];

  // page start
  useEffect(() => {
    if (!event) return navigate("/home", { replace: true });

    getPhotographers().then((res: CommonResponse<IData[]>) => {
      const grapherLists = getEventPhotoGrapher(res.data, event);

      if (grapherLists.length === 0) {
        Modal.show({
          content: "No photos yes",
          closeOnAction: true,
          actions: [
            {
              key: "Go back",
              text: "Go back",
              primary: true,
              onClick: () => {
                navigate("/home", { replace: true });
              },
            },
            {
              key: "I know",
              text: "I know",
            },
          ],
        });
      }

      const photoGrapherFromSearch = _.find(grapherLists, ["value", searchParams.get("photographer")]);
      const timesFromSearch = searchParams.get("time")?.split("-");
      const currentGrapher = photoGrapherFromSearch || grapherLists[0];
      const currentTime = getGrapherAvailableTime(currentGrapher, timesFromSearch?.[0], timesFromSearch?.[1]);

      setCurrentDateTime(currentTime);
      setPhotographers(grapherLists);
      setGrapher(currentGrapher);
      const Time = getGrapherAvailableTime(currentGrapher);
      getPhotoDateHourData(currentGrapher.value, Time[0], Time[1]).then((res: CommonResponse<IImage[]>) => {
        setTopImages(res.data.slice(0, 10));
      });
    });

    const EventsData = JSON.parse(sessionStorage.getItem("EventsData") as string);
    if (EventsData) {
      setEventInfo(EventsData[event]);
    }

    const ShoppingData = localStorage.getItem("ShoppingData");
    if (typeof ShoppingData === "string") {
      setShoppingValue(JSON.parse(ShoppingData as string));
    } else {
      setShoppingValue([]);
    }
    console.log(ShoppingData);

    setIsOnload(true);
  }, [event]);

  const deleteAllPhotos = () => {
    setShoppingValue([]);
  };
  const selectedPhotos = () => {
    navigate("/SelectedPhotos");
    console.log(1);
  };

  const actions: Action[] = [
    { key: "Show cart", icon: null, text: "Show cart", onClick: selectedPhotos },
    { key: "Clear all", icon: null, text: "Clear all", onClick: deleteAllPhotos },
  ];

  const handleCheckboxonClick = (name: string) => {
    // console.log(name,shoppingValue,name in shoppingValue)
    if (shoppingValue.includes(name)) {
      setShoppingValue(shoppingValue.filter((item) => item !== name));
    } else {
      console.log(name);
      setShoppingValue([...shoppingValue, name]);
    }
  };

  useEffect(() => {
    if (isOnLoad) {
      localStorage.setItem("ShoppingData", JSON.stringify(shoppingValue));
    }
  }, [shoppingValue]);

  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshToLatest = useCallback(() => {
    if (!grapher || !grapher.value) {
      return;
    }
    setCurrentDateTime(getGrapherAvailableTime(grapher));
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
  const getGrapherAvailableTime = (grapher: IPhotographer, date?: string, time?: string): [string, string] => {
    const dates: string[] = Object.keys(grapher.available_time);

    if (date && dates.includes(date)) {
      const hours: string[] = grapher.available_time[date];
      const hour: string = time && hours.includes(time) ? time : hours[0];
      return [date, hour];
    }
    const latestDate = dates[dates.length - 1];
    const availableTime = grapher.available_time[latestDate];
    // const latestTime = availableTime[availableTime.length - 1];
    const latestTime = autoRefresh ? availableTime[availableTime.length - 1] : availableTime[0];
    return [latestDate, latestTime];
  };

  const navGrapherAvailableTime = (
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
    // eslint-disable-next-line no-constant-condition
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

  const nextTime = grapher && navGrapherAvailableTime(grapher, currentDateTime, "next");

  const nextPhotos = () => {
    setIsImagePush(true);
    if (imagesRemain.length == 0) {
      navTime(nextTime as [string, string]);
    } else {
      let dataSorted;
      if (imagesRemain.length > PHOTOS_MAX_SIZE) {
        dataSorted = imagesRemain.slice(0, PHOTOS_MAX_SIZE);
        setImagesRemain(imagesRemain.slice(-(imagesRemain.length - PHOTOS_MAX_SIZE)));
      } else {
        dataSorted = imagesRemain;
        setImagesRemain([]);
      }

      const divider = {
        name: "divider",
        date: dataSorted[0].date,
        hour: dataSorted[0].hour,
        second: dataSorted[0].second,
        time: dataSorted[0].time,
        minute: dataSorted[0].minute,
      } as IImage;

      dataSorted = dataSorted.concat(divider);
      dataSorted = images.concat(dataSorted);
      setImages(dataSorted);
    }
  };

  const navTime = useCallback((t: [string, string]) => {
    // scrollTo({ top: 0, behavior: "smooth" });
    setAutoRefresh(false);
    setCurrentDateTime(t);
  }, []);

  useEffect(() => {
    if (!grapher?.value) return;
    getPhotoDateHourData(grapher?.value, currentDateTime[0], currentDateTime[1]).then(
      (res: CommonResponse<IImage[]>) => {
        let dataSorted = res.data.toSorted(latestFirstPhoto).reverse();
        if (dataSorted.length > PHOTOS_MAX_SIZE) {
          const r = dataSorted.slice(PHOTOS_MAX_SIZE, dataSorted.length - 1);
          setImagesRemain(r);
          dataSorted = dataSorted.slice(0, PHOTOS_MAX_SIZE);
        }
        let img;
        if (isImagePush) {
          const divider = {
            name: "divider",
            date: currentDateTime[0],
            hour: currentDateTime[1],
            second: "00",
            time: "00",
            minute: "00",
          } as IImage;
          img = images.concat(divider);
          img = img.concat(dataSorted);
        } else {
          img = autoRefresh ? dataSorted.reverse() : dataSorted;
        }
        setImages(img);
        if (nextTime && img.length < 20) {
          setIsImagePush(true);
          navTime(nextTime as [string, string]);
        }
      }
    );
    stateToUrl();
  }, [currentDateTime]);

  // 选择摄影师
  const handlePhotoGrapherChange = (nextGrapher: string) => {
    const selectedGrapher = photographers.find((item) => item.value === nextGrapher);
    const currentGrapherTime = getGrapherAvailableTime(selectedGrapher as IPhotographer);

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

  // image: string, index: number
  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <div
          className={styles.footerButton}
          // onClick={() => {
          //   console.log('Loading...')
          // }}
        >
          Swipe left and right to switch photos
        </div>
      </div>
    );
  };

  return (
    <div>
      <List header="Event Information">
        <List.Item>
          <span style={{ width: "80px", display: "inline-block" }}>
            <b>name</b>
          </span>
          <span>{eventInfo?.event}</span>
        </List.Item>
        <List.Item>
          <span style={{ width: "80px", display: "inline-block" }}>
            <b>city</b>
          </span>
          <span>{eventInfo?.city}</span>
        </List.Item>
        <List.Item>
          <span style={{ width: "80px", display: "inline-block" }}>
            <b>category</b>
          </span>
          <span>{eventInfo?.category}</span>
        </List.Item>
        <List.Item>
          <span style={{ width: "80px", display: "inline-block" }}>
            <b>website</b>
          </span>
          <span>
            <a href={eventInfo?.website}>{eventInfo?.website}</a>
          </span>
        </List.Item>
      </List>
      <br />

      <Divider>Featured Images</Divider>
      <div>
        <Carousel arrows autoplay autoplaySpeed={2000} draggable>
          {topImages.map((item) => (
            <div className={styles.featuredImages}>
              <Image src={item.url} fit="cover" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          ))}
        </Carousel>
      </div>

      <Divider>...</Divider>
      <p>current photographer below:</p>
      <div onClick={() => setGrapherPopupVisible(true)}>
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
      <Divider>...</Divider>
      <InfiniteScroll
        dataLength={images.length}
        next={() => {
          nextPhotos();
        }}
        hasMore={nextTime != undefined}
        loader={
          <Divider>
            Loading
            <DotLoading color="primary" />
          </Divider>
        }
        scrollThreshold={"20px"}
        endMessage={<Divider>No more photos</Divider>}
      >
        <Masonry
          column={columnsPhotos}
          gap={8}
          initailHeight={150}
          items={images.map((image, index) =>
            image.name == "divider" ? (
              <Divider>
                ⬇️ {image.hour}:{image.minute} ⬇️
              </Divider>
            ) : (
              <div>
                <div key={image.name} onClick={() => openImageViewer(index)} style={{ position: "relative" }}>
                  <span style={{ position: "absolute", right: 0, margin: 10 }}>
                    <Checkbox
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCheckboxonClick(image.name);
                      }}
                      block
                      style={{ "--icon-size": "30px" }}
                      value={image.name}
                      checked={shoppingValue.includes(image.name) ? true : false}
                    ></Checkbox>
                  </span>

                  <ResponsiveImage minHeight={150} lazy src={image?.url} fit="cover" />
                </div>
              </div>
            )
          )}
        />
      </InfiniteScroll>

      <Popup visible={grapherPopupVisible} onMaskClick={() => setGrapherPopupVisible(false)} destroyOnClose>
        <p className="text-center"> Select a photographer below:</p>
        <CheckList
          defaultValue={grapher?.value ? [grapher.value] : []}
          onChange={(val) => {
            setIsImagePush(false);
            handlePhotoGrapherChange(val[0] as string);
            setGrapherPopupVisible(false);
          }}
          className={styles.photographers}
        >
          {photographers.map((item) => (
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
        mouseWheel
        onConfirm={(val) => {
          setIsImagePush(false);
          setCurrentDateTime(val as [string, string]);
        }}
      />
      <ImageViewer.Multi
        ref={imageViewerRefs}
        images={images.map((i) => i.url as string)}
        visible={imagePopVisible}
        defaultIndex={1}
        onClose={() => setImagePopVisible(false)}
        renderFooter={renderFooter}
      />
      <Popover.Menu actions={actions} onAction={(node) => node.onClick} placement="left-start" trigger="click">
        <FloatButton icon={<ShoppingCartOutlined />} badge={{ count: shoppingValue.length, color: "#FFCA83" }} />
      </Popover.Menu>
    </div>
  );
};

export default Event;
