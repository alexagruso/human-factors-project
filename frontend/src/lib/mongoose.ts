import mongoose, { Types, Schema, model } from "mongoose";
import { MONGODB_URI } from "$env/static/private";

export interface Item {
    name: string;
    quantity: number;
}

export interface Receipt {
    merchant: string;
    transactionDate: Date;
    items: Types.DocumentArray<Item>;
}

mongoose.connect(MONGODB_URI).catch((error) => {
    console.error(error);
    console.error("FAILED TO CONNECT TO MONGODB");
});

const receiptSchema = new Schema<Receipt>({
    merchant: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
});

export const Receipts = model<Receipt>("Receipt", receiptSchema);
