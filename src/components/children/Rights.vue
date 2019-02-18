<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==0">一级</el-tag>
            <el-tag v-else-if="info.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
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
      let { data: res } = await this.axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.tableData = res.data
    }
  },
  created() {
    this.getList()
  }
}
</script>
