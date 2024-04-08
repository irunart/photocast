import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Flex } from "antd";
import { Image, ImageViewer, Popup, CheckList, CascadePicker, Grid, Card } from "antd-mobile";
import { DownOutlined, MehOutlined, ClockCircleOutlined } from '@ant-design/icons'

import { getPhotographers, getPhotoDateHourData } from "@/services/googleApis";
import { getEventPhotoGrapher, grapherDateToCascadeOptions } from "./common";

import styles from "./index.module.scss";

// TODO: ImageViewer.Multi 用来展示图片

const Home = () => {
	// const location = useLocation();
	const navigate = useNavigate();
	const { event } = useParams();

	// 摄影师列表
	const [photoGraphers, setPhotoGraphers] = useState([]);
	// 当前摄影师
	const [grapher, setGrapher] = useState(null);

	const [grapherPopupVisible, setGraperPopupVisible] = useState(false)

	const [images, setImages] = useState([]);


	const [currentDateTime, setCurrentDateTime] = useState([]);
	const [dateTimePopVisible, setDateTimePopVisible] = useState(false);
	const [imagePopVisible, setImagePopVisible] = useState(false)

	if (!event) navigate("/home", { replace: true });

	useEffect(() => {
		if (!event) return;

		// 获取摄影师列表
		getPhotographers().then((res) => {
			const grapherLists = getEventPhotoGrapher(res, event);
			// setGrapher(grapherLists[0]);
			initSetGrapher(grapherLists[0])
			setPhotoGraphers(grapherLists);
		});
	}, [event]);

	const handlePhotoGrapherChange = (nextGrapher) => {
		const selectedGrapher = photoGraphers.find(
			(item) => item.value === nextGrapher
		);
		initSetGrapher(selectedGrapher)
	};

	// 选择摄影师 ，自动选择日期和时间
	const initSetGrapher = grapher => {
		const dates = Object.keys(grapher.available_time)
		const hours = grapher.available_time[dates[0]]

		setGrapher(grapher);
		setCurrentDateTime([dates[0], hours[0]])
	}

	useEffect(() => {
		if (!grapher?.value) return;
		getPhotoDateHourData(grapher?.value, currentDateTime[0], currentDateTime[1]).then(datas => {
			setImages(datas)
			console.log('datas', datas)
		})

	}, [currentDateTime])


	return (
		<div>
			<p>current photographer below:</p>
			<Input prefix={<MehOutlined />} value={grapher?.label} onClick={() => setGraperPopupVisible(true)} placeholder="Select a photographer" readOnly suffix={<DownOutlined />} />
			<p>current photo date time</p>
			<Input prefix={<ClockCircleOutlined />} value={currentDateTime.join('-')} onClick={() => setDateTimePopVisible(true)} placeholder="Select date and time" readOnly suffix={<DownOutlined />} />
			<p></p>
			<Grid columns={2} gap={8} >
				{images.map((image, index) => (
					<Grid.Item key={image.name} onClick={() => setImagePopVisible(true)}>
						<Image
							lazy={true}
							src={image?.url}
							fit='cover'
							style={{ borderRadius: 4 }}

						/>

					</Grid.Item>
				))}
			</Grid>
			<Popup
				visible={grapherPopupVisible}
				onMaskClick={() => setGraperPopupVisible(false)}
				destroyOnClose
			>
				<p className="text-center">   Select a photographer below:</p>
				<CheckList
					defaultValue={grapher?.value ? [grapher.value] : []}
					onChange={val => {
						handlePhotoGrapherChange(val[0])
						setGraperPopupVisible(false)
					}}
				>
					{photoGraphers.map(item => (
						<CheckList.Item key={item?.value} value={item?.value} className={styles.photoGraperItem}>
							<Flex align="center">
								<Image
									src={item?.photographer_icon_url}
									width={40}
									height={40}
									fit='cover'
									style={{ borderRadius: 4 }}
								/>
								<span>&nbsp;{item?.label}</span>
							</Flex>
						</CheckList.Item>
					))}
				</CheckList>
			</Popup>
			<CascadePicker
				title='级联选择'
				options={grapherDateToCascadeOptions(grapher)}
				visible={dateTimePopVisible}
				onClose={() => setDateTimePopVisible(false)}
				onConfirm={(val) => setCurrentDateTime(val)}
			/>
			<ImageViewer.Multi
				images={images.map(i => i.url)}
				visible={imagePopVisible}
				defaultIndex={1}
				onClose={() => setImagePopVisible(false)}
			/>
		</div>
	);
};

export default Home;
