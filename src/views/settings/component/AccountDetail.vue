<template>
  <div class="account-detail-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :class-name="'sub-navbar'">
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="saveForm">保存</el-button>
        <el-button v-else v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交</el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="账户：" prop="username">
              <el-input v-model="postForm.username" placeholder="请填写账户" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="姓名：" prop="realname">
              <el-input v-model="postForm.realname" placeholder="请填写姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="密码：" prop="password">
              <el-input type="password" v-model="postForm.password" placeholder="请输入确认密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="确认密码：" prop="checkPassword">
              <el-input type="password" v-model="postForm.checkPassword" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchAccount, createAccount, updateAccount } from '@/api/account'

const defaultForm = {
  id: 1,
  username: '', // 账户
  realname: '', // 姓名
  password: '',
  checkPassword: ''
}

export default {
  name: 'accountDetail',
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
      loading: false
    }
  },
  computed: {
    rules() {
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.postForm.checkPassword !== '') {
            this.$refs.postForm.validateField('checkPassword')
          }
          callback()
        }
      }
      const validatePassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.postForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return !this.isEdit || (this.isEdit && this.postForm.password) ? ({
        username: { required: true, message: '请填写账户名', trigger: 'blur' },
        realname: { required: true, message: '请填写真实姓名', trigger: 'blur' },
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePassword2, trigger: 'blur' }
        ]
      }) : {
        username: { required: true, message: '请填写账户名', trigger: 'blur' },
        realname: { required: true, message: '请填写真实姓名', trigger: 'blur' }
      }
    }
  },
  created() {
    // console.log('created')
    if (this.isEdit) {
      const id = this.id || parseInt(this.$route.params && this.$route.params.id)
      // console.log(id)
      fetchAccount(id).then(res => {
        // console.log(res)
        this.postForm = Object.assign(this.postForm, res.data.data)
      })
    }
  },
  methods: {
    submitForm() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.postForm))
          delete data.checkPassword
          createAccount(data).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              // this.handleUpdateStatus()
              this.loading = false
              this.jumpTo('/settings/account', true)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '提交失败'
            })
          }).finally(res => {
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
          const data = JSON.parse(JSON.stringify(this.postForm))
          delete data.checkPassword
          updateAccount(data).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.jumpTo('/settings/account', true)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          }).finally(res => {
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
.account-detail-container {
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
