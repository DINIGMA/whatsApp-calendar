<script setup>
import { useDataStore } from '../stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const dataStore = useDataStore();
const {getDefualtHourCapacity } = storeToRefs(dataStore);


const props = defineProps({
    scheduler: Number,
    defaultHourCapacity: Number
})

const procentBookedScheduler = computed(() => {
    if(props.scheduler !== null){
        return ((props.scheduler / props.defaultHourCapacity) * 100).toFixed(5)
    }
})



</script>    
    

<template>
    <div v-if="procentBookedScheduler" :style="{ width: `${procentBookedScheduler}%` }">
        <span>{{ scheduler }}</span>
    </div>
</template>
    

    
<style scoped>

</style>