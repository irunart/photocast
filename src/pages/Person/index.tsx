/* eslint-disable react-hooks/exhaustive-deps */
// import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import { IImageEs } from "./type";
import { CloudDownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd-mobile";
import { Link } from "react-router-dom";
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
  const deleteAllPhotos = () => {
    setImages([]);
    localStorage.removeItem("ShoppingData");
  };

  const [isLoading, setIsLoading] = useState(false);

  const downloadAllPhotos = async () => {
    setIsLoading(true);

    // try {
    //   const promises = images.map(async (item) => {
    //     const response = await fetch(item.url);
    //     const blob = await response.blob();
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = `${item.name}`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    //   });

    //   await Promise.all(promises);
    // } catch (error) {
    //   console.error("Error downloading images:", error);
    // } finally {
    //   setIsLoading(false);
    // }
    // for (let i =0;i<images.length;i++){
    //   window.open("https://runart.net/photo_download/?url=" + images[i].url);
    //   console.log(i)
    // }
    Modal.alert({
      content:
        "This feature has not yet been implemented.You can download them one by one.Please understand the inconvenience caused to you",
      confirmText: "I know",
    });
  };
  return (
    <>
      <div style={{ paddingBottom: "10px", paddingTop: "10px" }}>
        The site shows thumbnails and you can download the original images from this page.
      </div>

      <div style={{ marginBottom: 10 }}>
        <Link to="/">
          <Button style={{ marginRight: 10 }}>Back to Home</Button>
        </Link>

        <Button style={{ marginRight: 10 }} onClick={deleteAllPhotos}>
          Clear All
        </Button>

        <Button onClick={downloadAllPhotos}>Download All{isLoading}</Button>
      </div>

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
    </>
  );
};

export default Person;
