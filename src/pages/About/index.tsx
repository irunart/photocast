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
      <p>
        本網頁僅為參賽者分享圖片內容提供網路平台與儲存空間，所分享之圖片將不時進行增減或更新。
        如有需要下載個人的完整圖片文件，或希望從本網頁移除，請與我們聯絡: <b>hi@iest.run</b>.
      </p>

      <p>
        {" "}
        Photocast is a platform to provide storage of pictures for trail runners. Photocase might add, revmove or update
        the pictures from time to time. For donwloading original photo, or removing your pictures from Photocast, please
        contact us: <b>hi@iest.run</b> .
      </p>
    </>
  );
};

export default About;
