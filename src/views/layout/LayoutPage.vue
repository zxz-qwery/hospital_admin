
<script setup>
import {
  TrendCharts,
  User,
  OfficeBuilding,
  Avatar,
  Calendar,
  List,
  Rank,
  Bell,
  Setting,
  Fold,
  Expand,
  ArrowDown,
} from "@element-plus/icons-vue";
import { ref } from "vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/index";
import { computed } from "vue";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
// 侧边栏折叠状态
const isCollapse = ref(false);

const breadcrumbList = computed(() => {
  return route.matched.filter((item) => item.meta && item.meta.title);
});
// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};
const handleCommand = (command) => {
  if (command === "logout") {
    userStore.removeToken();
    ElMessage.success("退出成功");
    router.push("/login");
  }
};
</script>

<template>
  <el-container class="main">
    <!-- 侧边栏 -->
    <el-aside class="aside">
      <!-- 系统标题 -->
      <div class="sidebar-header">医院预约系统管理</div>
      <el-menu
        class="sidebar-menu"
        :default-active="$route.path"
        router
        background-color="#ffffff"
        text-color="#606266"
        active-text-color="#409EFF"
        :collapse-transition="false"
      >
        <el-menu-item index="/data">
          <el-icon><Rank /></el-icon>
          <span>首页展示</span>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/departments">
          <el-icon><OfficeBuilding /></el-icon>
          <span>科室管理</span>
        </el-menu-item>

        <el-menu-item index="/doctors">
          <el-icon><Avatar /></el-icon>
          <span>医生管理</span>
        </el-menu-item>

        <el-menu-item index="/schedules">
          <el-icon><Calendar /></el-icon>
          <span>排班管理</span>
        </el-menu-item>

        <el-menu-item index="/appointments">
          <el-icon><List /></el-icon>
          <span>预约管理</span>
        </el-menu-item>

        <el-menu-item index="/medicalRecord">
          <el-icon><Bell /></el-icon>
          <span>就诊记录</span>
        </el-menu-item>

        <el-menu-item index="/announcement">
          <el-icon><Setting /></el-icon>
          <span>公告模块</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <!-- 左侧菜单按钮（移动端/PC端折叠侧边栏） -->
        <div class="header-left">
          <el-icon class="menu-icon" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 右侧用户信息下拉 -->
        <div class="header-right">
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <span class="user-info">
              <el-icon class="arrow-icon"><Avatar /></el-icon>
              <span class="username">系统管理员</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">账号设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main><TagsView></TagsView><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .sidebar-header {
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-weight: 500;
    font-size: 18px;
  }
  .aside {
    height: 100%;
    width: 240px;
    background: #79a9f2;
    display: flex;
    flex-direction: column;
    .el-menu {
      flex: 1;
      width: 100%;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #79a9f2;
  }
  .el-main {
    padding: 0 30px 10px 30px;
    background: #f1f5fb;
  }
  .arrow-icon {
    margin: 5px;
  }
}
</style>