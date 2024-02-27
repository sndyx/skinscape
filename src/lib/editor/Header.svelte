<script>
import Menu from "../Menu.svelte";
import { profile, showAuthOverlay } from "$lib/stores.js";

import { _ } from "svelte-i18n";
</script>

<div class="header">
    <div class="header-left">
        <Menu label={$_('editor.header.file')} />
        <Menu label={$_('editor.header.edit')} />
        <Menu label={$_('editor.header.view')}></Menu>
        <Menu label={$_('editor.header.color')}></Menu>
    </div>
    <div class="header-center">
        <div class="logo-container">
            <span class="logo text">S</span>
            <span class="logo text">K</span>
            <span class="logo text">I</span>
            <span class="logo text">N</span>
            <span class="logo text">S</span>
            <span class="logo text">C</span>
            <span class="logo text">A</span>
            <span class="logo text">P</span>
            <span class="logo text">E</span>
        </div>
    </div>
    <div class="header-right">
        {#if $profile}
            <div class="pfp"><img src={$profile.display_skin} width="28" height="28" alt="profile"></div>
        {:else}
            <div class="login" on:mousedown={() => {showAuthOverlay.set(true)}}>
                <p class="login-text">{$_("editor.header.login")}</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .header {
        background-color: var(--secondary-color);
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 32px;
        margin-bottom: 4px;
        box-shadow: 0 2px 0 var(--border-dark), 0 4px 0 var(--border-light);
    }

    .header-left {
        flex: 1;
        display: flex;
        justify-content: left;
    }

    .header-center {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .logo-container {
        padding: 6px;
    }

    .logo {
        font-family: 'Silkscreen', serif;
        text-shadow: 2px 0 0 var(--border-dark),
        -2px 0 0 var(--border-dark),
        0 2px 0 var(--border-dark),
        0 -2px 0 var(--border-dark);
    }

    .header-right {
        flex: 1;
        display: flex;
        justify-content: right;
    }

    .login {
        background: var(--main-color);
        margin: 4px 6px;
        padding: 2px;
    }

    .login-text {
        font-family: LanaPixel, serif;
        font-size: 18px;
        color: var(--primary-text);
        margin: 0;
    }

    .pfp {
        margin: 2px 16px;
        box-shadow: 0 0 0 2px var(--border-dark);
    }

    .pfp:hover {
        --border-dark: var(--button-hover);
    }
</style>