
// 发布订阅模式
class EventBus {
  // 事件池
  listenters = [];
  // 监听事件
  $on(eventName, cb) {
    this.listenters.push({
      eventName,
      cb,
    });
  }
  // 用于触发事件
  $emit(eventName, ...args) {
    this.listenters.forEach(item => {
      if (item.eventName === eventName) {
        item.cb(...args);
      }
    })
    console.log(this.listenters);
  }
}
expect const EventBus = new EventBus();

// $on $emit

// 发布订阅
eventBus.$on('live', () => {
  console.log("如果开播，通知下");
  console.log("向客户发送请求》》电影开播");
  alert("电影上映")
})
eventBus.$emit('live');