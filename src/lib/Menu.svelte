<script>
    export let label;

    let menu;
    let content;

    let active = false;

    function click() {
        if (!active) {
            let rect = menu.getBoundingClientRect();
            content.setAttribute(
                "style",
                `display: block; top: 20px; left: ${rect.left}px;`,
            );
        } else {
            content.setAttribute("style", "display: none;");
        }
        active = !active;
    }

    function mousemove(event) {
        const menuRect = menu.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        if (
            !(
                (event.clientX >= menuRect.left &&
                    event.clientX <= menuRect.right &&
                    event.clientY >= menuRect.top &&
                    event.clientY <= menuRect.bottom) ||
                (event.clientX >= contentRect.left &&
                    event.clientX <= contentRect.right &&
                    event.clientY >= contentRect.top &&
                    event.clientY <= contentRect.bottom)
            )
        ) {
            content.setAttribute("style", "display: none;");
            active = false;
        }
    }
</script>

<svelte:window on:mousemove={mousemove} />

<div class="menu" bind:this={menu} on:click={click}>
    <p class="menu-item text">{label}</p>
</div>

<div class="content" bind:this={content} style="display: none;">
    <slot />
</div>

<style>
    .menu {
        height: 20px;
        padding: 0 5px;
    }

    .content {
        background: var(--inlay-color);
        position: absolute;
        z-index: 1;
    }

    p {
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--primary-text);
        margin: 0;
        padding: 0;
        user-select: none;
    }
</style>
