export default {
  "/api": {
    target: `http://localhost:3000`, // 开发模式下代理地址， 解决跨域请求问题
    changeOrigin: true,
  },
};
