import bcrypt from "bcryptjs";
import { isUser, users, type User } from "$lib/schemas/user";
import { type Actions, fail } from "@sveltejs/kit";
import { SALT_ROUNDS } from "$env/static/private";
import { isSession, sessions, type Session, createSession } from "$lib/session";

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

            const oldSession = JSON.parse(cookies.get("Session") ?? "{}") as Session;

            if (isSession(oldSession)) {
                if (oldSession.email == foundUser.email) {
                    return fail(409, { error: "User is already logged in", loginError: true });
                } else {
                    // Deletes old session if user changes accounts
                    await sessions.deleteOne(oldSession);
                    cookies.delete("Session", { path: "/" });
                }
            }

            const newSession = createSession(foundUser.email);

            //  TODO: verify if insertMany() is idiomatic
            await sessions.insertMany(newSession);
            cookies.set("Session", JSON.stringify(newSession), { path: "/", expires: newSession.expiresAt });
        } catch (error) {
            return fail(500, {
                error: "Failed to log in due to a system issue, please try again later",
                loginError: true,
            });
        }

        return { success: true };
        // throw redirect(302, "/");
    },
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

        return { success: true };
        // throw redirect(302, "/");
    },
    register: async ({ request }) => {
        try {
            const data = Object.fromEntries(await request.formData());

            if (!isUser(data)) {
                return fail(400, { error: "Invalid input", registerError: true });
            }

            if (await users.findOne({ email: data.email })) {
                return fail(400, { error: "User already exists", registerError: true });
            }

            const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
            const encryptedPassword = await bcrypt.hash(data.password, salt);

            await users.insertMany({ email: data.email, password: encryptedPassword });
        } catch (error) {
            return fail(500, {
                error: "Failed to register due to a system issue, please try again later",
                registerError: true,
            });
        }

        return { success: true };
        // throw redirect(302, "/");
    },
};
