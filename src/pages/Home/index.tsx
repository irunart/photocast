import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image, Picker, Tag, Divider } from "antd-mobile";
import { Input } from "antd";

import { BankOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";

import { getEventDetail } from "@/services/googleApis";
import useMediaQuery from "use-media-antd-query";
import { Popover } from "antd";

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

  const cancelFilter = (type: string) => {
    if (type == "city") {
      setCitySelected("All");
      const res =
        categorySelected != "All" ? EventDetails.filter((event) => event.category == categorySelected) : EventDetails;

      setEventDetailsFiltered(res);
      setEventCount(res.length);
    } else {
      setCategorySelected("All");
      const res = citySelected != "All" ? EventDetails.filter((event) => event.city == citySelected) : EventDetails;
      setEventDetailsFiltered(res);
      setEventCount(res.length);
    }
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
      <Popover content="click to cancel this filter">
        <span>
          <Tag
            color="#2db7f5"
            round
            onClick={() => {
              cancelFilter("city");
            }}
          >
            {citySelected}
          </Tag>

          <Tag
            color="#87d068"
            round
            onClick={() => {
              cancelFilter("category");
            }}
          >
            {categorySelected}
          </Tag>
        </span>
      </Popover>

      <Divider>There are {eventCount} results</Divider>
      <Grid columns={columnsEvent} gap={8}>
        {eventDetailsFiltered.map((item) => (
          <Grid.Item onClick={() => goEventDetail(item.event)} key={item.event}>
            <div style={{ border: "2px solid #000000", borderRadius: "15px" }}>
              <Card
                title={
                  <div style={{ height: "40px" }}>
                    <div>{item.event}</div>
                    <Tag>{item.category}</Tag>
                  </div>
                }
              >
                <Image src={item.event_icon_url} style={{ borderRadius: 20, aspectRatio: "4/3" }} fit="cover" />

                <Tag color="#108ee9">
                  {item.date_start}-{item.date_end}
                </Tag>
                <Tag color="#87d068"> {item.city}</Tag>
              </Card>
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </>
  );
};

export default Home;
