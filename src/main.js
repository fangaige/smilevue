import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Divider , SwipeCell , SubmitBar , Card , Checkbox , CheckboxGroup , Image , Icon , Sku , GoodsAction, GoodsActionIcon, GoodsActionButton ,Cell, CellGroup ,Tabbar,TabbarItem,PullRefresh,Stepper,Tab,Tabs,Button, Row, Col, Swipe, SwipeItem , Lazyload ,List ,Field, NavBar } from 'vant'

Vue.use(Divider).use(SwipeCell).use(SubmitBar).use(Card).use(Checkbox).use(CheckboxGroup).use(Image).use(Icon).use(Sku).use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton).use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem).use(Stepper).use(PullRefresh).use(Tab).use(Tabs).use(Field).use(NavBar).use(Button).use(Row).use(Col).use(Swipe).use(SwipeItem).use(Lazyload).use(List)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
