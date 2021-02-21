<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!--        <img src="../assets/logo.png" alt />-->
        <div
          class="adminlogo"
          :style="isCollapse ? 'width:64px' : 'width:200px'"
          v-if="!isCollapse"
        >
          电商管理系统
        </div>
        <div
          class="adminlogo"
          :style="isCollapse ? 'width:64px' : 'width:200px'"
          v-if="isCollapse"
        >
          <i class="el-icon-apple"></i>
        </div>
        <i
          :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          @click="toggleCollapse"
        ></i>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '' : '200px'">
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.name"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.name, subItem.title)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :style="isCollapse ? 'margin-left:64px' : 'margin-left:200px'">
        <el-card class="box-card" :body-style="{ padding: 0 }">
          <ul class="nav-tab">
            <li
              :key="index"
              v-for="(item, index) in tags"
              @click="tabRouter(item.router)"
              :style="
                activePath == item.router
                  ? { backgroundColor: '#e8e8e8' }
                  : { backgroundColor: '' }
              "
            >
              {{ item.name
              }}<i class="el-icon-close" @click.stop="closeRouter(index)"></i>
            </li>
          </ul>
        </el-card>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        2: 'iconfont icon-user',
        4: 'iconfont icon-tijikongjian',
        5: 'iconfont icon-shangpin',
        66: 'iconfont icon-danju',
        92: 'iconfont icon-baobiao',
        191: 'iconfont icon-baobiao',
        195: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '', // 当前选项卡url
      tags: []
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    console.log(123, window.sessionStorage.getItem('tags'))
    this.tags = window.sessionStorage.getItem('tags')
      ? window.sessionStorage.getItem('tags')
      : []
  },
  watch: {
    tags: function (newQuestion, oldQuestion) {
      window.sessionStorage.setItem('tags', thi)
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.status !== 200) {
        return this.$message({
          message: res.msg,
          type: 'warning'
        })
      }

      this.menuList = res.data
    },
    // 点击按钮菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath, title) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      var flag = false
      this.tags.forEach((item) => {
        if (item.name === title) {
          flag = true
        }
      })
      if (flag === false) {
        this.tags.push({ name: title, router: activePath })
      }
    },
    tabRouter(router) {
      this.$router.push(router)
      window.sessionStorage.setItem('activePath', router)
      this.activePath = router
    },
    closeRouter(index) {
      if (this.$route.path === this.tags[index].router) {
        if (index !== 0) {
          this.$router.push(this.tags[index - 1].router)
        } else if (this.tags.length > 1) {
          this.$router.push(this.tags[1].router)
        } else {
          this.$router.push('/welcome')
        }
      }
      this.tags.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  position: fixed;
  width: 100%;
  z-index: 9;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    height: 100%;
    span {
      margin-left: 15px;
    }
  }
  img {
    height: 100%;
    width: 200px;
  }
  .adminlogo {
    height: 100%;
    width: 200px;
    line-height: 60px;
    text-align: center;
    overflow: hidden;
  }
}
.el-aside {
  position: fixed;
  height: 100%;
  z-index: 8;
  transform: translateY(60px);
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
  margin-left: 200px;
  margin-top: 60px;
  padding: 0;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}

.nav-tab {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  overflow: hidden;
  height: 40px;
}
.nav-tab li {
  position: relative;
  text-align: center;
  align-self: center;
  cursor: pointer;
  font-size: 13px;
  line-height: 40px;
  padding: 0 20px;
}
.nav-tab li i {
  position: absolute;
  top: 13px;
  right: 3px;
  margin-left: 5px;
  display: none;
}
.nav-tab li:hover {
  background-color: #cacfd3;
}
.nav-tab li:hover i {
  display: inline-block;
  border: 1px solid red;
  border-radius: 10px;
}
</style>
