<template>
    <div>
      <el-row>
        <el-col :span="12">
          <el-upload
            class="upload-demo"
            drag
            :action=url.upload
            :headers = headers
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        ocr: {},
        url: {
          upload: axios.defaults.baseURL + '/ocrupload'
        },
        headers: { Authorization: window.sessionStorage.getItem('token') }
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        // this.formData.avatar = res.data[0]
        this.$set(this.formData, 'code', res.data[0])
        this.ocr = res.ocrtext
        console.log(this.ocr)
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
