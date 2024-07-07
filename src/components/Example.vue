<template>
    <div style="height: 200px;">
      <label>Закрасить элемент на:</label>
      <input type="number" v-model="fillPercentage" min="0" max="100">
      <div class="progress-container" style="display: flex; justify-content: center; align-items: center;">
        <span style="color: black;">1</span>
        <div class="progress-bar" :style="{ height: `${fillPercentage}%` }"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const fillPercentage = ref(50);
  </script>
  
  <style scoped>
  .progress-container {
    position: relative;
    width: 20px; /* Ширина элемента прогресса */
    height: 200px; /* Высота элемента прогресса */
    background-color: #f0f0f0; /* Цвет фона для наглядности */
    border-radius: 20px;
  }
  
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #248b3a; /* Цвет прогресса */
    border-radius: 20px;
  }
  </style>

