<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import Calendar from './components/Calendar.vue';
// import Example from './components/Example.vue';
import HelloWorld from './components/HelloWorld.vue';
// import Example2 from './components/Example2.vue'
import {provide, ref} from 'vue'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
const counter = ref(500)

const date = ref(null)

const updateDate = (data) => {
  console.log(data);
  date.value = `${data.selectedDay.toISODate()} ${data.time}:00`
}

provide('counter', counter)

</script>

<template>
  <!-- <HelloWorld class="hello"/> -->
   <!-- <div></div> -->
   <!-- <HelloWorld></HelloWorld> -->
   <!-- <Calendar></Calendar> -->
   <!-- <Example></Example> -->
    <!-- <Example2></Example2> -->
    <div class="date-editor">
      <p class="date-editor__title">Дата и время отправки</p>
    </div>
    <div class="input-date-wrapper">
      <input :value="date" type="text" autocomplete="off" placeholder="Выберите дату" class="input-date" readonly @click="openModal">
      <span>
        <img src="/public/img/1.png" alt="" width="20" height="20">
      </span>
    </div>
    <div class="popup" v-if="isModalOpen">
        <div class="popup-blur" @click="closeModal"></div>
        <Calendar @update-date="updateDate" @close-popup="closeModal"></Calendar>
    </div>
</template>

<style lang="scss">
    
</style>
