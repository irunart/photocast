import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash-es";

import { List, Image } from "antd-mobile";

import { getEventLists } from "@/services/googleApis";

import type { IEventLists } from "./type";

const Home = () => {
	const navigate = useNavigate();

	const [data, setData] = useState<string[]>([]);

	const datasRef = useRef<IEventLists>();

	// init 阶段
	useEffect(() => {
		getEventLists().then((res: CommonResponse<IEventLists>) => {
			datasRef.current = res.data;
			setData(_.keys(res.data));
		});
	}, []);

	const goEventDetail = (name: string) => {
		navigate("/event/" + name, { state: { data: datasRef.current?.[name] } });
	};

	//TODO: api接口 赛事详情,对应图片

	return (
		<List>
			{data.map((event) => (
				<List.Item
					prefix={
						<Image
							src="https://iest.run/IEST-flag.jpg"
							style={{ borderRadius: 20 }}
							fit="cover"
							width={40}
							height={40}
						/>
					}
					description={event + "赛事"}
					key={event}
					onClick={() => goEventDetail(event)}
				>
					{event}
				</List.Item>
			))}
		</List>
	);
};

export default Home;
