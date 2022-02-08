const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'popeye',
            uploadImgUrl: '',
        }
    },
    methods: {
        upload(event) {
            console.dir(event);
            let file = event.target.files[0];
            console.log(file);
            const formData = new FormData();
            formData.append('file-to-upload', file);
            axios.post(`${this.apiUrl}/api/${this.path}/admin/upload`, formData)
                .then(res => {
                    console.log(res.data.imageUrl);
                    this.uploadImgUrl = res.data.imageUrl;
                })
                .catch(err => {
                    console.log(err.response);
                })
        }
    },
    mounted() {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common["Authorization"] = token;
        console.log(this);
    }
})

app.mount('#app')