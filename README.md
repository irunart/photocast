# PhotoCast frontend

- Staging: https://irunart.github.io/photocast/
- Prod: https://iest.run/photocast

```bash
# node 18 + 自带npm
npm install -g pnpm
pnpm i # 下载依赖包

# dev

pnpm dev # 启动开发服务器

# build 打包产物

pnpm build


```

# 部分库说明

css 样式
https://tailwind.nodejs.cn/docs/configuration

组件仓库
https://ant-design.antgroup.com/components/form-cn
https://mobile.ant.design/zh/components/button

# Changelog

### 2024-08-07

1. 打开大图后能添加提示可以左右滑动浏览，否则用户不容易察觉可以左右滑动看，例如添加左右箭头
2. 赛事列表布局优化：1）列表转网格，responsiveness；2）改为按 date_start 倒序，最新的赛事在上面；3）支持按照 category、city 做 filter
3. 赛事列表布页。赛事详情添加：赛事 Icon，赛事基本信息，如时间等。event_detail.json
4. Event 页面优化：显示 Event 的基本信息。

### 2024-04-08

Done:
1. 选择时间和日期
2. 展示图片，并且点击图片可以弹窗滑动

TODO:

1. 图片懒加载不生效，有性能问题
2. 分享连接和滑动到顶部功能未实现
3. tailwindcss 暂时不生效，后面空了再研究下
