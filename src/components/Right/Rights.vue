<template>
  <div class="right_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="rightsList"
        style="width: 100%"
        height="400"
      >
        <el-table-column type="index" width="100px"></el-table-column>
        <el-table-column property="authName" label="权限名称"></el-table-column>
        <el-table-column property="path" label="路径"></el-table-column>
        <el-table-column property="level" label="权限等级">
          <!-- 记住用template插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success">二级权限</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="warning">三级权限</el-tag>
          </template>
          <!-- 记住用template插槽 -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import rightsMixin from "./Rights-Mixin";
export default {
  mixins: [rightsMixin]
};
</script>

<style scoped>
</style>
