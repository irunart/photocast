/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, ReactElement, useEffect, useState } from "react";
import { MasonryElement } from "@/components/MasonryElement";

export interface MasonryProps {
  items: React.ReactNode[];
  column: number;
  initailHeight?: number;
  gap?: number;
  style?: CSSProperties;
  divider?: React.ReactNode | undefined;
}

interface PhotosDivider {
  photos: React.ReactNode[];
  divider: React.ReactNode | undefined;
}

export const Masonry: React.FC<MasonryProps> = (props) => {
  const { items, column, gap = 8, style, initailHeight = 150 } = props;
  const [photosDividers, setPhotosDividers] = useState<PhotosDivider[]>([]);

  useEffect(() => {
    const value: PhotosDivider[] = [];
    let start = 0;
    for (let i = 0; i < items.length; i++) {
      if ((items[i] as ReactElement)?.type != "div") {
        console.log(1);
        value.push({ photos: items.slice(start, i - 1), divider: items[i] });
        start = i + 1;
      }
    }
    value.push({ photos: items.slice(start, items.length), divider: undefined });
    setPhotosDividers(value);
  }, [items]);

  return photosDividers.map((i) => (
    <MasonryElement
      column={column}
      gap={gap}
      initailHeight={initailHeight}
      items={i.photos}
      divider={i.divider}
      style={style}
    />
  ));
};

export default Masonry;
