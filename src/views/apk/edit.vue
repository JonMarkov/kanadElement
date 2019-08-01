<template>
  <apk-detail :is-edit="true" :id="id"></apk-detail>
</template>

<script>
import ApkDetail from './component/ApkDetail'
export default {
  name: 'editApk',
  components: { ApkDetail },
  data() {
    return {
      id: undefined
    }
  },
  created() {
    this.id = parseInt(this.$route.params && this.$route.params.id)
  }
}
</script>
