<script setup>
import BookedSchedule from './BookedSchedule.vue';
import Schedules from './Schedules.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useDataStore } from '../stores/data';
// import useDataStore from '../stores/data'
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import { storeToRefs } from 'pinia';


const dataStore = useDataStore();

const calendarType = ref("month")


const { getDates, getDefualtDayCapacity, getSchedules } = storeToRefs(dataStore);




const currentDate = ref(DateTime.local())
const selectedDay = ref(DateTime.local())


const nowDate = ref(DateTime.local())
// const currentMonth = computed(() => {
//     return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
// });




function isPastDate(date){
    return (date < nowDate.value) ? true : false
}

function isNotCurrentDate(date){
    const endDay = currentDate.value.endOf('month')

    const startDay = DateTime.local(currentDate.value.year, currentDate.value.month, 1)

    return ( (date > endDay || date < startDay) & date > nowDate.value) ? true : false
}

const calendar = computed(()=> {
    let year = currentDate.value.year
    let month = currentDate.value.month
    const startDay = DateTime.local(year,month, 1).weekday
    const endDay = currentDate.value.endOf('month').day

    const endDatePrev = currentDate.value.minus({months:1}).endOf('month').day


    let date = 1;
    let weeks = []

    for(let i=0; i < 6; i++){
        const days = []
        for(let j = 1; j <= 7; j++){
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
        }
        weeks.push(days);
        
    }
    console.log(weeks);
    return weeks;
    
    
})

const previous = () => {
        if(calendarType.value == 'month'){
            currentDate.value = currentDate.value.minus({month: 1}).startOf('month')
        }else{
            currentDate.value = currentDate.value.minus({day: 1})
            selectedDay.value = selectedDay.value.minus({day: 1})
        }
    };

const next = () => {
    if(calendarType.value == 'month'){
        currentDate.value = currentDate.value.plus({month: 1}).startOf('month')
    }else{
        currentDate.value = currentDate.value.plus({day: 1})
        selectedDay.value = selectedDay.value.plus({day: 1})
    }
};



const checkDate = (day) => {
    let dates = []
    for(let i in getDates.value){
        dates.push(i)
    }

    const foundDate = dates.find(item => item == day.toISODate())

    if(foundDate){
        let fillPercentage = null
        fillPercentage = Math.ceil((getDates.value[`${foundDate}`].engaged_count / getDefualtDayCapacity.value) * 100)
        return fillPercentage

    }
    return null
    
}

const getCalendarInfo = computed(() => {
    const dates = getSchedules.value.filter((item) => item.date == selectedDay.value.toISODate())
    if(dates.length > 0){ 
        const calendarInfo = dates.reduce((sum,item)  => { 
            return Number(item.engaged_count) + sum
        },0)
        return getDefualtDayCapacity.value - calendarInfo
    }else {
        return getDefualtDayCapacity.value
    } 
})



const toggleCalendarType = (day) => {
    if(day>nowDate.value){
        selectedDay.value = day
        calendarType.value = "day"
    }
}


onMounted(async() => {
    await dataStore.getSchedulerInfo();
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
                        <div>
                            <span v-if="calendarType == 'month'" class="calendar__selection-dates-text">
                                {{ currentDate.setLocale("ru").toFormat('LLLL yyyy г.') }}
                            </span> 
                            <span v-else class="calendar__selection-dates-text">
                                {{ selectedDay.setLocale("ru").toFormat('dd LLL yyyy г.') }}
                            </span>
                        </div>    
                        <button class="next" @click="next"></button>   
                    </div>
                    <div class="calendar__toggle-date">
                        <div class="toggle-item toggle-day">
                            <input 
                                type="radio" 
                                checked 
                                name="toggle-date" 
                                value="month" 
                                id="month-btn" 
                                v-model="calendarType"
                            />
                            <label for="month-btn">Месяц</label></div>
                        <div class="toggle-item toggle-month">
                            <input 
                                type="radio" 
                                name="toggle-date" 
                                value="day" 
                                id="day-btn"
                                v-model="calendarType"
                            />
                            <label for="day-btn">День</label></div>     
                    </div>

                </div>
                <div class="calendar__days" v-if="calendarType == 'month'">
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
                                @click="toggleCalendarType(day.date)"
                            >
                                <span>{{ day.day }}</span>
                                <div v-if="checkDate(day.date) && !isPastDate(day.date)" class="calendar__progress-bar" :style="{ height: `${checkDate(day.date)}%` }"></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else>
                   <div class="calendar__info">
                     <span>Свободно на день <b>{{ getCalendarInfo }}</b> из <b>{{ getDefualtDayCapacity }}</b></span>
                   </div>
                   <div class="calendar__time-options">
                        <div class="calendar__time-options-item" time="7:00-15:00">
                            <Schedules 
                                class="schedules" 
                                :selectedDay="selectedDay"
                                :time="7"
                                :class="{'schedules_filled' : isPastDate(selectedDay)}"
                                >
                            </Schedules>
                        </div>
                        <div class="calendar__time-options-item" time="10:00-20:00">
                            <Schedules 
                                class="schedules" 
                                :selectedDay="selectedDay"
                                :time="10"
                                :class="{'schedules_filled' : isPastDate(selectedDay)}"
                                >
                            </Schedules>
                        </div>
                   </div>
                </div>
                
            </div>
        </div>
    </div>
   
</template>



<style>
    
</style>