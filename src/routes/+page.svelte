<script lang="ts">
    import ColorButton from "$lib/color/ColorButton.svelte";
    import ColorPicker from "$lib/color/ColorPicker.svelte";
    import type { RgbaColor } from 'colord';

    let rgba: RgbaColor = { r: 0, g: 0, b: 0, a: 1 };
</script>

<header>
    <div class="menu">
        <p class="menu-item">FILE</p>
        <p class="menu-item">EDIT</p>
        <p class="menu-item">SKIN</p>
    </div>
    <div class="logo">
        <span style="color:#ff0000">S</span>
        <span style="color:#ffa200">K</span>
        <span style="color:#bfff00">I</span>
        <span style="color:#1eff00">N</span>
        <span style="color:#00ff80">S</span>
        <span style="color:#00ddff">C</span>
        <span style="color:#0040ff">A</span>
        <span style="color:#6200ff">P</span>
        <span style="color:#ff00ff">E</span>
    </div>
    <nav>
        <p>Hello</p>
    </nav>
</header>

<div class="test">
    <ColorPicker bind:rgba width={150} height={180} />
    <ColorButton bind:rgba width={150} height={30} />
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    .test {
        padding-top: 100px;
        width: auto;
        display: flex;
        flex-direction: column;
        width: min-content;
    }

    header {
        position: fixed;
        display: flex;
        justify-content: space-between;
        top: 0;
        left: 0;
        width: 100%;
        height: 22px;
    }

    .menu {
        display: flex;
        flex: 1;
        height: 100%;
    }

    .menu-item {
        font-family: 'Silkscreen', serif;
        padding: 0 10px;
        height: 100%;
    }

    .menu-item:hover {
        background-color: rgba(18, 255, 117, 10)
    }

    .logo {
        flex: 1;
        text-align: center;
    }

    span {
        font-family: Silkscreen, serif;
    }

    nav {
        flex: 1;
    }
</style>