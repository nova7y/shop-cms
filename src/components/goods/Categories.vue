<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="success">添加分类</el-button>
      <!-- 商品分类table -->
      <zk-table
        :data="tableData"
        :columns="tableColumns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
      >
        <!-- 自定义列：是否启用 -->
        <template slot="active" slot-scope="info">
          <i
            class="el-icon-circle-check"
            style="color:rgb(68, 178, 170)"
            v-if="info.row.cat_deleted===false"
          ></i>
          <i class="el-icon-circle-close" style="color:red;" v-else></i>
        </template>
        <!-- 自定义列：排序 -->
        <template slot="order" slot-scope="info">
          <el-tag :disable-transitions="true" v-if="info.row.cat_level===0">一级</el-tag>
          <el-tag :disable-transitions="true" v-else-if="info.row.cat_level===1" type="success">二级</el-tag>
          <el-tag :disable-transitions="true" v-else type="warning">三级</el-tag>
        </template>
        <!-- 自定义列：操作 -->
        <template slot="option" slot-scope="info">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editCategoriesShow(info.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delCategoriesShow(info.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categoriesParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="categoriesParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categoriesParams.total"
      ></el-pagination>

      <!-- 弹窗：编辑功能 -->
      <el-dialog title="编辑分类" :visible.sync="editBoxShow" @close="resetEditBoxShow">
        <el-form
          :model="editFormData"
          status-icon
          ref="editForm"
          label-width="100px"
          class="demo-ruleForm"
          :rules="editRules"
        >
          <el-form-item label="活动名称" prop="cat_name">
            <el-input v-model="editFormData.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editCategories">确定</el-button>
          <el-button type="info" @click="editBoxShow=false">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      // zk-table 配置
      tableColumns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '200px'
        },
        {
          label: '是否启用',
          width: '150px',
          type: 'template',
          template: 'active'
        },
        {
          label: '排序',
          width: '100px',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          width: '200px',
          type: 'template',
          template: 'option'
        }
      ],
      // 获取商品分类数据的参数 + 分页功能参数
      categoriesParams: {
        type: 3, // 数据层数
        pagenum: 1, // 当前页码值
        pagesize: 5, // 每页显示多少条数据
        total: 5 // 数据总数量
      },
      // 修改功能弹窗、数据
      editBoxShow: false,
      editFormData: {
        cat_name: ''
      },
      editRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoriesData() {
      let { data: res } = await this.axios.get('categories', {
        params: this.categoriesParams
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data.result
      // 获取数据总页数 用于分页功能
      this.categoriesParams.total = res.data.total
    },
    // 编辑功能 - 显示弹窗+数据
    async editCategoriesShow(id) {
      this.editBoxShow = true
      let { data: res } = await this.axios.get(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editFormData = res.data
    },
    // 编辑功能 - 提交修改数据
    editCategories() {
      // 触发表单验证，成功后 发送ajax请求
      this.$refs.editForm.validate(async verify => {
        if (!verify) return this.$message.error('请正确填写表单')
        let { data: res } = await this.axios.put(
          `categories/${this.editFormData.cat_id}`,
          { cat_name: this.editFormData.cat_name }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editBoxShow = false
        this.getCategoriesData()
      })
    },
    // 编辑功能 - 弹窗关闭重置表单数据
    resetEditBoxShow() {
      this.$refs.editForm.resetFields()
    },
    // 删除功能 - 显示弹窗
    async delCategoriesShow(id) {
      let { data: res } = await this.axios.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 判断删除后 是否需要页码-1
      if (this.tableData.length === 1 && this.categoriesParams.pagenum > 1) {
        this.categoriesParams.pagenum--
      }
      this.getCategoriesData()
    },
    // 分页功能：每页显示数据量 改变后
    handleSizeChange(val) {
      this.categoriesParams.pagesize = val
      this.getCategoriesData()
    },
    // 分页功能：页码 改变后
    handleCurrentChange(val) {
      this.categoriesParams.pagenum = val
      this.getCategoriesData()
    }
  },
  created() {
    this.getCategoriesData()
  }
}
</script>
<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
