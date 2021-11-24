<script>
  import {crossfade, fly, fade} from "svelte/transition";
  import {quintOut, sineInOut} from "svelte/easing";
  import {generateAnimation, steps, time} from "./logic";
  import {sleep} from "./helpers";
  import {onMount} from "svelte";

  export let packages, split;

  let boxes = "ABCDE".split('');
  let colors = ['green', 'blue', 'yellow', 'red', 'purple', 'orange', 'black'];
  const getRandColor = () => colors[Math.floor(Math.random() * colors.length)]
  let person = {position: 0};
  let step = 0;
  $: done = step >= packages.length;
  let movespeed = 400;
  $: movespeedAdjusted = movespeed * .25

  $: remaining = packages.length - (split * Math.ceil(step / split));
  // $: console.log(person.position)
  $: console.log(movespeed)
  $: generatedAnimation = generateAnimation(packages, split, time);
  console.log({generatedAnimation})

  async function handleAnimation() {
    step = 0;
    for (let i = 0; i < generatedAnimation.length; i++) {
      let letter = generatedAnimation[i];
      person.position = steps[letter.position];
      movespeed = letter.stepsTo ?? movespeed;
      if (!letter.isDefault) {
        step++;
      }
      await sleep(movespeedAdjusted + 900)
    }
  }

  const [send, receive] = crossfade({
    duration: d => {
      return movespeedAdjusted
    },
    easing: sineInOut,
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  })

  onMount(() => {
    handleAnimation();
  })

</script>
<div class="container">
    <!--    <button on:click={handleAnimation}>toggle pos</button>-->
    <div class="input">
        <label>Jiffies held</label>
        <input readonly type="number" bind:value={split} min="1">
    </div>
    <div class="box-container">
        <div class="rack">{remaining < 0 ? 0 : remaining}</div>
        {#each boxes as box, i (box)}
            <div class="box-group">
                <div class="box" boxColor="{getRandColor()}">
                    {box}
                </div>
                {#if i === person.position }
                    <div id="person"
                         in:receive
                         out:send>
                    </div>
                    <div in:fade="{{delay: 500}}"
                         out:fly="{{ duration: 300, x: 0, y: -100, opacity: 0.5, easing: quintOut}}"
                         id="package">{done ? 'problem solve' : 'Amazon'}</div>
                {/if}
            </div>
        {/each}
    </div>
    {#if done}
        <p>Done!</p>
    {/if}
</div>
<style>

    :root {
        --box-border-radius: 6px;
    }

    #package {
        padding: 1rem;
        border-radius: 6%;
        color: dodgerblue;
        border: solid black 1px;
        font-size: .25em;
    }

    .box-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        width: 50%;
        margin: 2em auto;
        gap: 1rem;
    }

    .input {
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        gap: .75rem;
    }

    .rack {
        align-self: flex-end;
        display: flex;
        align-items: center;
        height: 12rem;
        padding: 0 2rem;
        background: silver;
        transform: translateY(6.2rem);
    }

    .box {
        background: #c5c5c5;
        padding: 2rem;
        color: white;
        border-width: 15px;
    }

    @media (max-width: 640px) {
        .box {
            padding: .85em;
        }

        .rack {
            padding: 0;
            transform: none;
        }

        #package {
            /*transform: rotateZ(90deg);*/
            padding: .25rem;
            font-size: 10px;
        }
    }

    .box[boxColor="green"] {
        border: solid green var(--box-border-radius);
    }

    .box[boxColor="blue"] {
        border: solid blue var(--box-border-radius);
    }

    .box[boxColor="red"] {
        border: solid red var(--box-border-radius);
    }

    .box[boxColor="yellow"] {
        border: solid yellow var(--box-border-radius);
    }

    .box[boxColor="purple"] {
        border: solid purple var(--box-border-radius);
    }

    .box[boxColor="orange"] {
        border: solid orange var(--box-border-radius);
    }

    .box[boxColor="black"] {
        border: solid black var(--box-border-radius);
    }

    .box-group {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #person {
        border-radius: 100%;
        background: red;
        margin-top: 1rem;
        color: white;
        height: 2rem;
        width: 2rem;
    }
</style>
