<template>
  <div class="login-container">
    <!-- 背景光斑 -->
    <div class="bg-circle circle1"></div>
    <div class="bg-circle circle2"></div>

    <div class="login-wrapper">
      <!-- 左侧系统介绍 -->
      <div class="login-left">
        <div class="system-logo">
          <el-icon size="32"><Plus /></el-icon>
        </div>

        <h1 class="system-title">医院预约挂号</h1>
        <p class="system-subtitle">后台管理中心</p>

        <ul class="system-features">
          <li>✔ 科室医生管理，排班管理</li>
          <li>✔ 预约订单、就诊记录管理</li>
          <li>✔ 患者信息统一管理</li>
          <li>✔ 数据统计与智能分析</li>
        </ul>

        <div class="system-footer">智慧医疗 · 高效管理 · 安全可靠</div>
      </div>

      <!-- 右侧登录 -->
      <div class="login-right">
        <div class="login-card">
          <h2 class="login-title">管理员登录</h2>
          <p class="login-desc">Hospital Appointment Admin</p>

          <el-form
            :model="loginForm"
            :rules="rules"
            ref="formRef"
            label-position="top"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-button type="primary" class="login-btn" @click="handleLogin">
              登 录
            </el-button>
          </el-form>

          <div class="login-footer">© 2026 医院预约挂号系统</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { adminLogin } from "@/api/user";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/index.js";

const router = useRouter();
const userStore = useUserStore();

const formRef = ref();

const loginForm = ref({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  await formRef.value.validate();
  const res = await adminLogin(loginForm.value);
  if (res.code === 200) {
    ElMessage.success(res.message);
    userStore.setToken(res.token);
    router.push("/");
  } else {
    ElMessage.error(res.message);
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f4c81, #1e88e5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 光斑背景 */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.circle1 {
  width: 400px;
  height: 400px;
  background: #4fc3f7;
  top: -100px;
  left: -100px;
}

.circle2 {
  width: 300px;
  height: 300px;
  background: #90caf9;
  bottom: -100px;
  right: -50px;
}

/* 主体 */
.login-wrapper {
  width: 1000px;
  height: 520px;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

/* 左侧 */
.login-left {
  flex: 1;
  padding: 60px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.system-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.system-title {
  font-size: 32px;
  font-weight: bold;
}

.system-subtitle {
  margin-top: 6px;
  opacity: 0.8;
}

.system-features {
  margin-top: 30px;
  line-height: 32px;
}

.system-footer {
  margin-top: 40px;
  font-size: 14px;
  opacity: 0.7;
}

/* 右侧 */
.login-right {
  width: 380px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 登录卡片 */
.login-card {
  width: 280px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 5px;
}

.login-desc {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  height: 40px;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-top: 20px;
}
</style>