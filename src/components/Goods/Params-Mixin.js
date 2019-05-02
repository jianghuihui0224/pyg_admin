export default {
  name: 'Params',
  data () {
    return {
      // 级联相关参数
      formData: [],
      // 级联选中项的ID数组
      selectedOptions: [],
      // tab栏默认选中栏
      activeIndex: 'many',
      // 按钮禁止状态
      disabled: true,
      // 动态参数列表
      manyAttrs: [],
      // 静态参数列表
      onlyAttrs: [],
      // 添加参数相应数据
      addDialogFormVisible: false,
      paramsName: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          {required: true, message: '参数名称必填', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    // 将三层分类的ID值记录在计算属性中,之后需要用的时候直接写该计算属性的字段名即可
    paramsId () {
      const len = this.selectedOptions.length
      if (len === 3) {
        return this.selectedOptions[2]
      } else {
        return null
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories', {params: {type: 3}})
      if (meta.status !== 200) return this.$message.error('获取商品分类失败')
      // console.log(data)
      this.formData = data
    },
    // 选择三级分类触发的函数
    handleChange () {
      this.getParams()
    },
    // 切换tab栏是触发的函数
    handleClick () {
      this.getParams()
    },
    // 获取动态和静态参数数据方法
    async getParams () {
      const len = this.selectedOptions.length
      if (len === 3) {
        const id = this.selectedOptions[len - 1]
        const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {params: {sel: this.activeIndex}})
        // console.log(data)
        if (meta.status !== 200) return this.$message.error('获取参数列表失败')
        // 将(动态参数)data中的attr_vals转换成数组,方便后台操作,因为直接在前台转换为数组的话,js代码拿不到这个数组,执行操作的时候会有困难,所以需要走在后台进行转换为数组
        if (this.activeIndex === 'many') {
          data.forEach(item => {
            // 将attr_vals转换为数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // 将每个添加标签加上显示属性
            item.inputShow = false
            // 将动态每行都添加一个input输入框的值
            item.inputValue = ''
          })
        }
        if (this.activeIndex === 'only') {
          data.forEach(item => {
            // 将每个添加标签加上显示属性
            item.inputOnlyShow = false
          })
        }
        // console.log(data)
        // 利用对象的动态绑定属性的方法,将对应的数据赋值给对应的数据类型
        this[`${this.activeIndex}Attrs`] = data
        // 标签启用状态
        this.disabled = false
      } else {
        // 选中项为空,只有选择了三级分类才满足要求,才能在输入框显示
        this.selectedOptions = []
        // 按钮禁止状态
        this.disabled = true
      }
    },
    // 添加动态,静态参数
    addParams () {
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    addNewParams () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.post(`categories/${this.paramsId}/attributes`, {attr_name: this.paramsName.attr_name, attr_sel: this.activeIndex})
          // console.log(meta)
          if (meta.status !== 201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          this.getParams()
          this.addDialogFormVisible = false
        }
      })
    },
    // 删除参数
    delParams (attrid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta}} = await this.$http.delete(`categories/${this.paramsId}/attributes/${attrid}`)
        if (meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除参数成功')
        this.getParams()
      }).catch(() => {})
    },
    // 修改标签中的删除
    delTag (row, i) {
      row.attr_vals.splice(i, 1)
      this.editAttr(row)
    },
    // 把修改后的数据提交给后台
    async editAttr (row) {
      const {data: {meta}} = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeIndex,
        attr_vals: row.attr_vals.join(',')
      })
      if (meta.status !== 200) return this.$message.error('更新参数失败')
      this.$message.success('更新参数成功')
    },
    // 显示input
    showInput (row) {
      row.inputShow = true
      this.$nextTick(() => {
        this.$refs[`showInput` + row.attr_id].focus()
      })
    },
    // 隐藏input事件,修改标签中的添加
    hidInput (row) {
      row.inputShow = false
      // 如果输入的内容为空  不能提交
      if (row.inputValue) {
        // 当前input输入的内容 追加到 attr_vals 中
        row.attr_vals.push(row.inputValue)
        // 把修改好的数据给后台
        this.editAttr(row)
        // 清空输入框的值
        row.inputValue = ''
      }
    },
    // 静态参数修改
    async showOnlyInput (row) {
      row.inputOnlyShow = true
      const {data: {meta}} = await this.$http.get(`categories/${this.paramsId}/attributes/${row.attr_id}`, {params: {attr_sel: this.activeIndex}})
      if (meta.status !== 200) return this.$message.error('获取参数信息失败')
      // this.onlyInput = data.attr_name
      this.$nextTick(() => {
        this.$refs[`showOnlyInput` + row.attr_id].focus()
      })
    },
    async hidOnlyInput (row) {
      row.inputOnlyShow = false
      // 如果输入的内容为空  不能提交
      if (row.attr_vals) {
        // 把修改好的数据给后台
        const {data: {meta}} = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: this.activeIndex,
          attr_vals: row.attr_vals
        })
        if (meta.status !== 200) return this.$message.error('更新参数失败')
        this.$message.success('更新参数成功')
      }
    },
    editParams (id) {}
  }
}
