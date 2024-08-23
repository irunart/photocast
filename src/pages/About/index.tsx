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
        本網頁僅為跑者分享圖片內容提供網路平台與儲存空間，所分享之圖片將不時進行增減或更新。
        影像由同爲跑者的攝影師上傳，平臺不負責驗證版權。 如希望從本網頁移除部分照片，請與我們聯絡: <b>hi@iest.run</b>.
      </p>

      <p>
        {" "}
        Photocast is a platform for runners to share photos. Photocase might add, revmove or update the pictures from
        time to time. The photos are uploaded by peer runners directly and the platform does not verify copyright
        ownership. If you want to remove some photos from the platform, please contact us: <b>hi@iest.run</b>.
      </p>
    </>
  );
};

export default About;
