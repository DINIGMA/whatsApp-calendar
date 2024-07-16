
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useDataStore } from '../stores/data';
// import useDataStore from '../stores/data'
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import { storeToRefs } from 'pinia';


const dataStore = useDataStore();


const dt = DateTime.local()



const isDatePrev = ref(false)

// const dates = computed(() => dataStore.whatsappResponse.data.dates)
const { whatsappResponse, getDates, getDefualtDayCapacity } = storeToRefs(dataStore);





const currentDate = ref(new Date)
const nowDate = ref(new Date)
const currentMonth = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

function isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}


function isPastDate(date){
    return (date < nowDate.value) ? true : false
}

function isNotCurrentDate(date){
    const lastDayMonth = new Date(
        currentDate.value.getFullYear(), 
        currentDate.value.getMonth() + 1, 
        0
    )
    const firstDayOfMonth = new Date(
        currentDate.value.getFullYear(), 
        currentDate.value.getMonth(), 
        1
    )
    return ( (date > lastDayMonth || date < firstDayOfMonth) & date > nowDate.value) ? true : false
}

const calendar = computed(()=> {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay =  new Date(year, month + 1, 0);
    let startDay = firstDay.getDay();
    const endDay = lastDay.getDate();

    const endDatePrev = new Date(year, month, 0).getDate();

    // console.log(startDay);
    // console.log(endDay);

    let date = 1;
    let weeks = []

    for(let i=0; i < 6; i++){
        const days = []
        if(startDay == 0 ){
            startDay = 7
        }
        for(let j = 1; j <= 7; j++){
            if (i === 0 && startDay > j) {
                const currentDate = new Date(year, month-1, endDatePrev-startDay+j+1);
                days.push({ day: endDatePrev-startDay+j+1, date: currentDate});
            }
            else{
                if(date > endDay){
                    const currentDate = new Date(year,month+1,date-endDay)
                    days.push({ day: currentDate.getDate(), date: currentDate});
                    date++
                }else{
                    const currentDate = new Date(year,month,date);
                    days.push({day:date,date:currentDate})
                    date++  
                }
                
            }
        }
        weeks.push(days);
    }
    console.log(weeks);
    return weeks;
    
    
})

const previous = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
      console.log(dt);
      console.log(dt.toLocaleString());
    };

const next = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};



const checkDate = (day) => {
    const luxonDate = DateTime.fromJSDate(day.date);
    let dates = []
    console.log("dsdsds");
    for(let i in getDates.value){
        dates.push(i)
    }
    const foundDate = dates.find(item => item == luxonDate.toISODate())
    if(foundDate){
        let fillPercentage = null
        fillPercentage = Math.ceil((getDates.value[`${foundDate}`].engaged_count / getDefualtDayCapacity.value) * 100)
        console.log(day.date);
        return fillPercentage

    }
    return null
    
}

onMounted(async() => {
    await dataStore.getSchedulerInfo()
})



</script>


<template>
    <div class="container">
        <div class="calendar">
            <h1 class="calendar__title">
                Задание на WhatsApp
            </h1>
            <p class="calendar__desc">
                Задания на WhatsApp рассылки принимаются за день до старта.<br/>
                Рассылки осуществляются в 2 очереди: <br/>
                с 7.00 до 15.00 и с 10.00 до 20.00, пн-вс (по Московскому времени) 
            </p>
            <div class="calendar__content">
                <div class="calendar__header">
                    <div class="calendar__selection-dates">
                        <button class="prev" @click="previous"></button>
                        <span class="calendar__selection-dates-text">{{ currentMonth }}</span>
                        <button class="next" @click="next"></button>   
                    </div>
                    <div class="calendar__toggle-date">
                        <div class="toggle-item toggle-day">
                            <input type="radio" checked name="toggle-date" value="month" id="month-btn"/>
                            <label for="month-btn">Месяц</label></div>
                        <div class="toggle-item toggle-month">
                            <input type="radio" name="toggle-date" value="day" id="day-btn"/>
                            <label for="day-btn">День</label></div>     
                    </div>

                </div>
                <div class="calendar__days">
                    <ul class="calendar__day-of-week">
                        <li class="day-of-week-item">Пн</li>
                        <li class="day-of-week-item">Вт</li>
                        <li class="day-of-week-item">Ср</li>
                        <li class="day-of-week-item">Чт</li>
                        <li class="day-of-week-item">Пт</li>
                        <li class="day-of-week-item">Сб</li>
                        <li class="day-of-week-item">Вс</li>
                    </ul>
                    <ul class="calendar__dates">
                        <li v-for="(week,index) in calendar" :key="index" class="calendar__weeks">
                            <div
                                v-for="(day,index) in week" 
                                :key="index" 
                                class="calendar__day" 
                                :class="[
                                        {'calendar__day_prevDate': isPastDate(day.date)}, 
                                        {'calendar__day_not-current' : isNotCurrentDate(day.date)} 
                                    ]"
                                @click="console.log(day.date);"
                            >
                                <span>{{ day.day }}</span>
                                <div v-if="checkDate(day) && !isPastDate(day.date)" class="calendar__progress-bar" :style="{ height: `${checkDate(day)}%` }"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
   
</template>



<style>
    /* .calendar__dates{
        width: 1000px;
        padding: 10px;    
    }


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.days {
  display: grid;
}

.week {
  display: flex;
}

.day {
  flex: 1;
  padding: 5px;
  text-align: center;
  border: 1px solid #eee;
} */
</style>


if (i === 0 && startDay > j) {
    // const currentDate1 = new Date(year, month-1, endDatePrev1-startDay1+j+1);
    const currentDate = new Date(year, month-2, endDatePrev-startDay+j+1);
    const currentDateLuxon = DateTime.fromJSDate(currentDate)
    days.push({ day: currentDateLuxon.day, date: currentDateLuxon});
}
else{
    if(date > endDay){
        const currentDate = new Date(year,month,date-endDay)
        const currentDateLuxon = DateTime.fromJSDate(currentDate)
        days.push({ day: currentDateLuxon.day, date: currentDateLuxon});
        date++
    }else{
        // const currentDate1 = new Date(year,month,date);
        const currentDate = DateTime.local(year,month,date)
        days.push({day:date,date:currentDate})
        date++  
    }
    
}