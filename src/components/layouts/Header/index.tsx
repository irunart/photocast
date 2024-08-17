import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { Image, Grid } from "antd-mobile";

const Header = () => {
  return (
    <>
      <Grid columns={2}>
        <Grid.Item>
          <Link to="/">
            <h1>PhotoCast</h1>
          </Link>

          <em className={styles.summary}>
            {"A runners-for-runners photo system by "}
            <a href="https://iest.run">iest.run</a>.
          </em>
        </Grid.Item>
        <Grid.Item>
          <Link to="https://iest.run/" className={styles.title} style={{ paddingBottom: "10px" }}>
            <Image
              src="https://iest.run/assets/img/IEST-logo-with-text-horizontal.png"
              width={"150px"}
              style={{ position: "absolute", right: 0 }}
            ></Image>
          </Link>
        </Grid.Item>
      </Grid>
    </>
  );
};

export default Header;
