<template>
    <div class="my-events-wrapper">
        <MyEvent
            v-for="(event, index) in sortedEvents"
            :key="index"
            :event="event"
            @edit-event="handleEditEvent"
        />
    </div>
</template>

<script setup>
import MyEvent from "@/components/UI/MyEvent.vue";
import { computed } from "vue";
const emit = defineEmits(["edit-event"]);
const props = defineProps({
    events: {
        type: Object,
        required: true,
    },
});

const sortedEvents = computed(() => {
    const allEvents = Object.values(props.events).flat();

    return allEvents.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
});

const handleEditEvent = (event) => {
    emit("edit-event", event);
};
</script>

<style lang="scss" scoped>
.my-events-wrapper {
    height: 100%;
}
</style>
