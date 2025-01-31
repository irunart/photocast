import React, { useState } from "react";
import { FloatButton, Modal } from "antd";
import { Link } from "react-router-dom";

import { Space } from "antd-mobile";

import { CommentOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const Footer: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // const handleShareBtnClick = () => {
  //   navigator.clipboard.writeText(window.location.href).then(
  //     () => {
  //       messageApi.success("Link copied to clipboard");
  //     },
  //     () => {
  //       messageApi.error(
  //         "Your browser does not support this feature, please copy the link manually and send it to your friends"
  //       );
  //     }
  //   );
  // };

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
          src="https://forms.gle/A8ohKa6i5ffssTQ9A?embedded=true"
          width="100%"
          height="400"
          style={{ border: "none" }}
        >
          Loading...
        </iframe>
      </Modal>
      <hr />
      <div className={styles.footer}>
        <Space wrap block justify="center" align="center" style={{ textAlign: "center", "--gap": "20px" }}>
          <span>
            Powered by <a href="https://RunArt.net">RunArt.net</a>
          </span>
          |
          <span>
            Operated by <a href="https://iest.run">iest.run</a>
          </span>
          |
          <span>
            <Link to="/about">About</Link>
          </span>
        </Space>
      </div>
      <FloatButton.Group style={{ bottom: 200 }}>
        {/* <FloatButton icon={<ShareAltOutlined />} onClick={handleShareBtnClick} /> */}
        <FloatButton icon={<CommentOutlined />} onClick={openForm} />
        <FloatButton.BackTop />
      </FloatButton.Group>
    </>
  );
};

export default Footer;
