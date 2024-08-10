import { Link } from "react-router-dom";
import styles from "./index.module.scss";
const Header = () => {
  return (
    <>
      <h5>
        <Link to="/" className={styles.title}>
          PhotoCast
        </Link>
      </h5>
      <em className={styles.summary}>
        {"A runners-for-runners photo system by "}
        <a href="https://iest.run">iest.run</a>.
      </em>
    </>
  );
};

export default Header;
