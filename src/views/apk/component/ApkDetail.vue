<template>
  <div class="apk-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :class-name="'sub-navbar'">
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="saveForm">保存
        </el-button>
        <el-button v-else v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交
        </el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="应用名称：" prop="app_name">
              <el-input v-model="postForm.app_name" placeholder="请填写应用名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label-width="140px" label="内容方：" class="postInfo-container-item" prop="manufacturer_id">
            <el-select @change="selectGet" v-model="form.region" placeholder="请选择内容方">
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label-width="140px" label="类型：" class="postInfo-container-item" prop="type">
            <el-select @change="selectType" v-model="type.region" placeholder="请选择类型">
              <el-option
                v-for="(item, index) in statusListType"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="版本号：" prop="code">
              <el-input v-model="postForm.code" placeholder="请填写版本号" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="版本名称：" prop="name">
              <el-input v-model="postForm.name" placeholder="请填写版本名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="APK名称(包名)：" prop="package">
              <el-input v-model="postForm.package" placeholder="请填写APK名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="上传图标：" prop="icon">
              <el-upload
                action=""
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="upLoad">
                <img v-if="postForm.icon" :src="postForm.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="上传APK：" prop="size">
              <el-upload
                action=""
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="upLoadApk">
                <el-button size="small " type="primary" :style="upBtn">{{upName}}</el-button>
                <div slot="tip" class="el-upload__tip" v-if="sizeText">APK包大小：{{sizeText}}</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="下载链接：" prop="download_url">
              <el-input v-model="postForm.download_url" placeholder="请点击上传APK后导入下载链接" disabled=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="选择标签：" prop="tag_name">
              <el-input v-model="postForm.tag_name" placeholder="请填写标签"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="min-width">
            <el-form-item label-width="140px" label="" prop="selected_tag_id">
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item, index) in cities" :label="item.id" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchApk, createApk, updateApk, fetchmanufacturersApk, ossRqu, client, lableList } from '@/api/apk'

