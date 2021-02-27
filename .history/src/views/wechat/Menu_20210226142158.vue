<template>
  <div>
    <Crumbs :crumbs-name="['用户', '用户列表']"></Crumbs>
    <el-card>
      <el-row>
        <el-col :span="6">
          <div class="mobile-menu-preview"></div>
          <ul class="menu-list" id="menu-list">
    
    <li id="menu-0" class="menu-item current" data-type="view" data-key="" data-name="个人中心" data-url="" data-appid="" data-pagepath="" draggable="false">
        <a href="javascript:;" class="menu-link" draggable="false">个人中心</a>

        <div class="sub-menu-box" style="display: block;">
            <ul class="sub-menu-list">
                
                <li class="add-sub-item"><a href="javascript:;" title="添加子菜单" draggable="false"><span class=" "><i class="weixin-icon add-gray"></i></span></a></li>
            </ul>
            <i class="arrow arrow-out"></i> <i class="arrow arrow-in"></i>
        </div>
    </li>
    
    
    <li id="menu-1" class="menu-item" data-type="click" data-key="" data-name="绑定验证码" data-url="" data-appid="" data-pagepath="" draggable="false" style="">
        <a href="javascript:;" class="menu-link" draggable="false">
            <i class="icon-menu-dot"></i> <i class="weixin-icon sort-gray"></i> <span class="title">绑定验证码</span>
        </a>

        <div class="sub-menu-box" style="display: none;">
            <ul class="sub-menu-list">
                
                <li class="add-sub-item"><a href="javascript:;" title="添加子菜单" draggable="false"><span class=" "><i class="weixin-icon add-gray"></i></span></a></li>
            </ul>
            <i class="arrow arrow-out"></i> <i class="arrow arrow-in"></i>
        </div>
    </li>
    
    
    <li id="menu-2" class="menu-item" data-type="" data-key="" data-name="我的角色" data-url="" data-appid="" data-pagepath="" draggable="false">
        <a href="javascript:;" class="menu-link" draggable="false">我的角色</a>

        <div class="sub-menu-box" style="display: none;">
            <ul class="sub-menu-list">
                
                    
                    
                    <li id="sub-menu-0" class="sub-menu-item" data-type="click" data-key="" data-name="添加子菜单" data-url="" data-appid="" data-pagepath=""><a href="javascript:;" draggable="false"> <i class="weixin-icon sort-gray"></i><span class="sub-title">添加子菜单</span></a></li>
                    
                
                <li class="add-sub-item"><a href="javascript:;" title="添加子菜单" draggable="false"><span class=" "><i class="weixin-icon add-gray"></i></span></a></li>
            </ul>
            <i class="arrow arrow-out"></i> <i class="arrow arrow-in"></i>
        </div>
    </li>
    
    <li class="add-item extra" id="add-item">
        <a href="javascript:;" class="menu-link" title="添加菜单"><i class="weixin-icon add-gray"></i></a>
    </li>
                            </ul>
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
</style>
