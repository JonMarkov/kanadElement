<template>
  <channel-detail :is-edit="true" :id="id"></channel-detail>
</template>

<script>
import ChannelDetail from './component/ChannelDetail'
export default {
  name: 'editChannel',
  components: { ChannelDetail },
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
