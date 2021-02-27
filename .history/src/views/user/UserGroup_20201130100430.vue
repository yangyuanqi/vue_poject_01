<template>
  <div>
    <!--面包屑-->
    <Crumbs :crumbs-name="['用户','用户群组']"></Crumbs>
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
      <el-table :data="dataList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="组名"></el-table-column>
        <el-table-column prop="notice" label="群公告"></el-table-column>
        <el-table-column prop="code" label="群二维码" width="90">
            <template slot-scope="scope">
              <el-avatar :size="60" :src="api + scope.row.code">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" :formatter="dateFormat"></el-table-column>
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editDialogShow(scope.row)"
            >查看群成员</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="editDialogShow(scope.row)"
            >禁言</el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogShow(scope.row)"
            >修改</el-button>
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
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="formData" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="组名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="群公告" prop="notice">
          <el-input v-model="formData.notice"></el-input>
        </el-form-item>
        <el-form-item label="群二维码" prop="code">
          <el-upload
            class="avatar-uploader"
            :action=url.upload
            :show-file-list="false"
            :headers = headers
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formData.code" :src="api + formData.code" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input type="hidden" v-model="formData.code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="formData" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="组名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="群公告" prop="notice">
          <el-input v-model="formData.notice"></el-input>
        </el-form-item>
        <el-form-item label="群二维码" prop="code">
          <el-upload
            class="avatar-uploader"
            :action=url.upload
            :show-file-list="false"
            :headers = headers
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formData.code" :src="api + formData.code" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input type="hidden" v-model="formData.code"></el-input>
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
        preg: [],
        bookType: [],
        api: '',
        // 基础数据
        dataList: [],
        total: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        headers: { Authorization: window.sessionStorage.getItem('token') },
        url: {
          index: 'user/group',
          create: 'user/group',
          update: 'user/group',
          delete: 'user/group',
          upload: axios.defaults.baseURL + '/upload'
        },
        queryInfo: {
          pagesize: 10,
          page: 1
        },
        formData: {
          name: '',
          notice: '',
          code: ''
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
        this.preg = res.preg
        this.bookType = res.book_type
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
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post(this.url.create, this.formData)
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
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put(this.url.update + '/' + this.formData.id, this.formData)
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
        ).catch(err => err)
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
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw)
        if (res.status === 200) {
          // this.formData.code = res.data[0]
          this.$set(this.formData, 'code', res.data[0])
        } else {
          this.$message.error('上传失败')
        }
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
<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
