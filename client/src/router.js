import Vue from 'vue'
import Router from 'vue-router'
import DrawingBoard from './views/DrawingBoard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: DrawingBoard
    }
  ]
})
