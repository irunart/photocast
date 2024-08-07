import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";
import { Grid, Card, Image } from "antd-mobile";

// import { getEventLists } from "@/services/googleApis";
import { getEventDetail } from "@/services/googleApis";

import type { IEventLists } from "./type";

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<string[]>([]);

  const dataRef = useRef<IEventLists>();

  // init 阶段
  useEffect(() => {
    getEventDetail().then((res: CommonResponse<IEventLists>) => {
      const sortedEventLists = Object.entries(res.data).reduce((acc, [key, value]) => {
        acc[key] = _.sortBy(value, "date_start");
        return acc;
      }, {} as IEventLists);

      console.log(sortedEventLists);
      res.data = sortedEventLists;

      setData(_.keys(res.data));
    });
  }, []);

  const goEventDetail = (name: string) => {
    navigate("/event/" + name, { state: { data: dataRef.current?.[name] } });
  };

  //TODO: api接口 赛事详情,对应图片
  return (
    <Grid columns={3} gap={8}>
      {data.map((event) => (
        <Grid.Item onClick={() => goEventDetail(event)} key={event}>
          <Card title={event}>
            <Image src="https://iest.run/IEST-flag.jpg" style={{ borderRadius: 20 }} fit="cover" />
          </Card>
        </Grid.Item>
      ))}
    </Grid>
  );
};

export default Home;
