<nav class="row">
    <div class="logo">
        <h2>ExpenseAid</h2>
    </div>
    <div class="links row">
        <!--  TODO: make this dynamic -->
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    </div>
</nav>

<style lang="scss">
    nav {
        justify-content: center;
        align-items: center;
        gap: 15rem;

        padding: 1rem 10rem;

        background-color: $primary;

        color: $white;

        & h2 {
            color: $accent;
            font-size: 2rem;
        }
    }

    .links {
        gap: 1rem;
    }

    a {
        transition:
            color 150ms,
            background-color 150ms;

        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        font-size: 1.1rem;

        &:hover {
            color: mix($accent, $white, 90%);
            background-color: mix($primary, $black, 75%);
        }
    }
</style>
