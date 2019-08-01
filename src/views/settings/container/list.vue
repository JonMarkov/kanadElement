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
          <el-form-item label-width="100px" label="配置名称：" class="postInfo-container-item">
            <el-input v-model="listQuery.name" placeholder="请输入配置名称" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="4">
          <router-link to="/settings/container/add">
            <el-button type="primary">新增配置</el-button>
          </router-link>
        </el-col>
      </el-form>
    </el-row>
    <el-row class="list">
      <div class="list-header">
        <div class="list-header__title">
          容器配置列表
        </div>
        <a class="list-header__action" @click="handleDownloadExcel">导出EXCEL</a>
      </div>
      <el-row class="list-content">
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
          <!-- <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row type="flex" justify="center">
                <el-col :span="12">
                  创建时间：{{ scope.row.created_at }}
                </el-col>
                <el-col :span="12">
                  更新时间：{{ scope.row.updated_at }}
                </el-col>
              </el-row>
            </template>
          </el-table-column> -->

          <el-table-column width="80" align="center" label="ID">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="配置名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="创建人">
            <template slot-scope="scope">
              <span>{{ scope.row.created_by_user.realname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | timeFilter }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column width="160px" align="center" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updated_at }}</span>
            </template>
          </el-table-column> -->

          <el-table-column align="center" label="Actions" width="120px">
            <template slot-scope="scope">
              <router-link :to="'/settings/container/edit/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.perpage" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { fetchContainerConfigList } from '@/api/container'

export default {
  name: 'containerConfigList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        name: '',
        page: 1,
        perpage: 10
      }
    }
  },
  filters: {
    timeFilter(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchContainerConfigList(this.listQuery).then(res => {
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
    handleSizeChange(val) {
      this.listQuery.perpage = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDownloadExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '配置名称', '创建人', '创建时间']
        const filterVal = ['id', 'name', 'created_by_user', 'created_at']
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
        } else if (j === 'created_by_user') {
          return v[j].realname
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  .list{
    max-width: none;
    margin-top: 0;
  }
</style>
