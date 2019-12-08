/* eslint-disable camelcase */
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home ' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert
                title="注意：只允许为第三季分类设置相关参数！"
                type="warning"
                :closable='false'
                show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        expand-trigger='hover'
                        :props='cateProps'
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区域 -->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                 <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type='primary' size='mini' :disabled='isBtnIsDisable' @click="addDialogvisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data='manyTableData' border stripe >
                        <!-- 索引列 -->
                        <!-- 展开行 -->
                        <el-table-column type='expand'>
                          <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_avls" :key="i" closable @close='handleClose(i,scope.row)'>{{item}}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input
                              class="input-new-tag"
                              v-if="scope.row.inputVisible"
                              v-model="scope.row.inputValue"
                              ref="saveTagInput"
                              size="small"
                              @keyup.enter.native="handleInputConfirm(scope.row)"
                              @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <!-- 添加的按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label='参数名称' prop='attr_name'></el-table-column>
                        <el-table-column lable='操作' >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加静态属性按钮 -->
                    <el-button type='primary' size='mini' :disabled='isBtnIsDisable' @click="addDialogvisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data='onlyTableData' border stripe >
                        <!-- 索引列 -->
                        <!-- 展开行 -->
                        <el-table-column type='expand'>
                          <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_avls" :key="i" closable @close='handleClose(i,scope.row)'>{{item}}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input
                              class="input-new-tag"
                              v-if="scope.row.inputVisible"
                              v-model="scope.row.inputValue"
                              ref="saveTagInput"
                              size="small"
                              @keyup.enter.native="handleInputConfirm(scope.row)"
                              @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <!-- 添加的按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column type='index'></el-table-column>
                        <el-table-column label='属性名称' prop='attr_name'></el-table-column>
                        <el-table-column lable='操作' >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogvisible"
            width="50%"
            @close='addDialogClosed'>
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogvisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 修改参数的对话框 -->
        <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogvisible"
            width="50%"
            @close='editDialogClosed'>
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogvisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //   被激活的页签的名称
      activeName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态参数数据
      onlyTableData: [],
      //   控制添加对话框的显示与隐藏
      addDialogvisible: false,
      //   添加参数的而表单数据对象
      addForm: {},
      //   添加表单的数据对象
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      //   控制修改对话框的显示与隐藏
      editDialogvisible: false,
      //   修改的表单数据对象
      editForm: {},
      //   修改表单的验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 控制按钮与文本框的切换形式
      inputVisible: false,
      // 文本框输入的内容
      inputValue: ''
    }
  },
  created () {
    //   获取所有的商品分类
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框变化会触发该函数
    handleChange () {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的数据列表
    async getParamsData () {
      //   console.log(this.selectedCateKeys)
      if (this.selectedCateKeys.length !== 3) {
        // 选中的不是三级分类
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      //   选中的是三级分类
      console.log(this.selectedCateKeys)
      //   根据所选分类的id和当前所处的面板获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.careId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      //   console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加布尔值控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(`categories/${this.careId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          console.log(res.meta.status)
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogvisible = false
        this.getParamsData()
      })
    },
    // 点击按钮展示修改对话框
    async showEditDialog (aid) {
      const { data: res } = await this.$http.get(`categories/${this.careId}/attributes/${aid}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDialogvisible = true
    },
    // 重置修改表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        const { data: res } = await this.$http.put(`categories/${this.careId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogvisible = false
      })
    },
    // 根据id删除对应的参数项
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 确认删除
      const { data: res } = await this.$http.delete(`categories/${this.careId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框失去焦点或按下enter
    async handleInputConfirm (row) {
      console.length('ok')
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 如果没有return 则证明输入了合法的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存这一次操作
      this.saveAttrVals(row)
    },
    // 将对attr——vals的操作保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.careId}/attributes/row.attr_id`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数成功')
    },
    // 点击的文本输入框
    showInput () {
      this.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数和选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    //   如股票按钮需要被禁用则返回true
    isBtnIsDisable () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    careId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
el-tag{
  margin: 10px
}
</style>
