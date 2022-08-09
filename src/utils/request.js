import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Message } from "element-ui";
import { gettime } from "@/utils/auth";

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
}); //创建axios实例
const timeout = 6000000;
function getTimeNow() {
  return Date.now() - gettime() < timeout;
}
// q请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) {
      // x携带请求头
      if (getTimeNow()) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        Message.error("tokrn超时,请重新登录");
        store.dispatch("user/logout");
        router.push("/");
        return Promise.reject("");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 相应拦截器
request.interceptors.response.use(
  (response) => {
    const {
      data: { success, data, message },
    } = response;
    if (success) {
      return data;
    }
    // rRu如果代码走到这里，说明success不存在，请求接口有问题
    Message.error(message || "系统错误");
    // 失败的promise>>接口请求的地方报错
    return Promise.reject(message || "系统错误");
  },
  (error) => {
    console.dir(error);
    // 添加错误处理方式
    // 401 >> 退出登录 》》 跳转到登录页面
    if (error.response.status === 401) {
      store.dispatch("user/logout");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "系统错误");
    return Promise.reject(error);
  }
);

export default request; //mo默认导出request请求
