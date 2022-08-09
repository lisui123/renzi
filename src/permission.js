import router from "@/router";

import store from "@/store";

import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css";
// import { from } from "core-js/core/array";
// import router from "./router";

const whiteList = ["/login", "/404"];

// 监听路由的变化
// 所有路由跳转之前触发
//
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start();
  // 是否有token
  const token = store.getters.token;
  // console.log(1)
  if (token) {
    // console.log(1);
    if (!store.getters.userId) {
      const r = await store.dispatch("user/getUserInfo");
      // 添加用户拥有的路由权限之后，再去做跳转，filterRoutes
      // routes筛选以后的结果》》用户拥有权限的动态路由列表
      console.log(r);
      const routes = await store.dispatch(
        "permission/filterRoutes",
        r.roles.menus
      );
      //  默认情况只有静态路由
      // 进行动态路由添加
      console.log(routes);
      router.addRoutes([
        ...routes,
        // 404 page must be placed at the end !!!
        { path: "*", redirect: "/404", hidden: true },
      ]);
      //重新跳转
      next(to.path);
      // 筛选出动态路由以后，需要添加router里面，这样的可以去访问
    }
    // if (!store.state.user.userInfo.userId) {
    //   await store.dispatch("user/getUserInfo");
    // }
    if (to.path === "/login") {
      console.log(1);

      next("/");
    } else {
      // console.log(1);
      next();
    }
  } else {
    console.log("无token");
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});
// // 权限拦截 导航守卫 路由守卫  router
// import router from "@/router"; // 引入路由实例
// import store from "@/store"; // 引入vuex store实例
// import NProgress from "nprogress"; // 引入一份进度条插件
// import "nprogress/nprogress.css"; // 引入进度条样式

// const whiteList = ["/login", "/404"]; // 定义白名单  所有不受权限控制的页面
// // 路由的前置守卫
// router.beforeEach(function (to, from, next) {
//   NProgress.start(); // 开启进度条
//   //  首先判断有无token
//   if (store.getters.token) {
//     //   如果有token 继续判断是不是去登录页
//     if (to.path === "/login") {
//       //  表示去的是登录页
//       next("/"); // 跳到主页
//     } else {
//       // 白名单的界面(不需要权限)
//       // 需要权限的界面
//       next(); // 直接放行
//     }
//   } else {
//     // 如果没有token
//     if (whiteList.indexOf(to.path) > -1) {
//       // 如果找到了 表示在在名单里面
//       next();
//     } else {
//       next("/login"); // 跳到登录页
//     }
//   }
//   NProgress.done(); // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
// });
// // 后置守卫
// router.afterEach(function () {
//   NProgress.done(); // 关闭进度条
// });
