<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <el-button icon="iconfont icon-hanbaobao" circle size="mini" class="fold" @click="fold()"></el-button>
      <span>品优购后台管理系统</span>
      <el-button type="danger" round size="mini" class="logout" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏列表 -->
      <el-aside :width="collapse? '65px': '180px'" class="home_aside">
        <!-- :default-active="$route.name"绑定页面选中项,刷新页面也还是显示选中的选项页,name值是定义该路由时定义的name属性值 -->
        <el-menu
          :default-active="$route.name"
          :router='true'
          :unique-opened='true'
          :collapse-transition="false"
          :collapse="collapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="home_menu"
        >
          <el-submenu :index="item.path+''" v-for="(item, i) in list" :key="i">
            <template slot="title">
              <i :class="['iconfont', icons[i]]"></i>
              <span>&nbsp;{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+val.path+''" v-for="(val, k) in item.children" :key="k">
              <i class="el-icon-menu"></i>
              <span>{{val.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      collapse: false,
      list: [],
      icons: [
        'icon-user-fill',
        'icon-zhanghaoquanxianguanli',
        'icon-shangpinguanli',
        'icon-dingdanguanli',
        'icon-shujutongji'
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    fold() {
      this.collapse = !this.collapse;
    },
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("login");
    },
    async getList() {
      // this.$http.get("menus")
      //   .then(res => {
      //     console.log(res.data.data);
      //     this.list = res.data.data;
      //   })
      //   .catch(err => console.log(err));
      const {data: {data, meta}} = await this.$http.get("menus");
      if (meta.status !== 200) return this.$message.error('获取列表失败');
      this.list = data;
    }
  }
};
</script>

<style scoped>
.home_container {
  height: 100%;
}
.home_header {
  background-color: #373d41;
  line-height: 60px;
}
.fold {
  border: none;
}
.home_header span {
  font-size: 20px;
  color: #eee;
  margin-left: 20px;
}
.logout {
  float: right;
  margin-top: 15px;
}
.home_aside {
  height: 100%;
  background: #333744;
}
.home_menu {
  border: none;
  margin-top: 5px;
}
/* .home_main {
  text-align: center;
  font-size: 24px;
  background-color: #eee;
} */

</style>