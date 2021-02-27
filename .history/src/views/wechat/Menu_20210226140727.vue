<template>
  <div>
    <Crumbs :crumbs-name="['用户', '用户列表']"></Crumbs>
    <el-card></el-card>
  </div>
</template>

<script>
import Crumbs from '@/components/global/Crumbs.vue'
export default {
  components: {
    Crumbs
  },
  data() {
    return {
        menu:{
            button:[
                {
                             "type":"click",
          "name":"今日歌曲",
          "key":"V1001_TODAY_MUSIC"
                },
                {},
            ]
        }
    }
  }
}
</script>
