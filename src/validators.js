import { ICONS } from "@/icons.js";

export function isIconValid(icon) {
    return Object.keys(ICONS).includes(icon);
}
