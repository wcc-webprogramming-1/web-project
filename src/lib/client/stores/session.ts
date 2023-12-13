import { writable } from "svelte/store";
import type { ClientUser } from "../objects/user";

export const Session = writable<{
  isLoggedIn: false,
  user: undefined,
} | {
  isLoggedIn: true,
  user: ClientUser,
}>({ isLoggedIn: false, user: undefined });