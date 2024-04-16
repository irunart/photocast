import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Input, Flex } from "antd";
import { Image, ImageViewer, Popup, CheckList, CascadePicker } from "antd-mobile";
import type { MultiImageViewerRef } from "antd-mobile";
import { DownOutlined, MehOutlined, ClockCircleOutlined } from "@ant-design/icons";
import * as _ from "lodash-es";

import { getPhotographers, getPhotoDateHourData } from "@/services/googleApis";

import type { IData, IPhotographer, IImage } from "./type";

import { getEventPhotoGrapher, grapherDateToCascadeOptions } from "./common";

import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import styles from "./index.module.scss";

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = useParams();
  const searchParams = new URLSearchParams(location.search);

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

    return [dates[0], grapher.available_time[dates[0]][0]];
  };

  useEffect(() => {
    if (!grapher?.value) return;
    getPhotoDateHourData(grapher?.value, currentDateTime[0], currentDateTime[1]).then(
      (res: CommonResponse<IImage[]>) => {
        setImages(res.data);
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
    const params = new URLSearchParams(window.location.search);
    params.set("photographer", grapher?.value as string);
    params.set("time", currentDateTime.join("-"));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <div>
      <p>current photographer below:</p>
      <Input
        prefix={<MehOutlined />}
        value={grapher?.label}
        onClick={() => setGraperPopupVisible(true)}
        placeholder="Select a photographer"
        readOnly
        suffix={<DownOutlined />}
      />
      <p>current photo date time:</p>
      <Input
        prefix={<ClockCircleOutlined />}
        value={currentDateTime.join("-")}
        onClick={() => setDateTimePopVisible(true)}
        placeholder="Select date and time"
        readOnly
        suffix={<DownOutlined />}
      />
      <p></p>

      <Masonry
        column={3}
        gap={8}
        initailHeight={150}
        items={images.map((image, index) => (
          <div key={image.name} onClick={() => openImageViewer(index)}>
            <ResponsiveImage minHeight={150} lazy src={image?.url} fit="cover" style={{ borderRadius: 4 }} />
          </div>
        ))}
      />
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
                <Image
                  src={item?.photographer_icon_url}
                  width={40}
                  height={40}
                  fit="cover"
                  style={{ borderRadius: 4 }}
                />
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

export default Home;
