<template>
  <div>
    <Crumbs :crumbs-name="['用户', '用户列表']"></Crumbs>
    <el-card>
      <el-row>
        <el-col :span="6">
          <div class="mobile-menu-preview">
            <ul class="menu">
              <li :key="index" v-for="(item, index) in menu.button">
                <a href="">{{ item.name }}</a>
                <div class="sub-menu-box">
                  <ul>
                    <li v-for="(item2,index2) in">1</li>
                    <li>2</li>
                    <li>3</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="6">2</el-col>
      </el-row>
    </el-card>
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
            name: '菜单三',
            key: 'V1001_TODAY_MUSIC'
          }
        ]
      }
    }
  }
}
</script>
<style lang="less">
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
.mobile-menu-preview {
  display: block;
  float: left;
  position: relative;
  width: 317px;
  height: 550px;
  background: transparent url(~@/assets/images/mobile_header_bg.png) no-repeat 0
    0;
  background-position: 0 0;
  border: 1px solid #e7e7eb;
}
.menu {
  position: absolute;
  display: flex;
  height: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e7e7eb;
  background: transparent url(~@/assets/images/mobile_footer_bg.png) no-repeat 0
    0;
  background-position: 0 0;
  background-repeat: no-repeat;
  padding-left: 43px;
  margin: 0;
  cursor: pointer;
}
.menu li {
  border: 1px solid #777;
  height: 50px;
  line-height: 50px;
  flex: 1;
  text-align: center;
  position: relative;
}
.sub-menu-box {
  position: absolute;
  bottom: 60px;
  width: 100%;
}
</style>
