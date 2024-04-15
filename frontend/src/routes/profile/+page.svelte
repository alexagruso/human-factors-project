<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="profile-interface row">
    <div class="user card col">
        <header class="col">
            <h2>Logged in as</h2>
            <h2>
                {$page.data.userEmail}
            </h2>
        </header>
        <div class="information">
            <h2>Hello</h2>
            <input type="date" name="" id="" />
        </div>
    </div>
    <div class="statistics card col">
        <a href="/profile/statistics">Statistics</a>
        <a href="/profile/upload">Upload</a>
    </div>
</div>

<style lang="scss">
    .profile-interface {
        gap: 1rem;

        width: clamp(50%, 10rem, 150rem);
    }

    .card {
        flex-basis: 0;

        overflow: hidden;

        border-radius: 0.5rem;

        background-color: $primary;
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
