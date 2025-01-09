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
// import weekday from "dayjs/plugin/weekday";
// import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/zh-cn";
import toObject from "dayjs/plugin/toObject";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "./i18n";

dayjs.extend(advancedFormat); //其他格式 ( 依赖 AdvancedFormat 插件 )
dayjs.extend(toObject); //返回包含时间信息的 Object。
dayjs.extend(weekOfYear);

import "./assets/styles/base.css";

const getAntdLocale = (lng: string) => {
  switch (lng) {
    case "zh-TW":
      return zhTW;
    case "zh":
      return zhCN;
    case "en":
    default:
      return enUS;
  }
};

// 创建一个包装组件来使用 hooks
const AppWrapper = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // 同步 dayjs 的语言设置
    const language = i18n.language.toLowerCase();
    if (language.startsWith("zh")) {
      dayjs.locale("zh-cn");
    } else {
      dayjs.locale("en");
    }
  }, [i18n.language]);

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
