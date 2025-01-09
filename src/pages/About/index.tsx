import { GithubOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
// import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header";
const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header></Header>
      <p className={styles.github}>
        Github
        <GithubOutlined />:<a href="https://github.com/irunart/photocast">https://github.com/irunart/photocast</a>
      </p>
      <p>
        {t("statement")} <b>hi@iest.run</b>.
      </p>
    </>
  );
};

export default About;
