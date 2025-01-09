import React from "react";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";
import { StyleProvider, legacyLogicalPropertiesTransformer } from "@ant-design/cssinjs";
import App from "@/routes";

import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import zhTW from "antd/locale/zh_TW";

import NiceModal from "@ebay/nice-modal-react";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // 繁体中文
import "dayjs/locale/zh-cn"; // 简体中文
import "dayjs/locale/en";
import "./i18n";

import "./assets/styles/base.css";

const getAntdLocale = (lng: string) => {
  switch (lng) {
    case "zh-TW":
      dayjs.locale("zh-tw");
      return zhTW;
    case "zh":
      dayjs.locale("zh-cn");
      return zhCN;
    case "en":
    default:
      dayjs.locale("en");
      return enUS;
  }
};

// 创建一个包装组件来使用 hooks
const AppWrapper = () => {
  const { i18n } = useTranslation();

  return (
    <React.StrictMode>
      <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
        <ConfigProvider
          locale={getAntdLocale(i18n.language)}
          theme={{
            components: {
              FloatButton: {
                zIndexPopupBase: 800,
              },
            },
          }}
        >
          <NiceModal.Provider>
            <App />
          </NiceModal.Provider>
        </ConfigProvider>
      </StyleProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppWrapper />);
