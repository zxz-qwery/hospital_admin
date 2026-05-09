<script setup>
import { ref } from "vue";
import { addDepartment, updateDepartment } from "@/api/departments";
const dialogVisible = ref(false);
const form = ref();
const formModel = ref({
  name: "",
  description: "",
});
const rules = {
  name: [{ required: true, message: "请输入科室名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入科室详情", trigger: "blur" }],
};
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
  if (formModel.value.id) {
    const res = await updateDepartment(formModel.value.id, formModel.value);
    ElMessage.success(res.message);
  } else {
    const res = await addDepartment(formModel.value);
    ElMessage.success(res.message);
  }

  dialogVisible.value = false;
  emit("success");
};
//open()方法对外暴露
defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '修改科室' : '添加科室'"
  >
    <el-form ref="form" :model="formModel" :rules="rules">
      <el-form-item label="科室名称">
        <el-input
          placeholder="请输入科室名称"
          v-model="formModel.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="科室简介">
        <el-input
          placeholder="请输入科室简介"
          v-model="formModel.description"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
</style>