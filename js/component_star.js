export default {
    props: {
        'starNum': {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            tempValue: this.starNum,
            ratings: [1, 2, 3, 4, 5]
        };
    },
    methods: {
        set(index) {
            if (!this.disabled) {
                return this.tempValue = index + 1;
            }
        }
    },
    template: `<div class="star-rating">
    <label class="star-rating__star" v-for="(rating,index) in ratings" 
    :class="{'is-selected': ((tempValue >= rating) && tempValue != null),'is-disabled': disabled}" 
    @click="set(index)">
    <input class="star-rating star-rating__checkbox" type="radio" :value="rating" 
    v-model="tempValue" :disabled="disabled">{{rating}}★{{value}}</label></div>`,
};
