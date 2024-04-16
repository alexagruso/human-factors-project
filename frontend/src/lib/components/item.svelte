<script lang="ts">
    import type { Item } from "@lib/schemas/item";

    export let item: Item;
</script>

<div class="item row">
    <div class="product-name row">
        <span>{item.productName}</span>
    </div>
    <div class="quantity row">
        <span>Quantity:</span>
        <span>{item.quantity}</span>
    </div>
    <div class="price row">
        <span>{item.price}/unit </span>
    </div>
</div>

<style lang="scss">
    .item {
        gap: 1rem;
    }

    .quantity {
        gap: 0.25rem;
    }
</style>
