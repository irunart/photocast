import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
const pxUnitToNumber = (val: string) => {
  return Number(val.replace("px", ""));
};
export interface MasonryProps {
  items: React.ReactNode[];
  column: number;
  initailHeight?: number;
  gap?: number;
  style?: CSSProperties;
  divider: React.ReactNode | undefined;
}

export const MasonryElement: React.FC<MasonryProps> = (props) => {
  const { items, column, gap = 8, style, initailHeight = 150, divider } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState((initailHeight + gap) * ((items.length + column - 1) / column));
  const reLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const heights = Array.from({ length: column }, () => 0);
    containerRef.current.childNodes.forEach((child) => {
      const element = child as HTMLElement;
      const elementHeight = pxUnitToNumber(window.getComputedStyle(element).height);
      if (elementHeight === 0 || element.dataset.class === "column-break") {
        return;
      }
      const minHeight = Math.min(...heights);
      const minColumn = heights.indexOf(minHeight);
      element.style.order = `${minColumn + 1}`;
      heights[minColumn] += elementHeight + gap;
    });
    flushSync(() => setMaxHeight(Math.ceil(Math.max(...heights))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, gap, items]);

  useEffect(() => {
    const observer = new ResizeObserver(reLayout);
    if (containerRef.current) {
      containerRef.current.childNodes.forEach((child) => observer.observe(child as HTMLElement));
    }
    return () => observer.disconnect();
  }, [reLayout]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          position: "relative",
          flexFlow: "column wrap",
          alignContent: "flex-start",
          boxSizing: "border-box",
          width: "100%",
          height: maxHeight + gap,
          overflow: "hidden",
          ...style,
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              margin: `0 ${gap}px ${gap}px 0`,
              width: `calc((100% - ${(column - 1) * gap}px) / ${column})`,
              order: (idx % column) + 1,
            }}
          >
            {item}
          </div>
        ))}
        {Array.from({ length: column }).map((_, idx) => (
          <span
            key={`break-${idx}`}
            data-class="column-break"
            style={{
              flexBasis: "100%",
              width: 0,
              padding: 0,
              order: idx + 1,
            }}
          />
        ))}
      </div>
      {divider}
    </>
  );
};
