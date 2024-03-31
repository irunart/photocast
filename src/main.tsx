import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import router from '@/routes';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import NiceModal from '@ebay/nice-modal-react';
import './bootstrap';

export const browserRouter = createHashRouter(router);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider
        locale={zhCN}
      >
        <NiceModal.Provider>
          <RouterProvider router={browserRouter} />
        </NiceModal.Provider>
      </ConfigProvider>
    </StyleProvider>
  </React.StrictMode>,
);
