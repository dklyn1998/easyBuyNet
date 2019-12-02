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
                <el-table-column type='expand'></el-table-column>
                <!-- 索引列 -->
                <el-table-column label='#' type='index'></el-table-column>
                <el-table-column label='角色名称' prop='roleName'></el-table-column>
                <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
                <el-table-column label='操作' width='300px'>
                    <template slot-scope="">
                        <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size='mini'>分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色数据列表
      roleList: {}
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
    }
  }
}
</script>
<style lang="less" scope>

</style>
