import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
<<<<<<< HEAD
=======
import Disc from 'components/disc/disc'
>>>>>>> recommend songList finish

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
<<<<<<< HEAD
      component: Recommend
=======
      component: Recommend,
      // 配置子路由
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
>>>>>>> recommend songList finish
    },
    {
      path: '/singer',
      component: Singer,
      // 配置子路由
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
