import { FloatButton, message } from "antd";
import { GithubOutlined, ShareAltOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleShareBtnClick = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        messageApi.success("Link copied to clipboard");
      },
      () => {
        messageApi.error(
          "Your browser does not support this feature, please copy the link manually and send it to your friends"
        );
      }
    );
  };

  return (
    <div className={styles.footer}>
      {contextHolder}
      <p className={styles.github}>
        <a href="https://github.com/irunart/photocast">
          <GithubOutlined />
        </a>
      </p>
      <FloatButton.Group style={{ bottom: 120 }}>
        <FloatButton icon={<ShareAltOutlined />} onClick={handleShareBtnClick} />
        <FloatButton.BackTop />
      </FloatButton.Group>
    </div>
  );
};

export default Footer;
