import Vue from 'vue'
import Router from 'vue-router'
import DrawingBoard from './views/DrawingBoard.vue'
import DataTable from './views/DataTable.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: DrawingBoard
    },
    {
      path: '/draw',
      name: 'draw',
      component: DrawingBoard
    },
    {
      path: '/input-data',
      name: 'input-data',
      component: DataTable
    }
  ]
})
