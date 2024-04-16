<script lang="ts">
    import { v4 as uuidv4 } from "uuid";
    import type { PageData } from "./$types";
    import { beforeUpdate } from "svelte";

    let grandTotal = 0;

    const calculateGrandTotal = (): number => {
        let sum = 0;

        data.itemsArray.forEach((item) => {
            sum += item.price * item.quantity;
        });

        return sum;
    };

    const createNewItem = () => {
        data.itemsArray.push({
            receiptID: data.receipt.localID,
            localID: uuidv4(),
            productName: "",
            category: "",
            quantity: 0,
            price: 0,
        });

        data.itemsArray = data.itemsArray; // push does not trigger svelte DOM update
    };

    const removeItemByID = (id: string) => {
        data.itemsArray = data.itemsArray.filter((item) => {
            return item.localID != id;
        });
    };

    const pushReceipt = async () => {
        let pushData = {
            receipt: data.receipt,
            items: data.itemsArray,
        };

        fetch("/profile/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(pushData),
        });
    };

    const convert = async (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const fetchOCR = async (event) => {
        const file = event.target.files[0];
        const base64File = await convert(file);

        let ocr_data = { image: base64File };

        const response = await fetch("/api/ocr_handler", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(ocr_data),
        });

        let items: [] = (await response.json()).Items;

        items.forEach((value) => {
            data.itemsArray.push({
                receiptID: data.receipt.localID,
                localID: uuidv4(),
                productName: value.productName,
                quantity: value.quantity,
                price: value.quantity,
                category: value.category,
            });
        });

        data.itemsArray = data.itemsArray; // push does not trigger svelte DOM update
    };

    beforeUpdate(() => {
        grandTotal = calculateGrandTotal();
        data.receipt.grandTotal = grandTotal;
    });

    export let data: PageData;
</script>

<input
    type="file"
    name="receipt-image"
    id="receipt-image-input"
    on:change={(event) => {
        fetchOCR(event);
    }}
/>
<div class="card col">
    <div class="receipt col">
        <header>
            <h2>Receipt</h2>
            <span class="receipt-id">ID: {data.receipt.localID}</span>
        </header>
        <div class="receipt-body col">
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
                        bind:value={data.receipt.transactionDate}
                        required
                    />
                </div>
            </section>
            <section class="receipt-items col">
                <div class="section-label">
                    <h3>Items:</h3>
                </div>
                <div class="entries col">
                    {#each data.itemsArray as item}
                        <div class="entry col">
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
                            </div>
                            <div class="item-details col">
                                <label for="{item.localID}-product">
                                    <p>Category</p>
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    id="{item.localID}-category"
                                    placeholder="category"
                                    bind:value={item.category}
                                    required
                                />
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
                            <button
                                class="delete"
                                on:click={() => {
                                    removeItemByID(item.localID);
                                }}>Delete</button
                            >
                        </div>
                    {/each}
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
                        await pushReceipt();
                    }}>Submit</button
                >
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

    .product-name {
        gap: 0.25rem;
    }

    .grand-total {
        justify-content: space-between;
    }

    .interactions {
        justify-content: right;
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
            background-color: $error;

            &:hover {
                background-color: mix($error, $white, 90%);
            }
        }
    }

    input {
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
</style>
