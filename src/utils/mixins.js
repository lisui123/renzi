import store from "@/store";
export const mixins = {
  // created() {
  //   console.log("混入created");
  // },
  // mounted() {
  //   console.log("混入mounted");
  // },
  // methods: {
  //   hello() {
  //     console.log("hello");
  //   },
  // },
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userInfo.roles.points);
      return !store.state.user.userInfo.roles.points.includes(key);
    },
  },
};
