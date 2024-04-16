<script lang="ts">
    import PieChart from "../../circle/PieChart.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h2>Monthly Spending by Category</h2>

<PieChart {data} />

<style lang="scss">
    h2 {
        color: $white;
    }
</style>
