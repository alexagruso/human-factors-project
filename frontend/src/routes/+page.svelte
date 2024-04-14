<script lang="ts">
    import { page } from "$app/stores";

    let response: string | undefined;
</script>

{#if $page.data.loggedIn}
    <h2>Logged in as {$page.data.userEmail}</h2>
{/if}

<button
    on:click={async () => {
        response = await fetch("/api/rand").then((res) => {
            if (res.body) {
                return res.json();
            }
        });
    }}>Ping rand</button
>
{#if response}
    <h2>{response}</h2>
{/if}

<style lang="scss">
    h2 {
        color: $white;
    }

    button {
        color: $white;

        &:hover {
            background-color: $primary-dark;
        }
    }
</style>
