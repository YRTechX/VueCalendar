<template>
    <div class="my-tippy-content">
        <span class="close-icon" @click="closePopup">
            <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z"
                        fill="#d6d6d6"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                        fill="#d6d6d6"
                    ></path>
                </g>
            </svg>
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
