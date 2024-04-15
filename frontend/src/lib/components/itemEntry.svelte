<script lang="ts">
    import type { Item } from "@lib/schemas/receipt";

    export let item: Item;
</script>

<div class="item row">
    <div class="product-name row">
        <span></span>
        <span>{item.quantity}</span>
    </div>
    <div class="quantity row">
        <span>Quantity:</span>
        <span>{item.quantity}</span>
    </div>
</div>
