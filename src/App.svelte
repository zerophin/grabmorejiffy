<script>
  import Stow from "./Stow.svelte";
  import {gen} from "./logic";

  let packageCount = 50;
  let packages = gen(packageCount)

</script>
<div>
    <aside>
        <h1>Hold more Jiffies!</h1>
        <button on:click={() => location.reload()}>Restart</button>
    </aside>
    <main>
        <div class="container">
            <Stow packages={packages} split={5}/>
            <Stow packages={packages} split={1}/>
        </div>
    </main>
</div>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        width: 75%;
        margin: 0 auto;
    }

    @media (max-width: 640px) {
        main {
            flex-direction: column;
        }
    }
</style>
