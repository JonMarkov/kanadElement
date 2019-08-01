<template>
  <div>
  <apk-detail :is-edit="false"></apk-detail>
  </div>
</template>

<script>
import ApkDetail from './component/ApkDetail'
export default {
  name: 'addApk',
  components: {
    ApkDetail
  }
}
</script>
