<template>
  <div class="crumbs">
    <el-breadcrumb separator="/" class="">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ crumbsName[0] }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ crumbsName[1] }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['crumbsName'],
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.crumbs {
  padding: 10px;
}
</style>
