<script setup>
import BookedSchedule from './BookedSchedule.vue';
import OwnSchedule from './OwnSchedule.vue';
import { useDataStore } from '../stores/data';
import { storeToRefs } from 'pinia';
import { inject, ref, computed } from 'vue';
import _ from 'lodash';

const dataStore = useDataStore();

// const { getSchedules, getDefualtHourCapacity } = storeToRefs(dataStore);

// передать эти данные через provide

const selectedDay = inject('selectedDay')

const {time} = inject('bookedSchedules')

const selectedTime = inject('selectedTime')
const currentDate = computed(() => {
    return {selectedDay: selectedDay.value, time: time.value }
})

//Вынести в timeOptions

// const defaultHourCapacity = ref(getDefualtHourCapacity.value[props.time])

// const getScheduler = () => {
//     const dates = getSchedules.value.find((item) => item.date == props.selectedDay.toISODate() && item.hour == props.time)
//     if(dates){
//         return Number(dates.engaged_count)
//     }else{
//         return null
//     }
// }

</script>

<template>
    <div>
        <BookedSchedule 
        >
        </BookedSchedule>
        <OwnSchedule class="own" v-if="_.isEqual(selectedTime, currentDate) " />

    </div>
  
</template>



<style scoped> 
</style>