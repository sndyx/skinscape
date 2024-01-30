<script>
    export let bodyToggles;

    $: {

    }
</script>

<div class="container">
    <div class="top">
        <div class="head" on:click={bodyToggles.head = !bodyToggles.head}></div>
    </div>
    <div class="middle">
        <div class="left-arm" on:click={bodyToggles.leftArm = !bodyToggles.leftArm}></div>
        <div class="body" on:click={bodyToggles.body = !bodyToggles.body}></div>
        <div class="right-arm" on:click={bodyToggles.rightArm = !bodyToggles.rightArm}></div>
    </div>
    <div class="bottom">
        <div class="left-leg" on:click={bodyToggles.leftLeg = !bodyToggles.leftLeg}></div>
        <div class="right-leg" on:click={bodyToggles.rightLeg = !bodyToggles.rightLeg}></div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        background-color: red;
        width: 100%;
        height: 100%;
    }

    .top {
        flex: 1;
        justify-content: center;
        display: flex;
    }

    .head {
        aspect-ratio : 1 / 1;
        height: 100%;
        background-color: blue;
    }

    .middle {
        display: flex;
        padding: 10px 10px;
        flex: 2;
        justify-content: center;
    }

    .left-arm {
        flex: 1;
        height: 100%;
        background-color: blue;
    }

    .body {
        margin: 0 10px;
        flex: 3;
        height: 100%;
        background-color: blue;
    }

    .right-arm {
        flex: 1;
        height: 100%;
        background-color: blue;
    }

    .bottom {
        flex: 2;
    }


</style>