import { type Actions, fail, redirect } from "@sveltejs/kit";
import { users } from "$lib/schemas/user"
import { receipts } from "$lib/schemas/receipt";

export async function load({cookies}) { //on load of webpage we want to get all of the data for an individual user
        const currentSession = JSON.parse(cookies.get("Session") ?? "{}");
        //console.log(currentSession.id); //whenever the id is added to the receipt schema then this will grab the id 
        try {
            const allReceipts = await receipts.find({"Category": "PLACEHOLDER"}).select('Items').lean() //change this to the id(only current user) and add the date(only the month) query too
            //console.log(allReceipts);
            return { items: JSON.parse(JSON.stringify(allReceipts)) }; //returns only items, to keep object not clustered
        } catch (error) {
            return fail(500, {
                error: "You have no receipts.",
            });
        }
};
