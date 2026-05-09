<script setup>
import { ref } from "vue";
import { addDepartment, updateDepartment } from "@/api/departments";
import { Plus } from "@element-plus/icons-vue";
import { getDepartments } from "@/api/departments";
import { getAvatarUrl } from "@/utils/geturl";
import { addDoctor, updateDoctor, uploadMovieCover } from "@/api/doctors";
const drawer = ref(false);
const form = ref();
const formModel = ref({
  name: "",
  department_id: null,
  title: "",
  avatar: "",
  introduction: "",
});
const rules = {
  name: [
    { required: true, message: "请输入医生姓名", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
  department_id: [{ required: true, message: "请选择科室", trigger: "change" }],
  title: [{ required: true, message: "请输入职称", trigger: "blur" }],
  introduction: [
    { required: true, message: "请输入医生简介", trigger: "blur" },
  ],
};
// 组件对外暴露一个open()方法 => 基于传递的参数判断是编辑还是添加
const open = (obj) => {
  drawer.value = true;
  console.log(obj);

  formModel.value = { ...obj };
};
const deptList = ref([]);

const getDeptList = async () => {
  const res = await getDepartments();
  deptList.value = res.data.list;
};
getDeptList();

const previewUrl = ref("");

const onAvatarChange = async (uploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  // 1️⃣ 本地预览
  previewUrl.value = URL.createObjectURL(file);

  // 2️⃣ 上传
  const fd = new FormData();
  fd.append("file", file);

  const res = await uploadMovieCover(fd);

  // 3️⃣ 存数据库字段（改这里）
  formModel.value.avatar = res.data.url;

  ElMessage.success("头像上传成功");
};
//子传父，通知父组件重新获取数据，重而刷新页面
const emit = defineEmits(["success"]);
const submit = async () => {
  await form.value.validate();
  if (formModel.value.id) {
    const res = await updateDoctor(formModel.value.id, formModel.value);
    ElMessage.success(res.message);
  } else {
    const res = await addDoctor(formModel.value);
    ElMessage.success(res.message);
  }

  drawer.value = false;
  emit("success");
};
//open()方法对外暴露
defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    :title="formModel.id ? '修改医生' : '添加医生'"
    v-model="drawer"
    size="40%"
  >
    <el-form label-width="120" :model="formModel" :rules="rules" ref="form">
      <el-form-item label="医生姓名" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>

      <el-form-item label="科室" prop="department_id">
        <el-select v-model="formModel.department_id">
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onAvatarChange"
        >
          <img
            v-if="previewUrl || formModel.poster"
            :src="previewUrl || getAvatarUrl(formModel.poster)"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon i"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-input v-model="formModel.title" />
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input type="textarea" v-model="formModel.introduction" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang='less' scoped>
.avatar-uploader {
  width: 130px;
  height: 130px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  .i {
    width: 130px;
    height: 130px;
  }
}

.avatar-uploader:hover {
  border: 1px dashed #dcdcdc;
}
</style>