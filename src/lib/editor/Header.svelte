<script>
import EditMenu from "../EditMenu.svelte";
import FileMenu from "../FileMenu.svelte";
import Menu from "../Menu.svelte";

import { _ } from "svelte-i18n";
</script>

<div class="header">
    <div class="header-left">
        <FileMenu />
        <EditMenu />
        <Menu label={$_('editor.header.view')}></Menu>
        <Menu label={$_('editor.header.color')}></Menu>
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
        display: flex;
        width: 100%;
        height: 32px;
    }

    .header-left {
        flex: 1;
        display: flex;
        justify-content: left;
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