<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mixins } from "@/utils/mixins";
import { mapGetters } from "vuex";
export default {
  mixins: [mixins],
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    // this.hello()

    // console.log("自己mounted");
  },
  created() {
    // this.hello()
    // console.log("z自己created");
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
