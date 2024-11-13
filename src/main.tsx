import React from "react";
import ReactDOM from "react-dom/client";
import { StyleProvider, legacyLogicalPropertiesTransformer } from "@ant-design/cssinjs";
import App from "@/routes";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import NiceModal from "@ebay/nice-modal-react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/zh-cn";
import toObject from "dayjs/plugin/toObject";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat); //其他格式 ( 依赖 AdvancedFormat 插件 )
dayjs.extend(toObject); //返回包含时间信息的 Object。
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.locale("zh-cn"); // 设置dayjs，星期一作为周的第一天

import "./assets/styles/base.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider locale={zhCN}>
        <NiceModal.Provider>
          <App />
        </NiceModal.Provider>
      </ConfigProvider>
    </StyleProvider>
  </React.StrictMode>
);
