<template>
  <div>
    <Crumbs :crumbs-name="['权限', '管理员管理']"></Crumbs>
    <el-card>
      <!--面包屑-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogShow">添加用户</el-button>
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
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="nickname" label="所属组别">
          <template slot-scope="scope">
            <el-tag
              type="info"
              size="mini"
              :key="index"
              v-for="(item, index) in scope.row.auth_group_access"
              >{{ item.auth_group.name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="adminStateChange(scope.row)"
              active-value="normal"
              inactive-value="hidden"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="logintime"
          label="最后登录"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogShow(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
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
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="addForm.status" label="normal">正常</el-radio>
          <el-radio v-model="addForm.status" label="hidden">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="editForm.status" label="normal">正常</el-radio>
          <el-radio v-model="editForm.status" label="hidden">隐藏</el-radio>
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
import { getAdminList } from '../api/auth'

export default {
  components: {
    Crumbs
  },
  data() {
    // 自定义校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      keywords: '',
      // 基础数据
      dataList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      queryInfo: {
        pagesize: 10,
        page: 1
      },
      addForm: {
        username: '',
        password: '',
        nickname: '',
        status: '',
        email: ''
      },
      editForm: {
        username: '',
        password: '',
        nickname: '',
        status: '',
        email: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    addDialogShow() {
      this.addDialogVisible = true
      this.addForm.status = 'normal'
    },
    editDialogShow(userinfo) {
      this.formData = JSON.parse(JSON.stringify(userinfo))
      this.editDialogVisible = true
    },
    addDialogClosed() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
      this.formData = {}
    },
    // 监听对话框关闭
    editDialogClosed() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
      this.formData = {}
    },
    dateFormat(row, column) {
      return dateFormat(row, column)
    },
    // 获取用户数据
    async getAdminList() {
      // const { data: res } = await this.$http.get('auth/admin', {
      //   params: this.queryInfo
      // })
      // if (res.status !== 200) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '获取用户列表失败'
      //   })
      // }
      const {data:res} = await getAdminList()
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
    // 修改状态
    async adminStateChange(admininfo) {
      const { data: res } = await this.$http.put(
        `auth/admin/${admininfo.id}/status/${admininfo.status}`
      )
      if (res.status !== 200) {
        if (admininfo.status === 'hidden') {
          admininfo.status = 'normal'
        } else {
          admininfo.status = 'hidden'
        }
        return this.$message({
          type: 'warning',
          message: '更新用户状态失败'
        })
      }
      return this.$message({
        type: 'success',
        message: '更新用户状态成功'
      })
    },
    addSave() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'auth/admin/add',
          this.addForm
        )
        if (res.status !== 200) {
          return this.$message({
            type: 'warning',
            message: res.msg
          })
        }
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.addDialogVisible = false
        this.getAdminList()
      })
    },
    editSave() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'auth/admin/' + this.editForm.id,
          this.editForm
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
      const { data: res } = await this.$http.delete(`auth/admin/${info.id}`)
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
    }
  }
}
</script>
