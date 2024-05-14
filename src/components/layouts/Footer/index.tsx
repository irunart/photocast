import React, { useState } from "react";
import { FloatButton, message, Modal } from "antd";
import { ShareAltOutlined, CommentOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);

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

  const openForm = () => {
    setModalVisible(true); // Open the modal when the form button is clicked
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <>
      <Modal
        title="Feedback Form"
        open={modalVisible}
        onCancel={closeModal}
        footer={null} // Remove the default footer buttons
        width={640} // Set the width of the modal
      >
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdwCyjuEJt9TUUNDnRzUuJ8wYbHg9RHNQwaCKxbNu9QeCaO3A/viewform?embedded=true"
          width="100%"
          height="400"
          frameborder="0"
        >
          正在加载…
        </iframe>
      </Modal>
      <div className={styles.footer}>
        {contextHolder}
        <p className={styles.github}>
          <a href="https://github.com/irunart/photocast">GitHub.com</a>
        </p>
        <FloatButton.Group>
          <FloatButton icon={<ShareAltOutlined />} onClick={handleShareBtnClick} />
          <FloatButton icon={<CommentOutlined />} onClick={openForm} />
          <FloatButton.BackTop />
        </FloatButton.Group>
      </div>
    </>
  );
};

export default Footer;
