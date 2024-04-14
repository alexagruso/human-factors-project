import { SESSION_LENGTH } from "$env/static/private";
import { model, Schema, type Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Session {
    sessionID: string;
    email: string;
    createdAt: Date;
    expiresAt: Date;
}

const sessionSchema = new Schema<Session>({
    sessionID: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: {
        type: Date,
        required: true,
        expires: parseInt(SESSION_LENGTH),
        index: true, //  TODO: check if this is needed
    },
});

let sessions: Model<Session>;

try {
    sessions = model<Session>("Session");
} catch (_) {
    try {
        sessions = model<Session>("Session", sessionSchema);
    } catch (error) {
        console.error(error);
        console.error("ERROR: FAILED TO INITIALIZE USER SCHEMA");
    }
}

export { sessions };

export const createSessionFromUser = (email: string): Session => {
    return {
        sessionID: uuidv4(),
        email: email,
        createdAt: new Date(),
        // date class takes milliseconds since 1970 epoch
        expiresAt: new Date(new Date().getTime() + parseInt(SESSION_LENGTH) * 1000),
    };
};

export const isSession = (value: unknown): value is Session => {
    return (
        value !== null &&
        typeof value === "object" &&
        "sessionID" in value &&
        "sessionEmail" in value &&
        "createdAt" in value &&
        "expiresAt" in value
    );
};
