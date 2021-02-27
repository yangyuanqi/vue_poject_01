<template>
  <div>
    <Crumbs :crumbs-name="['权限', '角色组']"></Crumbs>
    <el-card>
      <!--面包屑-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keywords">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogShow">添加</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table
        :data="dataList"
        style="width: 100%"
        border
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="组名"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">隐藏</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id != 1"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogShow(scope.row)"
            ></el-button>
            <el-button
              v-if="scope.row.id != 1"
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
    </el-card>

    <!--添加-->
    <el-dialog
      title="添加"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="formData"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="父级" prop="pid">
          <div class="block">
            <el-cascader
              :options="dataList"
              v-model="formData.pid"
              :props="{
                expandTrigger: 'hover',
                checkStrictly: true,
                value: 'id',
                label: 'name',
                emitPath: false
              }"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="rules">
          <el-tree
            :data="rules"
            :props="{ label: 'title', children: 'children' }"
            show-checkbox
            @check-change="handleCheckChange"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="formData.status" :label="1">正常</el-radio>
          <el-radio v-model="formData.status" :label="0">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="formData"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="父级" prop="pid">
          <div class="block">
            <el-cascader
              :options="dataList"
              v-model="formData.pid"
              :props="{
                expandTrigger: 'hover',
                checkStrictly: true,
                value: 'id',
                label: 'name',
                emitPath: false
              }"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="rules">
          <el-tree
            :data="rules"
            :props="{ label: 'title', children: 'children' }"
            node-key="id"
            :default-checked-keys="treeKeys"
            ref="tree"
            show-checkbox
            @check-change="handleCheckChange"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="formData.status" :label="1">正常</el-radio>
          <el-radio v-model="formData.status" :label="0">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from '@/components/global/Crumbs.vue'
import { dateFormat } from '../../plugins/date'
import axios from 'axios'
import http from '../../plugins/http'
export default {
  components: {
    Crumbs
  },
  data() {
    return {
      // 分组
      rules: [],
      treeId: [],
      treeKeys: [],
      // advertGroup: [],
      // 基础数据
      // 列表数据与分页
      dataList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      headers: { Authorization: window.sessionStorage.getItem('token') },
      url: {
        index: 'auth/group',
        create: 'auth/group',
        update: 'auth/group',
        delete: 'auth/group',
        upload: axios.defaults.baseURL + '/upload'
      },
      queryInfo: {
        keywords: '',
        pagesize: 10,
        page: 1
      },
      formData: {
        name: '',
        status: 1,
        rules: []
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.api = this.$api
    this.getAdminList()
  },
  methods: {
    addDialogShow() {
      this.addDialogVisible = true
      this.formData.status = 1
      this.formData.pid = 1
    },
    addDialogClosed() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.formData = {}
    },
    editDialogShow(userinfo) {
      this.formData = JSON.parse(JSON.stringify(userinfo))
      this.editDialogVisible = true
      this.treeKeys = this.formData.rules.split(',')
    },
    // 监听对话框关闭
    editDialogClosed() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
      this.formData = {}
      this.$refs.tree.setCheckedKeys([])
    },
    dateFormat(row, column) {
      return dateFormat(row, column)
    },
    // 获取用户数据
    async getAdminList() {
      const res = await http({
        url: this.url.index,
        method: 'get',
        data: this.queryInfo
      })
      this.dataList = res.data
      this.total = res.total
      this.rules = res.rules
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
    addSave() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const {msg:message} = await http({
          url: this.url.create,
          method: 'post',
          data: this.formData
        })
        this.$message({
          type: 'success',
          message: res.message
        })
        this.addDialogVisible = false
        this.getAdminList()
      })
    },
    editSave() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          this.url.update + '/' + this.formData.id,
          this.formData
        )
        if (res.status !== 200) {
          return this.$message({
            type: 'warning',
            message: '修改失败'
          })
        }
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.editDialogVisible = false
        this.getAdminList()
      })
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
      const { data: res } = await this.$http.delete(
        this.url.delete + '/' + info.id
      )
      if (res.status !== 200) {
        this.$message({
          type: 'warning',
          message: res.msg
        })
      }
      this.$message({
        type: 'success',
        message: res.msg
      })
      this.getAdminList()
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.treeId.push(data.id)
      } else {
        var index = this.treeId.indexOf(data.id)
        this.treeId.splice(index, 1)
      }
      this.formData.rules = this.treeId.join(',')
      // console.log(this.treeId)
    }
  }
}
</script>
