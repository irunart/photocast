// import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Masonry from "@/components/Masonry";
import ResponsiveImage from "@/components/ResponsiveImage";

import { IImageEs } from "./type";
const Person: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState<IImageEs[]>([]);

  useEffect(() => {
    const names = searchParams.get("names")?.split(",");
    const img = names?.map(
      (item) => ({ name: item, url: "https://storage.googleapis.com/photocast/" + item }) as IImageEs
    );
    console.log(img);
    setImages(img || []);
    setSearchParams(searchParams);
  }, [searchParams]);

  return (
    <Masonry
      column={2}
      gap={8}
      initailHeight={150}
      items={images.map((image, index) => (
        // <div key={image.name} onClick={() => openImageViewer(index)}>
        <div key={image.name} onClick={() => console.log(index)}>
          <ResponsiveImage minHeight={150} lazy src={image?.url} fit="cover" />
        </div>
      ))}
    />
  );
};

export default Person;
