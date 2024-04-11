import bcrypt from "bcryptjs";
import { isUser, users } from "$lib/schemas/user";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { SALT_ROUNDS } from "$env/static/private";

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

            const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
            const encryptedPassword = await bcrypt.hash(data.password, salt);

            await users.insertMany({ email: data.email, password: encryptedPassword });
        } catch (error) {
            return fail(500, {
                error: "Failed to register due to a system issue, please try again later",
                registerError: true,
            });
        }

        throw redirect(302, "/");
    },
};
