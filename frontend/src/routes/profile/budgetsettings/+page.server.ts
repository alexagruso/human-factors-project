import { isUser, users, type User } from "$lib/schemas/user";
import { type Actions, fail, redirect } from "@sveltejs/kit";

export const actions: Actions = {
    budgetChange: async ({ request, locals }) => {
        try {
            const data = Object.fromEntries(await request.formData());
            await users.findOneAndUpdate({email:locals.userEmail},{monthlybudget:data.monthlybudget});
            return {success: true}
        } catch (error) {
            return fail(500, {
                error: "Failed to change budget due to a system issue, please try again later",
                registerError: true,
                success: false
            });
        }
    },
};
