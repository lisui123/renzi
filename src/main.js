import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css
import Print from "vue-print-nb"; //
import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

import * as directives from "@/directive/index";

import components from "@/components/index";

import * as filters from "@/filters/index";

Vue.use(Print)
// for (const filtersKey in filters) {
//   filters[filtersKey]
// }
Object.keys(filters).forEach((key) => {
  // 注册过滤器
  Vue.filter(key, filters[key]);
});
// Vue注册什么类型数据
// 对象：提供install方法，自动调用对象的install方法，然后把Vue传入
// 函数：直接调用函数，然后把Vue传入
Vue.use(components);
// console.log(directives);

for (const key in directives) {
  Vue.directive(key, directives[key]);
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
