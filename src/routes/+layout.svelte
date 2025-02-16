<svelte:head>
    <title>Greenpoint</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</svelte:head>

<slot />

<style>
    :global(:root) {
        --primary-color: #00b300;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        background: #f5f5f5;
    }
</style>
