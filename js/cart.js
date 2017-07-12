
Vue.filter('money',function(value,type){
    return '￥'+value.toFixed(2)+type;
});
var vm = new Vue({
    el:"#app",
    data:{
        productList:[],
        totalMoney:0,
        checkAllFlag : false,
        delFlag:false,
        productCode:0
    },
    filters:{
        formatMoney:function(value){
            return '￥'+value.toFixed(2);
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            this.cartView();
        })
    },
    methods:{
        cartView:function(){
            this.$http.get('data/cartData.json').then(res=>{
                this.productList = res.data.result.list;
            })
        },
        changeMoney:function(product,way){
            if(way>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity=1;
                }
            }
            this.calcProductTotal();
        },
        selectedProduct:function(item){
            if(typeof item.checked == 'undefined'){
                this.$set(item,'checked',true)
            }else{
                item.checked = !item.checked
            }
            this.calcProductTotal();
            this.judgeProductAll();
        },
        judgeProductAll:function(){
            let n=0;
            for(var i=0;i<this.productList.length; i++){
                if(this.productList[i].checked != 'undefined' && this.productList[i].checked == true){
                    n++;
                }
            }
            if(n == this.productList.length){
                this.checkAllFlag = true;
            }else{
                this.checkAllFlag = false;
            }
        },
        checkAll:function(flag){
            this.checkAllFlag = flag;
            this.productList.forEach((item,index)=>{
                if(typeof item.checked == 'undefined'){
                    this.$set(item,'checked',true)
                }else{
                    item.checked = flag
                }
            });
            this.calcProductTotal();
        },
        calcProductTotal:function(){
            this.totalMoney = 0;
            this.productList.forEach((item,index)=>{
                if(item.checked){
                    this.totalMoney += item.productPrice*item.productQuantity
                }
            })
        },
        delProduct:function(index){
            this.delFlag = true;
            this.productCode = index;
        },
        confirmProduct:function(){
            this.productList.splice(this.productCode,1);
            this.delFlag = false;
            this.judgeProductAll();
        }
    }
});
