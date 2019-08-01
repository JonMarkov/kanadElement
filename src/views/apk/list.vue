<template>
  <div class="app-container">
    <!--新增APK按钮-->
    <el-row style="max-width: 1100px;">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-col :span="8">
          <el-form-item label-width="80px" label="ID：" class="postInfo-container-item">
            <el-input v-model="listQuery.id" placeholder="请输入ID" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="100px" label="应用名称：" class="postInfo-container-item">
            <el-input v-model="listQuery.app_name" placeholder="请输入应用名称" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="4">
          <router-link to="/manage/apk/add">
            <el-button type="primary">新增APK</el-button>
          </router-link>
        </el-col>
      </el-form>
    </el-row>
    <!--应用列表-->
    <el-row class="list">
      <div class="list-header">
        <div class="list-header__title">
          应用列表
        </div>
        <a class="list-header__action" @click="handleDownload">导出EXCEL</a>
      </div>
      <el-row class="list-content">
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column width="80" align="center" label="ID">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="应用名称">
            <template slot-scope="scope">
              <span>{{ scope.row.app_name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">应用商城</span>
              <span v-if="scope.row.type === 2">自建</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="内容方">
            <template slot-scope="scope">
              <span>{{ scope.row.manufacturer_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="APK包名">
            <template slot-scope="scope">
              <span>{{ scope.row.package }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="大小">
            <template slot-scope="scope">
              <span>{{ scope.row.size}} kb</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下载链接">
            <template slot-scope="scope">
              <span><a :href="scope.row.download_url">{{ scope.row.download_url }}</a></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="详情" width="120px">
            <template slot-scope="scope">
              <router-link :to="'/manage/apk/edit/'+scope.row.id">
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
import { parseTime } from '@/utils'
import { fetchApkList } from '@/api/apk'

export default {
  name: 'apkList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        perpage: 10,
        status: undefined,
        id: '',
        app_name: ''
      },
      filename: 'APK管理',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  computed: {},
  created() {
    // 函数执行 查询数据列表
    this.getList()
  },
  filters: {
  },
  methods: {
    // 函数定义 查询应用名称
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 函数定义 查询数据列表
    getList() {
      this.listLoading = true
      fetchApkList(this.listQuery).then(res => {
        // console.log(res.data.data.items)
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
    // 函数定义 下载EXCEL表格
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '应用名称', '类型', '内容方', 'APK包名', '大小', '下载链接']
        const filterVal = ['id', 'app_name', 'type', 'manufacturer_name', 'package', 'size', 'download_url']
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
        if (j === 'date') {
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
  .list{
    max-width: none;
    margin-top: 0;
  }
</style>
