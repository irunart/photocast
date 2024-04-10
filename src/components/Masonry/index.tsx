import { CSSProperties } from "react";

export interface MasonryProps {
  items: React.ReactNode[];
  column: number;
  gap?: number;
  style?: CSSProperties;
}

const Masonry: React.FC<MasonryProps> = (props) => {
  const {items, column, gap = 8, style} = props;

  const columns = Array.from({length: column}, (): React.ReactNode[] => [])
  items.forEach((item, index) => columns[index % column].push(item))
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "stretch",
        boxSizing: "border-box",
        width: "100%",
        gap,
        ...style,
      }}
    >
      {columns.map((items, columnIndex) => (
        <div
          key={columnIndex}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "stretch",
            flex: 1,
            width: 0,
            gap,
          }}
        >
          {items}
        </div>
    ))}
    </div>
  )
}


export default Masonry;
