<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 商品列表select框 -->
      <el-row>
        <el-col :span="24">
          <span>选择商品分类：</span>
          <el-cascader
            :options="categoriesOptions"
            :props="categoriesOptionsProps"
            @change="categoriesOptionsChange"
            v-model="selectedOptions"
            expand-trigger="hover"
            style="width:300px"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 商品属性 选项卡 -->
      <el-tabs v-model="tabsActiveName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="parameter">
          <el-button type="primary" size="small" :disabled="btnDisabled">添加参数</el-button>
          <!-- 表格：商品-属性信息 -->
          <el-table :data="categoriesTableData" stripe style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="property">
          <el-button type="primary" size="small" :disabled="btnDisabled">添加属性</el-button>
          <!-- 表格：商品-参数信息 -->
          <el-table :data="categoriesTableData" stripe style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类select列表
      categoriesOptions: [],
      categoriesOptionsProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedOptions: [],
      // 商品属性 选项卡
      tabsActiveName: 'parameter',
      categoriesTableData: []
    }
  },
  computed: {
    // 监控select长度，控制添加按钮是否禁用
    btnDisabled: function() {
      if (this.selectedOptions.length === 3) return false
      return true
    },
    // 获取当前select所选择的 末节点 分类id
    catId: function() {
      if (this.selectedOptions.length !== 3) return 0
      return this.selectedOptions[2]
    }
  },
  methods: {
    // 获取商品分类树，渲染select列表
    async getCategoriesList() {
      let { data: res } = await this.axios.get('/categories/', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categoriesOptions = res.data
    },
    // 商品分类select列表 值改变后触发事件 : 判断是否满足"3级"商品分类
    categoriesOptionsChange() {
      // 如果select未选择3级标签 则把数据清空（若选择则获取数据）
      if (this.selectedOptions.length !== 3) {
        this.selectedOptions = []
        this.categoriesTableData = []
        return null
      }
      this.getCategoriesData()
    },
    // 选项卡改变后触发事件
    handleClick() {
      this.getCategoriesData()
    },
    // 获取商品 参数/属性 数据
    async getCategoriesData() {
      let { data: res } = await this.axios.get(
        `categories/${this.catId}/attributes`,
        {
          params: { sel: this.tabsActiveName === 'parameter' ? 'many' : 'only' }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categoriesTableData = res.data
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>
