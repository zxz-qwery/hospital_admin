<script setup>
defineProps({
  title: String,
});
</script>

<template>
  <el-card class="card-page">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <slot name="button"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style scoped lang="less">
.card-page {
  width: 100%;
  height: 88%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>