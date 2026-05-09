<script setup>
import { ref } from "vue";
import { addAnnouncement, updateAnnouncement } from "@/api/announcement.js";
const dialogVisible = ref(false);
const formModel = ref({
  title: "",
  content: "",
});
const rules = ref({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
});
const form = ref(null);

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
    res = await updateAnnouncement(formModel.value.id, formModel.value);
  } else {
    res = await addAnnouncement(formModel.value);
  }

  ElMessage.success(res.message);

  dialogVisible.value = false;
  emit("success");
};
defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '修改公告' : '添加公告'"
  >
    <el-form :model="formModel" :rules="rules" ref="form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formModel.title" />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="formModel.content" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>


<style>
</style>