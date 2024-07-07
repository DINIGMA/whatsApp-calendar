<template>
    <div class="calendar">
      <h2>{{ currentMonth }}</h2>
      <div class="navigation">
        <button @click="previousMonth">&lt;&lt;</button>
        <button @click="nextMonth">&gt;&gt;</button>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendar" :key="index">
            <td v-for="day in week" :key="day.date"
                :class="{ 'current-day': isCurrentDay(day), 'selected-day': isSelectedDay(day) }"
                @click="selectDay(day)">
              {{ day.date }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const currentDate = ref(new Date());
  const daysOfWeek = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);
  
  const currentMonth = computed(() => {
    return currentDate.value.toLocaleString('ru', { month: 'long', year: 'numeric' });
  });
  
  const calendar = computed(() => {
    const startOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
    const firstDayOfMonth = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; // Понедельник начинается с 0
    const daysInMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate();
    
    let date = 1;
    const weeks = [];
    
    for (let i = 0; i < 6; i++) {
      const days = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          // Дни предыдущего месяца
          const prevMonthDays = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), -firstDayOfMonth + j + 1).getDate();
          days.push({ date: prevMonthDays, month: 'prev' });
        } else if (date > daysInMonth) {
          // Дни следующего месяца
          days.push({ date: date - daysInMonth, month: 'next' });
          date++;
        } else {
          // Дни текущего месяца
          days.push({ date: date, month: 'current' });
          date++;
        }
      }
      weeks.push(days);
    }
    
    return weeks;
  });
  
  const isCurrentDay = (day) => {
    const today = new Date();
    return day.date === today.getDate() && currentDate.value.getMonth() === today.getMonth() && currentDate.value.getFullYear() === today.getFullYear();
  };
  
  const selectedDate = ref(null);
  
  const isSelectedDay = (day) => {
    return selectedDate.value && day.date === selectedDate.value.getDate() && currentDate.value.getMonth() === selectedDate.value.getMonth() && currentDate.value.getFullYear() === selectedDate.value.getFullYear();
  };
  
  const selectDay = (day) => {
    const selectedDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date);
    selectedDate.value = selectedDay;
  };
  
  const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  };
  
  const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  };
  </script>
  
  <style scoped>
  .calendar {
    font-family: Arial, sans-serif;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th, table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f0f0f0;
  }
  
  .current-day {
    background-color: #e0f7fa; /* Цвет фона текущего дня */
  }
  
  .selected-day {
    background-color: #b3e5fc; /* Цвет фона выбранного дня */
  }
  </style>
  