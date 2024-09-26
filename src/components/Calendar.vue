<template>
    <div class="calendar">
        <div class="calendar-header">
            <div class="calendar-header_top">
                <div class="title-wrapper">
                    <h3 class="calendar-title">Calendar View</h3>
                </div>
                <div class="calendar-view-mode-wrapper">
                    <div
                        class="calendar-view-mode-item"
                        v-for="view in calendarViews"
                        @click="updateCalendarView(view)"
                        :class="{ isActive: selectedView === view }"
                    >
                        {{ view }}
                    </div>
                </div>
            </div>
            <div class="calendar-header_bottom">
                <div class="calendar-controls-wrapper">
                    <div
                        class="calendar-control-item"
                        @click="today"
                        :class="{ isActive: isTodaySelected }"
                    >
                        Today
                    </div>
                    <div class="calendar-control-item" @click="prevMonth">
                        Back
                    </div>
                    <div class="calendar-control-item" @click="nextMonth">
                        Next
                    </div>
                </div>
                <div class="calendar-info-date">
                    {{ monthNames[currentMonth] }} {{ currentYear }}
                </div>
            </div>
        </div>
        <div class="calendar-body">
            <div class="table-header">
                <div
                    v-for="day in weekDays"
                    :key="day"
                    class="table-header-item"
                >
                    {{ day }}
                </div>
            </div>
            <div class="table-body">
                <div
                    v-for="(item, index) in daysInMonthWithOffset"
                    :key="index"
                    class="table-item"
                    :class="{
                        'prev-month': item.isPrevMonth,
                        'next-month': item.isNextMonth,
                        'current-day': isCurrentDay(item.fullDate),
                    }"
                    @click="
                        item.isPrevMonth
                            ? prevMonth()
                            : item.isNextMonth
                            ? nextMonth()
                            : openPopup(item)
                    "
                    :data-date="item.fullDate"
                >
                    <div class="table-item_header">{{ item.day || "" }}</div>
                    <div class="table-item_body">
                        <template v-if="getEventsByDate(item.fullDate).length">
                            <MyEvents
                                :events="getEventsByDate(item.fullDate)"
                                @edit-event="editEventEmitHandler"
                            ></MyEvents>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EventPopup
        ref="tippyContent"
        @closePopup="closePopup"
        @saveEvent="saveEvent"
        @editEvent="editEvent"
        :event="editEventObj"
    ></EventPopup>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from "vue";
import { localstorageHandler, formatDate } from "./utills";
import EventPopup from "@/components/popup/EventPopup.vue";
import MyEvents from "@/components/UI/MyEvents.vue";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarViews = ["Month", "Week", "Day", "Agenda"];

const selectedView = ref(calendarViews[0]);
const currentDate = ref(new Date());
const currentYear = ref(currentDate.value.getFullYear());
const currentMonth = ref(currentDate.value.getMonth());
const events = reactive({});
const tippyContent = ref(null);
const tippyInstance = ref(null);

const newEvent = reactive({
    name: "",
    date: "",
    time: "",
    notes: "",
    color: null,
    targetDate: null,
});

const editEventObj = ref({});

const openPopup = (item) => {
    newEvent.date = item.fullDate;
    createTippy(item.fullDate);
};

const closePopup = () => {
    tippyInstance.value.hide();
    tippyInstance.value = null;
};

const saveEvent = (data) => {
    const { id } = data;

    if (!events[id]) {
        events[id] = data;
    } else {
        console.log("Event with this ID already exists");
    }
    localstorageHandler({ actionType: "add", data });
    closePopup();
};

const editEvent = (data) => {
    const { id, date } = data;
    const eventToEdit = events[id];

    if (eventToEdit) {
        if (eventToEdit.date !== date) {
            delete events[id];
        }

        events[id] = { ...eventToEdit, ...data };

        localstorageHandler({ actionType: "edit", data });
    } else {
        console.log("Event not found");
    }
    closePopup();
};

