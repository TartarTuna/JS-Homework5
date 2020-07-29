//匯入中文語系
import zh_TW from './zh_TW.js';

//加入語系設定檔
VeeValidate.localize('tw', zh_TW);

//註冊 input 全域驗證表單元件
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
// // 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

// Class 設定檔案
VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    }
});

Vue.component("loading", VueLoading);

new Vue({
    el: "#app",
    data: {
        uuid: "0b14219f-1a37-44d4-8d67-88e77b0f312a",
        apiPath: "https://course-ec-api.hexschool.io",
        products: [],
        tempProduct: {
            imageUrl: [],
        },
        status: {
            loadingItem: ""
        },
        carts: [],
        totalPrice: 0,
        isLoading: false,
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: ''
        }
    },
    methods: {
        getProducts(page = 1) {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/products?page=${page}`;
            axios.get(url).then(res => {
                console.log(res);
                this.isLoading = false;
                this.products = res.data.data;
            }).catch(err => {
                this.isLoading = false;
            });
        },
        getProduct(id) {
            this.status.loadingItem = id;
            const url = `${this.apiPath}/api/${this.uuid}/ec/product/${id}`;
            axios.get(url).then(res => {
                console.log(res);
                this.status.loadingItem = "";
                this.tempProduct = res.data.data;
                this.tempProduct.num = 1;
                $("#productModal").modal("show")
            });
        },
        addToCart(id, quantity = 1) {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity,
            };
            console.log(cart);
            axios.post(url, cart).then(res => {
                this.isLoading = false;
                console.log(res);
            }).catch(err => {
                this.isLoading = false;
                console.log(err.response);
            });
        },
        getCart() {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            axios.get(url).then(res => {
                console.log("購物車", res)
                this.carts = res.data.data;
                this.updateTotal();
                this.isLoading = false;
            });
        },
        updateTotal() {
            this.totalPrice = 0;
            this.carts.forEach(item => {
                this.totalPrice += item.product.price * item.quantity;
            });
        },
        updateQuantity(id, quantity) {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity,
            };
            console.log(cart);
            axios
                .patch(url, cart)
                .then(res => {
                    this.getCart();
                    this.isLoading = false;
                }).catch(err => {
                    this.isLoading = false;
                    console.log(err.response);
                });
        },
        removeAllCartItem() {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/all/product`;

            axios.delete(url)
                .then(() => {
                    this.isLoading = false;
                    this.getCart();
                });
        },
        removeCartItem(id) {
            this.isLoading = true;
            const url = `${this.apiPath}/api/${this.uuid}/ec/shopping/${id}`;

            axios
                .delete(url)
                .then(() => {
                    this.isLoading = false;
                    this.getCart();
                });
        },
        confirm() {
            this.isLoading = true;
            $("#confirmModal").modal("show");
            this.isLoading = false;
        },
    },
    created() {
        this.getProducts();
        this.getCart();
    }
});