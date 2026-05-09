<script setup>
import { getDepartments, deleteDepartment } from "@/api/departments";
import { Search, RefreshLeft, Edit, Delete } from "@element-plus/icons-vue";
import CardPage from "@/components/CardPage.vue";
import DialogPage from "@/views/departments/DialogPage.vue";
import { ref } from "vue";

const tableData = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(6);

const getList = async () => {
  const res = await getDepartments({
    page: page.value,
    pageSize: pageSize.value,
  });
  tableData.value = res.data.list;
  total.value = res.data.total;
};
getList();

const paramsData = ref({
  name: "",
});
const search = async () => {
  const res = await getDepartments(paramsData.value);

  tableData.value = res.data.list;
};
const reset = () => {
  paramsData.value = { name: "" };
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
  const res = await deleteDepartment(id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};
</script>

<template>
  <CardPage title="用户管理">
    <template #button>
      <el-button @click="add" type="primary">添加科室</el-button>
    </template>
    <el-form inline>
      <el-form-item label="科室名称">
        <el-input
          placeholder="请输入科室名称"
          v-model="paramsData.name"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">
          <el-icon class="icon"><Search /></el-icon>搜索</el-button
        >
        <el-button @click="reset">
          <el-icon class="icon"><RefreshLeft /></el-icon>重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="ID" width="120"></el-table-column>
      <el-table-column prop="name" label="科室名称"></el-table-column>
      <el-table-column prop="description" label="科室简介"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <!-- row就是tableData中的每一项 $index下标 -->
        <template #default="{ row }">
          <el-button
            @click="edit(row)"
            type="primary"
            :icon="Edit"
            plain
            style="color: #409eff"
            >修改科室</el-button
          >
          <el-button
            @click="del(row.id)"
            type="danger"
            :icon="Delete"
            plain
            style="color: #f56c6c"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <DialogPage ref="dialog" @success="onSuccess"></DialogPage>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[4, 8, 12, 24]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getList"
      @size-change="getList"
      :background="true"
      style="justify-content: flex-end; margin-top: 20px"
    />
  </CardPage>
</template>


<style>
</style>