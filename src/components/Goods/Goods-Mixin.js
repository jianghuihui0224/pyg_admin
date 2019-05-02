export default {
  name: 'Goods',
  data () {
    return {
      goodsList: [],
      // 发请求时带的参数
      goodParams: {
        // 搜索框绑定
        query: '',
        // 表格当前页显示的是第几页
        pagenum: 1,
        // 表格一页显示几条
        pagesize: 5
      },
      // 总条数
      goodPages: 0,
      // 搜索后显示的永远是第一页
      currentPage: 0,
      // 编辑商品名称
      editDialogFormVisible: false,
      goodsNewName: {
        goods_name: '',
        goods_id: null
      },
      editFormRules: {
        goods_name: [
          {required: true, message: '商品名称必填', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getGoods()
  },
  methods: {
    async getGoods () {
      const {
        data: {
          data,
          meta
        }
      } = await this.$http.get('goods', {
        params: this.goodParams
      })
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.goodsList = data.goods
      this.goodPages = data.total
    },
    // 分页显示对应数据事件
    changePage (newPage) {
      // console.log(newPage)
      // 让表格显示的页码为分页页码对应的页数
      this.goodParams.pagenum = newPage
      // 获取数据
      this.getGoods()
    },
    // 搜索商品
    searchGoods () {
      // 获取数据
      this.getGoods()
      // 表格显示第一页
      this.goodParams.pagenum = 1
      // 永远先显示第一页
      this.currentPage = 1
    },
    // 删除商品
    delGood (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {
          data: {
            meta
          }
        } = await this.$http.delete(`goods/${id}`)
        if (meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        this.getGoods()
      })
    },
    // 编辑商品名称
    async editGood (id) {
      // const {data: {meta}} = await this.$http.put(`goods/${id}`)
      // if (meta.status !== 200) return tis.$message.error('修改商品')
      this.editDialogFormVisible = true
      const {data: {data, meta}} = await this.$http.get(`goods/${id}`)
      if (meta.status !== 200) return this.$message.error('获取商品名称失败')
      // console.log(data)
      this.goodsNewName = data
    },
    // editGoodName () {
    //   this.$refs.editForm.validate(async valid => {
    //     const {data: {meta}} = await this.$http.put(`goods/${this.goodsNewName.goods_id}`)
    //     if (meta.status !== 200) return this.$message.error('编辑商品名称失败')
    //     this.$message.success('删除商品名称成功')
    //     this.getGoods()
    //   })
    // }
    // 跳转到添加商品页
    changeGoodsAdd () {
      this.$router.push('/goods/add')
    }
  }
}
