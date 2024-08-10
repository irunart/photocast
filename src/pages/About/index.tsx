import { GithubOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const About = () => {
  return (
    <h1 className={styles.github}>
      Github
      <GithubOutlined />:<a href="https://github.com/irunart/photocast">https://github.com/irunart/photocast</a>
    </h1>
  );
};

export default About;
