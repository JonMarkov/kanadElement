<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
      <!-- <router-view/> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      // return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = fixedHeader  */
  min-height: calc(100vh - 84px);
  margin-top: 84px;
  position: relative;
  overflow: hidden;
}
</style>
