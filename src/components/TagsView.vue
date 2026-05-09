<template>
  <div class="tags-wrap">
    <!-- 左滚动按钮 -->
    <div class="scroll-btn left" @click="scrollLeft">
      <el-icon><ArrowLeft /></el-icon>
    </div>

    <!-- 标签容器 -->
    <div class="tags" ref="tagsRef">
      <el-tag
        v-for="tag in tags"
        :key="tag.path"
        :closable="tag.path !== '/'"
        :effect="isActive(tag.path) ? 'dark' : 'plain'"
        @click="go(tag.path)"
        @close="close(tag.path)"
        class="tag-item"
      >
        {{ tag.title }}
      </el-tag>
    </div>

    <!-- 右滚动按钮 -->
    <div class="scroll-btn right" @click="scrollRight">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { useTagsStore } from "@/stores/index.js";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch, nextTick } from "vue";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const tagsStore = useTagsStore();
const tagsRef = ref(null);

const tags = computed(() => tagsStore.tags);

// 激活判断
const isActive = (path) => route.path === path;

// 跳转页面
const go = (path) => {
  router.push(path);
};

// 关闭标签【优化版】
const close = (path) => {
  tagsStore.removeTag(path);

  // 如果关闭的是当前页面
  if (route.path === path) {
    const list = tagsStore.tags;
    // 优先跳上一个，没有再跳最后一个
    const nowIndex = list.findIndex((item) => item.path === path);
    const targetTag = list[nowIndex - 1] || list[list.length - 1];
    if (targetTag) router.push(targetTag.path);
  }
};

// 监听路由自动添加标签（关键：自动新增页面标签）
watch(
  () => route.path,
  (newPath) => {
    if (!tagsStore.tags.some((item) => item.path === newPath)) {
      tagsStore.addTag({
        path: newPath,
        title: route.meta.title || "未知页面",
      });
    }
    // 每次切换自动滚动到当前标签
    nextTick(() => {
      scrollToActiveTag();
    });
  },
  { immediate: true }
);

// 滚动相关方法
const scrollLeft = () => {
  tagsRef.value.scrollLeft -= 150;
};
const scrollRight = () => {
  tagsRef.value.scrollLeft += 150;
};
// 自动滚动到当前选中标签
const scrollToActiveTag = () => {
  const activeDom = tagsRef.value.querySelector(".el-tag--dark");
  if (activeDom) {
    activeDom.scrollIntoView({ behavior: "smooth", inline: "center" });
  }
};
</script>

<style scoped lang="less">
.tags-wrap {
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0 24px;

  .scroll-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    z-index: 2;
    user-select: none;

    &.left {
      margin-right: 6px;
    }
    &.right {
      margin-left: 6px;
    }
    &:hover {
      background: #f5f7fa;
    }
  }

  .tags {
    flex: 1;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(6px);
    border-radius: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
      height: 0;
    }
  }

  .tag-item {
    margin-right: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
}
</style>