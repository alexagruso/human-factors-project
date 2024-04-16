import { items } from "@lib/schemas/item";
import { receipts } from "@lib/schemas/receipt";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const receipt = body.receipt;
    const newItems: [] = body.items;

    await receipts.insertMany(receipt);
    await items.insertMany(newItems);

    return new Response("Ok");
};
