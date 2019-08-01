<template>
  <account-detail :is-edit="false"></account-detail>
</template>

<script>
import AccountDetail from './component/AccountDetail'
export default {
  name: 'addAccount',
  components: { AccountDetail }
}
</script>
