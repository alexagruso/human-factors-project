<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
</script>

<!--  TODO: make register automatically log in -->
<div class="form-container col">
    <header class="row">
        <h2>Register</h2>
    </header>
    <div class="form-body col">
        <form method="POST" action="?/register" class="col" use:enhance>
            <label for="register-email-input" class="col">
                <span>Email</span>
                <input type="email" name="email" id="register-email-input" placeholder="e.g. name@email.com" required />
            </label>
            <label for="register-password-input" class="col">
                <span>Password</span>
                <input type="password" name="password" id="register-password-input" placeholder="password" required />
            </label>
            {#if $page.form?.loginError}
                <span class="error">{$page.form.error}</span>
            {/if}
            <button type="submit">Register</button>
        </form>
        <div class="register-prompt row">
            <p>Already have an account?</p>
            <a href="/login">Log in here</a>
        </div>
    </div>
</div>

<style lang="scss">
    .form-container {
        align-items: center;

        overflow: hidden;

        border-radius: 0.75rem;
        width: fit-content;

        background-color: $primary;

        color: $white;
    }

    header {
        justify-content: center;

        padding: 0.75rem;
        width: 100%;

        background-color: $accent;

        & h2 {
            font-size: 1.5rem;
        }
    }

    .form-body {
        align-items: center;
        gap: 1.5rem;

        padding: 1.5rem 2rem;
    }

    form {
        align-items: center;
        gap: 1.5rem;
    }

    label {
        gap: 0.25rem;
    }

    input {
        transition: background-color 150ms;

        border-radius: 0.5rem;
        border: 2px solid $primary-dark;
        padding: 0.5rem;

        &::placeholder {
            transition: color 150ms;

            color: darken($white, 35%);
        }

        &:hover {
            background-color: mix($primary, $white, 90%);

            &::placeholder {
                color: $white;
            }
        }
    }

    .error {
        color: $error;
    }

    button[type="submit"] {
        transition: background-color 150ms;

        border-radius: 0.75rem;
        padding: 0.5rem 1rem;
        width: fit-content;

        background-color: $accent;

        &:hover {
            background-color: mix($accent, $white, 90%);
        }
    }

    .register-prompt {
        gap: 0.5rem;
    }

    p {
        font-size: 0.8rem;
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
