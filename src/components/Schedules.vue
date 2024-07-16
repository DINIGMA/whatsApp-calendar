<script setup>
import BookedSchedule from './BookedSchedule.vue';
import { useDataStore } from '../stores/data';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const dataStore = useDataStore();

const { getSchedules, getDefualtHourCapacity } = storeToRefs(dataStore);

const props = defineProps({
    selectedDay: Object,
    time: Number,
})

const defaultHourCapacity = ref(getDefualtHourCapacity.value[props.time])

const getScheduler = () => {
    const dates = getSchedules.value.find((item) => item.date == props.selectedDay.toISODate() && item.hour == props.time)
    if(dates){
        return Number(dates.engaged_count)
    }else{
        return null
    }
}



</script>

<template>
    <div>
        <BookedSchedule 
            :scheduler="getScheduler()"
            :defaultHourCapacity="defaultHourCapacity"
        >
        </BookedSchedule>
    </div>
  
</template>



<style scoped> 
</style>