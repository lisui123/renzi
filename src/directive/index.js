export const imgError = {
  inserted(el, options) {
    // el指令绑定元素
    // console.log(options);
    // console.log(el);
    el.onerror = function () {
      el.src = options.value
    }
   }
 }