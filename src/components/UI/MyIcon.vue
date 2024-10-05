<template>
    <component :is="ICONS[name]"></component>
</template>

<script setup>
import { ICONS } from "@/icons.js";
import { isIconValid } from "../../validators";
defineProps({
    name: {
        required: true,
        type: String,
        validator: isIconValid,
    },
});
</script>

<style lang="scss" scoped></style>
