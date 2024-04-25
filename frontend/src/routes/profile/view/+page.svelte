<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

{#each data.receipts as receipt}
    <span>{receipt.localID}</span>
    {#each data.items as item}
        {#if item.receiptID == receipt.localID}
            <span>{item.localID}</span>
        {/if}
    {/each}
{/each}
