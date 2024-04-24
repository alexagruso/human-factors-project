import { createReceipt, receipts } from "@lib/schemas/receipt";
import type { PageServerLoad } from "./$types";
import { type Actions } from "@sveltejs/kit";
import { items, type Item } from "@lib/schemas/item";

export const load: PageServerLoad = async ({ locals }) => {
    const receipt = createReceipt("", new Date());
    receipt.userID = locals.userEmail;

    const items: Item[] = [];

    return { receipt, items };
};

export const actions: Actions = {
    delete: async () => {
        await receipts.deleteMany({});
        await items.deleteMany({});
    },
};
