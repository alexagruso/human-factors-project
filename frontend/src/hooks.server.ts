import { sessions, type Session } from "@lib/schemas/session";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const currentSession = JSON.parse(event.cookies.get("Session") ?? "{}") as Session;

    try {
        if (!(await sessions.findOne(currentSession))) {
            event.cookies.delete("Session", { path: "/" });
            event.locals.loggedIn = false;
        } else {
            event.locals.loggedIn = true;
            event.locals.userEmail = currentSession.email;
            console.log(event.locals.userEmail);
        }
    } catch (error) {
        console.error(error);
        console.error("ERROR: failed to load server data");
    }

    return await resolve(event);
};
