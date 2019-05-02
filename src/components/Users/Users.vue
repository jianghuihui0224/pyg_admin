<template>
  <div class="users_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索关键字" v-model="userParams.query">
            <el-button slot="append" icon="el-icon-search" @click="searchNew()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" plain @click="showdialogFormVisible()">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="changeState(scope.row.id,scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" @click="showEditDialogFormVisible(scope.row.id)" round></el-button>
              <el-button icon="el-icon-delete" @click="delForm(scope.row.id)"></el-button>
              <el-button icon="el-icon-setting" @click="setDialogFormVisible(scope.row)" round></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="userParams.pagenum"
        @current-change="handleCurrentChange"
        :page-size="userParams.pagesize"
        background
        layout="prev, pager, next"
        :total="userPages"
      ></el-pagination>
    </el-card>

    <!-- 编辑用户弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible" width="400px">
      <el-form
        :model="editForm"
        :rules="fromRule"
        ref="ruleFormEdit"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNewForm(editForm.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹出层 -->

    <!-- 设置用户弹出层 -->
    <el-dialog title="设置用户角色" :visible.sync="setDialogFormVisibles" width="400px">
      <el-form :model="setForms" label-width="80px" autocomplete="off">
        <el-form-item label="当前用户">{{setForms.username}}</el-form-item>
        <el-form-item label="当前角色">{{setForms.role_name}}</el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in setForm"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setNewForm(setForms.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置用户弹出层 -->

    <!-- 添加用户弹出层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        :model="addForm"
        :rules="fromRule"
        ref="ruleForm"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForms()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户弹出层 -->
  </div>
</template>

<script>
import userMixin from './Users-Mixin.js'
export default {
  mixins: [userMixin]
};
</script>

<style scoped>

</style>