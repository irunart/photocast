import { message } from "antd";
import axios from "axios";
import i18n from "@/i18n";

const baseUrl = "https://storage.googleapis.com/photocast/config/";

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    const { data } = res || {};
    return data;
  },
  (error) => {
    if (error.response.status === 401) {
      message.error(i18n.t("errors.login_expired"));
    } else {
      message.error(i18n.t("errors.server_error"));
    }
    if (error.response) Promise.reject(error);
  }
);

export default instance;
