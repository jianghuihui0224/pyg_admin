<template>
  <div class="login_container">
    <div class="box">
      <img src="../assets/images/logo.png" alt>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user-fill" placeholder="请输入您的用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="iconfont icon-key" placeholder="请输入您的密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button>重置</el-button>
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        //{data: {data, meta}}来自valid
        const {data: {data, meta}} = await this.$http.post('login', this.form)
        if (meta.status !== 200) {
          this.$message.error(meta.msg);
        }
        sessionStorage.setItem('token', data.token)
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style scoped>
.login_container {
  height: 100%;
  background: linear-gradient(45deg, #eee, rgb(5, 116, 150));
}
.box {
  width: 400px;
  height: 250px;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  background: linear-gradient(45deg, rgb(159, 233, 247), #eee);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  padding: 0 20px;
  box-sizing: border-box;
}
.box img {
  display: block;
  margin: 10px auto;
}
</style>
