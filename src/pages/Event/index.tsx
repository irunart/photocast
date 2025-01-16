import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";
import {
  ClockCircleOutlined,
  DownOutlined,
  ShareAltOutlined,
  SyncOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Flex, Input, message, QRCode, FloatButton } from "antd";
import type { MultiImageViewerRef } from "antd-mobile";
import useMediaQuery from "use-media-antd-query";
import { Action } from "antd-mobile/es/components/popover";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import html2canvas from "html2canvas";
import * as _ from "lodash-es";

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
  Grid,
  Popover,
} from "antd-mobile";

import { getEventDetail, getPhotoDateHourData, getPhotographers } from "@/services/googleApis";
import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getEventPhotoGrapher, getPhotoGrapherCount, getPhotosCount, grapherDateToCascadeOptions } from "./common";
import type { IImage, IPhotographer, IEventDetail } from "./type";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const PHOTOS_MAX_SIZE = 100;

// Types
interface TimeNavigation {
  date: string;
  time: string;
}

// Utility functions
const formatDateToMD = (dateString: string): string => {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(4, 6), 10) - 1;
  const day = parseInt(dateString.slice(6, 8), 10);

  const dateFormat = new Date(year, month, day);
  const monthS = dateFormat.toLocaleString("en", { month: "short" });
  const dayS = dateFormat.getDate();

  const suffix = dayS === 1 ? "st" : dayS === 2 ? "nd" : dayS === 3 ? "rd" : "th";

  return `${monthS} ${dayS}${suffix}`;
};

const latestFirstPhoto = (a: IImage, b: IImage) => {
  if (a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }
  return b.time.localeCompare(a.time);
};

// Move colSize hook declaration to the top
const useColumnSize = () => {
  const colSize = useMediaQuery();
  return colSize;
};

const colSize2ColumnsPhotos = {
  xs: 3,
  sm: 3,
  md: 3,
  lg: 3,
  xl: 4,
  xxl: 5,
} as const;

// Modal helper function
const showNoPhotosModal = () => {
  Modal.show({
    content: "No photos yet.",
    closeOnAction: true,
    actions: [
      {
        key: "Go back",
        text: "Go back",
        primary: true,
        onClick: () => {
          window.location.href = "/home";
        },
      },
      {
        key: "I know",
        text: "I know",
      },
    ],
  });
};

const renderFooter = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerButton}>Swipe left and right to switch photos</div>
    </div>
  );
};
const scrollIntoView = () => {
  if (window.scrollY < 100) {
    window.scrollBy(0, 500);
  }
};

