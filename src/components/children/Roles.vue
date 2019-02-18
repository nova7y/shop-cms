<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" size="mini" icon="el-icon-share">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      let { data: res } = await this.axios.get('/roles/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data
      console.log(res.data)
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="less">
.el-row {
  margin-bottom: 15px;
}
</style>
