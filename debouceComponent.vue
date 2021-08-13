<script>
  // 防抖, 节流抽象父组件
  import {get, debounce, set, throttle} from 'loadsh';
  export default {
    abstract: true, // 标记为抽象组件
    name: "debounce-component",
    props: {
      event: {
        type: String,
        default: 'input'
      },
      time: {
        type: Number,
        default: 200
      },
      // 防抖还是节流
      type: {
        type: String,
        default: 'debounce'
      }
    },
    render() {
      let vnode = this.$slots.default[0]; // 子组件的vnode
      if (vnode) {
        let event = get(vnode, `data.on.${this.event}`); // 子组件绑定的click事件
        if (typeof event === 'function' && this.type === 'debounce') {
          set(vnode, `data.on.${this.event}`, debounce(event, this.time));
        }
        if (typeof event === 'function' && this.type === 'throttle') {
          set(vnode, `data.on.${this.event}`, throttle(event, this.time));
        }
      }
      return vnode;
    }
  }
</script>

<style scoped>

</style>