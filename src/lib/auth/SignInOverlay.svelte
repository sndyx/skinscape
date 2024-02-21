<script>
    let shown = true;

    function close() {
        shown = false;
    }
</script>

<div class="sign-in-overlay" class:active={shown} on:click={close}>
    <div class="sign-in border-small">
        <h1>Sign in</h1>
        <p class="text">Sign in to access more features</p>
        <input
            class="text border"
            spellcheck=false
            maxLength="20"
            placeholder="username"
        />
        <input
            class="text border"
            spellcheck=false
            maxLength="20"
            placeholder="password"
        />
        <p class="text link">Forgot password?</p>
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
        font-family: 'Silkscreen', serif;
        font-size: 14px;
        overflow: hidden;
        cursor: url('/icons/input@2x.png') 12 12, auto;
        border: none;
        background-color: var(--inlay-color);
        padding: 12px 12px;
        color: var(--primary-text);
        width: calc(100% - 36px);
        margin: 16px 0;
    }

    .link {
        color: var(--link-text);
        font-size: 18px;
        float: left;
        width: 100%;
        margin: 10px 0;
    }
</style>