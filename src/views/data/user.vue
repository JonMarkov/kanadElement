<template>
  <div class="dashboard-container">
    <el-row class="top">
      <div class="top-header">
        <div class="top-header__title">用户 - 昨日数据</div>
        <el-tooltip class="item" effect="light" placement="bottom">
          <div slot="content">
<!--            <p>投放应用: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>-->
            <p>日活跃: {{user_num}}</p>
            <p>激活用户: {{active_user_num}}</p>
          </div>
          <span class="top-header__tip el-icon-warning"></span>
        </el-tooltip>
      </div>
      <el-row class="top-content">
<!--        <el-col :span="8">-->
<!--          <div class="top-content__title">用户量</div>-->
<!--          <div class="top-content__data">1000</div>-->
<!--        </el-col>-->
        <el-col :span="12">
          <div class="top-content__title">日活跃</div>
          <div class="top-content__data">{{active_user_num}}</div>
        </el-col>
        <el-col :span="12">
          <div class="top-content__title">激活用户</div>
          <div class="top-content__data">{{user_num}}</div>
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
<!--          <el-table-column align="center" label="用户量">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="日活跃">
            <template slot-scope="scope">
              <span>{{ scope.row.active_user_num }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="激活用户">
            <template slot-scope="scope">
              <span>{{ scope.row.user_num }}</span>
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
import { fetchUserDeliverList, fetchUserDeliverOld } from '@/api/data'

export default {
  name: 'userData',
  data() {
    return {
      active_user_num: '',
      user_num: '',
      date: [],
      listLoading: false,
      list: null,
      filename: '用户数据',
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
      fetchUserDeliverList(this.listQuery).then(res => {
        // console.log(res)
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
    // 函数定义 查询昨日数据列表
    getOldList() {
      this.listLoading = true
      const datetime = new Date()
      datetime.setTime(datetime.getTime() - 24 * 60 * 60 * 1000)
      const year = datetime.getFullYear()
      const month = ('0' + (datetime.getMonth() + 1)).slice(-2)
      const date = ('0' + datetime.getDate()).slice(-2)
      const timestampData = (year + month + date)
      fetchUserDeliverOld(timestampData).then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          this.active_user_num = res.data.data.active_user_num
          this.user_num = res.data.data.user_num
          // console.log(this.list)
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['日期', '日活跃', '激活用户']
        const filterVal = ['date', 'active_user_num', 'user_num']
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
      .top-content > :nth-child(2)::after{
        display: none;
      }
    }
  }
</style>
