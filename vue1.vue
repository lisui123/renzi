<template>
  <div>
    {{ msg.age }}
    <Hello></Hello>
  </div>
</template>

<script>
import Hello from "./vue2.vue"
export default {
  components: { Hello},
  name: "App",
  mounted(){
    eventBus.$son('update', value => {
      this.msg.age = value
    })
  },
  data(){
    return {
      msg:{
        age: 123
      }
    }
  }

};
</script>

<style></style>
