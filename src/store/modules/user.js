import { getUserInfo, login, getUserDetailById } from "@/api/user";
import { resetRouter } from "@/router";
import {
  getToken,
  setToken,
  removeToken,
  removeUserInfo,
  settime,
} from "@/utils/auth";
// 存储状态
const state = {
  token: getToken(), //chu初始化的时候b吧本地存储里面的token赋值给vuex默认值
  userInfo: {},
};
// x修改状态
const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  // 修改的方法
  setToken(state, token) {
    state.token = token;
    setToken(token); //b本地存储的设置token的方法，，auth。js
  },
  removeToken(state) {
    state.token = null; // 删除vuex的token
    removeToken(); // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  removeUserInfo(state) {
    state.userInfo = null;
  },
};
// 执行异步
const actions = {
  // 登录的请求》》commit 》
  async login(context, data) {
    // console.log(data);
    const res = await login(data);
    console.log(res);
    settime();
    // 把获取到的数据放到vuex和本地存储，数据刷新时把本地存储的数据传给vuex
    context.commit("setToken", res);
  },
  // 获取用户资料active
  async getUserInfo(context) {
    // console.log(1);
    const res = await getUserInfo();
    const baseURL = await getUserDetailById(res.userId);
    // console.log(res);
    // console.log(baseURL);
    // 存储到vuex
    context.commit("setUserInfo", { ...res, ...baseURL });
    return { ...res, ...baseURL };
  },
  logout(context) {
    context.commit("removeToken");
    context.commit("removeUserInfo");

    // 重置路由匹配信息
    resetRouter()

    // 
    context.commit('permission/setRoutes',[],{root: true})
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
