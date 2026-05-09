<script setup>
import { ref } from "vue";
import { addSchedule, updateSchedule } from "@/api/schedule.js";
import { getDoctors } from "@/api/doctors.js";
const dialogVisible = ref(false); // 控制弹窗显示隐藏

const form = ref();
const formModel = ref({
  doctor_id: "",
  schedule_date: "",
  time_period: "",
  max_number: 20,
});

const formRef = ref(null);
const doctorList = ref([]);
const getList = async () => {
  const res = await getDoctors();
  doctorList.value = res.data.list;
};
getList();

const rules = ref({
  doctor_id: [{ required: true, message: "请选择医生", trigger: "change" }],
  schedule_date: [{ required: true, message: "请选择日期", trigger: "change" }],
  time_period: [{ required: true, message: "请选择时间段", trigger: "change" }],
  max_number: [{ required: true, message: "请输入号源数量", trigger: "blur" }],
});

// 组件对外暴露一个open()方法 => 基于传递的参数判断是编辑还是添加
const open = (obj) => {
  dialogVisible.value = true;
  console.log(obj);

  formModel.value = { ...obj };
};
//子传父，通知父组件重新获取数据，重而刷新页面
const emit = defineEmits(["success"]);
const submit = async () => {
  await form.value.validate();

  let res;

  if (formModel.value.id) {
    res = await updateSchedule(formModel.value.id, formModel.value);
  } else {
    res = await addSchedule(formModel.value);
  }

  ElMessage.success(res.message); // ✅ 修正

  dialogVisible.value = false;
  emit("success");
};
//open()方法对外暴露
defineExpose({
  open,
});
</script>
<template>
  <!-- 直接改成 el-dialog ，风格和科室弹窗完全一致 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '修改排班' : '添加排班'"
    width="500px"
  >
    <el-form ref="form" :model="formModel" :rules="rules" label-width="120px">
      <!-- 选择医生 -->
      <el-form-item label="选择医生" prop="doctor_id">
        <el-select
          v-model="formModel.doctor_id"
          placeholder="请选择医生"
          style="width: 100%"
        >
          <el-option
            v-for="item in doctorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <!-- 选择日期 -->
      <el-form-item label="选择日期" prop="schedule_date">
        <el-date-picker
          v-model="formModel.schedule_date"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 选择时间段 -->
      <el-form-item label="时间段" prop="time_period">
        <el-select
          v-model="formModel.time_period"
          placeholder="请选择时间段"
          style="width: 100%"
        >
          <el-option label="上午" value="上午" />
          <el-option label="下午" value="下午" />
        </el-select>
      </el-form-item>

      <!-- 号源数量 -->
      <el-form-item label="号源数量" prop="max_number">
        <el-input-number
          v-model="formModel.max_number"
          :min="1"
          :max="100"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>