import React from "react";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";
import { StyleProvider, legacyLogicalPropertiesTransformer } from "@ant-design/cssinjs";
import App from "@/routes";
import { ConfigProvider } from "antd";
import { ConfigProvider as ConfigProviderMobile } from "antd-mobile";
import NiceModal from "@ebay/nice-modal-react";
import dayjs from "dayjs";

import "dayjs/locale/zh-tw"; // 繁体中文
import "dayjs/locale/zh-cn"; // 简体中文
import "dayjs/locale/en";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import zhTW from "antd/locale/zh_TW";
import en_US from "antd-mobile/es/locales/en-US";
import zh_CN from "antd-mobile/es/locales/zh-CN";
import zh_TW from "antd-mobile/es/locales/zh-TW";

import "./i18n";

import "./assets/styles/base.css";

const getLocale = (lng: string) => {
  switch (lng) {
    case "zh-TW":
      dayjs.locale("zh-tw");
      return {
        antd: zhTW,
        antdMobile: zh_TW,
      };
    case "zh":
      dayjs.locale("zh-cn");
      return {
        antd: zhCN,
        antdMobile: zh_CN,
      };
    case "en":
    default:
      dayjs.locale("en");
      return {
        antd: enUS,
        antdMobile: en_US,
      };
  }
};

// 创建一个包装组件来使用 hooks
const AppWrapper = () => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <React.StrictMode>
      <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
        <ConfigProvider
          locale={locale.antd}
          theme={{
            components: {
              FloatButton: {
                zIndexPopupBase: 800,
              },
            },
          }}
        >
          <ConfigProviderMobile locale={locale.antdMobile}>
            <NiceModal.Provider>
              <App />
            </NiceModal.Provider>
          </ConfigProviderMobile>
        </ConfigProvider>
      </StyleProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppWrapper />);
