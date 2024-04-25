<script lang="ts">
    import { v4 as uuidv4 } from "uuid";
    import type { PageData } from "./$types";
    import { beforeUpdate } from "svelte";
    import { convert } from "@lib/utils/imageConverter";
    import { categories } from "@lib/schemas/item";
    import { receipts } from "@lib/schemas/receipt";

    let transactionDate = new Date().toISOString().split("T").at(0)!;
    let grandTotal = 0;

    let ocrStatus = "";
    let ocrError = false;

    let submitStatus = "";
    let submitError = false;

    let disableImageUpload = false;

    let editID = "";
    let badItemIDs: string[] = [];

    const calculateGrandTotal = (): number => {
        let sum = 0;

        data.items.forEach((item) => {
            sum += item.price * item.quantity;
        });

        return sum;
    };

    const createNewItem = () => {
        data.items.push({
            receiptID: data.receipt.localID,
            localID: uuidv4(),
            productName: "",
            category: "",
            quantity: 0,
            price: 0,
        });

        data.items = data.items; // push does not trigger svelte DOM update
    };

    const removeItemByID = (id: string) => {
        data.items = data.items.filter((item) => {
            return item.localID != id;
        });
    };

    const pushReceipt = async () => {
        data.receipt.transactionDate = new Date(transactionDate);

        let pushData = {
            receipt: data.receipt,
            items: data.items,
        };

        try {
            await fetch("/profile/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(pushData),
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOCR = async (event: Event) => {
        if (disableImageUpload) {
            return;
        }

        ocrStatus = "Scanning, please wait...";
        ocrError = false;

        disableImageUpload = true;

        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const rawFile = formData.get("receipt-image") as File;

            if (!rawFile) {
                return;
            }

            const base64File = await convert(rawFile);

            const response = await fetch("/api/ocr_handler", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ image: base64File }),
            });

            let items: [] = (await response.json()).Items;

            items.forEach((value) => {
                data.items.push({
                    receiptID: data.receipt.localID,
                    localID: uuidv4(),
                    productName: value.productName,
                    quantity: value.quantity,
                    price: value.price,
                    category: value.category,
                });
            });
        } catch (error) {
            console.error(`ERROR: ${error}`);

            ocrStatus = "Failed to upload file!";
            ocrError = true;

            return;
        } finally {
            disableImageUpload = false;
        }

        ocrStatus = "Scanning Complete!";

        data.items = data.items; // push does not trigger svelte DOM update
    };

    beforeUpdate(() => {
        grandTotal = calculateGrandTotal();
        data.receipt.grandTotal = grandTotal;
    });

    export let data: PageData;
</script>

