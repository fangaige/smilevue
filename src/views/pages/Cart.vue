<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar :title="isBuy ? '结算': '购物车'" left-text="返回" left-arrow @click-left="onClickLeft">
              <!-- <van-icon name="search" slot="right" /> -->
              <van-button size="small" round  slot="right"  type="danger" @click="clearCart" v-if="!isBuy">
                  清空购物车
              </van-button>
            </van-nav-bar>
        </div>

        <van-checkbox-group class="card-goods" v-model="checkedGoods">
          <van-checkbox
            :disabled ="isBuy"
            class="card-goods__item"
            v-for="item in cartInfo"
            :key="item.selectedSkuComb.id"
            :name="item.selectedSkuComb.id"
          >
            <van-card
              :title="item.title"
              :desc="showDesc(item)"
              :num="item.selectedNum"
              :thumb="showImage(item.skuAttrText)"
            >
               <div slot="tags" class="redcolor">
                   <span>{{moneySign}}{{item.selectedSkuComb.price | toDivide}}</span>
               </div>
               <div v-if="!isBuy" slot="footer">
                 <van-button size="mini" plain hairline type="danger" @click.stop ="clearCartOne(item.selectedSkuComb.id)">清除</van-button>
               </div>
           </van-card>
          </van-checkbox>
        </van-checkbox-group>
        <van-row style="padding: 10px">
             <van-col>
                 <van-radio-group v-model="radio">
                   <van-radio name="1">
                     <span style="font-size: 14px">货到付款</span> <img src="/src/assets/images/cash.jpg" alt="">
                   </van-radio>
                   <!-- <van-radio name="2">
                     单选框 2
                     <img
                       slot="icon"
                       slot-scope="props"
                       :src="props.checked ? icon.active : icon.inactive"
                     >
                   </van-radio> -->
                 </van-radio-group>
             </van-col>
        </van-row>
        <van-cell-group>
          <van-field
            v-model="name"
            required
            clearable
            label="姓名"
            placeholder="请输入姓名"
            :error-message="errName"
          />
        
          <van-field
            v-model="telephone"
            label="电话号码"
            clearable
            clickable
            placeholder="请输入电话号码"
            required
            :error-message="errTelephone"
          />
          <van-field
            v-model="email"
            label="邮箱"
            clearable
            clickable
            placeholder="请输入邮箱"
          />
          <van-field
            v-model="short_address"
            label="省市区"
            clearable
            clickable
            placeholder="请输入省市区"
            required
            :error-message="errShort_address"
          />
            <van-field
            v-model="address"
            label="详细地址"
            clearable
            clickable
            placeholder="请输入详细地址"
            required
            :error-message="errAddress"
          />
            <van-field
            v-model="message"
            label="留言"
            clearable
            clickable
            placeholder="请输入留言"
          />
        </van-cell-group>
        <van-submit-bar
        class="left50"
          :price="totalMoney"
          :disabled="!checkedGoods.length"
          button-text="结算"
          @submit="onSubmit"
        />
    </div>
    
</template>

