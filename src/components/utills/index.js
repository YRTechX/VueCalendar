export function localstorageHandler(payload) {
    const { actionType, data } = payload;

    let events = JSON.parse(localStorage.getItem("events")) || {};

    switch (actionType) {
        case "add":
            events[data.id] = data;

            localStorage.setItem("events", JSON.stringify(events));
            break;

        case "edit":
            if (events[data.id]) {
                events[data.id] = { ...events[data.id], ...data };

                localStorage.setItem("events", JSON.stringify(events));
            } else {
                console.error(`Event with id ${data.id} not found.`);
            }
            break;

        case "delete":
            if (events[data.id]) {
                delete events[data.id];

                localStorage.setItem("events", JSON.stringify(events));
            } else {
                console.error(`Event with id ${data.id} not found.`);
            }
            break;

        case "get":
            return events;

        default:
            console.error(`Unknown actionType: ${actionType}`);
    }
}

export function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
    ).padStart(2, "0")}`;
}
