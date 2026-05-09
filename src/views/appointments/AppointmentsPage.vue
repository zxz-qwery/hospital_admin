<script setup>
import CardPage from "@/components/CardPage.vue";
import { getDepartments } from "@/api/departments";
import {
  Search,
  RefreshLeft,
  Edit,
  Delete,
  Timer,
} from "@element-plus/icons-vue";
import { ref } from "vue";
import { getAppointments, deleteAppointment } from "@/api/appointments";
import { formatTime } from "@/utils/format";

const params = ref({
  real_name: "",
  name: "",
  department_id: "",
  status: "",
  start_date: "",
  end_date: "",
});

const tableData = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(6);

const getList = async () => {
  const res = await getAppointments({
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
const search = async () => {
  const res = await getAppointments(params.value);
  tableData.value = res.data.list;
};
const reset = () => {
  params.value = {
    user_id: "",
    doctor_id: "",
    department_id: "",
    status: "",
    start_date: "",
    end_date: "",
  };
  search();
};

const del = async (id) => {
  await ElMessageBox.confirm("你确定要删除吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  const res = await deleteAppointment(id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};
// 状态对应颜色
const getStatusType = (status) => {
  switch (status) {
    case "已预约":
      return "primary"; // 蓝色
    case "已完成":
      return "success"; // 绿色
    case "已取消":
      return "danger"; // 红色
    default:
      return "info"; // 灰色
  }
};
</script>

<template>
  <CardPage title="医生管理">
    <el-form inline>
      <!-- 患者/姓名/ID 搜索 -->
      <el-form-item label="患者">
        <el-input
          placeholder="姓名"
          v-model="params.real_name"
          style="width: 160px"
        ></el-input>
      </el-form-item>

      <!-- 医生/医生姓名 搜索 -->
      <el-form-item label="医生">
        <el-input
          placeholder="医生姓名"
          v-model="params.name"
          style="width: 160px"
        ></el-input>
      </el-form-item>

      <!-- 科室下拉 -->
      <el-form-item label="科室">
        <el-select
          style="width: 160px"
          v-model="params.department_id"
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

      <!-- 状态下拉 -->
      <el-form-item label="状态">
        <el-select
          v-model="params.status"
          placeholder="全部"
          style="width: 160px"
          clearable
        >
          <el-option label="全部" value="" />
          <el-option label="已预约" value="0" />
          <el-option label="就诊中" value="1" />
          <el-option label="已取消" value="2" />
        </el-select>
      </el-form-item>

      <!-- 日期范围 -->
      <el-form-item label="日期">
        <el-date-picker
          v-model="params.start_date"
          v-model:end="params.end_date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 260px"
        />
      </el-form-item>

      <!-- 搜索/重置 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">
          <el-icon class="icon"><Search /></el-icon>搜索
        </el-button>
        <el-button @click="reset">
          <el-icon class="icon"><RefreshLeft /></el-icon>重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="ID" width="120"></el-table-column>
      <el-table-column prop="user.real_name" label="患者"></el-table-column>
      <el-table-column prop="doctor.name" label="医生"></el-table-column>
      <el-table-column
        prop="doctor.department.description"
        label="科室"
      ></el-table-column>
      <el-table-column
        prop="schedule.schedule_date"
        label="预约日期"
      ></el-table-column>
      <el-table-column
        prop="schedule.time_period"
        label="时段"
      ></el-table-column>
      <el-table-column
        prop="schedule.current_number"
        label="排队号"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon style="font-size: 18px"><Timer /></el-icon>
            <span style="margin-left: 8px">{{
              formatTime(scope.row.created_at)
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <!-- row就是tableData中的每一项 $index下标 -->
        <template #default="{ row }">
          <el-button @click="edit(row)" type="primary" :icon="Edit" plain
            >详情</el-button
          >
          <el-button @click="del(row.id)" type="danger" plain :icon="Delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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