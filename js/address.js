new Vue({
    el: '.container',
    data: {
        limitNum: 3,
        addressList: [],
        currentIndex: 0,
        shippingMethod:1,
        delAddressPopup:0,
        addressIndex:0,
        editAndAddAddress:0
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getAddressList();
        });
    },
    computed: {
        filterAddress: function () {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        getAddressList: function () {
            this.$http.get("data/address.json").then((response)=> {
                if (response.data.status = "0") {
                    this.addressList = response.data.result;
                }
            });
        },
        loadMore: function () {
            this.limitNum = this.addressList.length;
        },
        setDefault:function(addressId){
            this.addressList.forEach(function(address,index){
                if(address.addressId == addressId){
                    address.isDefault = true;
                }else{
                    address.isDefault=false;
                }
            })
        },
        delAddress:function(index){
            this.delAddressPopup = 1;
            this.addressIndex = index;
        },
        confirmDeleteAddress:function(){
            this.addressList.splice(this.addressIndex,1);
            this.delAddressPopup = 0;
        },
        editAddress:function(index){
            this.delAddressPopup = 2;
            this.addressIndex = index;
            this.editAndAddAddress = 1
            this.$refs.name.value=this.addressList[this.addressIndex].userName;
            this.$refs.address.value=this.addressList[this.addressIndex].streetName;
            this.$refs.tel.value=this.addressList[this.addressIndex].tel;
        },
        saveAddress:function(type){
            if(type>1){
                if(this.$refs.name.value =='' || this.$refs.address.value =='' || this.$refs.tel.value ==''){
                    alert('某一项内容不能为空')
                    return
                }else{
                    this.addressList[this.addressIndex].userName = this.$refs.name.value;
                    this.addressList[this.addressIndex].streetName = this.$refs.address.value;
                    this.addressList[this.addressIndex].tel = this.$refs.tel.value;
                    this.delAddressPopup = 0;
                }
            }else{
                var newAddress={
                    "addressId": this.addressList[this.addressList.length],
                    "userName": this.$refs.name.value,
                    "streetName": this.$refs.address.value,
                    "postCode": "100001",
                    "tel": this.$refs.tel.value,
                    "isDefault": false
                }
                this.addressList.push(newAddress);
                this.loadMore();
                this.delAddressPopup = 0;
            }
        },
        addAddress:function(){
            this.editAndAddAddress = 0;
            this.delAddressPopup = 2;
        }
    }
});
