<template>
  <div class="good_contariner">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索关键字" v-model="goodParams.query">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" plain @click="changeGoodsAdd()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 搜索栏 -->
      <!-- 表格 -->
      <el-table :data="goodsList" style="width: 100%" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column property="goods_name" style="width: 70%" label="商品名称"></el-table-column>
        <el-table-column property="goods_price" label="价格"></el-table-column>
        <el-table-column property="goods_weight" label="重量"></el-table-column>
        <el-table-column property="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | ft}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" round @click="editGood(scope.row.goods_id)"></el-button>
              <el-button icon="el-icon-delete" round @click="delGood(scope.row.goods_id)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 -->
      <!-- 页码 -->
      <!-- @current-change="changePage"绑定的分页页码改变,显示对应页码的数据
      :page-size="goodParams.pagesize"每页显示条数
      :total="goodPages"总条数 
      :current-page="currentPage"绑定搜索后显示的页面永远是第一页-->
      <el-pagination
        @current-change="changePage"
        :page-size="goodParams.pagesize"
        :total="goodPages"
        :current-page="currentPage"
        background
        layout="prev, pager, next"
      ></el-pagination>
      <!-- 页码 -->
    </el-card>

    <!-- 编辑商品名称对话框 -->
    <el-dialog title="编辑商品名称" :visible.sync="editDialogFormVisible"  width="400px">
      <el-form label-width="100px" autocomplete="off" :rules="editFormRules" ref="editForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsNewName.goods_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodName()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑商品名称对话框 -->
  </div>
</template>

<script>
import goodsMixin from "./Goods-Mixin.js";
export default {
  mixins: [goodsMixin]
};
</script>

<style scoped>
</style>