import pagination from './component_pagination.js'


let productModal = null;
let delProductModal = null;
const vm = Vue.createApp({
    data() {
        return {
            // 產品資料格式
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            //isNew判斷是「新增產品」或「編輯產品」
            isNew: false,
            pagination: {},
            // delItemId: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
        }
    },
    components: {
        pagination,
    },

    methods: {
        //確認是否登入
        checkLogin() {
            // this.url要加上，不然沒有cookie的時候，不會導向登入頁面
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    console.log(res.data);
                    this.getProducts();
                }).catch((err) => {
                    console.log(err);
                    window.location = 'index.html';
                })
        },
        //取得所有產品的資料，並渲染到網頁上
        // page參數設定預設值1
        getProducts(page = 1) {
            // page 是 query
            const url = `${this.apiUrl}/api/${this.path}/admin/products?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    console.log(this.products);
                })
                .catch(err => {
                    console.dir(err);
                    alert(err.data.message);
                })
        },

        openModal(newEditDel, item) {
            // 點擊「新增產品」，帶入的參數為 new
            if (newEditDel === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                    starNum: 0,
                };
                this.isNew = true;
                productModal.show();
                // 點擊「修改產品」，帶入的參數為 edit
            } else if (newEditDel === 'edit') {
                this.tempProduct = { ...item };
                console.log(this.tempProduct.id);
                //if (!this.isNew) 使用put方法
                this.isNew = false;
                productModal.show();
                // 點擊「刪除產品」，帶入的參數為 delete
            } else if (newEditDel === 'delete') {
                this.tempProduct = { ...item };
                console.log(this.tempProduct);
                delProductModal.show();
            }
        },


    },
    mounted() {

        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common["Authorization"] = token;
        this.checkLogin()
    }
})
// 新增及修改產品對話視窗元件
vm.component('productModal', {
    template: '#productModalId',
    props: ['tempProduct', 'isNew'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
            modal: null,
            tempValue: this.tempProduct.starNum,
            ratings: [1, 2, 3, 4, 5]
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
        this.set(this.tempProduct.starNum);
    },
    methods: {
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.path}/admin/product`;
            let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }
            axios[http](url, { data: this.tempProduct })
                .then((response) => {
                    alert(response.data.message);
                    // this.getProducts(); 這裡沒有getProducts()--外層的方法
                    this.$emit('get-products');
                    productModal.hide();

                }).catch((err) => {
                    alert(err.data.message);
                })
        },
        upload(isMain, event) {
            // console.dir(event);
            let file = event.target.files[0];
            // console.log(file);
            const formData = new FormData();
            formData.append('file-to-upload', file);
            axios.post(`${this.apiUrl}/api/${this.path}/admin/upload`, formData)
                .then(res => {
                    console.log(res.data.imageUrl);
                    if (isMain === "main") {
                        this.tempProduct.imageUrl = res.data.imageUrl;
                        this.$refs.pathClear.value = ''
                    } else if (isMain === "sub" && !Array.isArray(this.tempProduct.imagesUrl)) {
                        this.tempProduct.imagesUrl = [];
                        console.log("a", res.data.imageUrl);
                        this.tempProduct.imagesUrl.push(res.data.imageUrl);
                        this.$refs.pathesClear.value = ''
                    } else if (isMain === "sub" && Array.isArray(this.tempProduct.imagesUrl)) {
                        console.log("b", res.data.imageUrl);
                        this.tempProduct.imagesUrl.push(res.data.imageUrl);
                        this.$refs.pathesClear.value = ''
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        set(index) {
            if (!this.disabled) {
                this.tempValue = index + 1;
                console.log(this.tempProduct.starNum);
            }
        },
        // createImages() {
        //     this.tempProduct.imagesUrl = [];
        //     this.tempProduct.imagesUrl.push('');
        // },
        // openModal() {
        //     productModal.show();
        // },
        // hideModal() {
        //     productModal.hide();
        // }
    },
});
//刪除產品對話視窗元件
vm.component('delProductModal', {
    template: '#delProductModalId',
    props: ['tempProduct'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
            modal: null,
        }
    },
    mounted() {
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        delProduct() {
            const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    this.$emit('get-products')
                    delProductModal.hide();
                    // this.getProducts();
                })
                .catch(err => {
                    console.dir(err);
                    alert(err.data.message);
                })
        },
    }
})
vm.mount('#app')