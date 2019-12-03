<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home ' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图 -->
        <el-card>
            <!-- 提娜佳角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type='primary'>添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data='roleList' border stripe>
                <!-- 展开列 -->
                <el-table-column type='expand'>
                  <template slot-scope="scope">
                    <el-row
                    v-for="(item1,i1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom',i1===0? 'bdtop':'','vcenter'] "
                    >
                      <!-- 渲染一级权限 -->
                      <el-col :span='6'>
                        <el-tag
                        closable
                        @close='removeright(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染二级和三级权限 -->
                      <el-col :span='18'>
                        <!-- 通过for循环嵌套渲染二级权限 -->
                        <el-row
                        v-for="(item2,i2) in item1.children"
                        :key="item2.id"
                        :class="[i2===0?'':'bdtop','vcenter']"
                        >
                          <el-col :span='6'>
                            <el-tag type='success'
                            closable
                            @close='removeright(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span='18'>
                            <!-- 渲染三级标签 -->
                            <el-tag
                            v-for="(item3) in item2.children"
                            :key="item3.id"
                            type='warning'
                            closable
                            @close='removeright(scope.row,item3.id)'
                            >
                              {{item3.authName}}
                            </el-tag>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- <pre>
                      {{scope.row}}
                    </pre> -->
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label='#' type='index'></el-table-column>
                <el-table-column label='角色名称' prop='roleName'></el-table-column>
                <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
                <el-table-column label='操作' width='300px'>
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size='mini' @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close='serRightDialogClosed'
          >
          <!-- 树形控件 -->
          <el-tree :data="rightList" :props="treetProps" show-checkbox node-key='id' default-expand-all
          :default-checked-keys='defKeys' ref="treeRef">

          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="allotRight">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色数据列表
      roleList: [],
      // 控制分配权限显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      // 树形控件的属性绑定对象
      treetProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      defKeys: [105, 116],
      // 当前分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 根据id删除对应的权限
    async removeright (role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      // this.getRoleList()
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据保存到data中
      this.rightList = res.data
      console.log(this.rightList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      // 对话框显示出来
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色所有三级权限的id，并保存到defkeys中
    getLeafKeys (node, arr) {
      // 如果当前节点不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    serRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRight () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }

  }
}
</script>
<style lang="less" scope>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid #eeeeee
  }
  .bdbottom{
    border-bottom: 1px solid #eeeeee
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
