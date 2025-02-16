<!-- +page.svelte -->
<script>
    import { journey } from '$lib/stores/journey';
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';

    let location = '';
    let error = '';

    function handleSubmit() {
        if (!location.trim()) {
            error = 'Please enter a location';
            return;
        }

        journey.setLocation('start', location);
        journey.setCurrentStep('transport');
        goto('/journey/transport');
    }
</script>

<div class="container" in:fly="{{ y: 20, duration: 400 }}">
    <h1>Where are you starting from?</h1>
    <p>Enter your starting location to begin your eco-friendly journey.</p>

    <form on:submit|preventDefault={handleSubmit} class="location-form">
        <div class="input-group">
            <input
                type="text"
                bind:value={location}
                placeholder="Enter your starting point"
                class:error={error}
                on:input={() => error = ''}
            />
            {#if error}
                <span class="error-message">{error}</span>
            {/if}
        </div>

        <button type="submit" class="primary-button">
            Continue
        </button>
    </form>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h1 {
        font-size: 2rem;
        color: var(--primary-color);
        margin: 0;
    }

    p {
        color: #666;
        margin: 0;
    }

    .location-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    input {
        padding: 1rem;
        border: 2px solid rgba(0, 179, 0, 0.1);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    input.error {
        border-color: #ff4444;
    }

    .error-message {
        color: #ff4444;
        font-size: 0.9rem;
    }

    .primary-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 179, 0, 0.1);
    }
</style>
