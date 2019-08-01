<template>
  <div class="app-container">
    <el-row style="max-width: 1100px;">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-col :span="8">
          <el-form-item label-width="80px" label="ID：" class="postInfo-container-item">
            <el-input v-model="listQuery.id" placeholder="请输入ID" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="100px" label="集成方名称：" class="postInfo-container-item">
            <el-input v-model="listQuery.name" placeholder="请输入集成方名称" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="4">
          <router-link to="/manage/channel/add">
            <el-button type="primary">新增集成方</el-button>
          </router-link>
        </el-col>
      </el-form>
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
          <el-table-column width="80" align="center" label="ID">
            <template slot-scope="scope">
              <span>{{ scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="集成方名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="对接人">
            <template slot-scope="scope">
              <span>{{ scope.row.manager}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系方式">
            <template slot-scope="scope">
              <span>{{ scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="电子邮箱">
            <template slot-scope="scope">
              <span>{{ scope.row.email}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="日期">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="详情" width="120px">
            <template slot-scope="scope">
              <router-link :to="'/manage/channel/edit/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
    <!--列表分页部分-->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchChannelsList } from '@/api/channel'
import { parseTime } from '@/utils'

export default {
  name: 'channelList',
  data() {
    return {
      date: [],
      listLoading: false,
      list: null,
      filename: '集成方管理',
      autoWidth: true,
      bookType: 'xlsx',
      total: 0,
      listQuery: {
        page: 1,
        perpage: 10,
        start_date: undefined,
        end_date: undefined,
        id: '',
        name: ''
      }
    }
  },
  created() {
    // 函数执行 查询数据列表
    this.getList()
  },
  computed: {},
  filters: {
    dateFilter(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  methods: {
    // 函数定义 查询数据列表
    getList() {
      this.listLoading = true
      fetchChannelsList(this.listQuery).then(res => {
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
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 函数定义 下载EXCEL表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['集成方名称', '对接人', '联系方式', '电子邮箱', '日期']
        const filterVal = ['name', 'manager', 'phone', 'email', 'created_at']
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
        if (j === 'created_at') {
          return parseTime(v[j], '{y}-{m}-{d} {h}:{i}:{s}')
        } else {
          return v[j]
        }
      }))
    },
    // 函数定义 分页部分
    handleSizeChange(val) {
      this.listQuery.perpage = val
      this.getList()
    },
    // 函数定义 分页部分
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDatePickerChange(val) {
      this.listQuery.start_date = Math.floor(+val[0] / 1000)
      this.listQuery.end_date = Math.floor(+val[1] / 1000) + 24 * 60 * 60 - 1
      this.listQuery.page = 1
      this.listQuery.id = ''
      this.listQuery.name = ''
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
  }
  .list{
    max-width: none;
    margin-top: 0;
  }
</style>
