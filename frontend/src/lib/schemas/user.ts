import { Model, Schema, model } from "mongoose";

export interface User {
    email: string;
    password: string;
}

const userSchema = new Schema<User>({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

let users: Model<User>;

try {
    users = model<User>("User");
} catch (_) {
    try {
        users = model<User>("User", userSchema);
    } catch (error) {
        console.error(error);
        console.error("ERROR: FAILED TO INITIALIZE USER SCHEMA");
    }
}

export { users };

export const isUser = (value: unknown): value is User => {
    return value !== null && typeof value === "object" && "email" in value && "password" in value;
};