const defaultForm = {
  // 应用名称
  app_name: '',
  // 内容方ID
  manufacturer_id: '',
  // 下载地址
  download_url: '',
  // 上传图标
  icon: '',
  // apk大小
  size: '',
  // 版本号
  code: null,
  // 版本名称
  name: '',
  // 标签名称
  tag_name: '',
  // 选中的标签id
  selected_tag_id: '',
  // 类型
  type: null,
  package: ''

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
    return {
      sizeText: '',
      upBtn: 'background: #3a8ee6;border-color: #3a8ee6;',
      upName: '点击上传APK',
      url: '',
      dialogImageUrl: '',
      dialogVisible: false,
      dataObj: {},
      uploadParams: null,
      checkAll: false,
      checkedCities: [],
      cities: null,
      isIndeterminate: true,
      form: {
        region: ''
      },
      type: {
        region: ''
      },
      statusList: [],
      statusListType: [{ id: 2, name: '自建' }, { id: 1, name: '应用商城' }],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        app_name: { required: true, message: '请填写应用名称', trigger: 'blur' },
        manufacturer_id: { required: true, message: '请选择内容方名称', trigger: 'blur' },
        download_url: { required: true, message: '请上传APk包导入链接', trigger: 'blur' },
        icon: { required: true, message: '请上传图标', trigger: 'blur' },
        code: { required: true, message: '请填写版本号', trigger: 'blur' },
        name: { required: true, message: '请填写版本名称', trigger: 'blur' },
        size: { required: true, message: '请上传APK包', trigger: 'blur' },
        package: { required: true, message: '请填写APK名称', trigger: 'blur' },
        type: { required: true, message: '请选择类型', trigger: 'blur' }
      }
    }
  },
  computed: {
    navList() {
      return this.navChildList.filter(item => this.postForm.nav_parent === item.parent_id)
    }
  },
  created() {
    // 函数执行 查询标签
    this.fetchLableList()
    // 函数执行 查询oss上传所需参数
    this.beforeUpload()
    // 函数执行 查询内容方列表
    this.fetchList()
    // 函数执行 查询类型列表
    this.fetchTypeList()
    // 判断是否从修改进入
    if (this.isEdit) {
      const id = this.id || (this.$route.params && this.$route.params.id)
      // console.log(id)
      fetchApk(id).then(res => {
        // console.log(res)
        this.postForm = Object.assign(this.postForm, res.data.data)
        // 标签部分
        const checkedCitie = this.postForm.tag
        const checkedCities = []
        for (const i in checkedCitie) {
          var lableList = checkedCitie[i].id
          checkedCities.push(lableList)
        }
        this.checkedCities = checkedCities
        this.form.region = this.postForm.manufacturer_id
        this.type.region = this.postForm.type
        this.postForm.manufacturer_id = this.postForm.manufacturer_id
        const size = this.postForm.size
        if (size >= 1048576) {
          this.sizeText = ((size / 1048576).toFixed(2)) + ' mb'
        } else {
          this.sizeText = ((size / 1028).toFixed(2)) + ' kb'
        }
        this.upBtn = 'background:#dd6161;border-color:#dd6161;'
        this.upName = '已上传APK包'
      })
    }
  },
  methods: {
    // 函数定义 获取内容方下拉框的id数据
    selectGet(vId) {
      let obj = {}
      obj = this.statusList.find((item) => {
        return item.id === vId
      })
      this.postForm.manufacturer_id = obj.id
    },
    // 函数定义 获取类型下拉框的id数据
    selectType(vId) {
      let obj = {}
      obj = this.statusListType.find((item) => {
        return item.id === vId
      })
      this.postForm.type = obj.id
    },
    // 函数定义 查询内容方列表
    fetchList() {
      fetchmanufacturersApk().then(res => {
        if (res.data.code === 0) {
          this.statusList = res.data.data.items
          // console.log(this.list)
          this.total = res.data.data.total
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 函数定义 查询标签列表
    fetchLableList() {
      lableList().then(res => {
        if (res.data.code === 0) {
          this.cities = res.data.data.items
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 函数定义 定义类型列表
    fetchTypeList() {
      // 定义类型
    },
    // 函数定义 提交
    submitForm() {
      this.postForm.code = parseInt(this.postForm.code)
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createApk(this.postForm).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.postForm = Object.assign({}, defaultForm)
              this.jumpTo('/manage/apk', true)
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
    // 函数定义 保存
    saveForm() {
      console.log(this.postForm)
      this.postForm.code = parseInt(this.postForm.code)
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateApk(this.postForm).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.jumpTo('/manage/apk', true)
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
    },
    // 函数定义 标签选择
    handleCheckedCitiesChange(e) {
      this.checkedCities = e
      this.postForm.selected_tag_id = e
    },
    // 函数定义 请求oss上传所需参数
    beforeUpload() {
      ossRqu().then(res => {
        if (res.data.code === 0) {
          this.dataObj = res.data.data
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 函数定义 图标上传
    upLoad(file) {
      const self = this
      const files = file.file
      const point = files.name.lastIndexOf('.')
      const suffix = files.name.substr(point)
      const fileName = files.name.substr(0, point)
      const date = Date.parse(new Date())
      const fileNames = '/resikanicon/' + `${fileName}_${date}${suffix}`
      client(this.dataObj).multipartUpload(fileNames, file.file).then(result => {
        this.postForm.icon = 'http://imgikancloud.kkstudy.cn' + result.name
        self.$message({
          message: '上传成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        self.$message.error('上传失败')
      })
    },
    // 函数定义 oss上传apk包
    upLoadApk(file) {
      this.upBtn = 'background-color:#e6a23c;border-color:#e6a23c;'
      this.upName = '上传中...'
      const self = this
      const files = file.file
      const size = files.size
      const point = files.name.lastIndexOf('.')
      const suffix = files.name.substr(point)
      const fileName = files.name.substr(0, point)
      const date = Date.parse(new Date())
      const fileNames = '/resikanapk/' + `${fileName}_${date}${suffix}`
      client(this.dataObj).multipartUpload(fileNames, file.file).then(result => {
        this.postForm.download_url = 'http://imgikancloud.kkstudy.cn' + result.name
        if (size >= 1048576) {
          this.sizeText = ((size / 1048576).toFixed(2)) + ' mb'
        } else {
          this.sizeText = ((size / 1028).toFixed(2)) + ' kb'
        }
        this.postForm.size = size
        this.upBtn = 'background:#dd6161;border-color:#dd6161;'
        this.upName = '已上传APK包'
        self.$message({
          message: '上传成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        self.$message.error('上传失败')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .apk-container {
    position: relative;

    .postInfo-container {
      position: relative;
      padding: 40px 45px 20px 50px;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  .min-width {
    min-width: 340px;
  }
</style>
