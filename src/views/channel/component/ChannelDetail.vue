<template>
  <div class="manufactturer-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :class-name="'sub-navbar'">
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="saveForm">保存</el-button>
        <el-button v-else v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交</el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="集成方名称：" prop="name">
              <el-input v-model="postForm.name" placeholder="请填写集成方名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="集成方Code：" prop="code">
              <el-input v-model="postForm.code" placeholder="请填写集成方Code" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="对接人：" prop="manager">
              <el-input v-model="postForm.manager" placeholder="请填写对接人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="联系方式：" prop="phone">
              <el-input type="number" v-model="postForm.phone" placeholder="请填写联系方式"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="集成方网址：" prop="home_url">
              <el-input v-model="postForm.home_url" placeholder="请填写集成方网址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="电子邮箱：" prop="email">
              <el-input v-model="postForm.email" placeholder="请填写电子邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="min-width">
            <el-form-item label-width="140px" label="备注：" prop="desc">
              <el-input v-model="postForm.desc" type="textarea" placeholder="请填写备注" rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchChannel, createChannel, updateChannel } from '@/api/channel'
import { validateEmail, validateURL, validatePhone } from '@/utils/validate'

const defaultForm = {
  name: '',
  code: '',
  manager: '',
  phone: '',
  email: '',
  home_url: ''
}

export default {
  name: 'ManufacturerDetail',
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
    function _validateEmail(rule, value, callback) {
      if (validateEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    function _validateURL(rule, value, callback) {
      if (validateURL(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的网站链接'))
      }
    }
    function _validatePhone(rule, value, callback) {
      if (validatePhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系方式'))
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: { required: true, message: '请填写集成方名称', trigger: 'blur' },
        code: { required: true, message: '请填写集成方编码', trigger: 'blur' },
        manager: { required: true, message: '请填写对接人', trigger: 'blur' },
        // phone: { required: true, message: '请填写联系方式', trigger: 'blur' },
        // email: { required: true, message: '请填写电子邮箱', trigger: 'blur' },
        // home_url: { required: true, message: '请填写集成方网址', trigger: 'blur' },
        phone: [
          { required: true, message: '请填写联系方式', trigger: 'blur' },
          { validator: _validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写email', trigger: 'blur' },
          { validator: _validateEmail, trigger: 'blur' }
        ],
        home_url: [
          { required: true, message: '请填写内容方网站', trigger: 'blur' },
          { validator: _validateURL, trigger: 'blur' }
        ]
        // desc
        // desc: { required: true, message: '请填写备注', trigger: 'blur' },
      }
    }
  },
  computed: {
    navList() {
      return this.navChildList.filter(item => this.postForm.nav_parent === item.parent_id)
    }
  },
  created() {
    if (this.isEdit) {
      // console.log(this.id)
      const id = this.id || (this.$route.params && this.$route.params.id)
      // console.log(id)
      fetchChannel(id).then(res => {
        // console.log(res)
        this.postForm = Object.assign(this.postForm, res.data.data)
      })
    }
  },
  methods: {
    // 函数定义 提交
    submitForm() {
      // console.log(this.postForm)
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createChannel(this.postForm).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.postForm = Object.assign({}, defaultForm)
              this.jumpTo('/manage/channel', true)
            } else {
              this.$message({
                type: 'error',
                message: `提交失败 ${res.data.message}`
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
    // 函数定义 保存
    saveForm() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateChannel(this.postForm).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.jumpTo('/manage/channel', true)
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
  .manufactturer-container {
    position: relative;
    .postInfo-container {
      position: relative;
      padding: 40px 45px 20px 50px;
      @include clearfix;
      margin-bottom: 10px;
    }
  }
  .min-width{
    min-width: 340px;
  }
</style>
