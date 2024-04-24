import { createReceipt, receipts } from "@lib/schemas/receipt";
import type { PageServerLoad } from "./$types";
import { type Actions } from "@sveltejs/kit";
import { items, type Item } from "@lib/schemas/item";

export const load: PageServerLoad = async ({ locals }) => {
    const newReceipt = createReceipt("", new Date());
    newReceipt.userID = locals.userEmail;

    const itemsArray: Item[] = [];

    return { receipt: newReceipt, itemsArray };
};

export const actions: Actions = {
    delete: async () => {
        await receipts.deleteMany({});
        await items.deleteMany({});
    },
};
