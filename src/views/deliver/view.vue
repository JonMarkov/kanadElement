<template>
  <deliver-detail></deliver-detail>
</template>

<script>
import DeliverDetail from './component/DeliverDetail'
export default {
  name: 'viewDeliver',
  components: { DeliverDetail },
  data() {
    return {
      id: undefined
    }
  }
}
</script>
