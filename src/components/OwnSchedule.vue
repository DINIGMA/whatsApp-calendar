<script setup>
import { useDataStore } from '../stores/data';
import { storeToRefs } from 'pinia';
import { computed, inject, ref } from 'vue';

const dataStore = useDataStore();

// const props = defineProps({
//     time: Number
// })

const {defaultHourCapacity} = inject('bookedSchedules')

// const {getDefualtHourCapacity } = storeToRefs(dataStore);

// const defaultHourCapacity = ref(getDefualtHourCapacity.value[props.time])

const counter = inject('counter')

const procentOwnScheduler = computed(() => {
    if(counter  !== null){
        return ((counter.value  / defaultHourCapacity.value * 100).toFixed(5))
    }
})


</script>    
    

<template>
    <div :style="{ width: `${procentOwnScheduler}%` }">
        <span>{{ counter }}</span>
    </div>
</template>
    

    
<style scoped>

</style>