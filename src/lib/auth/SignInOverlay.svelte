<script>
    let shown = true;
    let register = false;

    function close() {
        shown = false;
    }
</script>


<!-- SHUT UP SHUT UP SHUT UP SHUT UP SHUT UP SHUT UP -->
<!-- No Svelte, the drawing website is not accessible. Sorry. -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="sign-in-overlay" class:active={shown} on:click={close}>
    <div class="sign-in border-small" on:click={(e) => {e.stopPropagation()}}>
        {#if register}
            <h1>Sign in</h1>
            <p class="text">Sign in to access more features</p>
            <form method="post" action="/login?/login">
                <input
                    name="username"
                    spellcheck=false
                    maxLength="29"
                    placeholder="username"
                    class="text border"
                />
                <input
                    name="password"
                    type="password"
                    spellcheck=false
                    maxLength="255"
                    placeholder="password"
                    class="text border"
                />
                <input type="submit" value="Submit">
            </form>
            <p class="text link">Forgot password?</p>
        {:else}
            <form method="post" action="/login?/register">
                <input
                        name="username"
                        spellcheck=false
                        maxLength="29"
                        placeholder="username"
                        class="text border"
                />
                <input
                        name="password"
                        type="password"
                        spellcheck=false
                        maxLength="255"
                        placeholder="password"
                        class="text border"
                />
                <input
                        name="email"
                        spellcheck=false
                        maxLength="255"
                        placeholder="email"
                        class="text border"
                />
                <input type="submit" value="Submit">
            </form>
        {/if}
    </div>
</div>

<style>
    .sign-in-overlay {
        display: none;
        z-index: 5;
        background: repeating-linear-gradient(#ffffff02, #ffffff02 2px, #00000000 2px, #00000000 4px),
        repeating-linear-gradient(to right, #ffffff02, #ffffff02 2px, #00000000 2px, #00000000 4px);
        backdrop-filter: blur(1px);
        position: absolute;
        align-items: center;
        justify-content: center;

        inset: 0;
    }

    .sign-in {
        width: 40vh;
        height: 60vh;
        background-color: var(--main-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
    }

    .active {
        display: flex;
    }

    h1 {
        color: var(--primary-text);
        font-family: Unifont, serif;
        font-size: 32px;
        font-weight: 100;
    }

    p {
        color: var(--secondary-text);
        font-family: LanaPixel, serif;
        font-size: 22px;
        font-weight: 100;
    }

    input {
        z-index: 1;
        font-family: 'Muncro', serif;
        font-size: 20px;
        overflow: hidden;
        cursor: url('/icons/input@2x.png') 12 12, auto;
        border: none;
        background-color: var(--inlay-color);
        padding: 12px 12px;
        color: var(--primary-text);
        width: calc(100% - 36px);
        margin: 16px 0;
        -webkit-appearance: none;
        appearance: none;
        outline: none;
    }

    .link {
        color: var(--link-text);
        font-size: 18px;
        float: left;
        width: 100%;
        margin: 10px 0;
    }

    input[type="password"] {
        -webkit-text-security: square;
    }
</style>