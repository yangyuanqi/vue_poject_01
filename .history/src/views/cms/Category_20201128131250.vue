<template>
  <div>
    <Crumbs :crumbs-name="['主页', '栏目管理']"></Crumbs>
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
      <el-table
        :data="dataList"
        style="width: 100%"
        border
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="nickname" label="别名"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">其他</span>
            <span v-else>新闻</span>
          </template>
        </el-table-column>
        <el-table-column prop="isnav" label="导航">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isnav"
              @change="StatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickname">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            class="avatar-uploader"
            :action="url.upload"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.image" :src="formData.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="打开方式" prop="target">
          <el-select v-model="formData.target" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weigh">
          <el-input v-model="formData.weigh"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导航" prop="isnav">
          <el-radio-group v-model="formData.isnav">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">新闻</el-radio>
            <el-radio :label="0">其他</el-radio>
          </el-radio-group>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickname">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            class="avatar-uploader"
            :action="url.upload"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.image" :src="formData.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="打开方式" prop="target">
          <el-select v-model="formData.target" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weigh">
          <el-input v-model="formData.weigh"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导航" prop="isnav">
          <el-radio-group v-model="formData.isnav">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">新闻</el-radio>
            <el-radio :label="0">其他</el-radio>
          </el-radio-group>
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
export default {
  components: {
    Crumbs
  },
  data() {
    return {
      keywords: '',
      // select
      options: [
        {
          value: '_blank',
          lavel: '_blank'
        },
        {
          value: '_self',
          lavel: '_self'
        }
      ],
      headers: { Authorization: window.sessionStorage.getItem('token') },

      // 基础数据
      dataList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      url: {
        index: 'cms/category',
        create: 'cms/category',
        update: 'cms/category',
        delete: 'cms/category',
        upload: axios.defaults.baseURL + '/upload'
      },
      queryInfo: {
        pagesize: 10,
        page: 1
      },
      formData: {
        name: '',
        pid: 0,
        status: 0,
        isnav: 1,
        type: 0,
        target: '_self'
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
    parentCateChanged() {
      if (this.formData.pid == null) {
        this.formData.pid = 0
      }
    },
    addDialogShow() {
      this.addDialogVisible = true
      this.formData.status = 1
      this.formData.isnav = 0
      this.formData.type = 0
      this.formData.target = '_self'
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
      const { data: res } = await this.$http.get(this.url.index, {
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
        const { data: res } = await this.$http.post(
          this.url.create,
          this.formData
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
    async StatusChange(info) {
      const { data: res } = await this.$http.put(
        `cms/category/${info.id}/isnav/${info.isnav}`
      )
      if (res.status !== 200) {
        info.status = !info.status
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // this.formData.avatar = res.data[0]
      this.$set(this.formData, 'image', res.data[0])
      // this.formData.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
