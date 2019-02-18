<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- input的事件修饰符失效 解决办法：加上.native -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="userParams.query"
            class="input-with-select"
            :clearable="true"
            @keyup.native.enter="getUserData"
            @keyup.native.esc="getUserData('esc')"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="addUserBoxShow=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表内容 表格 -->
      <el-table :data="tableData" border style="width: 100%" :stripe="true">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="email" label="状态" width="60">
          <!-- <el-switch v-model="mg_state"></el-switch>  出现问题-->
          <!-- <span slot-scope="data">{{data.row}}</span>  使用插槽、ui库中的row显示数据 -->
          <el-switch
            v-model="data.row.mg_state"
            slot-scope="data"
            @change="updateUserStatus(data.row.mg_state,data.row.id)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>

          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="success" icon="el-icon-share" size="mini"></el-button>
          </el-tooltip>
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="userInfoShow(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="success" icon="el-icon-share" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userParams.total"
      ></el-pagination>
    </el-card>

    <!-- 弹窗：添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserBoxShow" @close="resetAddForm">
      <el-form label-width="80px" :model="addUserData" :rules="addUserRules" ref="addUserBox">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserBoxShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗：编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editUserBoxShow">
      <el-form label-width="100px" :model="editUserData">
        <el-form-item label="用户名：">
          <el-input v-model="editUserData.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="editUser">确认</el-button>
      <el-button type="info" @click="editUserBoxShow=false">取消</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 添加用户功能：自定义验证手机格式
    let checkMobile = (rule, value, callback) => {
      let check = /^1[123]{1}\d{9}$/
      if (check.test(value)) return callback()
      callback(new Error('手机号码格式错误：/^1[123]{1}d{9}$/'))
    }
    return {
      tableData: [],
      userParams: {
        query: '', // 查询关键字
        pagenum: 1, // 当前页码
        pagesize: 10, // 每页显示条数
        total: 0 // 数据总数量
      },
      // 添加用户from表单 显示/隐藏   绑定数据
      addUserBoxShow: false,
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: '12111111111'
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户from表单 显示/隐藏   绑定数据
      editUserBoxShow: false,
      editUserData: {
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    // 获取管理员数据
    async getUserData(option = '') {
      if (option === 'esc') this.userParams.query = '' // 键盘修饰符esc 的话就清空关键词数据

      let { data: res } = await this.axios.get('/users/', {
        params: this.userParams
      })
      if (res.meta.status !== 200) return this.$message.error('信息获取失败')

      this.tableData = res.data.users // 管理员数据
      this.userParams.total = res.data.total // 数据总数量
    },
    // 用户状态 更新
    async updateUserStatus(status, uId) {
      let { data: res } = await this.axios.put(`users/${uId}/state/${status}`)
      if (res.meta.status !== 200) return this.$message.error('修改状态失败')

      this.$message.success('修改状态成功')
    },
    // 添加用户弹窗关闭后 重置表单
    resetAddForm() {
      this.$refs.addUserBox.resetFields()
    },
    // 添加用户功能
    addUser() {
      this.$refs.addUserBox.validate(async verify => {
        if (!verify) return this.$message.error('表单填写不正确')
        let { data: res } = await this.axios.post('/users/', this.addUserData)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        // 成功后提示信息 + 隐藏弹窗 + 重新获取用户列表数据
        this.$message.success(res.meta.msg)
        this.addUserBoxShow = false
        this.getUserData()
      })
    },
    // 删除用户功能
    async delUser(id) {
      if (id === 500) return this.$message.warning('超级管理员 不允许删除')
      let { data: res } = await this.axios.delete(`/users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserData()
    },
    // 编辑用户功能 - 显示弹窗、用户信息
    async userInfoShow(id) {
      if (id === 500) return this.$message.warning('超级管理员 不允许编辑')
      this.editUserBoxShow = true
      let { data: res } = await this.axios.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserData = res.data
    },
    // 编辑用户功能 - 提交表单
    async editUser() {
      let { data: res } = await this.axios.put(
        `users/${this.editUserData.id}`,
        {
          id: this.editUserData.id,
          email: this.editUserData.email,
          mobile: this.editUserData.mobile
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editUserBoxShow = false
      this.getUserData()
    },
    // 分页功能：每页显示数据量 改变后
    handleSizeChange(val) {
      this.userParams.pagesize = val
      this.getUserData()
    },
    // 分页功能：页码 改变后
    handleCurrentChange(val) {
      this.userParams.pagenum = val
      this.getUserData()
    }
  },
  created() {
    this.getUserData()
  }
}
</script>
