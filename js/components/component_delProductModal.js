export default {
  props: ['tempProduct'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'popeye',
      // delProductModal: null,
    }
  },
  // mounted() {
  // this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, {
  //   keyboard: false,
  //   backdrop: 'static'
  // });
  // },
  methods: {
    delProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then(res => {
          // console.log(res);
          this.$emit('get-products');
          this.delModalHide()
          // this.delProductModal.hide();
          // this.getProducts();
        })
        .catch(err => {
          console.dir(err);
          alert(err.data.message);
        })
    },
    delModalHide() {
      this.$emit('delModalHide')
    }
  },
  template: `
    <div
        id="delProductModal"
        ref="delProductModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="delProductModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
              <h5 id="delProductModalLabel" class="modal-title">
                <span>刪除產品</span>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              是否刪除
              <strong class="text-danger">{{ tempProduct.title }}</strong>
              商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                取消
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
                @click="delProduct"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
}