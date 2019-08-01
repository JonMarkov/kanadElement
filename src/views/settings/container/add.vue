<template>
  <container-config-detail :is-edit="false"></container-config-detail>
</template>

<script>
import ContainerConfigDetail from './component/ContainerConfigDetail'
export default {
  name: 'addContainerConfig',
  components: { ContainerConfigDetail }
}
</script>
