import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import axios from "axios";

const url = "https://1ba67701b8743229.mokky.dev/whatsapp"

export const useDataStore = defineStore("dataStore", () => {
    const whatsappResponse = ref(null)
    const shedules = ref([])
    

    const getSchedulerInfo = async () => {
        try{
            const {data} = await axios.get(url)
            whatsappResponse.value = data[0];
        }catch(err){
            console.log(err);
        }
        
    }

    const getDates = computed(() => whatsappResponse.value ? whatsappResponse.value.data.dates : null)

    const getDefualtDayCapacity = computed(() => whatsappResponse.value ? whatsappResponse.value.data.default_day_capacity : null)

    const getSchedules = computed(() => whatsappResponse?.value.data?.schedules)

    const getDefualtHourCapacity = computed(() => whatsappResponse?.value.data?.default_hour_capacity)

    const getHourCapacity = computed(() => {
        return (time) => whatsappResponse?.value.data?.default_hour_capacity[time]
    })

    return {
        whatsappResponse,
        getSchedulerInfo,
        getDates,
        getDefualtDayCapacity,
        getSchedules,
        getDefualtHourCapacity,
        getHourCapacity,
    };
})