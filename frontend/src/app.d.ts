declare global {
    namespace App {
        interface Locals {
            loggedIn: boolean;
            userEmail: string;
        }
    }
}

export {};