<div class="card col">
    <div class="receipt col">
        <header>
            <h2>Receipt</h2>
            <span class="receipt-id">ID: {data.receipt.localID}</span>
        </header>
        <div class="receipt-body col">
            <section>
                <form
                    class="image-upload col"
                    on:submit={async (event) => {
                        await fetchOCR(event);
                    }}
                >
                    <input
                        type="file"
                        name="receipt-image"
                        id="receipt-image-input"
                        accept="image/*"
                        required
                        class:disabled={disableImageUpload}
                    />
                    <div class="upload-submit row">
                        <button type="submit">Scan</button>
                        <span class={ocrError ? "error" : "accent"}>{ocrStatus}</span>
                    </div>
                </form>
            </section>
            <section class="receipt-information col">
                <div class="editable row">
                    <label for="receipt-vendor-input">
                        <p>Vendor:</p>
                    </label>
                    <input
                        type="text"
                        name="vendor"
                        id="receipt-vendor-input"
                        placeholder="vendor"
                        bind:value={data.receipt.vendor}
                        required
                    />
                </div>
                <div class="editable row">
                    <label for="receipt-date-input">
                        <p>Date:</p>
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="receipt-date-input"
                        placeholder="mm/dd/yyyy"
                        bind:value={transactionDate}
                        required
                    />
                </div>
            </section>
            <section class="receipt-items col">
                <div class="section-label">
                    <h3>Items:</h3>
                </div>
                <div class="entries col">
                    {#if data.items.length == 0}
                        <span>Receipt is empty</span>
                    {:else}
                        {#each data.items as item}
                            <div class="entry col">
                                {#if badItemIDs.includes(item.localID)}
                                    <span class="error">Item has missing entries, cannot submit</span>
                                {/if}
                                <div class="product-name col">
                                    <label for="{item.localID}-product">
                                        <p>Product Name</p>
                                    </label>
                                    <input
                                        type="text"
                                        name="product"
                                        id="{item.localID}-product-name"
                                        placeholder="product name"
                                        bind:value={item.productName}
                                        required
                                    />
                                    <div class="product-buttons row">
                                        <button
                                            on:click={() => {
                                                if (editID == item.localID) {
                                                    editID = "";
                                                } else {
                                                    editID = item.localID;
                                                }
                                            }}>Edit</button
                                        >
                                        <button
                                            class="delete"
                                            on:click={() => {
                                                removeItemByID(item.localID);
                                            }}>Delete</button
                                        >
                                    </div>
                                </div>
                                {#if editID == item.localID}
                                    <div class="item-details col">
                                        <label for="{item.localID}-product">
                                            <p>Category</p>
                                        </label>
                                        <select
                                            name="category"
                                            id="{item.localID}-category"
                                            placeholder="category"
                                            bind:value={item.category}
                                            required
                                        >
                                            <option value="" selected disabled hidden>Choose category</option>
                                            {#each Object.entries(categories) as category}
                                                <option value={category.at(1)}>{category.at(1)}</option>
                                            {/each}
                                        </select>
                                        <label for="{item.localID}-product">
                                            <p>Quantity</p>
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            id="{item.localID}-quantity"
                                            min="0"
                                            step="1"
                                            placeholder="quantity"
                                            bind:value={item.quantity}
                                            required
                                        />
                                        <label for="{item.localID}-product">
                                            <p>Price ($)</p>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            id="{item.localID}-price"
                                            min="0"
                                            step="0.01"
                                            placeholder="price"
                                            bind:value={item.price}
                                            required
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>
                <button on:click={createNewItem}>New Item</button>
            </section>
            <section class="grand-total row">
                <h3>Grand Total:</h3>
                <p>${grandTotal.toFixed(2)}</p>
            </section>
            <section class="interactions row">
                <button
                    on:click={async () => {
                        if (!data.receipt.vendor) {
                            submitStatus = "Vendor cannot be empty";
                            submitError = true;

                            return;
                        }

                        if (data.items.length == 0) {
                            submitStatus = "Receipt cannot be empty";
                            submitError = true;

                            return;
                        }

                        badItemIDs = [];

                        data.items.forEach((item) => {
                            if (!item.category || !item.productName || !item.price || !item.quantity) {
                                badItemIDs.push(item.localID);
                            }
                        });

                        if (badItemIDs.length != 0) {
                            submitStatus = "Invalid item, cannot submit";
                            submitError = true;

                            return;
                        }

                        try {
                            submitError = false;
                            submitStatus = "Uploading...";

                            await pushReceipt();

                            submitStatus = "Success, redirecting...";
                        } catch (error) {
                            console.error(`ERROR: ${error}`);

                            submitStatus = "Failed to upload receipt...";
                            submitError = true;
                        }
                    }}>Submit</button
                >
                <span class={submitError ? "error" : "accent"}>{submitStatus}</span>
            </section>
        </div>
    </div>
</div>

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

    .entries {
        gap: 0.25rem;
    }

    .entry {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;

        border-bottom: 2px solid $primary-dark;
        padding: 1rem 0;
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

    input:not([type="file"]) {
        transition: background-color 150ms;

        border-radius: 0.5rem;
        border: 2px solid $primary-dark;
        padding: 0 0.5rem;

        &::placeholder {
            transition: color 150ms;

            color: darken($white, 35%);
        }

        &:hover {
            background-color: mix($primary, $white, 90%);

            &::placeholder {
                color: $white;
            }
        }
    }

    .entry input {
        padding: 0.5rem;
    }

    .receipt-information input {
        max-width: 60%;
    }

    .editable {
        justify-content: space-between;
    }

    .item-details {
        gap: 0.25rem;

        margin-left: 1rem;
    }

    input[type="file"] {
        color: $white;

        &::file-selector-button {
            transition: background-color 150ms;

            cursor: pointer;

            margin-right: 0.5rem;
            border-radius: 0.75rem;
            border: none;
            padding: 0.5rem 1rem;
            width: fit-content;

            background-color: $accent;

            color: $white;
            font-family: ubuntu;

            &:hover {
                background-color: mix($accent, $white, 90%);
            }
        }
    }

    select {
        transition: background-color 150ms;

        border-radius: 0.5rem;
        border: 2px solid $primary-dark;
        padding: 0.5rem 0.25rem;

        &::placeholder {
            transition: color 150ms;

            color: darken($white, 35%);
        }

        &:hover {
            background-color: mix($primary, $white, 90%);

            &::placeholder {
                color: $white;
            }
        }
    }

    .error {
        color: $error;
    }

    .image-upload {
        align-items: left;
        gap: 1rem;
    }

    .upload-submit {
        align-items: center;
        gap: 0.5rem;
    }

    .product-buttons {
        gap: 0.25rem;
    }
</style>
