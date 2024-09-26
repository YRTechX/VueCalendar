<template>
    <div class="calendar-page">
        <h3 class="title">Calendar</h3>
        <Calendar />
    </div>
</template>

<script setup>
import Calendar from "@/components/Calendar.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.calendar-page {
    background-color: $app-background;
    padding: 50px;
}
.title {
    margin-bottom: 40px;
    font-size: 32px;
    color: $app-text-dark-gray;
    font-weight: 400;
}
</style>
