export default {
  name: 'Categories',
  data () {
    return {
      tableData: [],
      catParams: {
        type: null,
        // 表格当前页显示的是第几页
        pagenum: 1,
        // 表格一页显示几条
        pagesize: 5
      },
      // 总条数
      catPages: null,
      // 添加类别
      addDialogFormVisible: false,
      addForm: {
        // 分类父 ID
        cat_pid: 0,
        cat_name: '',
        // 分类等级,0表示一级分类；1表示二级分类；2表示三级分类
        cat_level: 0
      },
      addFormRule: {
        cat_name: [
          {required: true, message: '输入分类名称', trigger: 'blur'}
        ]
      },
      // 申明级联对应的数据
      // 设置下拉选项数据
      categoryList: [],
      // 下拉选中的选项
      categoryValues: [],
      // 编辑分类
      editDialogFormVisible: false,
      editForm: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const {data: {data, meta}} = await this.$http.get('categories', {params: this.catParams})
      if (meta.status !== 200) return this.$message.erroe('获取商品分类失败')
      // console.log(data)
      this.tableData = data.result
      this.catPages = data.total
    },
    changePage (newPage) {
      this.catParams.pagenum = newPage
      this.getData()
    },
    // 删除分类
    delCat (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta}} = await this.$http.delete(`categories/${id}`)
        if (meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getData()
      })
    },
    // 添加分类
    addSubmit () {
      // 在对话框渲染之前将级联框的选项清空
      this.categoryValues = []
      this.addDialogFormVisible = true
      this.$nextTick(async () => {
        // 重置表单输入框的值
        this.$refs.addForm.resetFields()
        const {data: {data, meta}} = await this.$http.get('categories', {params: {type: 2}})
        // console.log(data)
        if (meta.status !== 200) return this.$message.error('获取类别失败')
        this.categoryList = data
      })
    },
    addNewForm () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 因为cat_name与表单绑定,所以不需要关心,
          // 但是父ID和分类等级是根据客户怎么样选择来定的,
          // 所以需要进行判断不同的情况,给父ID和分类等级赋不同的值
          const len = this.categoryValues.length
          if (len) {
            this.addForm.cat_pid = this.categoryValues[len - 1]
          } else {
            this.addForm.cat_pid = 0
          }
          this.addForm.cat_level = len
          // console.log(this.addForm)

          const {data: {meta}} = await this.$http.post('categories', this.addForm)
          if (meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.addDialogFormVisible = false
          this.getData()
        }
      })
    },
    // 编辑分类
    editCat (id) {
      this.editDialogFormVisible = true
      // 因为编辑的表单和数据进行了双向绑定,,所以不能直接赋值给editForm,否则会影响表单数据的显示效果
      this.$nextTick(async () => {
        this.$refs.editForm.resetFields()
        const {data: {data, meta}} = await this.$http.get(`categories/${id}`)
        console.log(data)
        if (meta.status !== 200) this.$message.error('获取分类名称失败')
        this.editForm = data
      })
    },
    editNewForm () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const {data: {meta}} = await this.$http.put(`categories/${this.editForm.cat_id}`, {cat_name: this.editForm.cat_name})
          // console.log(meta)
          if (meta.status !== 200) return this.$message.success('编辑分类名称失败')
          this.$message.success('编辑分类名称成功')
          this.editDialogFormVisible = false
          this.getData()
        }
      })
    }
  }
}
