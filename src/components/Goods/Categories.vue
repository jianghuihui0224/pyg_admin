<template>
  <div class="cata_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 -->
    <el-card>
      <el-button type="primary" plain @click="addSubmit()">添加分类</el-button>
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称" width="600"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: green" v-if="!scope.row.cat_deleted"></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0">一级分类</el-tag>
            <el-tag v-if="scope.row.cat_level===1" type="success">二级分类</el-tag>
            <el-tag v-if="scope.row.cat_level===2" type="warning">三级分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" round @click="editCat(scope.row.cat_id)"></el-button>
              <el-button icon="el-icon-delete" round @click="delCat(scope.row.cat_id)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @current-change="changePage"
        :page-size="catParams.pagesize"
        :total="catPages"
        background
        layout="prev, pager, next"
      ></el-pagination>
      <!-- 页码 -->
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible" width="400px">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRule"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="父级分类" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <!--value / v-model	选中项绑定值
          props =｛value:'选项对象的id字段',label:'选项对象的名称字段'｝
          options	可选项数据源，键名可通过 props 属性配置
          clearable是否支持清空选项 
          change-on-select是否允许选择任意一级的选项-->
          <el-cascader
            :props="{value:'cat_id', label:'cat_name'}"
            :options="categoryList"
            style="width: 100%"
            expand-trigger="hover"
            v-model="categoryValues"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类对话框 -->

    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogFormVisible" width="400px">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="addFormRule"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNewForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类 -->
  </div>
</template>

<script>
import ategoriesMixin from "./Categories-Mixin.js";
export default {
  mixins: [ategoriesMixin]
};
</script>

<style scoped>
</style>