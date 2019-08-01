<template>
  <manufacturer-detail :is-edit="true" :id="id"></manufacturer-detail>
</template>

<script>
import ManufacturerDetail from './component/ManufacturerDetail'
export default {
  name: 'editManufacturer',
  components: { ManufacturerDetail },
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
