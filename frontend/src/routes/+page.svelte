<script lang="ts">
    import { page } from "$app/stores";

    let response: string | undefined;
</script>

<div class="greeting col">
    <h1>ExpenseAid</h1>
    <h2>Budgeting Made Easy!</h2>

    {#if !$page.data.loggedIn}
        <p>Begin your budgeting journey by <a href="/login">Logging In</a></p>
        <p>Or, if you don't have an account, <a href="/register">Register Now!</a></p>
    {/if}
</div>

<style lang="scss">
    * {
        color: $white;
    }

    h1 {
        font-size: 3rem;
    }

    h2 {
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    p {
        font-size: 0.9rem;
    }

    .greeting {
        align-items: center;
        gap: 1rem;
    }

    a {
        transition: color 150ms;

        color: $accent;
        font-size: 0.8rem;
        text-decoration: underline;

        &:hover {
            color: mix($accent, $white, 75%);
        }
    }
</style>
