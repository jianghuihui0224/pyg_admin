export default {
  name: 'GoodsAdd',
  data () {
    return {
      // 步骤条相关数据
      activeIndex: 0,
      // 表单相关数据
      formData: {
        goods_cat: '',
        pics: {}
      },
      formRules: {
        goods_name: [
          {required: true, message: '商品名称必填', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '分类必须是第三级', trigger: 'change'}
        ],
        goods_price: [
          {required: true, message: '商品价格必填', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '商品数量必填', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '商品重量必填', trigger: 'blur'}
        ]
      },
      // 级联选择器相关数据
      selectedAll: [],
      selectedChange: [],
      manyAttrs: [],
      onlyAttrs: [],
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      action: this.$http.defaults.baseURL + '/upload/',
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    }
  },
  watch: {
    selectedChange (now, old) {
      // console.log(now)
      // console.log(this.formData.goods_cat)
      // 当 selectedChange 值改变的时候
      // formData.goods_cat 赋值
      // 如果 selectedChange 的长度不等于3  就不赋值清空
      if (now.length === 3) {
        // 以为','分割的分类列表
        this.formData.goods_cat = now.join(',')
      } else {
        this.formData.goods_cat = ''
      }
      // console.log(this.formData.goods_cat)
    }
  },
  mounted () {
    this.getChecked()
  },
  methods: {
    handleChange () {
      this.getParams('many')
      this.getParams('only')
    },
    async getChecked () {
      const {data: {data, meta}} = await this.$http.get('categories', {params: {type: 3}})
      if (meta.status !== 200) return this.$message.error('获取商品分类失败')
      // console.log(data)
      this.selectedAll = data
      // console.log(data)
    },
    // 切换tab栏之前执行的函数,activeIndex表示切换tab栏之后的下标,oldActiveIndex表示切换tab栏之前的下标值
    changeTabBefore (activeIndex, oldActiveIndex) {
      // console.log(activeIndex, oldActiveIndex)
      if (oldActiveIndex === '0') {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.activeIndex = +activeIndex
              resolve()
            } else {
              reject(new Error('校验表单失败'))
            }
          })
        })
      } else {
        // 如果不是第一个选项  随着tab的索引去切换步骤条
        this.activeIndex = +activeIndex
      }
    },
    async getParams (type) {
      const id = this.selectedChange[2]
      const {data: {data, meta}} = await this.$http.get(`categories/${id}/attributes`, {
        params: {sel: type}
      })
      if (meta.status !== 200) return this.$message.error('获取参数数据失败')
      this[type + 'Attrs'] = data
    },
    // 上传成功后需要给  form.pics 数组追加图片
    handleSuccess (res) {
      // 图片地址？  在上传成功后获取响应数据   才有图片地址
      console.log(res)
      this.formData.pics.push({pic: res.data.tmp_path})
    },
    handleRemove (file, fileList) {
      // 删除图片后台触发的事件
      console.log(file, fileList)
      // 移除 formData.pics 中对应的图片对象
      // 根据索引删除一条即可
      // 在file中可以获取当前删除图片的临时路径
      // 根据路径去 formData.pics 获取对应的索引
      const tmpPath = file.response.data.tmp_path
      const index = this.formData.pics.findIndex(item => item.pic === tmpPath)
      this.formData.pics.splice(index, 1)
    },
    handlePictureCardPreview (file) {
      // 预览图片
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 提交数据
    async setNewIno () {
      const {data: {meta}} = await this.$http.post('goods', this.formData)
      if (meta.status !== 201) this.$message.error('添加商品失败')
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
      this.getChecked()
    }
  }
}
