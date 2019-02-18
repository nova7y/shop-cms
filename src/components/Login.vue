<template>
  <div id="login-container">
    <div id="login_box">
      <div id="login_logo">
        <img src="../assets/logo.png" alt>
      </div>

      <el-form ref="loginForm" :model="form" :rules="rules">
        <el-form-item prop="uName">
          <el-input v-model="form.uName" >
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="uPassWord">
          <el-input v-model="form.uPassWord" type="password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="removeForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        uName: 'admin',
        uPassWord: '123456'
      },
      rules: {
        uName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        uPassWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async verify => {
        // 表单验证，如果通过则请求ajax
        if (!verify) return this.$message.error('请填写账号、密码')
        let { data: res } = await this.axios.post('/login/', {
          username: this.form.uName,
          password: this.form.uPassWord
        })

        // 判断接口返回接口，账号、密码是否正确
        if (res.meta.status !== 200) {
          return this.$message.error('账号或密码不正确')
        }
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    removeForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login_box {
    width: 450px;
    height: 304px;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    #login_logo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      box-shadow: 0 0 15px #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      border: 1px solid #eee;
      background: #fff;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .el-form {
      padding: 25px;
      width: 100%;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
    }
  }
}
</style>
