<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    let response: string | undefined;
</script>

{#if $page.data.loggedIn}
    <h2>Logged in as {$page.data.currentSession.email}</h2>
{/if}
<main class="col">
    <div class="form-container col">
        <h1>Login</h1>
        <form method="POST" action="?/login" class="col" use:enhance>
            <input type="email" name="email" id="login-email-input" required />
            <input type="password" name="password" id="login-password-input" required />
            <button type="submit">Login</button>
        </form>
    </div>
    {#if $page.form?.loginError}
        <h2>{$page.form.error}</h2>
    {/if}

    <div class="form-container col">
        <h1>Logout</h1>
        <form method="POST" action="?/logout" class="col" use:enhance>
            <button type="submit">Logout</button>
        </form>
    </div>
    {#if $page.form?.logoutError}
        <h2>{$page.form.error}</h2>
    {/if}

    <div class="form-container col">
        <h1>Register</h1>
        <form method="POST" action="?/register" class="col" use:enhance>
            <input type="email" name="email" id="register-email-input" required />
            <input type="password" name="password" id="register-password-input" required />
            <button type="submit">Register</button>
        </form>
    </div>
    {#if $page.form?.registerError}
        <h2>{$page.form.error}</h2>
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
</main>

<style lang="scss">
    main {
        align-items: center;
        gap: 1rem;
    }

    .form-container {
        align-items: center;

        border: 1px solid black;
        padding: 1rem;
    }

    form {
        gap: 0.5rem;
    }

    //  TODO: extract these to a global .scss file
    //  TODO: suppress warnings in neovim for unused selectors

    .row {
        display: flex;
        flex-direction: row;
    }

    .col {
        display: flex;
        flex-direction: column;
    }
</style>
