<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    let response: string | undefined;
</script>

{#if $page.data.loggedIn}
    <h2>Logged in as {$page.data.currentSession.email}</h2>
{/if}
<div class="form-container col">
    <h1>Logout</h1>
    <form method="POST" action="?/logout" class="col" use:enhance>
        <button type="submit">Logout</button>
    </form>
</div>

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
    .form-container {
        align-items: center;

        border: 1px solid black;
        padding: 1rem;
    }

    form {
        gap: 0.5rem;
    }
</style>
