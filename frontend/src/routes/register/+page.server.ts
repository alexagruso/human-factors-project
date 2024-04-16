import bcrypt from "bcryptjs";
import { isUser, users, type User } from "$lib/schemas/user";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { SALT_ROUNDS } from "$env/static/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.loggedIn) {
        redirect(302, "/");
    }
};

export const actions: Actions = {
    register: async ({ request }) => {
        try {
            const data = Object.fromEntries(await request.formData());

            if (!isUser(data)) {
                return fail(400, { error: "Invalid input", registerError: true });
            }

            if (await users.findOne({ email: data.email })) {
                return fail(400, { error: "User already exists", registerError: true });
            }

            const newUser: User = data;

            const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
            const encryptedPassword = await bcrypt.hash(newUser.password, salt);

            await users.insertMany({ email: newUser.email, password: encryptedPassword });
        } catch (error) {
            return fail(500, {
                error: "Failed to register due to a system issue, please try again later",
                registerError: true,
            });
        }

        throw redirect(302, "/login");
    },
};
