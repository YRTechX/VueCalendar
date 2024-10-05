<template>
    <div class="my-events-wrapper">
        <MyEvent
            v-for="(event, index) in sortedEvents"
            :key="index"
            :event="event"
            @edit-event="handleEditEvent"
            @delete-event="handleDeleteEvent"
        />
    </div>
</template>

<script setup>
import MyEvent from "@/components/UI/MyEvent.vue";

import { computed } from "vue";
const emit = defineEmits(["edit-event", "delete-event"]);
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

const handleDeleteEvent = (id) => {
    console.log("handleDeleteEvent", id);
    emit("delete-event", id);
};
</script>

<style lang="scss" scoped>
.my-events-wrapper {
    height: 100%;
}
</style>
