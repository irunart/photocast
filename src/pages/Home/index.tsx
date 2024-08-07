import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image } from "antd-mobile";

// import { getEventLists } from "@/services/googleApis";
import { getEventDetail } from "@/services/googleApis";

import type { IEventLists, IEventDetail } from "./type";

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<IEventDetail[]>([]);

  const dataRef = useRef<IEventLists>();

  // init 阶段
  useEffect(() => {
    getEventDetail().then((res: CommonResponse<IEventLists>) => {
      let values = _.values(res.data);
      values = _.sortBy(values, ["date_start"]).reverse();
      setData(values);

      sessionStorage.setItem("EventsData", JSON.stringify(res.data));
    });
  }, []);

  const goEventDetail = (name: string) => {
    navigate("/event/" + name, { state: { data: dataRef.current?.[name] } });
  };

  //TODO: api接口 赛事详情,对应图片
  return (
    <Grid columns={3} gap={8}>
      {data.map((item) => (
        <Grid.Item onClick={() => goEventDetail(item.event)} key={item.event}>
          <Card title={item.event}>
            <Image src="https://iest.run/IEST-flag.jpg" style={{ borderRadius: 20 }} fit="cover" />
            {item.date_start}-{item.date_end}
          </Card>
        </Grid.Item>
      ))}
    </Grid>
  );
};

export default Home;
