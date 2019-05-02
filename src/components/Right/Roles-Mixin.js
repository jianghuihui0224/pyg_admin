export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      // 添加角色
      addDialogFormVisible: false,
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      roleFromRule: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      // 编辑角色
      editDialogFormVisible: false,
      editRole: {},
      // 设置角色权限
      setDialogFormVisible: false,
      roleTreeData: [{
        pid: '',
        id: '',
        authName: '',
        children: [{
          pid: '',
          id: '',
          authName: '',
          children: [{
            pid: '',
            id: '',
            authName: ''
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 设置角色默认勾选的权限的id的数组
      roleTreeId: [],
      // 设置角色id，用来表示点击确定按钮时当前角色的id
      roleSetId: null
    }
  },
  mounted () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const {data: {data, meta}} = await this.$http.get('roles')
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('获取角色列表失败')
      // 利用循环获取到正确的data数据,因为返回的数据中带有children属性,所以vue会自动对children进行解析,最后就不会得到我们想要的数据
      data.forEach(item => {
        item.child = item.children
        delete item.children
        item.child.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
      })
      this.rolesList = data
    },
    // 添加角色
    addDialogFormVisibles () {
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addRoleForm.resetFields()
      })
    },
    addRoles () {
      this.$refs.addRoleForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.post('roles', this.addRole)
          if (meta.status !== 201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功')
          this.addDialogFormVisible = false
          this.getRoles()
        }
      })
    },
    // 删除角色
    delRoles (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta}} = await this.$http.delete(`roles/${id}`)
        if (meta.status !== 200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        this.getRoles()
      }).catch(() => {})
    },
    // 编辑角色
    async editDialogFormVisibles (id) {
      this.editDialogFormVisible = true
      const {data: {data, meta}} = await this.$http.get(`roles/${id}`)
      if (meta.status !== 200) return this.$message.error('获取该角色信息失败')
      this.editRole = data
    },
    editRoles () {
      this.$refs.editRoleForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.put(`roles/${this.editRole.roleId}`, this.editRole)
          if (meta.status !== 200) return this.$message.error('修改角色信息失败')
          this.editDialogFormVisible = false
          this.$message.success('修改角色信息成功')
          this.getRoles()
        }
      })
    },
    // 删除权限标签
    closeTag (row, roleId) {
      // console.log(row)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {data, meta}} = await this.$http.delete(`roles/${row.id}/rights/${roleId}`)
        // console.log(data)
        if (meta.status !== 200) return this.$message.error('删除权限失败')
        this.$message.success('删除权限成功')
        // 直接更新列表会刷新整个列表,用户体验不好
        // this.getRoles()
        data.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
            item.child.forEach(item => {
              item.child = item.children
              delete item.children
            })
          })
        })
        row.child = data
      }).catch(() => {})
    },
    // 设置角色权限
    async setDialogFormVisibles (row) {
      const {data: {data, meta}} = await this.$http.get(`rights/tree`)
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('获取角色权限失败')
      this.roleTreeData = data

      // 设置该角色选中权限的id数组
      const arr = []
      // 遍历该角色的第三层,获取第三层的id,因为选项默认有全选功能,所以只需要比阿尼了第三层即可
      row.child.forEach(item => {
        item.child.forEach(item => {
          item.child.forEach(item => {
            arr.push(item.id)
          })
        })
      })
      // console.log(arr)
      // 默认勾选的权限的id的数组
      this.roleTreeId = arr
      this.setDialogFormVisible = true
      this.roleSetId = row.id
    },
    async setRoles (id) {
      // 定义修改角色权限传参，后台规定参数为权限id的字符串结构
      const treeDom = this.$refs.treeDom
      const defaultKeys = treeDom.getCheckedKeys()
      const checkedKeys = treeDom.getHalfCheckedKeys()
      const ridsArr = [...defaultKeys, ...checkedKeys]

      const {data: {meta}} = await this.$http.post(`roles/${id}/rights`, {rids: ridsArr.join(',')})
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('修改角色权限失败')
      this.$message.success('修改权限成功')
      this.setDialogFormVisible = false
      this.getRoles()
    }
  }
}