const editEventEmitHandler = (data) => {
    const dataCopy = Object.assign({}, data);
    editEventObj.value = dataCopy;
    createTippy(data.date);
};

const updateDate = () => {
    currentDate.value = new Date();
};

const isTodaySelected = computed(() => {
    return (
        currentYear.value === currentDate.value.getFullYear() &&
        currentMonth.value === currentDate.value.getMonth()
    );
});

const isCurrentDay = computed(() => (date) => {
    const fullDate = formatDate(
        currentYear.value,
        currentMonth.value,
        currentDate.value.getDate()
    );
    return date == fullDate;
});

const daysInMonth = computed(() => {
    const days = new Date(
        currentYear.value,
        currentMonth.value + 1,
        0
    ).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
});

const firstDayOffset = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const daysInMonthWithOffset = computed(() => {
    const offset = firstDayOffset.value;
    const days = daysInMonth.value;

    const endOffset = (7 - ((offset + days.length) % 7)) % 7;

    const prevMonthDays = new Date(
        currentYear.value,
        currentMonth.value,
        0
    ).getDate();

    const startDays = Array.from({ length: offset }, (_, i) => {
        const day = prevMonthDays - offset + i + 1;
        const fullDate = formatDate(
            currentYear.value,
            currentMonth.value - 1,
            day
        );
        return {
            day,
            fullDate,
            isPrevMonth: true,
        };
    });

    const currentMonthDays = days.map((day) => ({
        day,
        fullDate: formatDate(currentYear.value, currentMonth.value, day),
        isCurrentMonth: true,
    }));

    const endDays = Array.from({ length: endOffset }, (_, i) => {
        const day = i + 1;
        const fullDate = formatDate(
            currentYear.value,
            currentMonth.value + 1,
            day
        );
        return {
            day,
            fullDate,
            isNextMonth: true,
        };
    }).slice(0, endOffset);

    return [...startDays, ...currentMonthDays, ...endDays];
});

const getEventsByDate = computed(() => (date) => {
    return Object.values(events).filter((event) => event.date === date);
});

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
};

const today = () => {
    currentYear.value = currentDate.value.getFullYear();
    currentMonth.value = currentDate.value.getMonth();
};

const updateCalendarView = (view) => {
    selectedView.value = view;
};

const createTippy = (fullDate) => {
    const tableItem = document.querySelector(
        `.table-item[data-date='${fullDate}']`
    );

    const contentElement = tippyContent.value.$el;

    contentElement.style.display = "block";

    tippyInstance.value = tippy(tableItem, {
        content: contentElement,
        trigger: "manual",
        allowHTML: true,
        theme: "event-popup",
        placement: "bottom",
        interactive: true,
        onHide() {
            editEventObj.value = {};
        },
    });
    tippyInstance.value.show();
};

onMounted(() => {
    Object.assign(events, localstorageHandler({ actionType: "get" }));
    const currentDateInterval = setInterval(() => {
        updateDate();
    }, 60000);

    onUnmounted(() => {
        clearInterval(currentDateInterval);
    });
});

const isLoading = ref(false);
</script>

<style lang="scss">
@import "@/assets/variables.scss";
.calendar-title {
    color: $app-text-dark-gray;
    font-size: 20px;
    font-weight: 400;
}
.calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: $app-shadow;
    background: white;
    height: 90%;
    padding: 20px;
}
.calendar-header {
    width: 100%;
    margin-bottom: 20px;
}
.calendar-body {
    width: 100%;
}
.table-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    width: 100%;
    text-align: center;
    border-top: 1.5px solid $app-table-border;
    border-left: 1.5px solid $app-table-border;
    border-right: 1.5px solid $app-table-border;
}
.table-header-item {
    padding: 10px;
    background-color: $app-table-gray;
    color: $app-text-light-gray;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
}
.table-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    width: 100%;
    border-collapse: collapse;
}
.table-item {
    text-align: right;
    border: 1.5px solid $app-table-border;
    aspect-ratio: 2 / 1.5;
    color: $app-text-dark-gray;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    &_header {
        padding: 15px 15px 5px;
    }
    &_body {
        flex: 1;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background-color: $app-scrollbar-bg;
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: $app-scrollbar-thumb;
            border-radius: 10px;
        }

        &::-webkit-scrollbar-button {
            display: none;
        }
    }
    &.current-day {
        background-color: $app-table-gray;
    }
}