const Event: React.FC = () => {
  const { t } = useTranslation();
  // State management
  const [isOnLoad, setIsOnload] = useState(false);
  const [eventInfo, setEventInfo] = useState<IEventDetail>();
  const [photographers, setPhotographers] = useState<IPhotographer[]>([]);
  const [currentPhotographer, setCurrentPhotographer] = useState<IPhotographer>();
  const [images, setImages] = useState<IImage[]>([]);
  const [topImages, setTopImages] = useState<IImage[]>([]);
  const [imagesRemain, setImagesRemain] = useState<IImage[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<TimeNavigation>({ date: "", time: "" });
  const [currentDateTime, setCurrentDateTime] = useState<TimeNavigation>({ date: "", time: "" });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [isImagePush, setIsImagePush] = useState(false);
  const [shoppingValue, setShoppingValue] = useState<string[]>([]);
  const [fromSource, setFromSource] = useState("");

  // UI state
  const [grapherPopupVisible, setGrapherPopupVisible] = useState(false);
  const [dateTimePopVisible, setDateTimePopVisible] = useState(false);
  const [imagePopVisible, setImagePopVisible] = useState(false);
  const [base64SharePhotos, setBase64SharePhotos] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();
  const [photoGrapherCount, setPhotoGrapherCount] = useState(0);
  const [photosCount, setPhotosCount] = useState(0);

  // Refs and hooks
  const navigate = useNavigate();
  const { event } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const imageViewerRefs = useRef<MultiImageViewerRef>(null);
  const contentRef = useRef(null);
  const ModalContentRef = useRef(null);
  const colSize = useColumnSize();

  const columnsPhotos = colSize2ColumnsPhotos[colSize];

  useEffect(() => {
    if (!event) {
      navigate("/home", { replace: true });
      return;
    }
    console.log("event init:", searchParams.get("time"), searchParams.get("photographer"));

    const init = async () => {
      setIsOnload(true);
      try {
        await initializeEventData();
        if (fromSource !== "home") {
          setTimeout(scrollIntoView, 2500);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        messageApi.error("Failed to initialize");
      }
      setIsOnload(false);
    };

    init();
  }, [event]);

  useEffect(() => {
    if (fromSource !== "home") {
      setTimeout(scrollIntoView, 2500);
    }
  }, [fromSource]);

  useEffect(() => {
    if (isOnLoad) {
      localStorage.setItem("ShoppingData", JSON.stringify(shoppingValue));
    }
  }, [shoppingValue, isOnLoad]);

  // Helper functions for loading data
  const loadEventInfo = async () => {
    try {
      const EventsData = JSON.parse(sessionStorage.getItem("EventsData") as string);
      if (EventsData) {
        setEventInfo(EventsData[event as string]);
      } else {
        const response = await getEventDetail();
        setEventInfo(response.data[event as string]);
      }
    } catch (error) {
      console.error("Failed to load event info:", error);
      messageApi.error("Failed to load event information");
    }
  };

  const loadShoppingData = () => {
    try {
      const ShoppingData = localStorage.getItem("ShoppingData");
      if (typeof ShoppingData === "string") {
        setShoppingValue(JSON.parse(ShoppingData));
      } else {
        setShoppingValue([]);
      }
    } catch (error) {
      console.error("Failed to load shopping data:", error);
      setShoppingValue([]);
    }
  };

  const refreshToLatest = useCallback(() => {
    if (!currentPhotographer) return;

    const latestTime = getPhotographerAvailableTime(currentPhotographer);
    setCurrentDateTime(latestTime);
  }, [currentPhotographer]);

  const getPhotographerAvailableTime = (photographer: IPhotographer, date?: string, time?: string): TimeNavigation => {
    const dates: string[] = Object.keys(photographer.available_time);

    if (date && dates.includes(date)) {
      const hours: string[] = photographer.available_time[date];
      const hour: string = time && hours.includes(time) ? time : hours[0];
      return { date, time: hour };
    }

    const latestDate = dates[dates.length - 1];
    const availableTime = photographer.available_time[latestDate];
    const latestTime = autoRefresh ? availableTime[availableTime.length - 1] : availableTime[0];
    return { date: latestDate, time: latestTime };
  };

  const throttledNextPhotos = _.throttle(() => {
    if (!isOnLoad || !currentPhotographer) return;

    setIsImagePush(true);
    if (imagesRemain.length === 0) {
      const nextTime = navGrapherAvailableTime(currentPhotographer, currentDateTime, "next");
      if (nextTime) {
        // Only update currentDateTime for next time loading
        setCurrentDateTime(nextTime);
      }
    } else {
      handleNextBatch();
    }
  }, 1000);

  useEffect(() => {
    if (autoRefresh) {
      const t = setInterval(refreshToLatest, 60000);
      return () => clearInterval(t);
    }
  }, [autoRefresh, refreshToLatest]);

  const handleNextBatch = () => {
    let newImages;
    if (imagesRemain.length > PHOTOS_MAX_SIZE) {
      setSkipCount(skipCount + PHOTOS_MAX_SIZE);
      newImages = imagesRemain.slice(0, PHOTOS_MAX_SIZE);
      setImagesRemain(imagesRemain.slice(PHOTOS_MAX_SIZE));
    } else {
      setSkipCount(0);
      newImages = imagesRemain;
      setImagesRemain([]);
    }

    const divider = createDividerImage(currentDateTime);
    setImages((prev) => [...prev, divider, ...newImages]);
    updateUrlParams();
  };

  const initializeEventData = async () => {
    try {
      const photographersResponse = await getPhotographers();
      const photographers = getEventPhotoGrapher(photographersResponse.data, event as string).filter(
        (g) => Object.keys(g.available_time).length
      );

      const photoGrapherCount = getPhotoGrapherCount(photographersResponse.data, event as string);
      const photosCount = getPhotosCount(photographersResponse.data, event as string);
      setPhotoGrapherCount(photoGrapherCount);
      setPhotosCount(photosCount);

      if (photographers.length === 0) {
        showNoPhotosModal();
        return;
      }

      const photoGrapherFromSearch = _.find(photographers, ["value", searchParams.get("photographer")]);
      const selectedPhotographer = photoGrapherFromSearch || photographers[0];

      if (_.isNull(photoGrapherFromSearch)) {
        setFromSource("home");
      }

      if (_.isNull(selectedPhotographer)) {
        showNoPhotosModal();
        return;
      }

      setPhotographers(photographers);
      setCurrentPhotographer(selectedPhotographer);
      setSkipCount(parseInt(searchParams.get("skip") || "0"));

      // Initialize with latest available time
      let initialDateTime = getPhotographerAvailableTime(selectedPhotographer);
      const timeParam = searchParams.get("time");
      if (timeParam) {
        const [date, time] = timeParam.split("-");
        if (date && time) {
          const availableTimes = selectedPhotographer.available_time[date];
          if (availableTimes?.includes(time)) {
            initialDateTime = { date, time };
          }
        }
      }

      // Set both selected and current datetime
      setSelectedDateTime(initialDateTime);
      setCurrentDateTime(initialDateTime);

      // Load top images
      const topImagesResponse = await getPhotoDateHourData(
        selectedPhotographer.value,
        initialDateTime.date,
        initialDateTime.time
      );
      // live sort last first
      setTopImages(topImagesResponse.data.sort(latestFirstPhoto).slice(0, 10));

      // Load initial photos
      await loadPhotos(selectedPhotographer, initialDateTime, topImagesResponse.data);

      // Load event info
      await loadEventInfo();

      // Load shopping data
      loadShoppingData();
    } catch (error) {
      console.error("Failed to initialize event data:", error);
      messageApi.error("Failed to load event data");
    }
  };

  const loadPhotos = async (photographer: IPhotographer, dateTime: TimeNavigation, topImages: IImage[]) => {
    if (!photographer?.value) return;

    try {
      let dataSorted: IImage[] = [];
      if (topImages && topImages.length > 0) {
        dataSorted = topImages;
      } else {
        const response = await getPhotoDateHourData(photographer.value, dateTime.date, dateTime.time);
        dataSorted = response.data;
      }

      if (!isImagePush) {
        // Clear existing data when switching to new date/time
        setImages([]);
        setImagesRemain([]);
        if (dataSorted.length > PHOTOS_MAX_SIZE) {
          handleLargePhotoSet(dataSorted);
        } else {
          setImages(autoRefresh ? dataSorted.reverse() : dataSorted);
        }
        // Only update URL when loading selected time
        if (dateTime.date === selectedDateTime.date && dateTime.time === selectedDateTime.time) {
          updateUrlParams();
        }
      } else {
        if (dataSorted.length > 0) {
          const divider = createDividerImage(dateTime);
          const newImages = [divider, ...dataSorted];
          setImages((prev) => [...prev, ...newImages]);
        }
      }
    } catch (error) {
      console.error("Failed to load photos:", error);
      messageApi.error("Failed to load photos");
    }
  };

  const handleLargePhotoSet = (dataSorted: IImage[]) => {
    const startIndex = PHOTOS_MAX_SIZE * Math.floor(skipCount / PHOTOS_MAX_SIZE);
    const endIndex = startIndex + PHOTOS_MAX_SIZE;

    const remainingImages = dataSorted.slice(endIndex);
    setImagesRemain(remainingImages);

    const currentBatch = dataSorted.slice(startIndex, endIndex);

    if (isImagePush) {
      const divider = createDividerImage(currentDateTime);
      setImages((prev) => [...prev, divider, ...currentBatch]);
    } else {
      setImages(currentBatch);
    }
  };

  const createDividerImage = (dateTime: TimeNavigation): IImage => ({
    name: "divider",
    date: dateTime.date,
    hour: dateTime.time,
    second: "00",
    time: "00",
    minute: "00",
    url: "", // Added empty url field
  });

  const handlePhotographerChange = async (photographerId: string) => {
    const selectedPhotographer = photographers.find((p) => p.value === photographerId);
    if (!selectedPhotographer) return;

    setIsImagePush(false);
    setCurrentPhotographer(selectedPhotographer);

    const newDateTime = getPhotographerAvailableTime(selectedPhotographer);
    setCurrentDateTime(newDateTime);
    setGrapherPopupVisible(false);

    // Clear existing images before loading new ones
    setImages([]);
    setImagesRemain([]);
    setSkipCount(0);

    await loadPhotos(selectedPhotographer, newDateTime, []);
  };

  // Screenshot and QR code handling
  const handleScreenshotComplete = () => {
    if (!ModalContentRef.current) return;

    html2canvas(ModalContentRef.current as HTMLElement, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      Modal.clear();
      Modal.show({
        content: <Image src={base64image} alt="" style={{ width: "100%" }} draggable={true} />,
        header: <div>Long press to save image</div>,
        showCloseButton: true,
        closeOnMaskClick: true,
      });
    });
  };

  useEffect(() => {
    if (!base64SharePhotos) return;

    Modal.alert({
      confirmText: "Screenshot Sharing",
      afterShow: handleScreenshotComplete,
      content: (
        <div ref={ModalContentRef}>
          <Grid columns={4} gap={8}>
            <Grid.Item>
              <div className={styles.PosterQRcode}>
                <QRCode
                  errorLevel="M"
                  value={window.location.href}
                  style={{ width: "100%", height: "auto" }}
                  bordered={false}
                  icon="https://iest.run/assets/img/IEST-logo-icon-only-sqaure.png"
                />
              </div>
            </Grid.Item>
            <Grid.Item span={3}>
              <div className={styles.PosterInformation}>
                <b>{event}</b>
                <p>Scan the QRcode to see more photos</p>
              </div>
            </Grid.Item>
          </Grid>
          <img src={base64SharePhotos} alt="" style={{ width: "100%" }} />
        </div>
      ),
    });
  }, [base64SharePhotos, event]);

  // Effect to handle datetime changes
  useEffect(() => {
    if (!currentPhotographer || !currentDateTime.date || !currentDateTime.time) return;

    const curDTString = currentDateTime.date + "-" + currentDateTime.time;
    if (curDTString !== searchParams.get("time")) {
      loadPhotos(currentPhotographer, currentDateTime, []);
    }
  }, [currentDateTime, currentPhotographer]);

  // UI Actions
  const actions: Record<string, Action[]> = {
    cart: [
      { key: "show", text: "Show cart", onClick: () => navigate("/SelectedPhotos") },
      { key: "clear", text: "Clear all", onClick: () => setShoppingValue([]) },
    ],
    share: [
      { key: "copy", text: "Copy Link", onClick: () => copyLink() },
      { key: "generate", text: "Generate posters", onClick: () => generatePosters() },
    ],
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => messageApi.success("Link copied to clipboard"))
      .catch(() => messageApi.error("Browser does not support clipboard copying"));
  };

  const generatePosters = async () => {
    if (!contentRef.current) return;

    const element = contentRef.current as HTMLElement;
    const rect = element.getBoundingClientRect();

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop,
        width: rect.width,
        height: window.innerHeight,
        useCORS: true,
      });

      setBase64SharePhotos(canvas.toDataURL("image/png"));
    } catch (error) {
      messageApi.error("Failed to generate poster");
    }
  };

  const updateUrlParams = () => {
    if (!currentPhotographer) return;
    console.log(
      "updateUrlParams:",
      " photographer:",
      currentPhotographer.value,
      "time:",
      `${selectedDateTime.date}-${selectedDateTime.time}`,
      "skip: ",
      skipCount.toString()
    );
    setSearchParams(
      (prev) => ({
        ...Object.fromEntries(prev),
        photographer: currentPhotographer.value ?? "",
        time: `${selectedDateTime.date}-${selectedDateTime.time}`,
        skip: skipCount.toString(),
      }),
      { replace: true }
    );
  };

  const handleImageSelect = (imageName: string) => {
    setShoppingValue((prev) =>
      prev.includes(imageName) ? prev.filter((item) => item !== imageName) : [...prev, imageName]
    );
  };
  const navGrapherAvailableTime = (
    photographer: IPhotographer,
    currentTime: TimeNavigation,
    action: "prev" | "next"
  ): TimeNavigation | undefined => {
    const dates: string[] = Object.keys(photographer.available_time);
    const dateIndex = dates.indexOf(currentTime.date);
    let times = photographer.available_time[dates[dateIndex]];
    const timeIndex = times.indexOf(currentTime.time);
    let targetTimeIndex = action === "prev" ? timeIndex - 1 : timeIndex + 1;

    // Check if we can stay in the same date
    if (targetTimeIndex >= 0 && targetTimeIndex < times.length) {
      return {
        date: currentTime.date,
        time: times[targetTimeIndex],
      };
    }

    // Need to change date
    let targetDateIndex = dateIndex;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      targetDateIndex = action === "prev" ? targetDateIndex - 1 : targetDateIndex + 1;
      if (targetDateIndex < 0 || targetDateIndex >= dates.length) {
        return undefined;
      }
      times = photographer.available_time[dates[targetDateIndex]];
      if (times.length) {
        targetTimeIndex = action === "prev" ? times.length - 1 : 0;
        return {
          date: dates[targetDateIndex],
          time: times[targetTimeIndex],
        };
      }
    }
  };

  const handleDateTimeChange = (newDateTime: TimeNavigation) => {
    if (!currentPhotographer) return;
    setIsImagePush(false);
    setDateTimePopVisible(false);

    // Clear existing data
    setImages([]);
    setImagesRemain([]);
    setSkipCount(0);

    // Update both selected and current datetime
    setSelectedDateTime(newDateTime);
    setCurrentDateTime(newDateTime);
  };

  const hasMoreContent = (photographer: IPhotographer | undefined, currentTime: TimeNavigation) => {
    if (!photographer) return false;

    return Boolean(navGrapherAvailableTime(photographer, currentTime, "next")) || imagesRemain.length > 0;
  };

  return (
    <>
      <div ref={contentRef}>
        {contextHolder}

        {/* Event Information */}
        <List header={t("event.info")} className={styles.InformationContainer}>
          <List.Item>
            <span className="w-20 inline-block">
              <b>{t("event.name")}</b>
            </span>
            <span>{eventInfo?.event}</span>
          </List.Item>
          <List.Item>
            <span className="w-20 inline-block">
              <b>{t("event.city")}</b>
            </span>
            <span>{eventInfo?.city}</span>
          </List.Item>
          <List.Item>
            <span className="w-20 inline-block">
              <b>{t("event.category")}</b>
            </span>
            <span>{eventInfo?.category}</span>
          </List.Item>
          <List.Item>
            <span className="w-20 inline-block">
              <b>{t("event.website")}</b>
            </span>
            <a href={eventInfo?.website}>{eventInfo?.website}</a>
          </List.Item>
          <List.Item>
            <span>{t("event.stats", { photoGrapherCount, photosCount })}</span>
          </List.Item>
        </List>

        {/* Featured Images Carousel */}
        <Divider>{t("event.featured")}</Divider>
        <div className={styles.carouselWrapper}>
          <Carousel infiniteLoop autoFocus autoPlay interval={4000} showThumbs={false}>
            {topImages.map((image, index) => (
              <div key={index} className="w-full h-full">
                <img src={image.url} alt="" className={styles.carouselItem} style={{ width: "auto" }} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Photographer Selection */}
        <Divider />
        <div onClick={() => setGrapherPopupVisible(true)}>
          <Input
            prefix={<TeamOutlined />}
            value={currentPhotographer?.label}
            placeholder={t("event.select_photographer")}
            readOnly
            suffix={<DownOutlined />}
          />
        </div>

        {/* DateTime Selection */}
        <div className="flex justify-between mt-4">
          <div onClick={() => setDateTimePopVisible(true)} className="flex-1">
            <Input
              prefix={<ClockCircleOutlined />}
              value={`${dayjs(selectedDateTime.date).format("YYYY-MM-DD")} ${selectedDateTime.time}:00`}
              placeholder={t("event.select_datetime")}
              readOnly
              suffix={<DownOutlined />}
            />
          </div>
          <Button
            size="small"
            color={autoRefresh ? "primary" : "default"}
            className="border-gray-300 w-40 ml-1"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <SyncOutlined spin={autoRefresh} className="mr-1" />
            {t("common.auto_refresh")}
          </Button>
        </div>

        {/* Image Grid */}
        <Divider />
        <InfiniteScroll
          dataLength={images.length}
          next={throttledNextPhotos}
          scrollThreshold={0.8}
          hasMore={hasMoreContent(currentPhotographer, currentDateTime)}
          loader={
            <Divider>
              {t("common.loading")}
              <DotLoading />
            </Divider>
          }
          endMessage={<Divider>{t("common.no_more")}</Divider>}
        >
          <Masonry
            column={columnsPhotos}
            gap={8}
            initailHeight={150}
            items={images.map((image, index) =>
              image.name === "divider" ? (
                <Divider key={`divider-${index}`}>
                  ⬇️ {formatDateToMD(image.date)} {image.hour}:{image.minute} ⬇️
                </Divider>
              ) : (
                <div key={image.name} className="relative">
                  <div
                    onClick={() => {
                      setImagePopVisible(true);
                      imageViewerRefs.current?.swipeTo(index);
                    }}
                  >
                    <span className="absolute right-0 m-2">
                      <Checkbox
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageSelect(image.name);
                        }}
                        block
                        style={{ "--icon-size": "30px" }}
                        checked={shoppingValue.includes(image.name)}
                      />
                    </span>
                    <ResponsiveImage minHeight={150} lazy src={image.url} fit="cover" />
                  </div>
                </div>
              )
            )}
          />
        </InfiniteScroll>

        <Popup visible={grapherPopupVisible} onMaskClick={() => setGrapherPopupVisible(false)} destroyOnClose>
          <CheckList
            defaultValue={currentPhotographer?.value ? [currentPhotographer.value] : []}
            onChange={(vals) => handlePhotographerChange(vals[0] as string)}
            className={styles.photographers}
          >
            {photographers.map((photographer) => (
              <CheckList.Item
                key={photographer.value}
                value={photographer.value ?? ""}
                className={styles.photoGraperItem}
              >
                <Flex align="center">
                  <Image src={photographer.photographer_icon_url} width={40} height={40} fit="cover" />
                  <span className="ml-2">{photographer.label}</span>
                </Flex>
              </CheckList.Item>
            ))}
          </CheckList>
        </Popup>

        <CascadePicker
          title={t("event.select_datetime")}
          options={grapherDateToCascadeOptions(currentPhotographer)}
          visible={dateTimePopVisible}
          value={[selectedDateTime.date, selectedDateTime.time]}
          onClose={() => setDateTimePopVisible(false)}
          mouseWheel
          onConfirm={(val) => {
            if (Array.isArray(val) && val.length === 2) {
              handleDateTimeChange({
                date: val[0] as string,
                time: val[1] as string,
              });
            }
          }}
        />

        <ImageViewer.Multi
          ref={imageViewerRefs}
          images={images.map((i) => i.url)}
          visible={imagePopVisible}
          onClose={() => setImagePopVisible(false)}
          renderFooter={renderFooter}
        />
      </div>

      {/* Floating Action Buttons */}
      <Popover.Menu actions={actions.cart} placement="top" trigger="click">
        <FloatButton
          icon={<ShoppingCartOutlined />}
          badge={{ count: shoppingValue.length, color: "#FFCA83" }}
          style={{ bottom: 100 }}
        />
      </Popover.Menu>

      <Popover.Menu actions={actions.share} placement="top" trigger="click">
        <FloatButton icon={<ShareAltOutlined />} style={{ bottom: 150 }} />
      </Popover.Menu>
    </>
  );
};

export default Event;
