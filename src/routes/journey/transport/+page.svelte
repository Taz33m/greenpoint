<!-- +page.svelte -->
<script>
    import { journey } from '$lib/stores/journey';
    import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import { getTransportEmoji } from '$lib/services/openai';
    
    let transport = '';
    let error = '';
    let isProcessing = false;
    
    // Common transport options with pre-defined emojis
    const quickOptions = [
        { name: 'Car', emoji: '🚗' },
        { name: 'Bus', emoji: '🚌' },
        { name: 'Train', emoji: '🚆' },
        { name: 'Bicycle', emoji: '🚲' },
        { name: 'Walking', emoji: '🚶' }
    ];

    function selectQuickOption(option) {
        transport = option.name;
        handleSubmit(option.emoji);
    }

    async function getCustomEmoji(transport) {
        // First check quick options
        const quickOption = quickOptions.find(opt => 
            opt.name.toLowerCase() === transport.toLowerCase()
        );
        if (quickOption) return quickOption.emoji;

        // If not found, use OpenAI
        try {
            return await getTransportEmoji(transport);
        } catch (error) {
            console.error('Error getting emoji:', error);
            return '🚗'; // Fallback emoji
        }
    }

    async function handleSubmit(preSelectedEmoji = null) {
        if (!transport.trim()) {
            error = 'Please enter your mode of transport';
            return;
        }

        isProcessing = true;
        error = '';

        try {
            const emoji = preSelectedEmoji || await getCustomEmoji(transport);
            
            journey.setTransport(transport, emoji);
            journey.setCurrentStep('destination');
            goto('/journey/destination');
        } catch (e) {
            error = 'Something went wrong. Please try again.';
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="container" in:fly="{{ y: 20, duration: 400 }}">
    <h1>How are you traveling?</h1>
    <p>Select or enter your mode of transport to calculate its environmental impact.</p>

    <div class="quick-options" in:fade="{{ duration: 400, delay: 200 }}">
        {#each quickOptions as option}
            <button 
                class="option-button {transport === option.name ? 'selected' : ''}"
                on:click={() => selectQuickOption(option)}
            >
                <span class="emoji">{option.emoji}</span>
                <span class="name">{option.name}</span>
            </button>
        {/each}
    </div>

    <div class="divider">
        <span>or</span>
    </div>

    <form on:submit|preventDefault={() => handleSubmit()} class="transport-form">
        <div class="input-group">
            <input
                type="text"
                bind:value={transport}
                placeholder="Enter your mode of transport"
                class:error={error}
                on:input={() => error = ''}
            />
            {#if error}
                <span class="error-message">{error}</span>
            {/if}
        </div>

        <button type="submit" class="primary-button" disabled={isProcessing}>
            {#if isProcessing}
                Processing...
            {:else}
                Continue
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

    .quick-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .option-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 2px solid rgba(0, 179, 0, 0.1);
        border-radius: 0.5rem;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .option-button:hover {
        transform: translateY(-2px);
        border-color: var(--primary-color);
    }

    .option-button.selected {
        background: rgba(0, 179, 0, 0.05);
        border-color: var(--primary-color);
    }

    .emoji {
        font-size: 1.5rem;
    }

    .name {
        font-size: 0.9rem;
        color: #666;
    }

    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 1rem 0;
    }

    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid rgba(0, 179, 0, 0.1);
    }

    .divider span {
        padding: 0 1rem;
        color: #666;
        font-size: 0.9rem;
    }

    .transport-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
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
</style>
