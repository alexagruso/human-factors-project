import { items } from "@lib/schemas/item";
import { receipts } from "@lib/schemas/receipt";
import type { RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const receipt = body.receipt;
    const itemIDs: string[] = body.items;

    itemIDs.forEach(async (itemID) => {
        await items.deleteOne({ localID: itemID });
    });

    await receipts.deleteOne({ localID: receipt });

    return new Response("Ok");
};
