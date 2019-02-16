<template>
  <div>
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
          <el-button type="success">添加用户</el-button>
        </el-col>
      </el-row>
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
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userParams.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      userParams: {
        query: '', // 查询关键字
        pagenum: 1, // 当前页码
        pagesize: 3, // 每页显示条数
        total: 0 // 数据总数量
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
