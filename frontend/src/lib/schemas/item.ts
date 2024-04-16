import { Model, Schema, model } from "mongoose";

export interface Item {
    receiptID: string; // Which receipt the item belongs to
    localID: string;
    productName: string;
    category: string;
    quantity: number;
    price: number;
}

const itemSchema = new Schema<Item>({
    receiptID: { type: String, required: true },
    localID: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

let items: Model<Item>;

try {
    items = model<Item>("Item");
} catch (_) {
    try {
        items = model<Item>("Item", itemSchema);
    } catch (error) {
        console.error(error);
        console.error("ERROR: failed to initialize item schema");
    }
}

export { items };

export const isItem = (value: unknown): value is Item => {
    return (
        value !== null &&
        typeof value === "object" &&
        "receiptID" in value &&
        "productName" in value &&
        "quantity" in value &&
        "price" in value
    );
};
