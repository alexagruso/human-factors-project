<script lang="ts">
</script>

<div class="col card">
    <h1>Budget Wheel</h1>
    <div class="col wheel">
        <section id="portion1"></section>
        <section id="portion2"></section>
        <section id="portion3"></section>
        <section id="portion4"></section>
        <section id="portion5"></section>
        <div id="date">April</div>
    </div>
</div>

<style lang="scss">
    .card {
        gap: 0.5rem;
        align-items: center;

        margin: 1rem;
        border-radius: 0.5rem;
        border: 1px solid black;
        padding: 0.5rem;
        width: fit-content;
    }

    .wheel {
        position: relative;

        border-radius: 100%;
        border: 1px solid black;
        height: 10rem;
        width: 10rem;
    }

    .wheel section {
        z-index: -1;
        height: 100%;
        width: 100%;
        position: absolute;
    }

    #portion {
        &1 {
            background-color: green;
            transform: rotateZ(20deg);
        }

        &2 {
            background-color: blue;
            transform: rotateZ(40deg);
        }

        &3 {
            background-color: red;
            transform: rotateZ(60deg);
        }

        &4 {
            background-color: yellow;
            transform: rotateZ(80deg);
        }

        &5 {
            background-color: orange;
            transform: rotateZ(100deg);
        }
    }
</style>
