import { v4 as uuidv4 } from "uuid";
import { createReceipt, receipts } from "@lib/schemas/receipt";
import type { PageServerLoad } from "./$types";
import { type Actions } from "@sveltejs/kit";
import { items, type Item } from "@lib/schemas/item";

export const load: PageServerLoad = async ({ locals }) => {
    const newReceipt = createReceipt("Walmart", new Date());
    newReceipt.userID = locals.userEmail;

    const item1: Item = {
        receiptID: newReceipt.localID,
        localID: uuidv4(),
        productName: "Apples",
        category: "Food",
        quantity: 3,
        price: 1.5,
    };

    const item2: Item = {
        receiptID: newReceipt.localID,
        localID: uuidv4(),
        productName: "Tires",
        category: "Automotive",
        quantity: 4,
        price: 15.0,
    };

    const item3: Item = {
        receiptID: newReceipt.localID,
        localID: uuidv4(),
        productName: "Purse",
        category: "Merchandise",
        quantity: 1,
        price: 14.0,
    };

    receipts.insertMany(newReceipt);
    items.insertMany(item1);
    items.insertMany(item2);
    items.insertMany(item3);

    return { receipt: newReceipt, itemsArray: [] };
};

export const actions: Actions = {
    delete: async (event) => {
        // console.log(event);
        receipts.deleteMany({});
        items.deleteMany({});
    },
};
