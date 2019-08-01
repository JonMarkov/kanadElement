<template>
  <container-config-detail :is-edit="true" :id="id"></container-config-detail>
</template>

<script>
import ContainerConfigDetail from './component/ContainerConfigDetail'
export default {
  name: 'editContainerConfig',
  components: { ContainerConfigDetail },
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
