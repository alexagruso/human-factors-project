<script lang="ts">
    let currentYear = new Date().getFullYear();
</script>

<footer class="row">
    <div class="contact row">
        <div class="copyright">
            <span>Copyright &copy; {currentYear} ExpenseAid. All Rights Reserved.</span>
        </div>
        <div class="credits row">
            <span>Created by</span>
            <a href="https://github.com/lgayler00" target="_blank">Luke</a>
            <span>,</span>
            <a href="https://github.com/alexagruso" target="_blank">Alex</a>
            <span>, and</span>
            <a href="https://github.com/aliyah-ym58" target="_blank">Aliyah</a>
        </div>
    </div>
</footer>

<style lang="scss">
    footer {
        justify-content: center;

        padding: 0.9rem;

        background-color: $primary;

        color: $white;
    }

    .contact {
        gap: 2rem;
    }

    span {
        margin-right: 0.25rem;

        font-size: 1rem;
    }

    a {
        transition: color 150ms;

        color: $accent;
        font-size: 1rem;
        text-decoration: underline;

        &:hover {
            color: mix($accent, $white, 75%);
        }
    }
</style>
