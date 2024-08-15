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

### 2024-08-09

1. Event 页面。当照片超过 100 张/hour 的时候，在前端进一步分组展示。动态调整时间分割线的粒度。 ceil(60min / ({# of photos} / 100)). 测试页面： Golden 100 2024（香港黄金百里；700/hr）
2. Event 页面。当一个 hour 照片数量过少的时候，自动 load 下一个 hour，从 >20 张照片开始展示
3. Event 页面优化：每个 event 展示 X?(十)张筛选过的照片。Mockup：用照片列表中的前十张。

### 2024-08-08
1.1) AutoRefresh 状态下，照片按照倒序，最新的时间在前面；2）非AutoRefresh 状态下，照片按照正序；
2. 非 AutoRefresh 状态下，实现 Infinite Scroll；添加小时的分割线
3. 数据请求时，增加loading 状态（infinite scroll 页面）
4. 只有 event 没有日期的情况下，优先选择最新的 date 里的第一个 hour
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
