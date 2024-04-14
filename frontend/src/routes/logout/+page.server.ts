import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { sessions, type Session } from "@lib/schemas/session";

export const load: PageServerLoad = async ({ cookies, locals }) => {
    const session = JSON.parse(cookies.get("Session") ?? "{}") as Session;

    try {
        await sessions.deleteOne(session);
        cookies.delete("Session", { path: "/" });
    } catch (error) {
        console.error(error);
        console.error("ERROR: failed to log out due to a system error");
    }

    locals.currentUser = {
        email: null,
    };

    throw redirect(302, "/");
};
