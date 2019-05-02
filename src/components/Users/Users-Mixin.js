export default {
  name: 'User',
  data () {
    const validatePass = (rule, val, callback) => {
      // rule 规则信息  value 验证的输入框的值  callback回调函数 (成功时没有参数 失败时必须有参数)
      if (!/^1[345789]\d{9}$/.test(val)) return callback(new Error('手机号码不正确'))
      callback()
    }
    return {
      userList: [],
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 定义的总条数
      userPages: 0,
      // 添加用户弹出层是否显示
      dialogFormVisible: false,
      // 添加的表单信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户,编辑用户表单验证 失去焦点时
      fromRule: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        mobile: [{required: true, message: '请输入电话号码', trigger: 'blur'},
          // 手机号需要自定义验证方式,在data数据return之前
          {validator: validatePass, trigger: 'blur'}
        ]
      },
      // 编辑用户弹出层是否显示
      editDialogFormVisible: false,
      editForm: {},
      // 设置用户弹出层是否显示
      setDialogFormVisibles: false,
      // 当前角色所在行的数据
      setForms: {
        roleUserName: '',
        roleName: '',
        id: ''
      },
      // 下拉菜单选项
      setForm: {},
      value: ''
    }
  },
  mounted () {
    this.getNews()
  },
  methods: {
    async getNews () {
      const {
        data: {
          data,
          meta
        }
      } = await this.$http.get('users', {
        params: this.userParams
      })
      if (meta.status !== 200) return this.$message.error('获取管理员信息失败')
      this.userList = data.users
      this.userPages = data.total
      // console.log(data)
    },
    handleCurrentChange (val) {
      this.userParams.pagenum = val
      this.getNews()
    },
    searchNew () {
      this.getNews()
      this.userParams.pagenum = 1
    },
    showdialogFormVisible () {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    addForms () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const {
            data: {
              meta
            }
          } = await this.$http.post('users', this.addForm)
          if (meta.status !== 201) return this.$message.error('请按照要求填写内容')
          this.dialogFormVisible = false
          this.getNews()
        }
      })
    },
    delForm (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta}} = await this.$http.delete(`users/${id}`)
        // console.log(meta)
        if (meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.getNews()
      })
    },
    async showEditDialogFormVisible (id) {
      // console.log(this.userList);
      // let [thisUser] = this.userList.filter(item => {
      //   return id === item.id;
      // });
      // // console.log(thisUser);
      // this.editForm = thisUser;
      const {
        data: {
          data,
          meta
        }
      } = await this.$http.get(`users/${id}`)
      if (meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = data
      this.editDialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.ruleFormEdit.resetFields();
      // });
    },
    editNewForm (id) {
      this.$refs.ruleFormEdit.validate(async valid => {
        // console.log(id, this.editForm);
        if (valid) {
          const {
            data: {
              meta
            }
          } = await this.$http.put(`users/${id}`, this.editForm)
          if (meta.status !== 200) return this.$message.error('请按照要求填写内容')
          this.$message.success('修改用户信息成功')
          this.editDialogFormVisible = false
          this.getNews()
        }
      })
    },
    async changeState (id, state) {
      const {
        data: {
          meta
        }
      } = await this.$http.put(`users/${id}/state/${state}`)
      if (meta.status !== 200) return this.$message.error('修改状态失败')
      this.$message.success('修改状态成功')
      this.getNews()
    },
    async setDialogFormVisible (row) {
      // console.log(row)
      this.setForms = row
      this.setDialogFormVisibles = true
      const {
        data: {
          data,
          meta
        }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色失败')
      this.setForm = data
      console.log(data)
    },
    async setNewForm (id) {
      console.log(this.setForm.id)
      const {
        data: {
          meta
        }
      } = await this.$http.put(`users/${id}/role`, {
        rid: this.value
      })
      if (meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.setDialogFormVisibles = false
      this.getNews()
    }
  }
}
