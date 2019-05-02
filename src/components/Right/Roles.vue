<template>
  <div class="right_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" plain @click="addDialogFormVisibles()">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" height="400">
        <el-table-column type="expand" width="100px">
          <!-- 展开列表 -->
          <template slot-scope="scope">
            <el-row v-if="scope.row.child.length?false:true">暂无任何权限</el-row>
            <el-row
              v-for="(item,i) in scope.row.child"
              :key="item.id"
              style="border-bottom: 1px solid #eee"
              :style="{'border-top':i===0?'1px solid #eee':'none'}"
            >
              <el-col :span="4">
                <el-tag closable @close="closeTag(scope.row, item.id)">{{item.authName}}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="(secondItem, i) in item.child"
                  :key="secondItem.id"
                  :style="{'border-top':i===0? 'none': '1px solid #eee'}"
                >
                  <el-col :span="8">
                    <el-tag
                      closable
                      type="success"
                      @close="closeTag(scope.row, secondItem.id)"
                    >{{secondItem.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      v-for="lastItem in secondItem.child"
                      :key="lastItem.id"
                      :closable="true"
                      @close="closeTag(scope.row, lastItem.id)"
                      type="warning"
                    >{{lastItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <!-- 展开列表 -->
        </el-table-column>
        <el-table-column type="index" width="100px"></el-table-column>
        <el-table-column property="roleName" label="角色名称"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" round @click="editDialogFormVisibles(scope.row.id)"></el-button>
              <el-button icon="el-icon-delete" @click="delRoles(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配权限" placement="right">
                <el-button icon="el-icon-setting" round @click="setDialogFormVisibles(scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹出层 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" width="400px">
      <el-form
        :model="addRole"
        :rules="roleFromRule"
        ref="addRoleForm"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户弹出层 -->

    <!-- 编辑角色弹出层 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible" width="400px">
      <el-form
        :model="editRole"
        :rules="roleFromRule"
        ref="editRoleForm"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹出层 -->

    <!-- 设置角色权限 -->
    <el-dialog title="分配权限" :visible.sync="setDialogFormVisible" width="400px">
      <!-- node-key="id"树状节点唯一标识 
        show-checkbox显示勾选框
        :default-expand-all="true"展开树状所有节点
        :props="defaultProps" 树状属性配置项 
        :default-checked-keys="roleTreeId"默认勾选的权限的id的数组   -->
      <el-tree
        ref="treeDom"
        :default-checked-keys="roleTreeId"
        :data="roleTreeData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles(roleSetId)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置角色权限 -->
  </div>
</template>

<script>
import rolesMixin from "./Roles-Mixin.js";
export default {
  mixins: [rolesMixin]
};
</script>

<style scoped>
.el-tag {
  margin: 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>