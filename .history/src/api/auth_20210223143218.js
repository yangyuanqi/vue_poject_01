import http from '../plugins/'

const { data: res } = await this.$http.get('auth/admin', {
    params: this.queryInfo
  })
  if (res.status !== 200) {
    return this.$message({
      type: 'warning',
      message: '获取用户列表失败'
    })
  }