import { Image, ImageProps } from "antd-mobile";
import { useState } from "react";

export interface ResponsiveImageProps extends ImageProps {
  minHeight: number;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = (props) => {
  const {minHeight: minHeightInitial, onLoad, style, ...restImageProps} = props;
  const [minHeight, setMinHeight] = useState(minHeightInitial);
  return <Image
    {...restImageProps}
    style={{
      ...style, 
      minHeight,
      alignContent: "center",
      backgroundColor: "var(--adm-color-fill-content)"
    }}
    onLoad={(e) => {
      onLoad?.(e);
      const img = e.target as HTMLImageElement;
      setTimeout(() => setMinHeight(img.getBoundingClientRect()?.height), 0);
    }}
  />;
}


export default ResponsiveImage;