.calendar-header_top,
.calendar-header_bottom {
    padding: 5px 0;
    display: flex;
    position: relative;
}
.calendar-info-date {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    color: $app-text-dark-gray;
    font-size: 20px;
    font-weight: 400;
}

.calendar-header_top {
    justify-content: space-between;
    align-items: baseline;
}
.calendar-view-mode-wrapper {
    display: flex;
    box-shadow: $app-controls-shadow;
    border-radius: 5px;
    border: 1.5px solid $app-tabs-border;
    overflow: hidden;
}
.calendar-view-mode-item {
    padding: 6px 18px;
    color: $app-text-dark-gray;
    font-size: 14px;
    transition: 0.2s ease-in;
    cursor: pointer;
    &:not(:last-child) {
        border-right: 1.5px solid $app-tabs-border;
    }
    &:hover {
        background-color: $app-table-gray;
    }
}
.calendar-controls-wrapper {
    display: flex;
    box-shadow: $app-controls-shadow;
    border-radius: 5px;
    border: 1.5px solid $app-tabs-border;
    overflow: hidden;
}
.calendar-control-item {
    padding: 6px 18px;
    color: $app-text-dark-gray;
    font-size: 14px;
    transition: 0.2s ease-in;
    cursor: pointer;
    &:not(:last-child) {
        border-right: 1.5px solid $app-tabs-border;
    }
    &:hover {
        background-color: $app-table-gray;
    }
}
.prev-month {
    color: $app-text-light-gray-2;
    cursor: not-allowed;
}

.next-month {
    color: $app-text-light-gray-2;
    cursor: not-allowed;
}
.isActive {
    color: $app-text-blue;
    pointer-events: none;
}

.tippy-box[data-theme="event-popup"] {
    background: white;
    box-shadow: $app-popup-shadow;
    border: 1.5px solid $app-popup-border;
    border-radius: 10px;
    max-width: 250px !important;
    .tippy-arrow {
        color: $app-popup-border;
    }
    .tippy-content {
        padding: 30px;
    }
    .my-tippy-content {
        display: block;
    }

    .share-link-wrapper {
        display: flex;

        button {
            margin-left: 4px;
        }

        .copy-icon {
            background-image: url("@/assets/images/copy-icon.svg");
        }

        .link-input {
            width: 100%;
            height: 32px;
            border: #dbeaf0 solid 1px;
            border-radius: 12px;
            padding-left: 12px;
            padding-right: 12px;
            font-size: 12px;
            transition: padding-right 0.25s, border 0.25s;
        }
    }

    a,
    #copy-link-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        transition: color 80ms cubic-bezier(0.65, 0, 0.35, 1) 0s;
        border: none;
        background: transparent;
        outline: none;
        cursor: pointer;

        &:hover {
            background-color: #f3f4f5;
        }
    }

    .icons {
        display: block;
        width: 16px;
        height: 16px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .share-icons-wrapper {
        display: flex;
        justify-content: space-around;
        padding-top: 10px;

        .twitter-icon {
            background-image: url("@/assets/images/twitter-icon.svg");
        }

        .facebook-icon {
            background-image: url("@/assets/images/facebook-icon.svg");
        }

        .linked-in-icon {
            background-image: url("@/assets/images/linked-in-icon.svg");
        }
    }
}
</style>
