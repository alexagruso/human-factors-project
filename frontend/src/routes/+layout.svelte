<script lang="ts">
    import Footer from "@components/footer.svelte";
    import Navbar from "@components/navbar.svelte";
    import "@lib/scss/reset.scss";
</script>

<Navbar></Navbar>
<main class="col">
    <slot />
</main>
<Footer></Footer>

<style lang="scss">
    main {
        justify-content: center;
        align-items: center;
        gap: 1rem;
        flex-grow: 1;
    }
</style>
