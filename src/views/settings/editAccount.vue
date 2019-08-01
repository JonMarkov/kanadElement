<template>
  <account-detail :is-edit="true" :id="id"></account-detail>
</template>

<script>
import AccountDetail from './component/AccountDetail'
export default {
  name: 'editAccount',
  components: { AccountDetail },
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
