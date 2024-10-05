<template>
    <div class="my-tippy-content">
        <span class="close-icon" @click="closePopup">
            <MyIcon :name="ICON_X_CIRCLE"></MyIcon>
        </span>
        <input
            v-model="newEvent.name"
            placeholder="Event name"
            class="app-input"
        />
        <span class="error" v-if="errors.name">{{ errors.name }}</span>

        <input type="date" v-model="newEvent.date" class="app-input" />
        <span class="error" v-if="errors.date">{{ errors.date }}</span>

        <input type="time" v-model="newEvent.time" class="app-input" />
        <span class="error" v-if="errors.time">{{ errors.time }}</span>

        <textarea
            v-model="newEvent.notes"
            placeholder="Notes"
            class="app-input"
        ></textarea>
        <span class="error" v-if="errors.notes">{{ errors.notes }}</span>

        <div class="color-picker">
            <label for="color">Event background color:</label>
            <input
                type="color"
                v-model="newEvent.color"
                id="color"
                name="color"
            />
        </div>

        <div class="popup-buttons">
            <button id="cancelBtn" class="app-btn" @click="closePopup">
                Cancel
            </button>
            <button
                v-if="isEmptyEvent"
                id="saveBtn"
                class="app-btn"
                @click="validateAndSaveEvent"
            >
                Save
            </button>
            <button
                v-else
                id="editBtn"
                class="app-btn"
                @click="validateAndEditEvent"
            >
                Edit
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import MyIcon from "@/components/UI/MyIcon.vue";
import { ICON_X_CIRCLE } from "@/icons.js";

const props = defineProps({
    event: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(["closePopup", "saveEvent", "editEvent"]);

const isEmptyEvent = computed(() => {
    return Object.keys(props.event).length === 0;
});

const newEvent = reactive({
    id: uuidv4(),
    name: "",
    date: "",
    time: "",
    notes: "",
    color: "#3a86ff",
});

const errors = reactive({
    name: "",
    date: "",
    time: "",
    notes: "",
});

const validateEvent = () => {
    clearErrors();
    let isValid = true;
    const now = new Date();
    const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);

    if (!newEvent.name) {
        errors.name = "Event name is required.";
        isValid = false;
    } else if (newEvent.name.trim().length > 30) {
        errors.name = "Event name can have up to 30 characters.";
        isValid = false;
    }

    if (!newEvent.date) {
        errors.date = "Event date is required.";
        isValid = false;
    } else if (eventDateTime < now) {
        errors.date = "Event date and time must be in the future.";
        isValid = false;
    }

    if (!newEvent.time) {
        errors.time = "Event time is required.";
        isValid = false;
    } else if (eventDateTime < now) {
        errors.time = "Event date and time must be in the future.";
        isValid = false;
    }

    return isValid;
};

const clearErrors = () => {
    errors.name = "";
    errors.date = "";
    errors.time = "";
    errors.notes = "";
};

const saveEvent = () => {
    emit("saveEvent", Object.assign({}, newEvent));
};

const editEvent = () => {
    emit("editEvent", Object.assign({}, newEvent));
};

const validateAndEditEvent = () => {
    if (validateEvent()) {
        editEvent();
    }
};

const validateAndSaveEvent = () => {
    if (validateEvent()) {
        saveEvent();
    }
};

const closePopup = () => {
    emit("closePopup");
};

watch(
    () => props.event,
    (newVal) => {
        if (newVal && Object.values(newVal).length) {
            newEvent.id = newVal.id || uuidv4();
            newEvent.name = newVal.name || "";
            newEvent.date = newVal.date || "";
            newEvent.time = newVal.time || "";
            newEvent.notes = newVal.notes || "";
            newEvent.color = newVal.color || "#3a86ff";
        } else {
            newEvent.id = uuidv4();
            newEvent.name = "";
            newEvent.date = "";
            newEvent.time = "";
            newEvent.notes = "";
            newEvent.color = "#3a86ff";
        }
    },
    { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.my-tippy-content {
    padding: 0;
    display: none;
}
.close-icon {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    width: 25px;
    color: $app-text-light-gray;
}
.popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 35px;
}
.app-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 18px;
    transition: 0.2s ease-in;
    &:hover {
        background-color: $app-table-gray;
    }
}
.app-input {
    outline: none;
    border-left: none;
    border-top: none;
    border-right: none;
    color: $app-text-dark-gray;
    padding: 15px 5px;
    border-bottom: 1px solid $app-tabs-border;
    width: 100%;
    &::placeholder {
        color: $app-text-light-gray;
    }
}
.error {
    color: red;
    font-size: 12px;
}
.color-picker {
    color: $app-text-light-gray;
    label {
        display: block;
        margin-bottom: 5px;
    }
}
#cancelBtn {
    color: $app-text-red;
}
#saveBtn {
    color: $app-text-dark-gray;
}
</style>
