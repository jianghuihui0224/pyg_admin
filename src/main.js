import Vue from 'vue'
import App from './App'
import router from './router'
// 引入moment
import moment from 'moment'

// 引入fonts图标文件
import './assets/fonts/iconfont.css'

// 引入axios,进行全局配置
import axios from './http'

// 引入element-ui组件库
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入全局样式global.css
import './assets/css/global.css'

// 引入富文本插件
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor/* { default global options } */)

// 配置全局时间格式转换过滤器
Vue.filter('ft', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

// 配置全局axios
Vue.prototype.$http = axios

// 注册element-ui组件库,第二个参数为组件库的配置项
Vue.use(ElementUi, {size: 'small'})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
