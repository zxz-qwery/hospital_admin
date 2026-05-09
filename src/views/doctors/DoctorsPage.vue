<script setup>
import { getDoctors } from "@/api/doctors";
import { Search, RefreshLeft, Edit, Delete } from "@element-plus/icons-vue";
import { getDepartments } from "@/api/departments";
import { deleteDoctor } from "@/api/doctors";
import CardPage from "@/components/CardPage.vue";
import { ref } from "vue";
import DialogPage from "@/views/doctors/DialogPage.vue";

const tableData = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(6);

const getAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return "http://127.0.0.1:8000" + url;
};

const getList = async () => {
  const res = await getDoctors({
    page: page.value,
    pageSize: pageSize.value,
  });
  tableData.value = res.data.list;
  total.value = res.data.total;
};
getList();
const deptList = ref([]);
const getDeptList = async () => {
  const res = await getDepartments();
  deptList.value = res.data.list;
};
getDeptList();

const paramsData = ref({
  name: "",
  department_id: null,
});

const search = async () => {
  const res = await getDoctors(paramsData.value);
  tableData.value = res.data.list;
};
const reset = () => {
  paramsData.value = {
    name: "",
    department_id: null,
  };
  search();
};
const dialog = ref();
const add = () => {
  dialog.value.open({});
};
//编辑
const edit = (row) => {
  dialog.value.open(row);
};

const del = async (id) => {
  await ElMessageBox.confirm("你确定要删除吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  const res = await deleteDoctor(id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};

//重新获取数据，刷新页面
const onSuccess = () => getList();
</script>

<template>
  <CardPage title="医生管理">
    <template #button>
      <el-button @click="add" type="primary">添加医生</el-button>
    </template>
    <el-form inline>
      <el-form-item label="医生名称">
        <el-input
          placeholder="请输入科室名称"
          v-model="paramsData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="科室">
        <el-select
          style="width: 160px"
          v-model="paramsData.department_id"
          placeholder="请选择科室"
          clearable
        >
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <el-avatar :size="40" :src="getAvatarUrl(row.avatar)" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="title" label="职称"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="introduction" label="科室"></el-table-column>
      <el-table-column label="操作" width="240">
        <!-- row就是tableData中的每一项 $index下标 -->
        <template #default="{ row }">
          <el-button @click="edit(row)" type="primary" :icon="Edit" plain
            >修改医生</el-button
          >
          <el-button @click="del(row.id)" type="danger" :icon="Delete" plain
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