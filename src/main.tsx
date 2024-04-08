import React from "react";
import ReactDOM from "react-dom/client";

import {
	StyleProvider,
	legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import App from "@/routes";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import NiceModal from "@ebay/nice-modal-react";
import "./bootstrap";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<StyleProvider
			hashPriority="high"
			transformers={[legacyLogicalPropertiesTransformer]}
		>
			<ConfigProvider locale={zhCN}>
				<NiceModal.Provider>
					<App />
				</NiceModal.Provider>
			</ConfigProvider>
		</StyleProvider>
	</React.StrictMode>
);
