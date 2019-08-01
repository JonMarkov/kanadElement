<template>
  <deliver-editer :is-edit="true" :id="id"></deliver-editer>
</template>

<script>
import DeliverEditer from './component/DeliverEditer'
export default {
  name: 'editDeliver',
  components: { DeliverEditer },
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
