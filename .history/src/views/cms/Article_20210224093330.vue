<template>
  <div>
    <!--面包屑-->
    <Crumbs :crumbs-name="['主页', '文章列表']"></Crumbs>
    <el-card>
      <!--search-->
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button type="primary" @click="addDialogShow"
            >添加</el-button
          ></el-col
        >
        <el-col :span="3">
          <el-cascader
            :options="category"
            v-model="queryInfo.category_id"
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
        </el-col>
        <el-col :span="5">
          <el-input placeholder="标题" v-model="queryInfo.title">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getAdminList"
            ></el-button>
          </el-input>
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
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column
          prop="cms_category.name"
          label="分类"
        ></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="hits" label="点击量"></el-table-column>
        <el-table-column prop="image" label="缩略图">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatetime"
          label="更新时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="发布时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">未发布</el-tag>
            <el-tag v-else>已发布</el-tag>
          </template>
        </el-table-column>
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
        <el-form-item label="父级" prop="category_id">
          <div class="block">
            <el-cascader
              :options="category"
              v-model="formData.category_id"
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author"></el-input>
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
        <el-form-item label="内容" prop="content">
          <Editor v-model="formData.content"></Editor>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
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
        <el-form-item label="父级" prop="category_id">
          <div class="block">
            <el-cascader
              :options="category"
              v-model="formData.category_id"
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author"></el-input>
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
        <el-form-item label="内容" prop="content">
          <Editor v-model="formData.content"></Editor>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">未发布</el-radio>
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
import Editor from '@/components/global/Editor'

import axios from 'axios'
export default {
  components: {
    Crumbs,
    Editor
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
      category: [],
      headers: { Authorization: window.sessionStorage.getItem('token') },
      isClear: false,
      // 基础数据
      dataList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      url: {
        index: 'cms/article',
        create: 'cms/article',
        update: 'cms/article',
        delete: 'cms/article',
        upload: axios.defaults.baseURL + '/upload'
      },
      queryInfo: {
        pagesize: 10,
        page: 1
      },
      formData: {
        title: '',
        pid: 0,
        status: 0
      },
      addFormRules: {},
      editFormRules: {}
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
      this.category = res.category
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
    },
    change(val) {
      console.log(val)
    }
  }
}
</script>
