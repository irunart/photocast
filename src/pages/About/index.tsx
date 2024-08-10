import { GithubOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
// import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header";
const About = () => {
  return (
    <>
      <Header></Header>
      <p className={styles.github}>
        Github
        <GithubOutlined />:<a href="https://github.com/irunart/photocast">https://github.com/irunart/photocast</a>
      </p>
    </>
  );
};

export default About;
