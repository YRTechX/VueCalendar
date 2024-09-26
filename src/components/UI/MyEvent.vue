<template>
    <div
        class="my-event"
        :style="{
            backgroundColor: event.color,
        }"
        @click.stop="$emit('editEvent', event)"
    >
        <p class="my-event-text">{{ event.name }}</p>
    </div>
</template>

<script setup>
defineProps({
    event: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.my-event {
    border-radius: 5px;
    padding: 10px;
}
.my-event-text {
    color: $app-text-white;
    text-align: left;
    word-wrap: break-word;
}
</style>
