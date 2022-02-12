export default {
  props: ['tempProduct', 'isNew'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'popeye',
      modal: null,
      ratings: [1, 2, 3, 4, 5],
      // disabled 控制modal的星星可不可以點
      disabled: false,
      // productModal: null,
    }
  },
  // mounted() {
  //   this.productModal = new bootstrap.Modal(document.getElementById('productModal'), {
  //     keyboard: false,
  //     backdrop: 'static'
  //   });
  // },
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
          this.productModalHide();
          // this.productModal.hide();
        }).catch((err) => {
          alert(err.data.message);
        });
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
    productModalHide() {
      this.$emit('productModalHide');
    },
  },
  template: `<div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
    >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <!-- Modal表頭背景色會隨「新增產品」或「修改產品」不同而變色 -->
        <div
          :class="isNew? 'bg-primary':'bg-success'"
          class="modal-header text-white"
        >
          <h5 id="productModalLabel" class="modal-title text-center">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-8">
              <div class="form-floating mb-3">
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="tempProduct.title"
                />
                <label for="title" class="form-label">標題</label>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <div class="form-floating">
                    <!-- v-model 綁定 tempProduct.category -->
                    <input
                      id="category"
                      type="text"
                      class="form-control"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                    <label for="category" class="form-label">分類</label>
                  </div>
                </div>
                <div class="mb-3 col-md-6">
                  <div class="form-floating">
                    <!-- v-model 綁定 tempProduct.unit -->
                    <input
                      id="unit"
                      type="text"
                      class="form-control"
                      placeholder="請輸入單位"
                      v-model="tempProduct.unit"
                    />
                    <label for="unit" class="form-label">單位</label>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <!-- 產品原價 -->
                  <!-- v-model 綁定 tempProduct.origin_price -->
                  <div class="form-floating">
                    <input
                      id="origin_price"
                      type="number"
                      min="0"
                      class="form-control"
                      placeholder="請輸入原價"
                      v-model="tempProduct.origin_price"
                    />
                    <label for="origin_price" class="form-label"
                      >原價</label
                    >
                  </div>
                </div>
                <div class="mb-3 col-md-6">
                  <!-- 產品售價 -->
                  <!-- v-model 綁定 tempProduct.price -->
                  <div class="form-floating">
                    <input
                      id="price"
                      type="number"
                      min="0"
                      class="form-control"
                      placeholder="請輸入售價"
                      v-model="tempProduct.price"
                    />
                    <label for="price" class="form-label">售價</label>
                  </div>
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <div class="form-floating">
                  <!-- v-model 綁定 tempProduct.description -->
                  <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    placeholder="請輸入產品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                  <label for="description" class="form-label"
                    >產品描述</label
                  >
                </div>
              </div>
              <div class="mb-3">
                <div class="form-floating">
                  <!-- v-model 綁定 tempProduct.content -->
                  <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    placeholder="請輸入說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                  <label for="content" class="form-label">說明內容</label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-floating">
                  <!-- v-model 綁定 tempProduct.recommend -->
                  <textarea
                    id="description"
                    type="text"
                    class="form-control"
                    placeholder="請輸入說明內容"
                    v-model="tempProduct.recommend"
                  ></textarea>
                  <label for="content" class="form-label">專家推薦</label>
                </div>
              </div>
             <div class="mb-3">
               <h6>專家評等： {{tempProduct.starNum}} 顆星</h6>
              <label class="star-rating__star" v-for="(rating,index) in ratings"
              :class="{'is-selected': tempProduct.starNum >= rating,'is-disabled': disabled }">
              <input class="star-rating star-rating__checkbox" type="radio" :value="rating"
              v-model="tempProduct.starNum" :disabled="disabled">★</label>
             </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="tempProduct.is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="uploadImg" class="form-label">新增主圖</label>
                <input type="file" class="form-control mb-3" id="uploadImg" ref="pathClear" @change="upload('main',$event)"><img class="img-fluid" :src="tempProduct.imageUrl"/>
                <button class="btn btn-outline-danger btn-sm d-block w-100" v-if="tempProduct.imageUrl" @click="tempProduct.imageUrl=''" >刪除檔案</button>
              </div>
              <!-- 多圖設置 file選擇檔案 -->
              <div class="mb-3">
                <div v-if="Array.isArray(tempProduct.imagesUrl)">
                  <label for="uploadImgs" class="form-label">多圖設置</label>
                  <input v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length-1] "
                      type="file"
                      class="form-control mb-3"
                      id="uploadImgs" ref="pathesClear"
                      @change="upload('sub',$event)"
                  />
                  <template v-for="(img,index) in tempProduct.imagesUrl" :key="index">
                    <img class="img-fluid" :src="tempProduct.imagesUrl[index]" />
                    <button class="btn btn-outline-danger btn-sm d-block w-100 mb-3"
                    @click="tempProduct.imagesUrl.splice(index,1)">刪除檔案</button>
                  </template>
                </div>
                <div v-else>
                  <label for="uploadImgs" class="form-label">多圖設置</label>
                  <input
                  type="file"
                  class="form-control"
                  id="uploadImgs"
                  placeholder="請輸入圖片網址b"
                  @change="upload('sub',$event)"
                />
                </div>
              </div>
            </div>
            <!-- button end -->
          </div>
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
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="updateProduct"
          >
            確認
          </button>
        </div>
      </div>
    </div>
    </div>`,
}