const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo?.username,
  userId: (state) => state.user.userInfo?.userId, // 建立用户id的映射
  avatar: (state) => state.user.userInfo?.staffPhoto,
  // name: state => state.user.name
  companyId: (state) => state.user.userInfo.companyId,
  routes: (state) => state.permission.routes,
};
export default getters;
