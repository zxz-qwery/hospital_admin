<script setup>
import CardPage from "@/components/CardPage.vue";
import { ref } from "vue";
import { getAnnouncements, deleteAnnouncement } from "@/api/announcement";
import DialogPage from "@/views/announcement/DialogPage.vue";

// 数据
const tableData = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);

const getList = async () => {
  const res = await getAnnouncements({
    page: page.value,
  });

  tableData.value = res.data.data;
  total.value = res.data.total;
};
getList();
const handlePageChange = (val) => {
  page.value = val;
  getList();
};

const dialog = ref();
const add = () => {
  dialog.value.open({});
};
//编辑
const edit = (row) => {
  dialog.value.open(row);
};
//重新获取数据，刷新页面
const onSuccess = () => getList();
const del = async (id) => {
  await ElMessageBox.confirm("你确定要删除吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  const res = await deleteAnnouncement(id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};
</script>

<template>
  <CardPage title="公告模块">
    <template #button>
      <el-button @click="add" type="primary">添加公告</el-button>
    </template>
    <el-table :data="tableData">
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="created_at" label="时间"></el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain type="primary" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button plain type="danger" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handlePageChange"
      :background="true"
      style="justify-content: flex-end; margin-top: 20px"
    />
    <DialogPage ref="dialog" @success="onSuccess"></DialogPage>
  </CardPage>
</template>

<style>
</style>