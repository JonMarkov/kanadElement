<template>
  <div class="deliver-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky v-if="postForm.status < 3" :class-name="'sub-navbar'">
        <el-button v-if="postForm.status === 1" v-loading="loading" style="margin-left: 10px;" @click="handleDiliver">确定投放</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="handleSave">保存</el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row >
          <el-form-item label-width="180px" label="状态：" prop="num">
            {{ postForm.status | statusFilter }}
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label-width="180px" label="投放数量：" prop="num">
            {{ postForm.max_num }}
          </el-form-item>
        </el-row>
        <el-row >
          <el-col :span="14" class="min-width">
            <el-form-item label-width="180px" label="备注：" prop="desc">
              <el-input v-if="postForm.status < 3" v-model="postForm.desc" type="textarea" rows="5" placeholder="请填写备注"></el-input>
              <span v-else>{{ postForm.desc }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, index) in postForm.list" :key="index" :title="'行为'+(index+1)" :name="index">
              <el-row style="display: flex;">
                <el-form-item label-width="180px" label="投放行为：">
                  <span>{{ item.type | actionFilter }}</span>
                </el-form-item>
                <el-form-item
                  v-if="item.type === 1"
                  label="息屏激活应用："
                  label-width="180px"
                  prop="list.notify">
                  <el-switch
                    v-if="item.type === 1 && !item.defaultNotify && postForm.status !== 3 && postForm.status !== 4"
                    v-model="item.notify"
                    active-text="是"
                    active-color="#13ce66"
                    inactive-text="否"
                    inactive-color="#dddddd">
                  </el-switch>
                  <span v-else>是</span>
                </el-form-item>
                <el-form-item v-if="item.type === 1" label-width="180px" label="自动卸载时间：">
                  <span v-if="item.auto_uninstall_time">{{ item.auto_uninstall_time }} 天</span>
                  <span v-else>未选择</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label-width="180px" label="投放应用：">
                  {{ item.app_name }}
                  <el-tooltip effect="light" placement="right">
                    <div v-if="apkInfosData[`${item.app_id}_${item.app_version_id}`]" class="tooltip" slot="content">
                      <p><strong>应用名称： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].app_name }}</p>
                      <p><strong>包名： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].package }}</p>
                      <!-- <p><strong>内容方ID： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].manufaturer_id }}</p>
                      <p><strong>下载地址： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].download_url }}</p>
                      <p><strong>图标： </strong> <img width="50px" :src="apkInfosData[`${item.app_id}_${item.app_version_id}`].icon"></p> -->
                      <!-- <p><strong>apk大小： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].size }}</p> -->
                      <p><strong>版本号： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].code }}</p>
                      <p><strong>版本名称： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].name }}</p>
                      <!-- <p><strong>标签名称： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].tag_name }}</p>
                      <p><strong>选中的标签id： </strong> {{ apkInfosData[`${item.app_id}_${item.app_version_id}`].selected_tag_id }}</p> -->
                    </div>
                    <div v-else class="tooltip" slot="content">
                      <p>请先选择应用和版本</p>
                    </div>
                    <i class="tooltip-icon el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item v-if="item.weight.name" label-width="180px" label="容器配置：">
                  {{ item.weight.name }}
                </el-form-item>
              </el-row>
              <el-row v-if="item.is_imei_deliver">
                <el-form-item label-width="180px" label="IMEI：">
                  {{ item.imei.join('、') }}
                </el-form-item>
              </el-row>
              <el-row v-else>
                <el-form-item label-width="180px" label="投放手机品牌/机型：">
                  <el-row class="mb-10" v-for="(deviceItem, deviceIndex) in item.devices" :key="deviceIndex">
                    {{ deviceItem.name }}： {{ deviceItem.types | deviceTypesFilter }}
                  </el-row>
                </el-form-item>
                <el-form-item label-width="180px" label="集成方：">
                  {{ item.channels | channelsFilter }}
                </el-form-item>
                <el-form-item label-width="180px" :label="item.not_these_areas ? '不投放区域：' : '投放区域：'">
                  <p v-for="(area, areaIndex) in item.areas" :key="areaIndex">{{ area | areaFileter }}</p>
                </el-form-item>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { CodeToText } from 'element-china-area-data'
import { fetchDeliver, updateDeliver, updateDeliverStatus, fetchAppInfo } from '@/api/deliver'
import { statusOptions, actionOptions } from './options'

