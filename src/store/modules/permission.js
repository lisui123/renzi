import { constantRoutes, asyncRoutes } from "@/router";

const state = {
  routes: constantRoutes,
};

const mutations = {
  // newRoutes动态路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes];
  },
};
const actions = {
  // 当前用户拥有的路由权限列表
  // 路由的name
  filterRoutes(context, menus) {
    // 动态路由 asyncRoutes
    // 用户拥有的路由name值
    // 筛选
    const resRoutes = asyncRoutes.filter((item) => {
      return menus.includes(item.name);
    });
    // vuex 》》 作用。。左侧菜单的显示
    // addRoutes进行添加
    context.commit("setRoutes", resRoutes);
    return resRoutes;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
