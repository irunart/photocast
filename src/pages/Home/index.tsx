import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image, Picker, Button, Space, Tag, Divider } from "antd-mobile";

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

  const basicColumns = [
    [{ label: "Hong Kong", value: "Hong Kong" }],
    [{ label: "IEST Training", value: "IEST Training" }],
  ];
  const [multColumns, setMultColumns] = useState(basicColumns);

  // const [value, setValue] = useState<(string | null)[]>([])

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
      setMultColumns([columnsCites, columnsCategories]);

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

  //TODO: api接口 赛事详情,对应图片
  return (
    <>
      <Picker
        columns={multColumns}
        // value={value}
        onConfirm={(val) => {
          setCitySelected(val[0] as string);
          setCategorySelected(val[1] as string);
          filterEvents(val[0] as string, val[1] as string);
          // console.log('onSelect', val, extend.items)
        }}
        onSelect={(val, extend) => {
          console.log("onSelect", val, extend.items);
        }}
        style={{ touchAction: "pan-y" }}
      >
        {(_items, { open }) => {
          return (
            <div>
              <Button onClick={open}>filter</Button>
              {/* {items.every(item => item === null)
                ? '未选择'
                : 
                } */}

              <Space>
                <span title="click to cancel this filter">
                  <Tag color="#2db7f5" round>
                    {citySelected}
                  </Tag>
                </span>
                <span title="click to cancel this filter">
                  <Tag color="#87d068" round>
                    {categorySelected}
                  </Tag>
                </span>
                <span></span>
              </Space>
            </div>
          );
        }}
      </Picker>
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
                <Image src={item.event_icon_url} style={{ borderRadius: 20 }} fit="cover" />

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
