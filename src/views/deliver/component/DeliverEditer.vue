<template>
  <div class="deliver-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="deliverPostForm">
      <sticky :class-name="'sub-navbar'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="handleSubmit">提交</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="handleSave">保存</el-button>
      </sticky>
      <div class="postInfo-container">
        <el-row >
          <el-col :span="12" class="min-width">
            <el-form-item
              label-width="180px"
              label="投放数量："
              prop="max_num">
              <el-input v-model.number="postForm.max_num" type="number" :min="0" :max="100000000" placeholder="请填写投放数量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="14" class="min-width">
            <el-form-item label-width="180px" label="备注：" prop="desc">
              <el-input v-model="postForm.desc" type="textarea" rows="5" placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, index) in postForm.list" :key="index" :title="'行为'+(index+1)" :name="index">
              <el-row>
                <el-col class="min-width" style="display:flex;">
                  <el-form-item
                    label-width="180px"
                    label="投放行为："
                    :prop="`list[${index}].type`"
                    :rules="{ required: true, message: '请选择投放行为' }">
                    <el-select v-model="item.type" placeholder="请选择">
                      <el-option
                        v-for="(actionItem, actionIndex) in actionOptions"
                        :key="actionIndex"
                        :label="actionItem.name"
                        :value="actionItem.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="item.type === 1" label-width="140px" label="息屏激活应用:" :prop="`list[${index}].notify`">
                    <el-switch
                      v-model="item.notify"
                      active-text="是"
                      active-color="#13ce66"
                      inactive-text="否"
                      inactive-color="#dddddd">
                    </el-switch>
                  </el-form-item>
                  <el-form-item
                    v-if="item.type === 1"
                    label-width="140px"
                    label="自动卸载时间:"
                    :prop="`list[${index}].auto_uninstall_time`"
                    :rules="{ required: true, message: '请选择或输入自动卸载时间' }">
                    <el-select v-model.number="item.auto_uninstall_time" placeholder="请选择" filterable allow-create>
                      <el-option
                        v-for="(timeItem, timeIndex) in autoUnintallTimeOptions"
                        :key="timeIndex"
                        :label="timeItem.name"
                        :value="timeItem.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="deliver-apk">
                  <el-form-item
                    label-width="180px"
                    label="投放应用："
                    :prop="`list[${index}].app_id`"
                    :rules="{ required: true, message: '请选择投放的应用' }">
                    <el-select v-model="item.app_id" placeholder="请选择投放的应用" @change="handleApplicationSelectChange(index)">
                      <el-option
                        v-for="(appItem, appIndex) in applicationOptions"
                        :key="appIndex"
                        :label="appItem.name"
                        :value="appItem.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    :prop="`list[${index}].app_version_id`"
                    :rules="{ required: true, message: '请选择应用版本' }">
                    <el-select v-model="item.app_version_id" placeholder="请选择应用版本" @change="handleAppVersionSelectChange(index)">
                      <el-option
                        v-for="(versionItem, versionIndex) in applicationVersionOptionsData[item.app_id]"
                        :key="versionIndex"
                        :label="versionItem.name"
                        :value="versionItem.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
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
                </el-col>
              </el-row>
              <el-row v-if="showContainerConfigFilter(item)">
                <el-col :span="10" class="min-width">
                  <el-form-item
                    label-width="180px"
                    label="容器配置："
                    :prop="`list[${index}].weight`"
                    :rules="{ required: true, message: '请选择容器配置' }"
                  >
                    <el-select v-model="item.weight" placeholder="请选择容器配置">
                      <el-option
                        v-for="(weightItem, weightIndex) in weightOptions"
                        :key="weightIndex"
                        :label="weightItem.name"
                        :value="weightItem.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label-width="180px" label="投放方式：" :prop="`list[${index}].is_imei_deliver`">
                  <el-switch
                    v-model="item.is_imei_deliver"
                    active-text="IMEI投放"
                    active-color="#13ce66"
                    inactive-text="常规投放"
                    inactive-color="#dddddd">
                  </el-switch>
                </el-form-item>
              </el-row>
              <el-row v-if="item.is_imei_deliver">
                <el-col :span="10" class="min-width">
                  <el-form-item
                    label-width="180px"
                    label="IMEI："
                    :prop="`list[${index}].imei`"
                    :rules="{ required: true, message: '请至少填写一个IMEI', trigger: 'blur' }">
                    <el-tag
                      class="imei-tag"
                      v-for="(tag, tagIndex) in item.imei"
                      :key="tagIndex"
                      closable
                      :disable-transitions="false"
                      @close="handleCloseImeiTag(index, tagIndex)">
                      {{ tag }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-model="imeiValue"
                      ref="saveTagInput"
                      size="small"
                      placeholder="请输入IMEI，按回车键以确认添加"
                      @keyup.enter.native="handleAddImeiTag(index)"
                      @blur="handleAddImeiTag(index)"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else>
                <el-form-item
                  label-width="180px"
                  label="投放手机品牌/机型："
                  :prop="`list[${index}].devices`"
                  :rules="{ required: false, message: '请添加投放手机品牌/机型', trigger: 'blur' }">
                  <el-row class="mb-10" v-for="(deviceItem, deviceIndex) in item.devices" :key="deviceIndex">
                    <el-select v-model="deviceItem.id" placeholder="请选择手机品牌" @change="handleDeviceSelectChange(index, deviceIndex)">
                      <el-option
                        v-for="(deviceItem, deviceIndex) in deviceBrandOptions"
                        :key="deviceIndex"
                        :label="deviceItem.name"
                        :value="deviceItem.id">
                      </el-option>
                    </el-select>
                    <el-select
                      class="w-320"
                      v-model="deviceItem.types"
                      clearable
                      multiple
                      filterable
                      default-first-option
                      placeholder="请选择机型">
                      <el-option
                        v-for="(typeItem, typeIndex) in deviceTypeOptionsData[deviceItem.id]"
                        :key="typeIndex"
                        :label="typeItem.code"
                        :value="typeItem.id">
                      </el-option>
                    </el-select>
                    <el-button icon="el-icon-delete" type="danger" @click="handleDeleteDevice(index, deviceIndex)"></el-button>
                  </el-row>
                  <el-button icon="el-icon-plus" @click="handleAddDevice(index)">新增手机品牌</el-button>
                </el-form-item>
                <el-form-item
                  label-width="180px"
                  label="投放集成方："
                  :prop="`list[${index}].channels`"
                  :rules="{ required: false, message: '请选择投放集成方' }">
                  <el-select
                    class="w-320"
                    v-model="item.channels"
                    clearable
                    multiple
                    filterable
                    default-first-option
                    placeholder="请选择投放集成方">
                    <el-option
                      v-for="(channelItem, channelIndex) in channelOptions"
                      :key="channelIndex"
                      :label="channelItem.name"
                      :value="channelItem.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="180px"
                  label="投放区域："
                  :prop="`list[${index}].areas`"
                  :rules="{ required: false, message: '请选择区域' }">
                  <el-form-item label-width="120px" label="不投所选区域：" :prop="`list[${index}].not_these_areas`">
                    <el-switch
                      v-model="item.not_these_areas"
                      active-text="是"
                      active-color="#13ce66"
                      inactive-text="否"
                      inactive-color="#dddddd">
                    </el-switch>
                  </el-form-item>
                  <el-cascader
                    style="width: 320px;"
                    size="large"
                    filterable
                    clearable
                    :props="elCascaderProps"
                    :options="regionOptions"
                    v-model="item.areas"
                    placeholder="请选择区域"
                    @change="handleAreasChange">
                  </el-cascader>
                </el-form-item>
              </el-row>
              <el-form-item label-width="180px">
                <el-button v-if="postForm.list.length > 1" type="danger" icon="el-icon-delete" @click="handleDeleteAction(index)">删除当前行为</el-button>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <el-row style="margin-top: 20px;">
            <el-button icon="el-icon-plus" @click="handleAddAction">添加行为</el-button>
          </el-row>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { regionDataPlus } from 'element-china-area-data'
import {
  fetchDeliver,
  createDeliver,
  fetchAppOptions,
  fetchAppVersionOptions,
  fetchAppInfo,
  fetchContainerConfigOptions,
  fetchChannelOptions,
  fetchBrandOptions,
  fetchDeviceTypeOptions
} from '@/api/deliver'
import { actionOptions, autoUnintallTimeOptions } from './options'

const defaultForm = {
  id: undefined,
  status: 0,
  max_num: '', // 投放数量
  desc: '', // 备注
  list: [
    {
      type: '', // 行为 1-安装 2-卸载
      notify: true, // 是否息屏激活应用
      app_id: undefined, // 应用ID
      app_version_id: undefined, // 应用版本ID
      auto_uninstall_time: 30, // 自动卸载时间
      weight: undefined, // 容器配置，对应内容分
      is_imei_deliver: false, // 是否IMEI投放
      imei: [], // IMEI列表
      devices: [], // 设备列表  { id: <手机品牌ID>, name: <手机品牌名称>, types: [<机型ID>] }
      channels: [], // 集成方ID列表
      not_these_areas: false, // 是否勾选为不投放区域
      areas: [] // 区域列表
    }
  ]
}

export default {
  name: 'DeliverEditer',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: undefined
    }
  },
  data() {
    function validateMaxNum(rule, value, callback) {
      if (value < 1 || value > 100000000) {
        callback(new Error(`投放数量值必须在1 - 100,000,000之间`))
      } else {
        callback()
      }
    }
    return {
      postForm: JSON.parse(JSON.stringify(defaultForm)),
      loading: false,
      rules: {
        max_num: [
          { required: true, message: '投放数量不能为空' },
          { validator: validateMaxNum, trigger: 'blur' }
        ]
      },
      imeiValue: '',
      activeNames: [0],
      actionOptions: actionOptions,
      autoUnintallTimeOptions: autoUnintallTimeOptions,
      applicationOptions: [],
      applicationVersionOptionsData: {},
      weightOptions: [],
      apkInfosData: {},
      deviceBrandOptions: [],
      deviceTypeOptionsData: {},
      channelOptions: [],
      regionOptions: regionDataPlus,
      elCascaderProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    Promise.all([
      this.getApkList(),
      this.getDeviceList(),
      this.getChannelList(),
      this.getWeightOptions()
    ]).then(() => {
      if (this.isEdit) {
        this.getDeliverData()
      }
    })
  },
  methods: {
    // 获取投放任务详情数据
    getDeliverData() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
      const id = this.id || (this.$route.params && this.$route.params.id)
      // console.log(id)
      fetchDeliver(id).then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          const data = res.data.data
          const promList = []
          data.list.forEach((item, index) => {
            // console.log(item)
            item.is_imei_deliver = !!item.imei.length
            promList.push(this.getApkVersionList(item.app_id))
            promList.push(this.getApkInfo(data.list, index, false))
            item.devices = item.devices.map(device => {
              promList.push(this.getDeviceTypeList(device.id))
              device.types = device.types.map(type => type.id)
              return device
            })
            item.notify = !!item.notify
            item.weight = item.weight.id
            item.not_these_areas = !!item.not_these_areas
            item.channels = item.channels.map(channel => channel.id)
            item.areas = item.areas.map(area => {
              const arr = []
              for (const key in area) {
                if (area[key]) {
                  arr.push('' + area[key])
                } else if (arr[arr.length - 1] !== '') {
                  arr.push('')
                }
              }
              return arr
            })
          })
          Promise.all(promList).then(() => {
            this.postForm = Object.assign(this.postForm, data)
            loading.close()
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 获取应用选项列表
    getApkList() {
      return fetchAppOptions().then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          this.applicationOptions = res.data.data.items
          // console.log(this.applicationOptions)
        }
        return Promise.resolve()
      })
    },
    // 获取容器配置选项列表
    getWeightOptions() {
      return fetchContainerConfigOptions().then(res => {
        if (res.data.code === 0) {
          this.weightOptions = res.data.data.items
          // console.log(this.weightOptions)
          return Promise.resolve()
        }
      })
    },
    // 获取手机品牌列表
    getDeviceList() {
      return fetchBrandOptions().then(res => {
        if (res.data.code === 0) {
          this.deviceBrandOptions = res.data.data.items
          // console.log(this.deviceBrandOptions)
          return Promise.resolve()
        }
      })
    },
    // 获取集成方列表
    getChannelList() {
      return fetchChannelOptions().then(res => {
        if (res.data.code === 0) {
          this.channelOptions = res.data.data.items
          // console.log(this.channelOptions)
          return Promise.resolve()
        }
      })
    },
    // 操作函数 投放应用下拉选框值改变后的回调
    handleApplicationSelectChange(index) {
      // this.postForm.list[index].app_version_id = undefined
      this.$set(this.postForm.list[index], 'app_version_id', undefined)
      const appId = this.postForm.list[index].app_id
      if (!this.applicationVersionOptionsData[appId]) {
        this.getApkVersionList(appId)
      }
    },
    // 获取指定应用的版本列表
    getApkVersionList(appId) {
      // 获取并缓存对应应用的版本数据
      return fetchAppVersionOptions(appId).then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          // this.applicationVersionOptionsData[appId] = res.data.data.items
          this.$set(this.applicationVersionOptionsData, appId, res.data.data.items)
          // console.log(this.applicationVersionOptionsData[appId])
          return Promise.resolve()
        }
      })
    },
    // 操作函数 应用版本下拉选框值改变后的回调
    handleAppVersionSelectChange(index) {
      this.getApkInfo(this.postForm.list, index)
    },
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
    // 操作函数 手机品牌下拉选框值改变后的回调
    handleDeviceSelectChange(index, subIndex) {
      this.postForm.list[index].devices[subIndex].types = []
      const deviceBrandId = this.postForm.list[index].devices[subIndex].id
      if (!this.deviceTypeOptionsData[deviceBrandId]) {
        this.getDeviceTypeList(deviceBrandId)
      }
    },
    // 获取指定手机品牌的机型列表
    getDeviceTypeList(deviceBrandId) {
      // 获取并缓存对应品牌手机的机型数据
      return fetchDeviceTypeOptions(deviceBrandId).then(res => {
        if (res.data.code === 0) {
          // this.deviceTypeOptionsData[deviceBrandId] = res.data.data.items
          this.$set(this.deviceTypeOptionsData, deviceBrandId, res.data.data.items)
          // console.log(this.deviceTypeOptionsData[deviceBrandId])
          return Promise.resolve()
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 操作函数 添加一条手机品牌/机型记录
    handleAddDevice(index) {
      this.postForm.list[index].devices.push({
        id: undefined,
        types: []
      })
    },
    // 操作函数 删除一条手机品牌/机型记录
    handleDeleteDevice(index, subIndex) {
      this.postForm.list[index].devices.splice(subIndex, 1)
    },
    handleChange(val) {
      // console.log(val)
    },
    handleAreasChange(areas) {
      // console.log(areas)
    },
    // 操作函数 添加行为
    handleAddAction() {
      this.postForm.list.push({
        type: 1,
        notify: false,
        app_id: undefined,
        app_version_id: undefined,
        auto_uninstall_time: 30,
        weight: undefined,
        is_imei_deliver: false,
        imei: [],
        devices: [],
        channels: [],
        not_these_areas: false,
        areas: []
      })
      this.activeNames = [this.postForm.list.length - 1]
    },
    // 操作函数 删除指定的行为
    handleDeleteAction(index) {
      if (this.postForm.list.length === 1) return
      this.$confirm('此操作将删除当前行为，请确认是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postForm.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        console.log('cancel delete')
      })
    },
    // 操作函数 添加imei标签
    handleAddImeiTag(index) {
      if (!this.imeiValue) return
      this.postForm.list[index].imei.push(this.imeiValue)
      this.imeiValue = ''
    },
    // 操作函数 删除imei标签
    handleCloseImeiTag(index, tagIndex) {
      this.postForm.list[index].imei.splice(tagIndex, 1)
    },
    // 操作函数 提交
    handleSubmit() {
      // console.log(JSON.stringify(this.postForm, null, 2))
      this.loading = true
      this.$refs.deliverPostForm.validate(valid => {
        // console.log(valid)
        if (valid) {
          const data = this.processData()
          data.status = 1
          // console.log(data)
          createDeliver(data).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              // this.postForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)))
              this.jumpTo('/manage/deliver', true)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              message: '提交失败',
              type: 'error'
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
    // 操作函数 保存
    handleSave() {
      this.loading = true
      this.$refs.deliverPostForm.validate(valid => {
        if (valid) {
          const data = this.processData()
          // console.log(data)
          createDeliver(data).then(res => { // 创建和保存操作复用同一个接口
            if (res.data.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              // console.log(res.data.data)
              this.postForm.id = res.data.data.task_id
              this.jumpTo('/manage/deliver', true)
            } else {
              this.$message({
                message: `保存失败 ${res.data.message}`,
                type: 'error'
              })
            }
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
    // 处理请求提交上报的数据
    processData() {
      const data = JSON.parse(JSON.stringify(this.postForm))
      data.list.forEach(item => {
        if (item.type === 2) {
          delete item.notify
          delete item.auto_uninstall_time
        }
        if (item.is_imei_deliver) {
          delete item.devices
          delete item.channels
          delete item.not_these_areas
          delete item.areas
        } else {
          delete item.imei
          item.channels = item.channels.map(id => {
            return this.channelOptions.filter(obj => obj.id === id)[0]
          })
          item.devices = item.devices.map(device => {
            if (!device.id) return null
            device.code = this.deviceBrandOptions.filter(obj => obj.id === device.id)[0].code
            device.types = device.types.map(id => {
              return this.deviceTypeOptionsData[device.id].filter(obj => obj.id === id)[0]
            })
            return device
          }).filter(device => device !== null)
          item.areas = item.areas.map(area => {
            return area.filter(item => item !== '')
          })
        }
        delete item.is_imei_deliver
      })
      // console.log(JSON.stringify(data, null, 4))
      return data
    },
    // 判断是否显示容器配置选项
    showContainerConfigFilter(item) {
      if (!item.app_id) return false
      const app = this.applicationOptions.filter(app => app.id === item.app_id)[0]
      return app && app.type === 1
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
    .deliver-apk{
      display: flex;
      :nth-child(2) {
        margin-left: 5px;
      }
    }
    .min-width{
      min-width: 380px;
    }
    .imei-tag{
      margin-right: 5px;
    }
    .mb-10{
      margin-bottom: 10px;
    }
    .w-320{
      width: 320px;
    }
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
<style lang="scss">
.tooltip{
  max-width: 200px;
  &-icon{
    margin-left: 10px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }
}
</style>
