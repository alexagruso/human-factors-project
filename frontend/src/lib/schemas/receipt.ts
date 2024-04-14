import { Types, Schema, model, Model } from "mongoose";

export interface Item {
    name: string;
    quantity: number;
}

export interface Receipt {
    merchant: string;
    transactionDate: Date;
    items: Types.DocumentArray<Item>;
}

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

let receipts: Model<Receipt>;

try {
    receipts = model<Receipt>("Receipt");
} catch (_) {
    try {
        receipts = model<Receipt>("Receipt", receiptSchema);
    } catch (error) {
        console.error(error);
        console.error("ERROR: FAILED TO INITIALIZE RECEIPT SCHEMA");
    }
}

export { receipts };

// TODO: write receipt validation function
export const isReceipt = (value: unknown): value is Receipt => {
    return (
        value !== null &&
        typeof value === "object" &&
        "sessionID" in value &&
        "sessionEmail" in value &&
        "createdAt" in value &&
        "expiresAt" in value
    );
};
