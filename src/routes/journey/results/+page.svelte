<!-- +page.svelte -->
<script>
    import { journey } from '$lib/stores/journey';
    import { profile } from '$lib/stores/profile';
    import { analyzeJourney } from '$lib/services/openai';
    import { fade, fly, scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let analysis = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            analysis = await analyzeJourney({
                start: { location: $journey.steps.start.location },
                destination: { location: $journey.steps.destination.location },
                transport: { mode: $journey.steps.transport.mode }
            });

            if (analysis) {
                journey.updatePoints(analysis.points);
                journey.completeStep('results');
                
                // Add journey to profile
                profile.addJourney({
                    start: $journey.steps.start,
                    destination: $journey.steps.destination,
                    transport: $journey.steps.transport,
                    analysis: analysis
                });
            }
            if (analysis.badge) {
                journey.addBadge(analysis.badge);
            }
            journey.setCarbonFootprint(analysis.carbonFootprint);
        } catch (e) {
            error = "Couldn't calculate environmental impact. Please try again.";
            console.error('Analysis error:', e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="results-container" in:fade="{{ duration: 400 }}">
    <div class="journey-summary" in:fly="{{ y: 20, duration: 400 }}">
        <h1>Journey Analysis</h1>
        <div class="route">
            <div class="point">
                <span class="emoji">{$journey.steps.start.emoji}</span>
                <span class="location">{$journey.steps.start.location}</span>
            </div>
            <div class="trail"></div>
            <div class="transport">
                <span class="emoji">{$journey.steps.transport.emoji}</span>
                <span class="mode">{$journey.steps.transport.mode}</span>
            </div>
            <div class="trail"></div>
            <div class="point">
                <span class="emoji">{$journey.steps.destination.emoji}</span>
                <span class="location">{$journey.steps.destination.location}</span>
            </div>
        </div>
    </div>

    {#if loading}
        <div class="loading-state" in:fade>
            <div class="spinner"></div>
            <p>Calculating environmental impact...</p>
        </div>
    {:else if error}
        <div class="error-state" in:fade>
            <p class="error">{error}</p>
            <button class="retry-button" on:click={() => window.location.reload()}>
                Try Again
            </button>
        </div>
    {:else}
        <div class="analysis-results" in:fly="{{ y: 20, duration: 400, delay: 200 }}">
            <div class="impact-card">
                <h2>Carbon Footprint</h2>
                <div class="journey-details">
                    <div class="detail-item">
                        <span class="label">Distance:</span>
                        <span class="value">{analysis.distance.miles} miles</span>
                        <span class="sub-text">({analysis.distance.routeType} route)</span>
                    </div>
                </div>
                <div class="impact-value">
                    <span class="number">{analysis.carbonFootprint.total}</span>
                    <span class="unit">kg CO₂</span>
                    <div class="rate">({analysis.carbonFootprint.perMile} kg/mile)</div>
                </div>
                <div class="explanation">
                    {analysis.carbonFootprint.explanation}
                </div>
                <div class="points {analysis.points > 0 ? 'positive' : 'negative'}">
                    {analysis.points > 0 ? '+' : ''}{analysis.points} points
                </div>
                {#if analysis.reasonings && analysis.reasonings.length > 0}
                    <div class="reasonings">
                        <h3>Analysis Details:</h3>
                        <ul>
                            {#each analysis.reasonings as reason}
                                <li>{reason}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>

            {#if analysis.alternatives?.length}
                <div class="alternatives" in:scale="{{ duration: 400, delay: 400 }}">
                    <h2>💡 Eco-Friendly Alternatives</h2>
                    <div class="alternatives-grid">
                        {#each analysis.alternatives as alternative}
                            <div class="alternative-card" in:fly="{{ y: 20, duration: 400 }}">
                                <div class="alternative-content">{alternative}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if analysis.badge}
                <div class="badge-earned" in:scale="{{ duration: 600, delay: 800 }}">
                    <h2>Badge Earned! 🎉</h2>
                    <div class="badge">
                        <span class="badge-name">{analysis.badge}</span>
                    </div>
                </div>
            {/if}
        </div>

        <div class="action-buttons" in:fade="{{ duration: 400, delay: 1000 }}">
            <button class="primary-button" on:click={() => {
                journey.setCurrentStep('profile');
                goto('/journey/profile');
            }}>
                View Profile
            </button>
        </div>
    {/if}
</div>

<style>
    .results-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    h1 {
        font-size: 2rem;
        color: var(--primary-color);
        margin: 0 0 2rem 0;
        text-align: center;
    }

    h2 {
        font-size: 1.2rem;
        color: #444;
        margin: 0 0 1rem 0;
    }

    .journey-summary {
        background: rgba(0, 179, 0, 0.05);
        padding: 1.5rem;
        border-radius: 1rem;
    }

    .route {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 2rem 0;
        background: rgba(0, 179, 0, 0.03);
        padding: 1.5rem;
        border-radius: 1rem;
        position: relative;
    }

    .trail {
        flex: 1;
        height: 2px;
        background: repeating-linear-gradient(90deg, var(--primary-color) 0, var(--primary-color) 6px, transparent 6px, transparent 12px);
        opacity: 0.3;
    }

    .point {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .transport {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .emoji {
        font-size: 1.2rem;
    }

    .location, .mode {
        font-size: 0.9rem;
        color: #666;
    }

    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
    }

    .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgba(0, 179, 0, 0.1);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s infinite linear;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .impact-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        text-align: center;
    }

    .journey-details {
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(0, 179, 0, 0.05);
        border-radius: 0.5rem;
    }

    .detail-item {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.5rem;
        font-size: 1.1rem;
    }

    .label {
        color: #666;
    }

    .value {
        font-weight: bold;
        color: var(--primary-color);
    }

    .sub-text {
        color: #666;
        font-size: 0.9rem;
    }

    .impact-value {
        font-size: 2.5rem;
        color: var(--primary-color);
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .rate {
        font-size: 1rem;
        color: #666;
    }

    .explanation {
        margin-top: 0.5rem;
        text-align: center;
        color: #666;
        font-size: 0.9rem;
    }

    .unit {
        font-size: 1rem;
        color: #666;
    }

    .points {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: bold;
    }

    .points.positive {
        background: rgba(0, 179, 0, 0.1);
        color: var(--primary-color);
    }

    .points.negative {
        background: rgba(255, 68, 68, 0.1);
        color: #ff4444;
    }

    .alternatives {
        margin-top: 2rem;
    }

    .alternatives ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .alternatives li {
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        border: 2px solid rgba(0, 179, 0, 0.1);
        margin-bottom: 0.5rem;
    }

    .reasonings {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(0, 179, 0, 0.05);
        border-radius: 0.5rem;
    }

    .reasonings h3 {
        font-size: 1rem;
        color: #444;
        margin: 0 0 0.5rem 0;
    }

    .reasonings ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .reasonings li {
        padding: 0.5rem;
        border-bottom: 1px solid rgba(0, 179, 0, 0.1);
        font-size: 0.9rem;
        color: #666;
    }

    .reasonings li:last-child {
        border-bottom: none;
    }

    .alternatives {
        margin-top: 2rem;
        padding: 1.5rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .alternatives h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);
        margin-bottom: 1.5rem;
    }

    .alternatives-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .alternative-card {
        background: rgba(0, 179, 0, 0.03);
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid rgba(0, 179, 0, 0.1);
        transition: all 0.2s;
    }

    .alternative-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        background: rgba(0, 179, 0, 0.05);
    }

    .alternative-content {
        color: #444;
        line-height: 1.4;
        font-size: 0.95rem;
    }

    .badge-earned {
        text-align: center;
        margin-top: 2rem;
    }

    .badge {
        display: inline-block;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #00b300 0%, #008000 100%);
        color: white;
        border-radius: 1rem;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0, 179, 0, 0.2);
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    .primary-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 179, 0, 0.1);
    }

    .error-state {
        text-align: center;
        padding: 2rem;
    }

    .error {
        color: #ff4444;
        margin-bottom: 1rem;
    }

    .retry-button {
        background: none;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
        padding: 0.8rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .retry-button:hover {
        background: var(--primary-color);
        color: white;
    }
</style>
