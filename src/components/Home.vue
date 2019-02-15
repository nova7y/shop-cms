<template>
  <el-container>
    <el-header>
      <div class="header_logo">
        <img src="../assets/logo3.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuShow?'65px':'200px'">
        <div class="fold" @click="menuShow=!menuShow">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :style="menuShow?width='200px':width='65px'"
          :collapse="menuShow"
          :collapse-transition="false"
          :router="true"
          :unique-opened="true"
        >
          <el-submenu :index="index+''" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont ' + menuIcon[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="item2 in item.children" :key="item2.id">
              <el-menu-item :index="item2.path">
                <i class="el-icon-document"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 渲染右侧 内容的 组件容器 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuShow: false,
      menuList: [],
      menuIcon: [
        'icon-users',
        'icon-tijikongjian',
        'icon-shangpin',
        'icon-danju',
        'icon-baobiao'
      ]
    }
  },
  methods: {
    // 获取左侧导航列表
    async getList() {
      var { data: res } = await this.axios.get('/menus/')
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    },
    // 退出登陆
    logout() {
      this.$confirm('是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/')
        })
        .catch(() => {
          this.$message({ type: 'success', message: '取消退出!' })
        })
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="less">
.el-container {
  height: 100%;
  .el-header {
    background: #333744;
    color: #ffffff;
    font-size: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_logo {
      display: flex;
      align-items: center;
      user-select: none;
      img {
        height: 100%;
        margin-right: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-menu {
    border-right: 0;
    i {
      padding-right: 10px;
    }
  }
  .fold {
    text-align: center;
    color: #fff;
    font-size: 12px;
    padding: 5px;
    letter-spacing: 0.2em;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    background: #51656d;
  }
}
</style>
