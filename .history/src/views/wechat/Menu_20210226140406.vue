<template>
  <div>
    <Crumbs :crumbs-name="['用户', '用户列表']"></Crumbs>
    <el-card></el-card>
  </div>
</template>

<script>
import Crumbs from '@'
export default {
    components:{
        Crumbs
    }
}
</script>