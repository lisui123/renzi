<template>
  <div>
    <button @click="handler">diajj</button>

    :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]"
    :page-size="100" :total="400"
  </div>
</template>

<script>
export default {
  name: "Hello",
  methods: {
    handler() {
      eventBus.$emit("update", "心智");
    },
  },
};
</script>

<style></style>
