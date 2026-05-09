<script setup>
import CardPage from "@/components/CardPage.vue";
import { ref } from "vue";
import { getSchedules, deleteSchedule } from "@/api/schedule";
import DialogPage from "@/views/schedules/DialogPage.vue";
const tableData = ref([]);
const page = ref(1);
const limit = ref(8);
const total = ref(0);
const getList = async () => {
  const res = await getSchedules({
    page: page.value,
    limit: limit.value,
  });

  tableData.value = res.data.data;
  total.value = res.data.total;
};
getList();

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
  const res = await deleteSchedule(id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};
//重新获取数据，刷新页面
const onSuccess = () => getList();

const handlePageChange = (val) => {
  page.value = val;
  getList();
};
</script>

<template>
  <CardPage title="用户管理">
    <template #button>
      <el-button @click="add" type="primary">新增排班</el-button>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="ID" width="80" />

      <!-- 医生 -->
      <el-table-column label="医生">
        <template #default="scope">
          {{ scope.row.doctor?.name }}
        </template>
      </el-table-column>

      <!-- 日期 -->
      <el-table-column prop="schedule_date" label="日期" />

      <!-- 时间段 -->
      <el-table-column prop="time_period" label="时间段" />

      <!-- 最大号源 -->
      <el-table-column prop="max_number" label="最大号源" />

      <!-- 已预约 -->
      <el-table-column prop="current_number" label="已预约" />

      <!-- 剩余号源（重点🔥） -->
      <el-table-column label="剩余号源">
        <template #default="scope">
          {{ scope.row.max_number - scope.row.current_number }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" plain @click="edit(scope.row)">
            修改
          </el-button>
          <el-button type="danger" plain @click="del(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <DialogPage ref="dialog" @success="onSuccess"></DialogPage>
    <!-- 分页 -->
    <el-pagination
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handlePageChange"
      :background="true"
      style="justify-content: flex-end; margin-top: 20px"
    />
  </CardPage>
</template>

<style>
</style>