<script setup>
import { useDataStore } from '../stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref, inject } from 'vue';

const dataStore = useDataStore();


const { defaultHourCapacity ,getBookedScheduler } = inject("bookedSchedules")

const procentBookedScheduler = computed(() => {
    if(getBookedScheduler.value !== null){
        return ((getBookedScheduler.value / defaultHourCapacity.value) * 100).toFixed(5)
    }
})

</script>    
    

<template>
    <div v-if="procentBookedScheduler" :style="{ width: `${procentBookedScheduler}%` }">
        <span>{{ procentBookedScheduler >20?"Забронированно:" : null }} {{procentBookedScheduler > 2 ? getBookedScheduler : null }}</span>
    </div>
</template>
    

    
<style scoped>

</style>