import { receipts, type Receipt } from "@lib/schemas/receipt";
import type { PageServerLoad } from "../$types";
import { items, type Item } from "@lib/schemas/item";

export const load: PageServerLoad = async ({ locals }) => {
    const userItems: Array<Item> = [];
    let spending3Month : number = 0.00; //spending from 2 months ago
    let spending2Month : number = 0.00; //spending from last month
    let spendingMonthCurr : number = 0.00; //spending up to current day for current month
    
    let date: Date = new Date()
    let firstDay : Date = new Date(date.getFullYear(), date.getMonth(), 1); //retrieves first day of the current month
    let firstDayOf3MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth()-2, 1);
    let lastDayOf3MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth()-1, 0);
    let firstDayOf2MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth()-1, 1);
    let lastDayOf2MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth(), 0); //retrieves first day of the current month


    try {
        const foundReceipts: Receipt[] | undefined = await receipts.find({ userID: locals.userEmail, transactionDate: { $gte: firstDay, $lte: date} }).lean();

        if (foundReceipts) {
            const object = JSON.parse(JSON.stringify(foundReceipts));

            for (let i = 0; i < object.length; i++) {
                const tagArray: string = object[i].localID;

                const foundItems: Item[] | undefined = await items.find({ receiptID: tagArray }).lean();

                if (foundItems) {
                    foundItems.forEach((item) => {
                        userItems.push(item);
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

    try{
        const foundReceiptsMonth3: Receipt[] | undefined = await receipts.find({ userID: locals.userEmail, transactionDate: { $gte: firstDayOf3MonthsAgo, $lte: lastDayOf3MonthsAgo} }, 'grandTotal').lean();
        if(foundReceiptsMonth3)
        {
            const object3Month = JSON.parse(JSON.stringify(foundReceiptsMonth3));
            for(let i = 0; i < object3Month.length; i++)
            {
                spending3Month += object3Month[i].grandTotal;
            }
        }
    } catch(error) {
        console.error(error);
    }
    try{
        const foundReceiptsMonth2: Receipt[] | undefined = await receipts.find({ userID: locals.userEmail, transactionDate: { $gte: firstDayOf2MonthsAgo, $lte: lastDayOf2MonthsAgo} }, 'grandTotal').lean();
        if(foundReceiptsMonth2)
        {
            const object2Month = JSON.parse(JSON.stringify(foundReceiptsMonth2));
            for(let i = 0; i < object2Month.length; i++)
            {
                spending2Month += object2Month[i].grandTotal;
            }
        }
    } catch(error) {
        console.error(error);
    }
    try{
        const foundReceiptsMonthCurr: Receipt[] | undefined = await receipts.find({ userID: locals.userEmail, transactionDate: { $gte: firstDay, $lte: date} }, 'grandTotal').lean();
        if(foundReceiptsMonthCurr)
        {
            const objectMonthCurr = JSON.parse(JSON.stringify(foundReceiptsMonthCurr));
            for(let i = 0; i < objectMonthCurr.length; i++)
            {
                spendingMonthCurr += objectMonthCurr[i].grandTotal;
            }
        }
    } catch(error) {
        console.error(error);
    }

    return { items: JSON.parse(JSON.stringify(userItems)), month3Value: spending3Month, month2Value: spending2Month, monthCurrValue: spendingMonthCurr};
};

