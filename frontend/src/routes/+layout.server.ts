import { building } from "$app/environment";
import { MONGODB_URI } from "$env/static/private";
import { sessions } from "$lib/session";
import mongoose from "mongoose";
import type { LayoutServerLoad } from "./$types";

if (!building) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log("LOG: SUCCESSFULLY CONNECTED TO MONGODB");
        })
        .catch((error) => {
            console.error(error);
            console.error("ERROR: FAILED TO CONNECT TO MONGODB");
        });
}

export const load: LayoutServerLoad = async ({ cookies }) => {
    const currentSession = JSON.parse(cookies.get("Session") ?? "{}");

    try {
        if (!(await sessions.findOne(currentSession))) {
            cookies.delete("Session", { path: "/" });
            return { loggedIn: false };
        }
    } catch (error) {
        console.error(error);
        console.error("ERROR: FAILED TO LOAD SERVER DATA");
    }

    return { currentSession, loggedIn: true };
};
