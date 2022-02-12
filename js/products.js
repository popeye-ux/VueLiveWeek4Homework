import pagination from './components/component_pagination.js'
import delProductModal from './components/component_delProductModal.js'
import productModal from './components/component_productModal.js'
const vm = Vue.createApp({
    data() {
        return {
            // 產品資料格式
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            delProductModal: null,
            productModal: null,
            //isNew判斷是「新增產品」或「編輯產品」
            isNew: false,
            pagination: {},
            ratings: [1, 2, 3, 4, 5],
            // disabled 控制app表格的星星可不可以點
            disabled: "true",
            // delItemId: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
        }
    },
    components: {
        pagination,
        delProductModal,
        productModal,
    },
    methods: {
        //確認是否登入
        checkLogin() {
            // this.url要加上，不然沒有cookie的時候，不會導向登入頁面
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    // console.log(res.data);
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
                    // console.log(this.products);
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
                this.productModal.show();
                // 點擊「修改產品」，帶入的參數為 edit
            } else if (newEditDel === 'edit') {
                this.tempProduct = { ...item };
                // console.log(this.tempProduct.id);
                //if (!this.isNew) 使用put方法
                this.isNew = false;
                this.productModal.show();
                // 點擊「刪除產品」，帶入的參數為 delete
            } else if (newEditDel === 'delete') {
                this.tempProduct = { ...item };
                // console.log(this.tempProduct);
                this.delProductModal.show();
            }
        },
        hideDelModal() {
            this.delProductModal.hide();
        },
        hideProductModal() {
            this.productModal.hide();
        },
    },
    mounted() {
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common["Authorization"] = token;
        this.checkLogin();
        this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal.$el, {
            keyboard: false,
            backdrop: 'static'
        });
        this.productModal = new bootstrap.Modal(this.$refs.productModal.$el, {
            keyboard: false,
            backdrop: 'static'
        });
    },

})

vm.mount('#app')