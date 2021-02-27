<template>
  <div>
    <Crumbs :crumbs-name="['权限', '管理员管理']"></Crumbs>
    <el-card>
      <!--面包屑-->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="keywords">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="dataList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
        ></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="url" label="Url"></el-table-column>
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="browser" label="Browser"></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              @click="viewDialogShow(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!--修改-->
      <el-dialog
        title="详情"
        :visible.sync="viewDialogVisible"
        width="50%"
        @close="viewDialogVisible = false"
      >
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '@/components/global/Crumbs.vue'
import { dateFormat } from '../../plugins/date'
import http from '../../plugins/http'
export default {
  components: {
    Crumbs
  },
  data() {
    return {
      keywords: '',
      // 基础数据
      viewDialogVisible: false,
      dataList: [],
      total: 0,
      queryInfo: {
        pagesize: 10,
        page: 1
      }
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    viewDialogShow() {
      this.viewDialogVisible = true
    },
    dateFormat(row, column) {
      return dateFormat(row, column)
    },
    // 获取用户数据
    async getAdminList() {
      const res = await http({
        url: 'auth/adminlog',
        method: 'get',
        data: this.queryInfo
      })
      this.dataList = res.data
      this.total = res.total
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAdminList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getAdminList()
    },
    async del(info) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消'
        })
      }
      // del
      const { msg: message } = await http({
        url: `auth/adminlog/${info.id}`,
        method: 'delete'
      })
      this.$message({
        type: 'success',
        message: message
      })
      this.getAdminList()
    }
  }
}
</script>
