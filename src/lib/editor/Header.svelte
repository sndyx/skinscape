<script>
import Menu from "../Menu.svelte";

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
        <a href="/donate" class="heart">
            <img alt="heart" src="/icons/heart.png" width="18" height="18" />
        </a>
        <div class="login">
            <img alt="login" src="/icons/login.png" width="60" height="18" />
        </div>
    </div>
</div>

<style>
    .header {
        background-color: var(--secondary-color);
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 32px;
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

    }

    .header-right {
        flex: 1;
        display: flex;
        justify-content: right;
    }

    .heart {
        padding: 2px;
    }

    .login {
        padding: 2px 10px;
    }
</style>