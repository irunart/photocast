import "./styles/base.scss";

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
