import { Model, Schema, model } from "mongoose";

export interface User {
    id: string;
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
        console.error("ERROR: failed to initialize user schema");
    }
}

export { users };

//  TODO: update this to actually check
export const isUser = (value: unknown): value is User => {
    return value !== null && typeof value === "object" && "email" in value && "password" in value;
};
