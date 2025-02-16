<svelte:head>
    <title>Greenpoint</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</svelte:head>

<main>
    <slot />
</main>

<footer>
    <p>© 2025 All Rights Reserved | Tazeem Mahashin - Founder of Greenpoint</p>
</footer>

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
    main {
        min-height: calc(100vh - 60px);
    }

    footer {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-top: 1px solid #f0f0f0;
        margin-top: auto;
    }

    footer p {
        color: #666;
        font-size: 0.9rem;
        text-align: center;
    }
</style>
