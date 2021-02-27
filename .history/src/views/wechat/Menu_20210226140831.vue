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
      menu: {
        button: [
          {
            type: 'click',
            name: '今日歌曲',
            key: 'V1001_TODAY_MUSIC'
          },
          {
            name: '菜单',
            sub_button: [
              {
                type: 'view',
                name: '搜索',
                url: 'http://www.soso.com/'
              },
              {
                type: 'miniprogram',
                name: 'wxa',
                url: 'http://mp.weixin.qq.com',
                appid: 'wx286b93c14bbf93aa',
                pagepath: 'pages/lunar/index'
              },
              {
                type: 'click',
                name: '赞一下我们',
                key: 'V1001_GOOD'
              }
            ]
          },
          {
            type: 'click',
            name: '',
            key: 'V1001_TODAY_MUSIC'
          },
        ]
      }
    }
  }
}
</script>
