import { building } from "$app/environment";
import { MONGODB_URI } from "$env/static/private";
import mongoose from "mongoose";
import type { LayoutServerLoad } from "./$types";

if (!building) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log("LOG: successfully connected to mongodb");
        })
        .catch((error) => {
            console.error(error);
            console.error("ERROR: failed to connect to mongodb");
        });
}

export const load: LayoutServerLoad = async ({ locals }) => {
    return { loggedIn: locals.loggedIn, userEmail: locals.userEmail };
};
