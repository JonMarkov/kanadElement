const globalMixin = {
  methods: {
    // 页面跳转，可以选择是否关闭当前标签
    jumpTo(path, isCloseTag = false) {
      return new Promise((resolve, reject) => {
        const prom = isCloseTag ? this.$store.dispatch('delVisitedView', this.$route) : Promise.resolve()
        prom.then(() => { // 移除当前路由标签
          this.$router.push({
            path: path,
            query: {
              t: +new Date() // 保证每次点击路由y的query项都是不一样的，确保会重新刷新view
            }
          })
          return resolve()
        })
      })
    }
  }
}

export default globalMixin
