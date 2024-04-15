<script lang="ts">
    import { page } from "$app/stores";
</script>

<h2>Error: {$page?.error?.message}</h2>

<style lang="scss">
    h2 {
        color: $white;
    }
</style>
