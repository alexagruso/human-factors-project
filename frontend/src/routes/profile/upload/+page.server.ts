import { createReceipt, receipts } from "@lib/schemas/receipt";
import type { PageServerLoad } from "./$types";
import { type Actions } from "@sveltejs/kit";
import { items } from "@lib/schemas/item";

export const load: PageServerLoad = async () => {
    const newReceipt = createReceipt("Walmart", new Date());

    return { receipt: newReceipt, itemsArray: [] };
};

export const actions: Actions = {
    delete: async (event) => {
        // console.log(event);
    },
};
