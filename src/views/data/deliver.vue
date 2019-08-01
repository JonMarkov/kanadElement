<template>
  <div class="dashboard-container">
    <el-row class="top">
      <div class="top-header">
        <div class="top-header__title">投放 - 昨日数据</div>
        <el-tooltip class="item" effect="light" placement="bottom">
          <div slot="content">
            <p>投放应用: {{apk_num}}</p>
            <p>应用激活: {{active_apk_num}}</p>
            <p>新增集成方: {{new_channel_num}}</p>
          </div>
          <span class="top-header__tip el-icon-warning"></span>
        </el-tooltip>
      </div>
      <el-row class="top-content">
        <el-col :span="8">
          <div class="top-content__title">投放应用</div>
          <div class="top-content__data">{{apk_num}}</div>
        </el-col>
        <el-col :span="8">
          <div class="top-content__title">应用激活</div>
          <div class="top-content__data">{{active_apk_num}}</div>
        </el-col>
        <el-col :span="8">
          <div class="top-content__title">新增集成方</div>
          <div class="top-content__data">{{new_channel_num}}</div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="list">
      <div class="list-header">
        <div class="list-header__title">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDatePickerChange">
          </el-date-picker>
        </div>
        <a class="list-header__action" @click="handleDownload">导出EXCEL</a>
      </div>
      <el-row class="list-content">
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="日期">
            <template slot-scope="scope">
              <span>{{ scope.row.date}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="投放应用">
            <template slot-scope="scope">
              <span>{{ scope.row.apk_num }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="应用激活">
            <template slot-scope="scope">
              <span>{{ scope.row.active_apk_num }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="新增集成方">
            <template slot-scope="scope">
              <span>{{ scope.row.new_channel_num }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
    <!--列表分页部分-->
    <div class="pagination-container" style="max-width: 1000px;margin: 20px auto 40px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { fetchDataDeliverList, fetchDataDeliverOld } from '@/api/data'

export default {
  name: 'deliverData',
  data() {
    return {
      apk_num: '',
      active_apk_num: '',
      new_channel_num: '',
      date: [],
      listLoading: false,
      list: null,
      filename: '看广告容器数据',
      autoWidth: true,
      bookType: 'xlsx',
      total: 0,
      listQuery: {
        page: 1,
        perpage: 10,
        start_date: undefined,
        end_date: undefined,
        id: ''
      }
    }
  },
  created() {
    // 函数执行 查询数据列表
    this.getList()
    // 函数执行 查询昨日数据
    this.getOldList()
  },
  computed: {},
  filters: {
    dateFilter(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d}')
    }
  },
  methods: {
    // 函数定义 查询数据列表
    getList() {
      this.listLoading = true
      fetchDataDeliverList(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.items
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
    // 函数定义 查询昨日数据
    getOldList() {
      this.listLoading = true
      const datetime = new Date()
      datetime.setTime(datetime.getTime() - 24 * 60 * 60 * 1000)
      const year = datetime.getFullYear()
      const month = ('0' + (datetime.getMonth() + 1)).slice(-2)
      const date = ('0' + datetime.getDate()).slice(-2)
      const timestampData = (year + month + date)
      fetchDataDeliverOld(timestampData).then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          this.apk_num = res.data.data.apk_num
          this.active_apk_num = res.data.data.active_apk_num
          this.new_channel_num = res.data.data.new_channel_num
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
    // 函数定义 下载EXCEL表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['日期', '投放数量', '应用激活', '新增集成方']
        const filterVal = ['date', 'apk_num', 'active_apk_num', 'new_channel_num']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 函数定义 分页部分
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    // 函数定义 分页部分
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDatePickerChange(val) {
      this.listQuery.start_date = Math.floor(+val[0] / 1000)
      this.listQuery.end_date = Math.floor(+val[1] / 1000)
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
  }
</style>
