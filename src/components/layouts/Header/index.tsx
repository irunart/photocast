import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { Image } from "antd-mobile";
const Header = () => {
  return (
    <>
      <h1>PhotoCast</h1>

      <em className={styles.summary}>
        {"A runners-for-runners photo system by "}
        <a href="https://iest.run">iest.run</a>.
      </em>
      <Link to="https://iest.run/" className={styles.title} style={{ paddingBottom: "10px" }}>
        <Image src="https://iest.run/assets/img/IEST-logo-with-text-horizontal.png" width={"200px"}></Image>
      </Link>
    </>
  );
};

export default Header;
