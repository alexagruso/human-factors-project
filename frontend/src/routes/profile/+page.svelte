<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="card col">
    <header class="col">
        <h2>Logged in as</h2>
        <h2>
            {$page.data.userEmail}
        </h2>
    </header>
    <div class="links col">
        <a href="/profile/view">View Past Receipts</a>
        <a href="/profile/statistics">View Statistics</a>
        <a href="/profile/upload">Upload Receipt</a>
        <a href="/profile/budgetsettings">Budget Settings</a>
    </div>
</div>

<style lang="scss">
    .card {
        overflow: hidden;

        border-radius: 0.5rem;
        width: 100%;
        max-width: 24rem;

        background-color: $primary;

        color: $white;
    }

    .links {
        align-items: center;
    }

    a {
        transition: background-color 150ms;

        padding: 1rem;

        width: 100%;
        text-align: center;

        &:not(:last-of-type) {
            border-bottom: 2px solid $primary-dark;
        }

        &:hover {
            background-color: mix($primary, $white, 90%);
        }
    }

    header {
        justify-content: center;
        align-items: left;
        gap: 0.5rem;

        padding: 1rem;

        background-color: $accent;

        & h2 {
            font-size: 1.1rem;
        }
    }

    .user {
        flex-grow: 1;
    }

    .statistics {
        flex-grow: 3;
    }

    h2 {
        color: $white;
    }
</style>
