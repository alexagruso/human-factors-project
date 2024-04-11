import { type Actions, fail, redirect } from "@sveltejs/kit";
import { sessions } from "$lib/schemas/session";

export const actions: Actions = {
    logout: async ({ cookies }) => {
        const currentSession = JSON.parse(cookies.get("Session") ?? "{}");

        try {
            await sessions.deleteOne(currentSession);
            cookies.delete("Session", { path: "/" });
        } catch (error) {
            return fail(500, {
                error: "Failed to log out due to a system issue, please try again later",
                logoutError: true,
            });
        }

        throw redirect(302, "/");
    },
};
