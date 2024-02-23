<script>
    // This whole component is straight dogshit 🔥🔥🔥
    // Perhaps this should be refactored later...
    // jk
    import Button from "$lib/common/Button.svelte";
    import { _ } from "svelte-i18n";

    let shown = true;

    let registering = false;

    let loginForm;
    let registerForm;

    // Returned from API
    // There has to be a better way to handle these... :(
    let errorTarget;
    let errorMessage;

    function login() {
        const username = loginForm.elements[0].value;
        const password = loginForm.elements[1].value;

        fetch(`/account/login?username=${username}&password=${password}`, {
            method: 'POST',
        }).then(async (res) => {
            const json = await res.json();
            if (json["success"]) {
                shown = false;
            } else {
                errorMessage = json["message"];
                errorTarget = json["target"];
            }
        });
    }

    function register() {
        const username = registerForm.elements[0].value;
        const password = registerForm.elements[1].value;
        const email = registerForm.elements[2].value;

        fetch(`/account/register?username=${username}&password=${password}&email=${email}`, {
            method: 'POST',
        }).then(async (res) => {
            const json = await res.json();
            if (json["success"]) {
                shown = false; // Probably? Change this later
            } else {
                errorMessage = json["message"];
                errorTarget = json["target"];
            }
        });
    }

    function toggleMode() {
        registering = !registering;
    }

    export function show() {
        errorTarget = undefined;
        errorMessage = undefined;
        registering = false;
        shown = true;
    }
</script>

<div class="auth-overlay" class:active={shown}>
    <div class="auth border">
        {#if registering}
            <h1 class="text">{$_("auth.register.title")}</h1>
            <p class="text">{$_("auth.register.subtext")}</p>
            {#if errorMessage} <!-- This is bad. I don't like this. -->
                <p class="error-text text">{$_(errorMessage)}</p>
            {:else}
                <div class="spacer"></div>
            {/if}
            <form bind:this={registerForm} class="auth-form">
                <input
                        placeholder={$_("auth.register.form.username")}
                        maxLength="29"
                        spellcheck=false
                        class="text border auth-input"
                        class:error={errorTarget === "username"}
                />
                <input
                        type="password"
                        placeholder={$_("auth.register.form.password")}
                        maxLength="255"
                        spellcheck=false
                        class="text border auth-input"
                        class:error={errorTarget === "password"}
                />
                <input
                        type="email"
                        placeholder={$_("auth.register.form.email")}
                        maxLength="255"
                        spellcheck=false
                        class="text border auth-input"
                        class:error={errorTarget === "email"}
                />
                <div class="button-container">
                    <Button text={$_("auth.register.form.submit")} on:mousedown={register} autoSelect={true}></Button>
                </div>
            </form>
            <div class="hint-text-container">
                <p class="hint-text text">{$_("auth.register.hint-text")}</p>
                <p class="hint-text-link text" on:click={toggleMode}>{$_("auth.register.hint-text-link")}</p>
            </div>
        {:else}
            <h1 class="text">{$_("auth.login.title")}</h1>
            <p class="text">{$_("auth.login.subtext")}</p>
            {#if errorMessage} <!-- This is bad. I don't like this. -->
                <p class="error-text text">{$_(errorMessage)}</p>
            {:else}
                <div class="spacer"></div>
            {/if}
            <form bind:this={loginForm} class="auth-form">
                <input
                        placeholder={$_("auth.login.form.username")}
                        maxLength="29"
                        spellcheck=false
                        class="text border auth-input"
                        class:error={errorTarget === "username"}
                />
                <input
                        type="password"
                        placeholder={$_("auth.login.form.password")}
                        maxLength="255"
                        spellcheck=false
                        class="text border auth-input"
                        class:error={errorTarget === "password"}
                />
                <div class="auth-form-options">
                    <div class="auth-checkbox-container">
                        <input class="auth-checkbox border-small" type="checkbox" />
                        <span class="hint-text text">{$_("auth.login.form.remember-me")}</span>
                    </div>
                    <p class="hint-text-link text">{$_("auth.login.form.forgot-password")}</p>
                </div>
                <div class="button-container">
                    <Button text={$_("auth.login.form.submit")} on:mousedown={login} autoSelect={true}></Button>
                </div>
            </form>
            <div class="hint-text-container">
                <p class="hint-text text">{$_("auth.login.hint-text")}</p>
                <p class="hint-text-link text" on:click={toggleMode}>{$_("auth.login.hint-text-link")}</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .auth-overlay {
        display: none;
        z-index: 3;
        background: repeating-linear-gradient(#ffffff02, #ffffff02 2px, #00000000 2px, #00000000 4px),
        repeating-linear-gradient(to right, #ffffff02, #ffffff02 2px, #00000000 2px, #00000000 4px);
        backdrop-filter: blur(1px);
        position: absolute;
        align-items: center;
        justify-content: center;

        inset: 0;
    }

    .active {
        display: flex;
    }

    .auth {
        width: 40vh;
        height: 60vh;
        background: var(--main-color);

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
    }

    .error {
        --border-color: var(--error-color);
        --border-light: var(--error-color);
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

    .error-text {
        width: 100%;
        font-size: 18px;
        margin: 0;
        color: var(--error-color);
    }

    .spacer {
        height: 23px;
    }

    .auth-input {
        z-index: 1;
        font-family: LanaPixel, serif;
        font-size: 22px;
        overflow: hidden;
        border: none;
        background-color: var(--inlay-color);
        padding: 12px 12px;
        color: var(--primary-text);
        width: calc(100% - 36px);
        margin: 16px 6px;
        -webkit-appearance: none;
        appearance: none;
        outline: none;
    }

    .hint-text {
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--secondary-text);
        margin: 0;
    }

    .hint-text-link {
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--link-text);
        margin: 0;
    }

    .auth-form-options {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .hint-text-container {
        display: flex;
        flex-direction: row;
        gap: 5px;
        width: 100%;
    }

    .hint-text {
        padding-top: 4px;
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--secondary-text);
    }

    .hint-text-link {
        padding-top: 4px;
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--link-text);
    }

    .hint-text-link:hover {
        text-decoration: underline;
    }

    .button-container {
        height: 54px;
        padding: 10px 0;
    }

    .auth-checkbox-container {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
    }

    .auth-checkbox {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background-color: var(--inlay-color);
    }
    .auth-checkbox:checked {
        background: var(--secondary-color);
    }
</style>