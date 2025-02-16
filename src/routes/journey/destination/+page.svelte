<!-- +page.svelte -->
<script>
    import { journey } from '$lib/stores/journey';
    import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import { analyzeJourney } from '$lib/services/openai';

    let location = '';
    let error = '';
    let isProcessing = false;
    let suggestions = [];



    async function handleSubmit() {
        if (!location.trim()) {
            error = 'Please enter your destination';
            return;
        }

        isProcessing = true;
        error = '';

        try {
            journey.setLocation('destination', location);
            journey.setCurrentStep('results');

            // Pre-fetch journey analysis while navigating
            analyzeJourney({
                start: { location: $journey.steps.start.location },
                destination: { location: location },
                transport: { mode: $journey.steps.transport.mode }
            }).catch(console.error); // Don't wait for result

            goto('/journey/results');
        } catch (e) {
            error = 'Something went wrong. Please try again.';
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="container" in:fly="{{ y: 20, duration: 400 }}">
    <h1>Where are you heading?</h1>
    <p>Enter your destination to calculate the journey's environmental impact.</p>

    <div class="journey-preview" in:fade="{{ duration: 400, delay: 200 }}">
        <div class="start">
            <span class="emoji">{$journey.steps.start.emoji}</span>
            <span class="location">{$journey.steps.start.location}</span>
        </div>
        <div class="transport">
            <span class="emoji">{$journey.steps.transport.emoji}</span>
        </div>
        <div class="destination">
            <span class="emoji">📍</span>
            <span class="location">{location || 'Your destination'}</span>
        </div>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="destination-form">
        <div class="input-group">
            <input
                type="text"
                bind:value={location}
                placeholder="Enter your destination"
                class:error={error}
                on:input={() => error = ''}
            />
            {#if error}
                <span class="error-message">{error}</span>
            {/if}
        </div>

        <button type="submit" class="primary-button" disabled={isProcessing}>
            {#if isProcessing}
                <span class="loading">Calculating route...</span>
            {:else}
                See Environmental Impact
            {/if}
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

    .journey-preview {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(0, 179, 0, 0.05);
        border-radius: 1rem;
        margin: 1rem 0;
    }

    .journey-preview .start,
    .journey-preview .destination {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .journey-preview .transport {
        display: flex;
        align-items: center;
        padding: 0 1rem;
    }

    .journey-preview .emoji {
        font-size: 1.2rem;
    }

    .journey-preview .location {
        color: #444;
        font-size: 0.9rem;
    }

    .destination-form {
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

    .primary-button:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 179, 0, 0.1);
    }

    .primary-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .loading {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .loading::after {
        content: '';
        width: 0.5rem;
        height: 0.5rem;
        background: white;
        border-radius: 50%;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
