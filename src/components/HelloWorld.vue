<template>
  <div class="calendar">
    <div class="header">
      <button @click="previous">&lt;</button>
      <span>{{ currentMonth }}</span>
      <button @click="next">&gt;</button>
    </div>
    <div class="days">
      <div v-for="(week, index) in calendar" :key="index" class="week">
        <div v-for="day in week" :key="day.date" class="day">
          {{ day.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Calendar',
  setup() {
    const currentDate = ref(new Date());
    
    const currentMonth = computed(() => {
      return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
    });
    
    const calendar = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      // console.log(firstDayOfMonth);
      console.log(lastDayOfMonth);
      
      const startDay = firstDayOfMonth.getDay(); // Day of the week (0 - 6)
      const endDay = lastDayOfMonth.getDate(); // Last day of the month
      console.log(startDay);
      console.log(endDay);
      
      let date = 1;
      const weeks = [];
      
      for (let i = 0; i < 6; i++) {
        const days = [];
        
        for (let j = 0; j < 7; j++) {
          // if (date > endDay) {
          //   break;
          // }
          
          if (i === 0 && j < startDay) {
            days.push({ day: '', date: null });
          } else {
            const currentDate = new Date(year, month, date);
            days.push({ day: date, date: currentDate });
            date++;
          }
        }
        
        weeks.push(days);
      }
      console.log(weeks);
      console.log(currentDate.value);
      console.log(currentMonth.value);
      return weeks;
    });
    
    const previous = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    };
    
    const next = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    };
    
    return {
      currentMonth,
      calendar,
      previous,
      next
    };
  }
};
</script>

<style scoped>
.calendar {
  width: 300px;
  border: 1px solid #ccc;
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
}
</style>
