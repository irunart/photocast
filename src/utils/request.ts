import axios from "axios";
import { message } from "antd";

const baseUrl = "https://storage.googleapis.com/photocast/config/";

const instance = axios.create({
	baseURL: baseUrl,
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
		return data?.data || data;
	},
	(error) => {
		if (error.response.status === 401) {
			message.error("登录失效，请重新登录");
		} else {
			message.error("服务器错误，请检查服务器");
		}
		if (error.response) Promise.reject(error);
	}
);

export default instance;
