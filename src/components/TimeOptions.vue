<script setup>
import { useDataStore } from '../stores/data';
import Schedules from './Schedules.vue';
import { storeToRefs } from 'pinia';
import { computed, provide, ref, inject } from 'vue';
import {DateTime} from 'luxon';


const dataStore = useDataStore();
const emits = defineEmits(['update-value']);

const selectedDay = inject('selectedDay')

const props = defineProps({
    time: Number,
})

const { getSchedules, getHourCapacity } = storeToRefs(dataStore);

const defaultHourCapacity = ref(getHourCapacity.value(props.time))

const time = ref(props.time)

// const getScheduler = () => {
//     const dates = getSchedules.value.find((item) => item.date == props.selectedDay.toISODate() && item.hour == props.time)
//     if(dates){
//         return Number(dates.engaged_count)
//     }else{
//         return null
//     }
// }

const getBookedScheduler = computed(() => {
    const dates = getSchedules.value.find((item) => item.date == selectedDay.value.toISODate() && item.hour == props.time)
    if(dates){
        return Number(dates.engaged_count)
    }else{
        return null
    }
})

const bookedSchedules = provide('bookedSchedules', {
    defaultHourCapacity,
    getBookedScheduler,
    time,
})

// getHourCapacity.value(props.time)

const nowDate = ref(DateTime.local())

// Сделать проверку на время(переполнение)

const selectTime = () => {
    if(selectedDay.value > nowDate.value){
        emits('update-value', {
            selectedDay: selectedDay.value,
            time: props.time
        })  
    }
}

//`${selectedDay.value.toISODate()} ${props.time}:00`

function isPastDate(date){
    return (date < nowDate.value) ? true : false
}



</script>    
    

<template>
    <div class="calendar__time-options-item" @click="selectTime">
        <Schedules 
            class="schedules"
            :class="{'schedules_filled' : isPastDate(selectedDay)}"
            >
        </Schedules>
    </div>
</template>
    

    
<style scoped>

</style>