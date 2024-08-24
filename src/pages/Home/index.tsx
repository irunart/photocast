import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image, Picker, Tag, Divider } from "antd-mobile";
import { Input } from "antd";

import { BankOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";

import { getEventDetail } from "@/services/googleApis";
import useMediaQuery from "use-media-antd-query";

import type { IEventLists, IEventDetail } from "./type";

const Home = () => {
  const navigate = useNavigate();

  // let EventDetails:IEventDetail[]=[];

  const [EventDetails, setEventDetails] = useState<IEventDetail[]>([]);

  const [eventDetailsFiltered, setEventDetailsFiltered] = useState<IEventDetail[]>([]);

  const dataRef = useRef<IEventLists>();

  // const basicColumnSelected=[String,String]
  const [citySelected, setCitySelected] = useState<string>("All");
  const [categorySelected, setCategorySelected] = useState<string>("All");
  const [eventCount, setEventCount] = useState<number>(0);

  const [cityPopVisible, setCityPopVisible] = useState(false);
  const [categoryPopVisible, setCategoryPopVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colSize = useMediaQuery();
  const colSize2ColumnsEvent = {
    // "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
    xs: 2,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3,
    xxl: 3,
  };
  const columnsEvent = colSize2ColumnsEvent[colSize];

  const basicColumnsCity = [
    [{ label: "Hong Kong", value: "Hong Kong" }],
    // [{ label: "IEST Training", value: "IEST Training" }],
  ];
  const basicColumnsCategory = [
    // [{ label: "Hong Kong", value: "Hong Kong" }],
    [{ label: "IEST Training", value: "IEST Training" }],
  ];
  const [cityColumns, setCityColumns] = useState(basicColumnsCity);
  const [categoryColumns, setCategoryColumns] = useState(basicColumnsCategory);

  // init 阶段
  useEffect(() => {
    getEventDetail().then((res: CommonResponse<IEventLists>) => {
      let values = _.values(res.data);
      values = _.sortBy(values, ["date_start"]).reverse();
      setEventDetails(values);
      setEventDetailsFiltered(values);
      setEventCount(values.length);
      const cites = values.map((item) => item.city);
      const categories = values.map((item) => item.category);
      const uniqueCites = ["All", ...new Set(cites)];
      const uniqueCategories = ["All", ...new Set(categories)];
      const columnsCites = uniqueCites.map((item) => {
        return { label: item, value: item };
      });
      const columnsCategories = uniqueCategories.map((item) => {
        return { label: item, value: item };
      });
      setCityColumns([columnsCites]);
      setCategoryColumns([columnsCategories]);

      // setMultColumns([columnsCites, columnsCategories]);

      sessionStorage.setItem("EventsData", JSON.stringify(res.data));
    });
  }, []);

  const goEventDetail = (name: string) => {
    navigate("/event/" + name, { state: { data: dataRef.current?.[name] } });
  };

  const filterEvents = (city: string, category: string) => {
    if (city != "All" && category != "All") {
      const res = EventDetails.filter((event) => event.city == city && event.category == category);
      setEventDetailsFiltered(res);
      setEventCount(res.length);
    } else if (city != "All" && category == "All") {
      const res = EventDetails.filter((event) => event.city == city);
      setEventDetailsFiltered(res);
      setEventCount(res.length);
    } else if (city == "All" && category != "All") {
      const res = EventDetails.filter((event) => event.category == category);
      setEventDetailsFiltered(res);
      setEventCount(res.length);
    } else {
      setEventDetailsFiltered(EventDetails);
      setEventCount(EventDetails.length);
    }
  };

  const formatDateToMD = (dateString: string) => {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // 月份是从0开始的
    const day = parseInt(dateString.slice(6, 8), 10);

    const dateFormat = new Date(year, month, day, 0, 0);
    const monthS = dateFormat.toLocaleString("default", { month: "short" });
    const dayS = dateFormat.getDate();
    let suffix: string = "";
    switch (dayS) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
      default:
        suffix = "th";
    }
    return `${monthS} ${dayS}${suffix}, ${year}`;
  };

  //TODO: api接口 赛事详情,对应图片
  return (
    <>
      <Grid columns={2} gap={8}>
        <Grid.Item>
          <div>City Filter</div>
        </Grid.Item>
        <Grid.Item>
          <div>Category Filter</div>
        </Grid.Item>
        <Grid.Item>
          <div onClick={() => setCityPopVisible(true)} style={{ flex: 1 }}>
            <Input
              prefix={<BankOutlined />}
              value={citySelected}
              placeholder="filter city"
              readOnly
              suffix={<DownOutlined />}
            />
          </div>
        </Grid.Item>

        <Grid.Item>
          <div onClick={() => setCategoryPopVisible(true)} style={{ flex: 1 }}>
            <Input
              prefix={<MenuOutlined />}
              value={categorySelected}
              placeholder="filter category"
              readOnly
              suffix={<DownOutlined />}
            />
          </div>
        </Grid.Item>
      </Grid>

      <Picker
        title="filter city"
        columns={cityColumns}
        visible={cityPopVisible}
        value={[citySelected]}
        mouseWheel
        onClose={() => setCityPopVisible(false)}
        onConfirm={(val) => {
          setCitySelected(val[0] as string);
          filterEvents(val[0] as string, categorySelected);
          setCityPopVisible(false);
        }}
      />
      <Picker
        title="filter category"
        columns={categoryColumns}
        visible={categoryPopVisible}
        value={[citySelected]}
        mouseWheel
        onClose={() => setCategoryPopVisible(false)}
        onConfirm={(val) => {
          setCategorySelected(val[0] as string);
          filterEvents(citySelected, val[0] as string);
          setCategoryPopVisible(false);
        }}
      />

      <Divider>There are {eventCount} results</Divider>
      <Grid columns={columnsEvent} gap={8}>
        {eventDetailsFiltered.map((item) => (
          <Grid.Item onClick={() => goEventDetail(item.event)} key={item.event}>
            <div style={{ border: "1px solid #000000", borderColor: "grey" }}>
              <Card title={<div>{item.event}</div>}>
                <Image src={item.event_icon_url} style={{ aspectRatio: "4/3" }} fit="cover" />
                <div style={{ marginLeft: "10px", height: "40px" }}>
                  {/* <div>{item.event}</div> */}
                  <Tag color="#4E7684">{item.category}</Tag>
                  <Tag color="#7F7A65" style={{ marginLeft: "5px" }}>
                    {item.city}
                  </Tag>
                  <Tag color="" fill="outline" style={{ marginLeft: "5px" }}>
                    {formatDateToMD(item.date_start)}
                  </Tag>
                </div>
              </Card>
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </>
  );
};

export default Home;
