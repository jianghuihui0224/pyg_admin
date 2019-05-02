<template>
  <div class="goods_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 -->
    <el-card>
      <!-- 提醒框 -->
      <el-alert
        center
        title="请按照步骤录入商品信息"
        type="info"
        show-icon>
      </el-alert>
      <!-- 提醒框 -->
      <!-- 步骤条 -->
      <el-steps :active="activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 步骤条 -->
      <!-- tab栏 -->
      <el-tabs tab-position="left" :before-leave="changeTabBefore">
        <el-tab-pane label="基本信息">
          <!-- 表单 -->
          <el-form ref="form" :model="formData" label-width="80px" :rules="formRules">
            <el-form-item label="商品名称" style="width: 600px" label-width="100px" prop="goods_name">
              <el-input v-model="formData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" style="width: 400px" label-width="100px" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                :props="{value:'cat_id', label:'cat_name'}"
                clearable
                expand-trigger="hover"
                :options="selectedAll"
                v-model="selectedChange"
                @change="handleChange">
              </el-cascader>
              <!-- 级联选择器 -->
            </el-form-item>
            <el-form-item label="商品价格" style="width: 400px" label-width="100px" prop="goods_price">
              <el-input v-model="formData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" style="width: 400px" label-width="100px" prop="goods_number">
              <el-input v-model="formData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" style="width: 400px" label-width="100px" prop="goods_weight">
              <el-input v-model="formData.goods_weight"></el-input>
            </el-form-item>
          </el-form>
          <!-- 表单 -->
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form label-width="200px">
            <el-form-item v-if="item.attr_vals" v-for="(item,i) in manyAttrs" :key="i" :label="item.attr_name">
              <el-tag v-for="(tag,i) in item.attr_vals.split(',')" :key="i" style="margin: 0 5px;">{{tag}}</el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form label-width="200px">
            <el-form-item v-if="value.attr_vals" v-for="(value,i) in onlyAttrs" :key="i" :label="value.attr_name">
              <el-tag style="width: 300px">{{value.attr_vals}}</el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <!-- :on-success="handleSuccess 表示上传成功后的执行操作
          action 是当前的上传地址 且  全路径
          headers 携带token值 不是通过axios  所以你需要添加token
          :on-preview="handlePictureCardPreview 表示预览照片
          :on-remove="handleRemove" 表示删除照片 -->
          <el-upload
            :on-success="handleSuccess"
            :action="action"
            :headers="headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <!-- 富文本插件 -->
          <quill-editor v-model="formData.goods_introduce"></quill-editor>
          <el-button @click="setNewIno()" type="primary" style="margin-top: 20px">提交</el-button>
        </el-tab-pane>
      </el-tabs>
      <!-- tab栏 -->
    </el-card>
  </div>
</template>

<script>
import goodsAddMixin from './Goods-Add-Mixin.js'
export default {
  mixins: [goodsAddMixin]
}
</script>

<style scoped>
.el-step {
  margin: 15px 0;
}
.el-tabs {
  margin-top: 10px;
}
.el-form-item {
  margin: 20px 0;
}
.el-form-item:first-child {
  margin: 0;
}
</style>