import { v4 as uuidv4 } from "uuid";
import { Schema, model, Model } from "mongoose";

export interface Receipt {
    localID: string; // For items to point to
    vendor: string;
    transactionDate: Date;
    grandTotal: number;
}

const receiptSchema = new Schema<Receipt>({
    localID: { type: String, required: true },
    vendor: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    grandTotal: { type: Number, required: true },
});

let receipts: Model<Receipt>;

//  TODO: extract this into separate function
try {
    receipts = model<Receipt>("Receipt");
} catch (_) {
    try {
        receipts = model<Receipt>("Receipt", receiptSchema);
    } catch (error) {
        console.error(error);
        console.error("ERROR: failed to initialize receipt schema");
    }
}

export { receipts };

export const createReceipt = (vendor: string, transactionDate: Date): Receipt => {
    return {
        localID: uuidv4(),
        vendor,
        transactionDate,
        grandTotal: 0.0,
    };
};

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
