<script setup>
import CardPage from "@/components/CardPage.vue";
import { ref, onMounted } from "vue";
import { getRecords, addRecord, deleteRecord } from "@/api/medicalRecord";
import { getUsers } from "@/api/user";
import { getDoctors } from "@/api/doctors";

const tableData = ref([]);
const dialogVisible = ref(false);

const form = ref(null);
const formModel = ref({
  user_id: "",
  doctor_id: "",
  diagnosis: "",
  treatment: "",
});
const rules = ref({
  user_id: [{ required: true, message: "请选择患者", trigger: "change" }],
  doctor_id: [{ required: true, message: "请选择医生", trigger: "change" }],
  diagnosis: [
    { required: true, message: "请输入诊断内容", trigger: "blur" },
    { min: 2, message: "诊断内容至少2个字符", trigger: "blur" },
  ],
  treatment: [
    { required: true, message: "请输入治疗方案", trigger: "blur" },
    { min: 2, message: "治疗方案至少2个字符", trigger: "blur" },
  ],
});

const userList = ref([]);
const doctorList = ref([]);

const getUserList = async () => {
  const res = await getUsers();
  userList.value = res.data.list;
};
const getDoctorList = async () => {
  const res = await getDoctors();
  doctorList.value = res.data.list;
};
const getList = async () => {
  const res = await getRecords();
  tableData.value = res.data.data;
};

onMounted(() => {
  getList();
  getUserList();
  getDoctorList();
});

const add = () => {
  dialogVisible.value = true;
};

const submit = async () => {
  await form.value.validate();
  const res = await addRecord(formModel.value);

  ElMessage.success(res.message);
  dialogVisible.value = false;
  getList();
};

const handleDelete = async (id) => {
  await ElMessageBox.confirm("你确定要删除吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await deleteRecord(id);
  ElMessage.success("删除成功");
  getList();
};
</script>

<template>
  <CardPage title="就诊记录">
    <template #button>
      <el-button @click="add" type="primary">新增就诊记录</el-button>
    </template>
    <el-table :data="tableData">
      <el-table-column prop="user.real_name" label="用户"></el-table-column>
      <el-table-column prop="doctor.name" label="医生"></el-table-column>
      <el-table-column prop="diagnosis" label="诊断"></el-table-column>
      <el-table-column prop="treatment" label="治疗"></el-table-column>
      <el-table-column prop="created_at" label="时间"></el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" plain @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="添加就诊记录">
      <el-form :model="formModel" :rules="rules" ref="form" label-width="80">
        <el-form-item label="用户ID" prop="user_id">
          <el-select v-model="formModel.user_id">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.real_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="医生ID" prop="doctor_id">
          <el-select v-model="formModel.doctor_id">
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="诊断" prop="diagnosis">
          <el-input type="textarea" v-model="formModel.diagnosis" />
        </el-form-item>

        <el-form-item label="治疗" prop="treatment">
          <el-input type="textarea" v-model="formModel.treatment" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </CardPage>
</template>

<style>
</style>