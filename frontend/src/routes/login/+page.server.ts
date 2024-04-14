import bcrypt from "bcryptjs";
import { isUser, users, type User } from "$lib/schemas/user";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { isSession, sessions, type Session, createSessionFromUser } from "$lib/schemas/session";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.loggedIn) {
        redirect(302, "/");
    }
};

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        try {
            const data = Object.fromEntries(await request.formData());

            if (!isUser(data)) {
                return fail(400, { error: "Invalid input", loginError: true });
            }

            const foundUser: User | null = await users.findOne({ email: data.email });

            if (!foundUser) {
                return fail(404, { error: "User not found", loginError: true });
            }

            if (!(await bcrypt.compare(data.password, foundUser.password))) {
                return fail(401, { error: "Incorrect password", loginError: true });
            }

            const sessionCookie = cookies.get("Session");

            if (sessionCookie) {
                const oldSession = JSON.parse(sessionCookie) as Session;

                if (oldSession.email == foundUser.email) {
                    return fail(409, { error: "User is already logged in", loginError: true });
                } else {
                    // Deletes old session if user changes accounts
                    await sessions.deleteOne(oldSession);
                    cookies.delete("Session", { path: "/" });
                }
            }

            const newSession = createSessionFromUser(foundUser.email);

            //  TODO: verify if insertMany() is idiomatic
            await sessions.insertMany(newSession);
            cookies.set("Session", JSON.stringify(newSession), { path: "/", expires: newSession.expiresAt });
        } catch (error) {
            console.error(error);
            return fail(500, {
                error: "Failed to log in due to a system issue, please try again later",
                loginError: true,
            });
        }

        throw redirect(302, "/");
    },
};
