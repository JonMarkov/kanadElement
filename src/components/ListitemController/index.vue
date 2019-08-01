<template>
  <div class="listitem-controller">
    <el-button v-if="topShow" :disabled="index < 1" circle title="置顶" @click="handleMoveTop"><svg-icon icon-class="top" /></el-button>
    <el-button v-if="upShow" :disabled="index < 1" circle title="上移一层" @click="handleMoveUp"><svg-icon icon-class="up" /></el-button>
    <el-button v-if="downShow" :disabled="index >= list.length - 1" circle title="下移一层" @click="handleMoveDown"><svg-icon icon-class="down" /></el-button>
    <el-button v-if="bottomShow" :disabled="index >= list.length - 1" circle title="置底" @click="handleMoveBottom"><svg-icon icon-class="bottom" /></el-button>
    <el-button v-if="plusShow" icon="el-icon-plus" circle title="在下方新增一行" @click="handleAdd" />
    <el-button v-if="deleteShow && atLeastOne && list.length > 1" icon="el-icon-delete" circle title="删除当前行" @click="handleDelete" />
  </div>
</template>

<script>
export default {
  name: 'ListitemController',
  /* eslint-disable vue/require-prop-types */
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    index: {
      type: Number,
      required: true
    },
    options: {
      type: String,
      default: 'top,up,down,bottom,plus,delete'
    },
    atLeastOne: {
      type: Boolean,
      default: true
    },
    disableItemHide: {
      type: Boolean,
      default: true
    },
    useDefaultAddHandle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      topShow: false,
      upShow: false,
      downShow: false,
      bottomShow: false,
      plusShow: false,
      deleteShow: false
    }
  },
  created() {
    const components = this.options.split(',').map((item) => item.trim())
    components.forEach(item => {
      this[`${item}Show`] = true
    })
  },
  methods: {
    handleMoveTop() {
      const currentItem = this.list.splice(this.index, 1)[0]
      this.list.unshift(currentItem)
    },
    handleMoveUp() {
      const currentItem = this.list.splice(this.index, 1)[0]
      this.list.splice(this.index - 1, 0, currentItem)
    },
    handleMoveDown() {
      const currentItem = this.list.splice(this.index, 1)[0]
      this.list.splice(this.index + 1, 0, currentItem)
    },
    handleMoveBottom() {
      const currentItem = this.list.splice(this.index, 1)[0]
      this.list.push(currentItem)
    },
    handleAdd() {
      this.$emit('add', this.index, this.list)
    },
    handleDelete() {
      this.list.splice(this.index, 1)[0]
    }
  }
}
</script>

<style scoped>
.el-button.is-disabled{
  opacity: 0.5;
}
</style>
