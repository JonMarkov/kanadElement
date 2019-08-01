<template>
  <div class="config-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :class-name="'sub-navbar'">
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="saveForm">保存</el-button>
        <el-button v-else v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交</el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="配置名称：" prop="name">
              <el-input v-model="postForm.name" placeholder="请填写配置名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item
              label-width="180px"
              label="对应内容方投放比："
              prop="manufacturers"
              :rules="{ validator: validateManufacturer, trigger: 'blur' }"
            >
              <el-form-item
                class="rate-item"
                v-for="(item, index) in postForm.manufacturers"
                :key="index"
                label-width="160px"
                :label="`${item.name}：`"
                :prop="`manufacturers[${index}]`"
                :rules="[
                  { required: true, message: '请填写投放比' },
                  { validator: validateManufacturerRate, trigger: 'blur' }
                ]">
                <el-input v-model.number="item.weight" type="number" :min="0" :max="100"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchContainerConfig, createContainerConfig, updateContainerConfig, fetchManufacturerOptions } from '@/api/container'

const defaultForm = {
  id: undefined,
  name: '',
  manufacturers: []
}

export default {
  name: 'ContainerConfigDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: undefined
    },
    isJump: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: { required: true, message: '请填写内容方名称', trigger: 'blur' }
      }
    }
  },
  computed: {
    navList() {
      return this.navChildList.filter(item => this.postForm.nav_parent === item.parent_id)
    }
  },
  created() {
    this.getManufacturerOptions().then(() => {
      if (this.isEdit) {
        const id = this.id || (this.$route.params && this.$route.params.id)
        // console.log(id)
        fetchContainerConfig(id).then(res => {
          // console.log(res)
          // this.postForm = Object.assign(this.postForm, res.data.data)
          // 单独赋值，避免manufacturers值无法完全合并
          const { id, name, manufacturers } = res.data.data
          this.postForm.id = id
          this.postForm.name = name
          this.postForm.manufacturers = Object.assign([], this.postForm.manufacturers, manufacturers)
        })
      }
    })
  },
  methods: {
    // 获取最新的内容方列表
    getManufacturerOptions() {
      return fetchManufacturerOptions().then(res => {
        // console.log(res)
        const { code, data } = res.data
        if (code === 0) {
          data.items.forEach(item => {
            item.weight = 0
          })
          this.postForm.manufacturers = data.items
        }
        return Promise.resolve()
      })
    },
    // 表单验证函数 验证内容方投放比
    validateManufacturer(rule, value, callback) {
      // console.log(rule, value)
      const sum = value.length ? value.map(item => item.weight).reduce((total, num) => (+total) + (+num)) : 0
      if (value.length && sum !== 100) {
        // const index = +rule.field.match(/[\d]/)[0] + 1
        // this.$message({
        //   message: `行为${index}的内容方投放比相加值不为100`,
        //   type: 'warning'
        // })
        callback(new Error(`投放比的相加值必须为100，当前为${sum}，偏差${sum - 100}`))
      } else {
        callback()
      }
    },
    // 表单验证函数 内容方投放比文本框失去焦点后触发整体相加验证
    validateManufacturerRate(rule, value, callback) {
      // console.log(rule, value)
      this.$refs.postForm.validateField('manufacturers')
      callback()
    },
    submitForm() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createContainerConfig(this.postForm).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.postForm = Object.assign({}, defaultForm)
              this.jumpTo('/settings/container', true)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '提交失败!'
            })
          }).finally((res) => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    saveForm() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateContainerConfig(this.postForm).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.jumpTo('/settings/container', true)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败!'
            })
          }).finally((res) => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.config-container {
  position: relative;
  .postInfo-container {
    position: relative;
    padding: 40px 45px 20px 50px;
    @include clearfix;
    margin-bottom: 10px;
    .rate-item{
      margin-bottom: 10px;
      position: relative;
      width: 240px;
      &::after{
        position: absolute;
        right: -24px;
        top: 0;
        content: "%";
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
</style>
