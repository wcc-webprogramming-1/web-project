import { writable } from "svelte/store";

export const loginUserField = writable<string | undefined>(undefined)
export const loginPasswordField = writable<string | undefined>(undefined)