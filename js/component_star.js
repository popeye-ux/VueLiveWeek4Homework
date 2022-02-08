export default {
    props: ['starValue'],
    data() {
        return {
            tempValue: 0,
            ratings: [1, 2, 3, 4, 5],
            starValue: null
        };
    },
    methods: {
        starOver(index) {
            this.starValue = index + 1;
        },
        starOut(index) {
            return this.starValue = index + 1;
        },
        starClick(index) {
            this.starValue = index + 1;

        },
    },
    mounted() {

    },
    template: `<label class="star-rating__star" v-for="(star,index) in ratings" :key="index" @click="starClick(index)" @mouseover="starOver(index)" @mouseOut="starOut(index)" :class="{'is-selected':((value >= star) && value != null)}">
    <input class="star-rating star-rating__checkbox" type="radio" :value="star" v-model="starValue">★</label>`
}