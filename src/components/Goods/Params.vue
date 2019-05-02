<template>
  <div class="params_contariner">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 -->
    <el-card>
      <el-alert class="el-icon-warning" title="注意：第三级分类才可设置参数。" type="warning"></el-alert>
      <!-- 级联选择框 -->
      <el-form @submit.native.prevent>
        <el-form-item label="选择商品分类:">
          <el-cascader
            :props="{value:'cat_id', label:'cat_name'}"
            clearable
            expand-trigger="hover"
            :options="formData"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 级联选择框 -->

      <!-- tab栏切换 -->
      <!-- v-model绑定的数据为name绑定的数据,表示默认显示的是哪个tab栏 -->
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="success" :disabled="disabled" @click="addParams()">添加动态参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyAttrs">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="delTag(scope.row, i)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  size="normal"
                  closable
                >{{item}}</el-tag>
                <!-- 修改中的添加标签
                :disable-transitions="true"表示取消标签关闭动画-->
                <el-tag
                  @click="showInput(scope.row)"
                  v-show="!scope.row.inputShow"
                  size="normal"
                  style="width: 100px"
                  :disable-transitions="true"
                >+添加tag</el-tag>
                <!-- 修改中的添加标签 -->
                <!-- 修改中添加标签的input输入框
              :ref="'showInput'+scope.row.attr_id"为了保证能够单独获取每一行的DOM元素,需要个每一行设置不同的ref,否则会一下子获取到所有的DOM元素 
                @keyup.native.enter="scope.row.inputShow=false"/ @blur="scope.row.inputShow=false"表单在失去焦点和按enter键时隐藏,标签tag显示-->
                <el-input
                  v-model="scope.row.inputValue"
                  @keyup.native.enter="hidInput(scope.row)"
                  @blur="hidInput(scope.row)"
                  :ref="'showInput'+scope.row.attr_id"
                  style="width: 100px; margin: 5px"
                  v-show="scope.row.inputShow"
                ></el-input>
                <!-- 修改中添加标签的input输入框 -->
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" circle></el-button>
                <el-button icon="el-icon-delete" circle @click="delParams(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 动态参数表格 -->
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <el-button type="success" :disabled="disabled" @click="addParams()">添加静态参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyAttrs">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="scope">
                <el-tag 
                  style="width: 200px" 
                  size="normal"
                  @click="showOnlyInput(scope.row)"
                  v-show="!scope.row.inputOnlyShow"
                  :disable-transitions="true">{{scope.row.attr_vals}}</el-tag>
                <el-input style="width: 200px"
                  :value="scope.row.attr_vals"
                  v-model="scope.row.attr_vals"
                  @keyup.native.enter="hidOnlyInput(scope.row)"
                  @blur="hidOnlyInput(scope.row)"
                  :ref="'showOnlyInput'+scope.row.attr_id"
                  v-show="scope.row.inputOnlyShow"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" circle @click="editParams(scope.row.attr_id)"></el-button>
                <el-button icon="el-icon-delete" circle @click="delParams(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 静态参数表格 -->
        </el-tab-pane>
      </el-tabs>
      <!-- tab栏切换 -->
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="activeIndex==='many'?'添加动态参数':'添加静态参数'"
      :visible.sync="addDialogFormVisible"
      width="400px"
    >
      <el-form
        :model="paramsName"
        label-width="100px"
        autocomplete="off"
        :rules="addRules"
        ref="addForm"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="paramsName.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewParams()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加参数对话框 -->
  </div>
</template>

<script>
import paramsMixin from "./Params-Mixin.js";
export default {
  mixins: [paramsMixin]
};
</script>

<style scoped>
.el-form {
  margin-top: 20px;
}
.el-tag {
  margin: 5px;
}
</style>