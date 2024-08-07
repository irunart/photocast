import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image, Picker, Button, Space, Tag } from "antd-mobile";

// import { getEventLists } from "@/services/googleApis";
import { getEventDetail } from "@/services/googleApis";

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
      console.log(EventDetails.filter((event) => event.city == city));
      setEventDetailsFiltered(EventDetails.filter((event) => event.city == city && event.category == category));
    } else if (city != "All" && category == "All") {
      setEventDetailsFiltered(EventDetails.filter((event) => event.city == city));
    } else if (city == "All" && category != "All") {
      setEventDetailsFiltered(EventDetails.filter((event) => event.category == category));
    } else {
      setEventDetailsFiltered(EventDetails);
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
        {(items, { open }) => {
          return (
            <div>
              <Button onClick={open}>filter</Button>
              {/* {items.every(item => item === null)
                ? '未选择'
                : 
                } */}
              <Space>
                <Tag color="#2db7f5">{citySelected}</Tag>
                <Tag color="#87d068">{categorySelected}</Tag>
              </Space>
            </div>
          );
        }}
      </Picker>
      <Grid columns={3} gap={8}>
        {eventDetailsFiltered.map((item) => (
          <Grid.Item onClick={() => goEventDetail(item.event)} key={item.event}>
            <Card title={item.event}>
              <Image src="https://iest.run/IEST-flag.jpg" style={{ borderRadius: 20 }} fit="cover" />
              {item.date_start}➡️{item.date_end}
            </Card>
          </Grid.Item>
        ))}
      </Grid>
    </>
  );
};

export default Home;
