/* eslint-disable react-hooks/exhaustive-deps */
// import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import { IImageEs } from "./type";
import { CloudDownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd-mobile";
const Person: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState<IImageEs[]>([]);

  useEffect(() => {
    const ShoppingData = localStorage.getItem("ShoppingData");
    let img: IImageEs[];
    if (typeof ShoppingData === "string") {
      const ShoppingDataList = JSON.parse(ShoppingData as string) as string[];
      img = ShoppingDataList?.map(
        (item) => ({ name: item, url: "https://storage.googleapis.com/photocast/" + item }) as IImageEs
      );
    } else {
      img = [];
    }

    setImages(img);
  });
  useEffect(() => {
    // const names = searchParams.get("names")?.split(",");
    // const img = names?.map(
    //   (item) => ({ name: item, url: "https://storage.googleapis.com/photocast/" + item }) as IImageEs
    // );
    // console.log(img);
    // setImages(img || []);
    console.log(searchParams);
    setSearchParams(searchParams);
  }, [searchParams]);

  const deletePhoto = (name: string) => {
    const ShoppingData = localStorage.getItem("ShoppingData");
    const ShoppingDataList = JSON.parse(ShoppingData as string) as string[];
    const ShoppingDataListDeleted = ShoppingDataList.filter((item) => item != name);
    localStorage.setItem("ShoppingData", JSON.stringify(ShoppingDataListDeleted));

    setImages(images.filter((item) => item.name != name));
  };
  return (
    <Masonry
      column={2}
      gap={8}
      initailHeight={150}
      items={images.map((image, index) => (
        // <div key={image.name} onClick={() => openImageViewer(index)}>
        <div key={image.name} onClick={() => console.log(index)} style={{ position: "relative" }}>
          <span style={{ position: "absolute", right: 0, marginTop: 10, marginRight: 10 }}>
            <Button
              shape="rounded"
              onClick={() => {
                deletePhoto(image.name);
              }}
            >
              <DeleteOutlined style={{ fontSize: "30px" }} />
            </Button>
          </span>
          <span style={{ position: "absolute", right: 0, marginTop: 60, marginRight: 10 }}>
            <Button
              shape="rounded"
              onClick={() => {
                window.open("https://runart.net/photo_download/?url=" + image.url);
              }}
            >
              <CloudDownloadOutlined style={{ fontSize: "30px" }} />
            </Button>
          </span>

          <ResponsiveImage minHeight={150} lazy src={image?.url} fit="cover" />
        </div>
      ))}
    />
  );
};

export default Person;
