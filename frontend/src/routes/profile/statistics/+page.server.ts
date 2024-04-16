import { receipts, type Receipt } from "@lib/schemas/receipt";
import type { PageServerLoad } from "../$types";
import { items, type Item } from "@lib/schemas/item";

export const load: PageServerLoad = async ({ locals }) => {
    const userItems: Array<Item> = [];

    try {
        const foundReceipts: Receipt[] | undefined = await receipts.find({ userID: locals.userEmail }).lean();

        if (foundReceipts) {
            const object = JSON.parse(JSON.stringify(foundReceipts));

            for (let i = 0; i < object.length; i++) {
                const tagArray: string = object[i].localID;

                const foundItems: Item[] | undefined = await items.find({ receiptID: tagArray }).lean();

                if (foundItems) {
                    foundItems.forEach((item) => {
                        userItems.push(item);
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

    return { items: JSON.parse(JSON.stringify(userItems)) };
};