<script>
    import axios from 'axios'
    import {Toast} from 'vant'
    import url from '@/serviceAPI.config.js'
    import { toMoney, toDivide} from '@/filter/moneyFilter.js'
    export default {
       data() {
           return {
               radio: '1',
               cartInfo: [] ,
               isEmpty: false ,
               checkedGoods: [],
               malldata: [],
               malldataOrder:[],
               countPrice: null,
               isBuy: false,
               name: '',
               telephone: '',
               address: '',
               short_address:'',
               email: '',
               message: '',
               errName:'',
               errTelephone:'',
               errAddress: '',
               errShort_address: ''
           }
          
       }, 
       created(){
           this.getCartInfo()
       },
       mounted() {console.log(this.cartInfo)},
       computed:{
           totalMoney(){
               this.malldata = []
               this.malldataOrder = []
               this.countPrice = null
               this.checkedGoods.forEach(element => {
                   this.cartInfo.forEach(ele => {
                       let obj = {} 
                       if(ele.selectedSkuComb.id === element){
                          obj.good_id = ele.goodsId
                          obj.sku_id = ele.selectedSkuComb.id //如果=goodsId说明是无规格没有sku
                          obj.messages = ele.messages.message_0
                          obj.price = ele.selectedSkuComb.price
                          obj.sku_nums = ele.selectedNum
                          this.malldata.push(obj)     //这个数据发给后台
                          this.malldataOrder.push(ele)     //这个数据发给ordersuccess页面
                          this.countPrice += obj.price * obj.sku_nums
                       }
                   });
               });
               console.log(this.malldata,this.countPrice)

               return this.countPrice
           },
           moneySign(){
               return this.$store.money_sign
           }
       },
       filters:{
           moneyFilter(money){
               return toMoney(money)
           },
           toDivide (money){
               return toDivide(money)
           }
       },
       methods: {
           onClickLeft () {
               this.$router.go(-1)
           },
            //得到购物车数据的方法
            getCartInfo() { 
                let skuData = this.$route.params.skuData ? this.$route.params.skuData : this.$route.query.skuData

                 this.isBuy = skuData ? true : false //立即购买还是购物车
                if(this.isBuy){
                    console.log(this.$route.params.skuData)
                    this.cartInfo.push(skuData)
                    this.checkedGoods.push(skuData.selectedSkuComb.id)
                }else{
                   if(localStorage.cartInfo){
                    this.cartInfo=JSON.parse(localStorage.cartInfo)
                   } 
                   console.log(' this.cartInfo:'+JSON.stringify(this.cartInfo))
                   this.isEmpty=this.cartInfo.length>0 ?true : false
                }
            
            },
            clearCart(){
                localStorage.removeItem('cartInfo')
                this.cartInfo=[]
            },
            onSubmit(){
               this.errName=''
               this.errTelephone=''
               this.errAddress=''
               if(this.name === ''){
                   this.errName = '姓名不能为空！';return
               }else if (this.telephone===''){
                   this.errTelephone = '电话不能为空！';return
               }else if (this.short_address===''){
                   this.errShort_address = '省市区不能为空！';return
               }else if(this.address===''){
                   this.errAddress = '详细地址不能为空！';return
               }
                console.log(this.malldata,this.countPrice)
                let data = {}
                data.cart_data = this.malldata
                data.countPrice = this.countPrice
                data.receiver_name = this.name
                data.receiver_phone = this.telephone
                data.receiver_email = this.email
                data.address = this.address
                data.short_address = this.short_address

                axios({
                    url:url.sendOrderInfo,
                    method:'post',
                    data: data
                })
                .then(response=>{
                    console.log(response)
                    if(response.status== 200 && response.data.success){
                        //如果不是直接购买，下单成功后删除对应购物车商品
                        if(!this.isBuy){
                          let cartInfo1=JSON.parse(localStorage.cartInfo)
                          //筛选购物车去掉已经买过的留下还没买的
                          let newCart = cartInfo1.filter(value => {
                             if (this.checkedGoods.every(function(val){return val != value.selectedSkuComb.id})){ return value}
                            })
                          localStorage.cartInfo =  JSON.stringify(newCart)       
                        }
                      this.$router.push({name:'order',params:{orderData: this.malldataOrder,orderResponse: response.data.data}})
                      
                    }else{
                        Toast('服务器错误，数据提交失败')
                    }
                })

            },
            showImage(skuAttrText) {
                let img=''
                skuAttrText.forEach(element => {
                    if(element.imgUrl){img= element.imgUrl }
                })
                return img

            },
            showDesc(item){
                return item.skuAttrText.map(ele=>{return ele.name}).join('/')+'   '+item.messages.message_0
            },
            clearCartOne(id){
                for(let i=0;i<this.cartInfo.length;i++){
                    if(this.cartInfo[i].selectedSkuComb.id === id){
                        this.cartInfo.splice(i,1);break
                    }
                }
                let cartIn = JSON.parse(localStorage.cartInfo)
                for(let i=0;i<cartIn.length;i++){
                    if(cartIn[i].selectedSkuComb.id === id){
                        cartIn.splice(i,1);break
                    }
                }
                localStorage.cartInfo = JSON.stringify(cartIn)
            }
        },
    }
</script>

<style scoped>
.cart-title{
    height: 2rem;
    line-height: 2rem;
    background-color: #fff;
    border-bottom:1px solid #E4E7ED;
    padding:5px;
    text-align:right;
}

.cart-list{
    background-color: #fff;
}
.pang-row{
    display: flex;
    flex-direction: row;
    flex-wrap:nowrap;
    padding:0.5rem;
    font-size:0.85rem;
    border-bottom:1px solid #E4E7ED;
}

.pang-img{
    flex:6;
}
.pang-text{
    flex:14;
    padding-left:10px;
}
.pang-control{
    padding-top:10px;
}
.pang-goods-price{
    flex:4;
    text-align: right;
}
.allPrice{
    color:red;
}
.redcolor{
    color:#f44
}
.totalMoeny{
    text-align: right;
    background-color: #fff;
    border-bottom:1px solid #E4E7ED;
    padding:5px;
}
.card-goods {
  padding: 10px 0;
  background-color: #fff;
}
.card-goods .card-goods__item {
  position: relative;
  background-color: #fafafa;
}
.card-goods .card-goods__item >>> .van-checkbox__label {
      width: 100%;
      height: auto; 
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }
.card-goods .card-goods__item >>> .van-checkbox__icon {
      top: 50%;
      left: 10px;
      z-index: 1;
      position: absolute;
      margin-top: -10px;
    }
.card-goods .card-goods__item >>> .van-card__price {
      color: #f44;
    }
</style>