const statusMap = statusOptions.slice(1).map(item => item.name)
const actionMap = actionOptions.map(item => item.name)
actionMap.unshift('')

const defaultForm = {
  id: undefined,
  num: '', // 投放数量
  desc: '', // 备注
  status: 1,
  list: [
    {
      type: '', // 行为
      notify: false,
      app_id: undefined,
      app_name: '',
      app_version_id: '',
      app_version: '',
      app_code_info: {},
      weight: {},
      is_imei_deliver: false,
      imei: '',
      devices: [
        {
          id: undefined,
          types: []
        }
      ],
      channels: [],
      not_these_areas: false,
      areas: []
    }
  ]
}

export default {
  name: 'DeliverDetail',
  components: { Sticky },
  data() {
    return {
      postForm: Object.assign({}, JSON.parse(JSON.stringify(defaultForm))),
      loading: false,
      rules: {},
      activeNames: [0],
      apkInfosData: {}
    }
  },
  filters: {
    statusFilter(status) {
      return statusMap[status]
    },
    actionFilter(action) {
      return actionMap[action]
    },
    deviceTypesFilter(types) {
      return types.map(item => item.code).join('、')
    },
    channelsFilter(channers) {
      return channers.map(item => item.name).join('、')
    },
    areaFileter(area) {
      let str = ''
      for (const key in area) {
        if (area[key]) {
          str += CodeToText[area[key]] + ' / '
        }
      }
      // return `${CodeToText['' + area.province_id]} / ${CodeToText['' + area.city_id]} / ${CodeToText['' + area.district_id]}`
      return str.slice(0, -3)
    }
  },
  created() {
    const id = this.id || (this.$route.params && this.$route.params.id)
    // console.log(id)
    fetchDeliver(id).then(res => {
      // console.log(res)
      if (res.data.code === 0) {
        const data = res.data.data
        data.list.forEach((item, index) => {
          // console.log(item)
          item.is_imei_deliver = !!item.imei.length
          item.defaultNotify = !!item.notify
          item.notify = !!item.notify
          this.getApkInfo(data.list, index, false)
        })
        this.postForm = Object.assign(this.postForm, data)
      } else {
        this.$message({
          type: 'error',
          message: res.data.message
        })
      }
    })
  },
  methods: {
    // 获取指定的apk包数据
    getApkInfo(data, index, whetherSetManufacturers = true) {
      return new Promise((resolve, reject) => {
        // console.log(data[index])
        const appId = data[index].app_id
        const versionId = data[index].app_version_id
        // 以{appId}_{versionId}为key缓存对应的apk包数据
        if (!this.apkInfosData[`${appId}_${versionId}`]) {
          fetchAppInfo(versionId).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              // this.apkInfosData[`${appId}_${versionId}`] = res.data.data
              this.$set(this.apkInfosData, `${appId}_${versionId}`, res.data.data)
              resolve()
            } else {
              this.$message({
                type: 'error',
                message: '获取应用信息失败！'
              })
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    handleChange(val) {
      // console.log(val)
    },
    saveForm() {
      return new Promise((resolve, reject) => {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            const { id, desc } = this.postForm
            const list = this.postForm.list.map(item => {
              return {
                id: item.id,
                notify: item.notify
              }
            })
            updateDeliver({ id, desc, list }).then(res => {
              // console.log(res)
              if (res.data.code === 0) {
                resolve(res)
              } else {
                reject(res)
              }
            }).catch(res => {
              reject(res)
            })
          } else {
            console.log('error submit!!')
            reject()
            return false
          }
        })
      })
    },
    handleSave() {
      this.loading = true
      this.saveForm().then(() => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).catch(res => {
        this.$message({
          type: 'error',
          message: '保存失败!'
        })
      }).finally(() => {
        this.loading = false
      })
    },
    handleDiliver() {
      this.loading = true
      this.$confirm('请确认是否进行投放?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveForm().then(() => {
          return updateDeliverStatus({
            id: this.postForm.id
            // status: 2
          })
        }).then(res => {
          // console.log(res.data)
          this.$notify({
            title: '成功',
            message: '投放成功',
            type: 'success',
            duration: 2000
          })
        }).finally(() => {
          this.loading = false
          this.jumpTo('/manage/deliver', true)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消投放'
        })
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.deliver-container {
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
.el-radio-group{
  line-height: unset;
}
.el-radio.is-bordered+.el-radio.is-bordered,
.el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 0;
}
.el-radio.is-bordered,
.el-checkbox.is-bordered{
  margin-right: 10px;
}
</style>
