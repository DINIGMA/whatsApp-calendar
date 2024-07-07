import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import axios from "axios";

const url = "https://1ba67701b8743229.mokky.dev/whatsapp"

export const useDataStore = defineStore("dataStore", () => {
    const whatsappResponse = ref(null)


    const getSchedulerInfo = async () => {
        try{
            const {data} = await axios.get(url)
            whatsappResponse.value = data[0];
            console.log(whatsappResponse.value.data.dates);
        }catch(err){
            console.log(err);
        }
        
    }

    const getDates = computed(() => whatsappResponse.value ? whatsappResponse.value.data.dates : null)

    const getDefualtDayCapacity = computed(() => whatsappResponse.value ? whatsappResponse.value.data.default_day_capacity : null)

    return {
        whatsappResponse,
        getSchedulerInfo,
        getDates,
        getDefualtDayCapacity
    };
})