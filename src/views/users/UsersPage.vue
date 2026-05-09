<script setup>
import { Search, RefreshLeft, Edit, Delete } from "@element-plus/icons-vue";
import { getUsers, resetPassword, deleteUser } from "@/api/user";
import CardPage from "@/components/CardPage.vue";
import { ref } from "vue";

const tableData = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(6);
const getList = async () => {
  const res = await getUsers({
    page: page.value,
    pageSize: pageSize.value,
  });
  tableData.value = res.data.list;
  total.value = res.data.total;
};
getList();

const paramsData = ref({
  username: "",
  real_name: "",
  phone: "",
});

const search = async () => {
  const res = await getUsers(paramsData.value);
  tableData.value = res.data.list;
};
const reset = () => {
  paramsData.value = {
    username: "",
    real_name: "",
    phone: "",
  };
  getList();
};

const dialogVisible = ref(false);
const form = ref();
const oldpwd = ref("");
const password = ref("");
const currentId = ref(null);

const changePwd = (row) => {
  dialogVisible.value = true;
  oldpwd.value = row.password;
  currentId.value = row.id;
};
const submit = async () => {
  await form.value.validate();
  const res = await resetPassword(currentId.value, {
    password: password.value,
  });
  if (res.code === 200) {
    ElMessage.success("重置成功");
    dialogVisible.value = false;
    password.value = "";
  }
};
const del = async (row) => {
  await ElMessageBox.confirm("你确定要删除吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  const res = await deleteUser(row.id);
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  }
};
</script>

<template>
  <CardPage title="用户管理">
    <template #button>
      <el-button type="primary">注册用户</el-button>
    </template>
    <el-form inline>
      <el-form-item label="用户名">
        <el-input
          placeholder="请输入用户名"
          v-model="paramsData.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input
          placeholder="请输入昵称"
          v-model="paramsData.real_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          placeholder="请输入手机号"
          v-model="paramsData.phone"
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="real_name" label="昵称"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="birthday" label="出生日期"></el-table-column>
      <el-table-column label="操作" width="240">
        <!-- row就是tableData中的每一项 $index下标 -->
        <template #default="{ row }">
          <el-button @click="changePwd(row)" type="primary" :icon="Edit" plain
            >重置密码</el-button
          >
          <el-button @click="del(row)" type="danger" :icon="Delete" plain
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="重置密码" width="420">
      <el-form ref="form">
        <el-form-item label="原密码">
          <el-input v-model="oldpwd" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input placeholder="请输入密码" v-model="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
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

<style lang="less" scoped>
.icon {
  margin-right: 4px;
}
</style>