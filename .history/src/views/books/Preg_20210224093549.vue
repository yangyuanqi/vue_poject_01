<template>
  <div>
    <Crumbs :crumbs-name="['小说', '采集规则']"></Crumbs>
    <el-card>
      <!--面包屑-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogShow">添加</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="dataList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" width="120px">
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="list_author">
          <el-input v-model="formData.list_author"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="list_describe">
          <el-input v-model="formData.list_describe"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="list_msg_img">
          <el-input v-model="formData.list_msg_img"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="list_msg_last_time">
          <el-input v-model="formData.list_msg_last_time"></el-input>
        </el-form-item>
        <el-form-item label="列表链接" prop="list_a">
          <el-input v-model="formData.list_a"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content_text">
          <el-input v-model="formData.content_text"></el-input>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="list_author">
          <el-input v-model="formData.list_author"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="list_describe">
          <el-input v-model="formData.list_describe"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="list_msg_img">
          <el-input v-model="formData.list_msg_img"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="list_msg_last_time">
          <el-input v-model="formData.list_msg_last_time"></el-input>
        </el-form-item>
        <el-form-item label="列表链接" prop="list_a">
          <el-input v-model="formData.list_a"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content_text">
          <el-input v-model="formData.content_text"></el-input>
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
export default {
  components: {
    Crumbs
  },
  data() {
    return {
      keywords: '',
      // 基础数据
      dataList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      url: {
        index: 'books/preg',
        create: 'books/preg',
        update: 'books/preg',
        delete: 'books/preg'
      },
      queryInfo: {
        pagesize: 10,
        page: 1
      },
      formData: {
        name: '',
        list_author: '',
        list_describe: '',
        list_msg_img: '',
        list_msg_last_time: '',
        list_a: '',
        content_text: ''
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
    this.getAdminList()
  },
  methods: {
    addDialogShow() {
      this.addDialogVisible = true
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
      const res = await this.$http.get(this.url.index, {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'warning',
          message: '获取用户列表失败'
        })
      }
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
    addSave() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await this.$http.post(this.url.create, this.formData)
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
        const res = await this.$http.put(
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
      const res = await this.$http.delete(this.url.delete + '/' + info.id)
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
