import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { Image, Modal, ImageViewer } from "antd-mobile";

import { getPhotographers } from "@/services/googleApis";
import { getEventPhotoGrapher } from "./common";

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

	const [images, setImages] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedHour, setSelectedHour] = useState(null);

	if (!event) navigate("/home", { replace: true });

	useEffect(() => {
		if (!event) return;

		// 获取摄影师列表
		getPhotographers().then((res) => {
			const grapherLists = getEventPhotoGrapher(res, event);
			setGrapher(grapherLists[0]);
			setPhotoGraphers(grapherLists);
		});
	}, [event]);

	useEffect(() => {
		if (
			grapher &&
			selectedDate &&
			selectedHour !== null &&
			grapher.value &&
			selectedDate
		) {
			const fetchData = async () => {
				try {
					const response = await fetch(
						`https://storage.googleapis.com/photocast/config/${grapher.value}/${selectedDate}/${selectedHour}.json`
					);
					const data = await response.json();
					setImages(data.data);
				} catch (error) {
					console.error("Error fetching images:", error);
				}
			};

			fetchData();
		}
	}, [grapher, selectedDate, selectedHour]);

	const handlePhotoGrapherChange = (nextGrapher) => {
		const selectedGrapher = photoGraphers.find(
			(item) => item.value === nextGrapher
		);
		setGrapher(selectedGrapher);

		setSelectedDate(null);
		setSelectedHour(null);
	};

	const handleDateSelection = (date) => {
		setSelectedDate(date);
		setSelectedHour(null);
	};

	const handleHourSelection = (hour) => {
		setSelectedHour(hour);
	};

	const handleImageClick = (image) => {
		console.log("Image Path:", image.url);
		setSelectedImage(image);
		openWebpageWithDisclaimer(image.url, "Disclaimer");
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const openWebpageWithDisclaimer = (imageUrl, disclaimerText) => {
		const newWindow = window.open("", "_blank");
		newWindow.document.write(`
      <html>
        <head>
          <title>Image Viewer</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #efefef;
            }
            .container {
              max-width: 80%;
              text-align: center;
            }
            .image {
              max-width: 100%;
              max-height: 80vh;
              margin-bottom: 20px;
            }
            .disclaimer {
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="image" src="${imageUrl}" alt="Original Image">
            <div class="disclaimer">${disclaimerText}</div>
          </div>
        </body>
      </html>
    `);
		newWindow.document.close();
	};

	return (
		<div>
			<p>Select a photographer below:</p>
			<Select
				className={styles.grapherOptions}
				onChange={handlePhotoGrapherChange}
				value={grapher?.value}
			>
				{photoGraphers.map((item) => (
					<Select.Option key={item.value} value={item.value}>
						<span>{item.label}</span>
					</Select.Option>
				))}
			</Select>
			{grapher && (
				<div>
					<div>
						<p>Select a date:</p>
						<Select
							onChange={handleDateSelection}
							value={selectedDate}
							style={{ width: 200 }}
						>
							{Object.keys(grapher.available_time).map((date) => (
								<Select.Option key={date} value={date}>
									{date}
								</Select.Option>
							))}
						</Select>
						{selectedDate && (
							<div>
								<p>Select an hour:</p>
								<Select
									onChange={handleHourSelection}
									value={selectedHour}
									style={{ width: 200 }}
								>
									{grapher.available_time[selectedDate]?.map((hour) => (
										<Select.Option key={hour} value={hour}>
											{hour}
										</Select.Option>
									))}
								</Select>
							</div>
						)}
					</div>
					<div className={styles.imageContainer}>
						{images.map((image, index) => (
							<div key={index} className={styles.imageWrapper}>
								<Image
									src={image.url}
									alt={`Image ${index + 1}`}
									className={styles.image}
									onClick={() => handleImageClick(image)}
								/>
							</div>
						))}
						<Modal visible={isModalOpen} onClose={handleModalClose}>
							<Image
								src={selectedImage?.url}
								alt="Selected Image"
								className={styles.modalImage}
							/>
						</Modal>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
