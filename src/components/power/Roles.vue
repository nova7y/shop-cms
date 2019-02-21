<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addDivisionBoxShow=true">添加角色</el-button>
      <!-- 数据表格 -->
      <el-table :data="tableData" stripe style="width: 100%" border>
        <!-- 表格额外展开项 start -->
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(item,index) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #eee','border-top':index===0?'1px solid #eee':''}"
            >
              <!-- 一级tag -->
              <el-col :span="5">
                <el-tag closable @close="delRight(item.id,info.row)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级tag -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item.children"
                  :key="item2.id"
                  :style="{'border-top':index2!==0?'1px solid #eee':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRight(item2.id,info.row)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级tag -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="delRight(item3.id,info.row)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 表格额外展开项 end -->
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editDivisionShow(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delDivision(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-share"
              @click="getDivisionTree(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹窗：添加角色 -->
      <el-dialog title="添加角色" :visible.sync="addDivisionBoxShow" @close="resetAddForm">
        <el-form
          ref="addDivisionForm"
          :model="addDivisionData"
          label-width="80px"
          :rules="addDivisionRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addDivisionData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addDivisionData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDivisionBoxShow = false">取 消</el-button>
          <el-button type="primary" @click="addDivision">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 弹窗：编辑角色 -->
      <el-dialog title="编辑角色" :visible.sync="editDivisionBoxShow" @close="resetEditForm">
        <el-form
          ref="editDivisionForm"
          :model="editDivisionData"
          label-width="80px"
          :rules="editDivisionRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editDivisionData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editDivisionData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDivisionBoxShow = false">取 消</el-button>
          <el-button type="primary" @click="editDivision">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 弹窗：分配权限 -->
      <el-dialog title="分配权限" :visible.sync="setDivisionBoxShow">
        <el-tree
          :data="divisionData"
          :props="divisionProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
          default-expand-all
          ref="selectTree"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setDivisionBoxShow = false">取 消</el-button>
          <el-button type="primary" @click="setDivision">确 定</el-button>
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
      // 添加角色 弹窗、信息、验证规则
      addDivisionBoxShow: false,
      addDivisionData: {
        roleName: '',
        roleDesc: ''
      },
      addDivisionRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色 弹窗、信息、验证规则
      editDivisionBoxShow: false,
      editDivisionData: {
        roleName: '',
        roleDesc: ''
      },
      editDivisionRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 分配角色 弹窗、信息
      setDivisionBoxShow: false,
      // 分配角色 - select data + 配置
      divisionData: [],
      defaultCheckedKeys: [],
      divisionProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      let { data: res } = await this.axios.get('/roles/')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data
      // 二级、三级tag
    },
    // 添加角色功能 - 添加表单
    addDivision() {
      this.$refs.addDivisionForm.validate(async verify => {
        if (!verify) return this.$message.error('请正确填写表单')
        let { data: res } = await this.axios.post(
          '/roles/',
          this.addDivisionData
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDivisionBoxShow = false
        this.$message.success(res.meta.msg)
        this.getList()
      })
    },
    // 添加角色功能 - 关闭弹窗时 清空表单数据
    resetAddForm() {
      this.$refs.addDivisionForm.resetFields()
    },
    // 删除角色功能
    async delDivision(id) {
      let { data: res } = await this.axios.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getList()
    },
    // 编辑角色功能 - 显示弹窗、角色信息
    async editDivisionShow(id) {
      this.editDivisionBoxShow = true
      let { data: res } = await this.axios.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDivisionData = res.data
    },
    // 编辑角色功能 - 提交表单
    editDivision() {
      this.$refs.editDivisionForm.validate(async verify => {
        if (!verify) return this.$message.error('请正确填写表单')
        let { data: res } = await this.axios.put(
          `roles/${this.editDivisionData.roleId}`,
          {
            roleName: this.editDivisionData.roleName,
            roleDesc: this.editDivisionData.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDivisionBoxShow = false
        this.$message.success(res.meta.msg)
        this.getList()
      })
    },
    // 编辑角色功能 - 关闭弹窗，重置表单
    resetEditForm() {
      this.$refs.editDivisionForm.resetFields()
    },
    // 删除角色下的权限 - tag触发
    async delRight(rightId, role) {
      // rightId:点击tag对应的数据id
      // role：父级角色信息
      let { data: res } = await this.axios.delete(
        `/roles/${role.id}/rights/${rightId}/`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 分配角色功能 - 获取原权限树
    async getDivisionTree(role) {
      // role：父级角色信息
      this.setDivisionBoxShow = true
      this.roleId = role.id
      // 获取所有的权限 - 渲染select tree
      let { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.divisionData = res.data
      // 递归遍历role信息，找出该角色下的权限id
      let tempAry = []
      this.getLeafIds(role, tempAry)
      this.defaultCheckedKeys = tempAry
    },
    // 分配角色功能 - 递归遍历 第三级权限id
    getLeafIds(role, tempAry) {
      if (!role.children) return tempAry.push(role.id)
      role.children.forEach(item => this.getLeafIds(item, tempAry))
    },
    // 分配角色功能 - 提交表单
    async setDivision() {
      // 获取select tree选中的节点key(id)，拼接字符串后发ajax请求
      let key1 = this.$refs.selectTree.getCheckedKeys() // 目前选中节点的 key
      let key2 = this.$refs.selectTree.getHalfCheckedKeys() // 目前半选的节点的 key
      let keyAry = [...key1, ...key2].join(',')

      let { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: keyAry
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setDivisionBoxShow = false
      this.getList()
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 5px;
}
</style>
