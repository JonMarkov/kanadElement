<template>
  <div class="app-container">
    <el-row style="max-width:1000px">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-col :span="8">
          <el-form-item label-width="80px" label="投放ID：" class="postInfo-container-item">
            <el-input v-model="listQuery.id" placeholder="请输入ID" clearable @keypress.native.enter="handleSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="80px" label="状态：" class="postInfo-container-item">
            <el-select v-model="listQuery.status" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="4">
          <router-link :to="{ path: '/manage/deliver/add', query: { t: +new Date() }}">
            <el-button type="primary">新增投放任务</el-button>
          </router-link>
        </el-col>
        <!-- <el-col :span="3">
          <el-button type="info" @click="handleDownloadExcel">导出EXCEL</el-button>
        </el-col> -->
      </el-form>
    </el-row>
    <el-row class="list">
      <div class="list-header">
        <div class="list-header__title">
          投放任务列表
        </div>
        <a class="list-header__action" @click="handleDownloadExcel">导出EXCEL</a>
      </div>
      <el-row class="list-content">
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @sort-change="handleSortChange">
          <!-- <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row type="flex" justify="center">
                <el-col :span="12">
                  创建时间：{{ scope.row.created_at | timeFilter }}
                </el-col>
                <el-col :span="12">
                  更新时间：{{ scope.row.updated_at | timeFilter }}
                </el-col>
              </el-row>
            </template>
          </el-table-column> -->

          <el-table-column width="80" align="center" label="投放ID">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="投放数量">
            <template slot-scope="scope">
              <span>{{ scope.row.max_num }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="行为激活数量">
            <template slot-scope="scope">
              <span>{{ scope.row.active_num }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusTagTypeFilter">{{ scope.row.status | statusTagTextFilter }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column min-width="160px" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | timeFilter }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column width="160px" align="center" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updated_at }}</span>
            </template>
          </el-table-column> -->

          <el-table-column align="center" label="Actions" width="240px">
            <template slot-scope="scope">
              <router-link v-if="scope.row.status === 0" :to="'/manage/deliver/edit/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
              <router-link v-if="scope.row.status !== 0" :to="'/manage/deliver/view/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-view">查看</el-button>
              </router-link>
              <el-button v-if="scope.row.status === 2" type="danger" size="small" @click="handleStopDeliver(scope)">终止</el-button>
              <el-button v-if="scope.row.status === 1" type="success" size="small" @click="handleDeliver(scope)">投放</el-button>
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
    <el-dialog title="图片预览" :visible.sync="imageDialogVisible" top="8vh">
      <img width="100%" :src="viewImage" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { fetchDeliverList, updateDeliverStatus } from '@/api/deliver'
import { statusOptions } from './component/options'

const statusMap = statusOptions.slice(1).map(item => item.name)

export default {
  name: 'deliverList',
  data() {
    return {
      statusList: statusOptions,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        perpage: 10,
        status: undefined,
        id: ''
      },
      imageDialogVisible: false,
      viewImage: ''
    }
  },
  filters: {
    timeFilter(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    statusTagTextFilter(status) {
      return statusMap[status]
    },
    statusTagTypeFilter(status) {
      return ['info', 'warning', '', 'success', 'danger'][status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handlePreviewImage(url) {
      this.viewImage = url
      this.imageDialogVisible = true
    },
    handleSortChange(data) {
      // console.log(data)
      const order = data.order === 'ascending' ? '' : '-'
      this.listQuery.sort = order + 'quote'
      this.listQuery.page = 1
      // console.log(this.listQuery.sort)
      this.getList()
    },
    handleStopDeliver(scope) {
      this.$confirm('此操作将终止当前投放任务, 且不可逆，请确认是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateDeliverStatus({
          id: scope.row.id
          // status: 4
        }).then(res => {
          // console.log(res.data)
          this.list[scope.$index].status = 4
          this.$message({
            type: 'success',
            message: '终止成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消终止'
        })
      })
    },
    handleDeliver(scope) {
      this.$confirm('请确认是否进行投放?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateDeliverStatus({
          id: scope.row.id
          // status: 2
        }).then(res => {
          // console.log(res.data)
          this.list[scope.$index].status = 2
          this.$message({
            type: 'success',
            message: '投放成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消终止'
        })
      })
    },
    handleSearch() {
      // console.log('search')
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchDeliverList(this.listQuery).then(res => {
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
        const tHeader = ['ID', '投放数量', '应用激活', '状态', '创建时间']
        const filterVal = ['id', 'max_num', 'active_num', 'status', 'created_at']
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
        } else if (j === 'status') {
          return statusMap[v[j]]
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
