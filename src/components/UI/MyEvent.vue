<template>
    <div
        class="my-event"
        :style="{
            backgroundColor: event.color,
            color: isTextContrastDark ? '#000' : '#FFF',
        }"
        @click.stop="$emit('editEvent', event)"
    >
        <p class="my-event-text">{{ event.name }}</p>
        <span
            class="delete-icon"
            :style="{
                backgroundColor: event.color,
                color: isTextContrastDark ? '#000' : '#FFF',
            }"
            @click.stop="$emit('deleteEvent', event.id)"
        >
            <MyIcon :name="ICON_TRASH"></MyIcon>
        </span>
    </div>
</template>

<script setup>
import { ICON_TRASH } from "../../icons";
import MyIcon from "./MyIcon.vue";
import { computed } from "vue";

const props = defineProps({
    event: {
        type: Object,
        required: true,
    },
});

// Function to calculate brightness and determine contrast
function getContrastColor(bgColor) {
    const hex = bgColor.replace("#", "");

    // Convert hex color to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // If luminance is greater than a threshold, return true for dark text
    return luminance > 186; // You can adjust this threshold if needed
}

// Computed property to check if text should be dark
const isTextContrastDark = computed(() => {
    return getContrastColor(props.event.color);
});
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.my-event {
    border-radius: 5px;
    padding: 10px;
    display: flex;
    position: relative;
    box-shadow: $app-controls-shadow;
    &:hover .delete-icon {
        opacity: 1;
    }
}
.my-event-text {
    text-align: left;
    word-wrap: break-word;
}
.delete-icon {
    width: 25px;
    height: 25px;
    padding: 5px;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(calc(50% - 5px)) translateX(calc(-50% + 5px));
    transition: opacity 0.1s ease-in;
    opacity: 0;
}
</style>
