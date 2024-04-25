<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { PageData } from "./$types";

    export let data: PageData;

    const rawDateToString = (date: Date): string => {
        return date.toString().split("T").at(0)!;
    };

    const deleteByID = async (receiptID: string) => {
        let itemIDs: string[] = [];

        data.items?.forEach((item) => {
            if (receiptID == item.receiptID) {
                itemIDs.push(item.localID);
            }
        });

        try {
            await fetch("/profile/view", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ receipt: receiptID, items: itemIDs }),
            });
        } catch (error) {
            console.error(error);
        }
    };
</script>

{#if data.receipts?.length == 0}
    <span>You haven't <a href="/profile/upload">uploaded any receipts.</a> </span>
{:else if data.receipts}
    {#each data.receipts as receipt}
        <div class="card col">
            <div class="receipt col">
                <header>
                    <h2>Receipt</h2>
                    <span class="receipt-id">ID: {receipt.localID}</span>
                </header>
                <div class="receipt-body col">
                    <section class="receipt-information col">
                        <div class="receipt-label row">
                            <h3>Vendor:</h3>
                            <h3>{receipt.vendor}</h3>
                        </div>
                        <div class="receipt-label row">
                            <h3>Date:</h3>
                            <h3>{rawDateToString(receipt.transactionDate)}</h3>
                        </div>
                    </section>
                    <section class="receipt-items col">
                        <div class="section-label">
                            <h3>Items:</h3>
                        </div>
                        <div class="entries col">
                            {#each data.items as item}
                                {#if item.receiptID == receipt.localID}
                                    <div class="entry col">
                                        <div class="product-name row">
                                            <h4>{item.productName}</h4>
                                        </div>
                                        <div class="item-details row">
                                            <span>Quantity: {item.quantity}</span>
                                            <span>Price: ${item.price}</span>
                                            <span class="item-category">{item.category}</span>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </section>
                    <section class="grand-total row">
                        <h3>Grand Total:</h3>
                        <p>${receipt.grandTotal.toFixed(2)}</p>
                    </section>
                    <section class="interactions row">
                        <button
                            class="delete"
                            on:click={async () => {
                                await deleteByID(receipt.localID);
                                await invalidateAll();
                            }}>Delete</button
                        >
                    </section>
                </div>
            </div>
        </div>
    {/each}
{/if}

<style lang="scss">
    .card {
        overflow: hidden;

        border-radius: 0.5rem;
        max-width: 24rem;
        width: 100%;

        background-color: $primary;

        color: $white;
    }

    header {
        justify-content: center;

        padding: 0.75rem;
        width: 100%;

        background-color: $accent;

        & h2 {
            font-size: 1.5rem;
        }

        & span {
            font-size: 0.75rem;
        }
    }

    .receipt-body > section {
        padding: 1rem 2rem;

        &:not(:last-of-type) {
            border-bottom: 2px solid $primary-dark;
        }
    }

    .receipt-information {
        gap: 0.5rem;

        & > div {
            justify-content: space-between;

            font-size: 1.25rem;
        }
    }

    .section-label {
        h3 {
            font-size: 1.25rem;
        }
    }

    .receipt-items {
        gap: 1rem;
    }

    .entry {
        justify-content: space-between;
        flex-wrap: wrap;

        padding-top: 0.75rem;

        &:not(:last-of-type) {
            border-bottom: 2px solid $primary-dark;
        }
    }

    .product-label {
        gap: 0.25rem;
        align-items: end;

        & input {
            width: 15rem;
        }
    }

    .product-name {
        gap: 0.25rem;
    }

    .grand-total {
        justify-content: space-between;
    }

    .interactions {
        align-items: center;
        gap: 1rem;
    }

    button {
        transition: background-color 150ms;

        border-radius: 0.75rem;
        padding: 0.5rem 1rem;
        width: fit-content;

        background-color: $accent;

        &:hover {
            background-color: mix($accent, $white, 90%);
        }

        &.delete {
            height: fit-content;

            background-color: $error;

            &:hover {
                background-color: mix($error, $white, 90%);
            }
        }
    }

    .receipt-information input {
        max-width: 60%;
    }

    .item-details {
        gap: 0.25rem;

        margin-left: 0.5rem;

        & > span {
            flex-basis: 0;
            flex: 1;

            height: fit-content;

            &.item-category {
                flex: 0.75;
            }
        }
    }

    h4 {
        font-size: 1.1rem;
    }

    span {
        color: $white;
    }

    a {
        transition: color 150ms;

        color: $accent;
        font-size: 1rem;
        text-decoration: underline;

        &:hover {
            color: mix($accent, $white, 75%);
        }
    }
</style>
