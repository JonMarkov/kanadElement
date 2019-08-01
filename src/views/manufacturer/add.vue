<template>
  <manufacturer-detail :is-edit="false"></manufacturer-detail>
</template>

<script>
import ManufacturerDetail from './component/ManufacturerDetail'
export default {
  name: 'addManufacturer',
  components: { ManufacturerDetail }
}
</script>
