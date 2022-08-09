import Cookies from "js-cookie";
// Cookie
// z怎么操作cookie
// 借助第三方库
// 原生的太麻烦，document.cookie = 'key=value&name=lisi'
const TokenKey = "hrsass_token";//token 存储到本地存储》》key
const  timeKey= "time_key"
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export const gettime = () => {
  return Cookies.get(timeKey);
}
export const settime = () => {
   Cookies.set(timeKey, Date.now());
}
