<script>
    import { profile } from '$lib/stores/profile';
    import { fly, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let showProfile = false;

    function formatDate(isoString) {
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatCarbonFootprint(value) {
        return value.toFixed(2);
    }
</script>

<div class="profile-overlay" class:visible={showProfile} on:click|self={() => showProfile = false}>
    <div class="profile-content" in:fly="{{ y: 20, duration: 300, delay: 100 }}" out:fly="{{ y: 20, duration: 200 }}">
        <button class="close-button" on:click={() => showProfile = false}>×</button>
        
        <div class="profile-header">
            <h2>Your Green Journey</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="value">{formatCarbonFootprint($profile.totalCarbonFootprint)}</span>
                    <span class="label">kg CO₂ Total</span>
                </div>
                <div class="stat-card">
                    <span class="value">{$profile.totalPoints}</span>
                    <span class="label">Points Earned</span>
                </div>
                <div class="stat-card">
                    <span class="value">{$profile.badges.size}</span>
                    <span class="label">Badges</span>
                </div>
            </div>
        </div>

        {#if $profile.badges.size > 0}
            <div class="badges-section">
                <h3>Badges Earned</h3>
                <div class="badges-grid">
                    {#each Array.from($profile.badges) as badge}
                        <div class="badge" in:slide="{{ duration: 300 }}">
                            <span class="badge-icon">🏆</span>
                            <span class="badge-name">{badge}</span>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="journey-history">
            <h3>Recent Journeys</h3>
            {#if $profile.journeys.length === 0}
                <p class="no-journeys">No journeys recorded yet. Start your green adventure!</p>
            {:else}
                <div class="journey-list">
                    {#each $profile.journeys as journey}
                        <div class="journey-card" in:slide="{{ duration: 300 }}">
                            <div class="journey-header">
                                <span class="date">{formatDate(journey.date)}</span>
                                <span class="points {journey.points >= 0 ? 'positive' : 'negative'}">
                                    {journey.points >= 0 ? '+' : ''}{journey.points}
                                </span>
                            </div>
                            <div class="journey-route">
                                <span class="from">{journey.from}</span>
                                <span class="arrow">→</span>
                                <span class="to">{journey.to}</span>
                            </div>
                            <div class="journey-details">
                                <span class="mode">{journey.mode}</span>
                                <span class="footprint">{formatCarbonFootprint(journey.carbonFootprint)} kg CO₂</span>
                            </div>
                            {#if journey.badge}
                                <div class="journey-badge">
                                    <span class="badge-icon">🏆</span>
                                    {journey.badge}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <button class="reset-button" on:click={() => profile.reset()}>
            Reset Profile
        </button>
    </div>
</div>

<style>
    .profile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }

    .profile-overlay.visible {
        display: flex;
    }

    .profile-content {
        background: white;
        border-radius: 1rem;
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0.5rem;
        line-height: 1;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-button:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .profile-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .profile-header h2 {
        color: var(--primary-color);
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: rgba(0, 179, 0, 0.05);
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .stat-card .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }

    .stat-card .label {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.25rem;
    }

    .badges-section {
        margin-bottom: 2rem;
    }

    .badges-section h3 {
        color: #444;
        margin-bottom: 1rem;
    }

    .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .badge {
        background: white;
        border: 2px solid rgba(0, 179, 0, 0.1);
        border-radius: 0.5rem;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .badge-icon {
        font-size: 1.2rem;
    }

    .badge-name {
        font-size: 0.9rem;
        color: #444;
    }

    .journey-history h3 {
        color: #444;
        margin-bottom: 1rem;
    }

    .journey-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .journey-card {
        background: white;
        border: 2px solid rgba(0, 179, 0, 0.1);
        border-radius: 0.5rem;
        padding: 1rem;
    }

    .journey-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .date {
        color: #666;
        font-size: 0.9rem;
    }

    .points {
        font-weight: bold;
        font-size: 0.9rem;
    }

    .points.positive {
        color: var(--primary-color);
    }

    .points.negative {
        color: #ff4444;
    }

    .journey-route {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .from, .to {
        font-weight: bold;
        color: #444;
    }

    .arrow {
        color: #666;
    }

    .journey-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: #666;
    }

    .journey-badge {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(0, 179, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);
        font-size: 0.9rem;
    }

    .no-journeys {
        text-align: center;
        color: #666;
        padding: 2rem;
        background: rgba(0, 179, 0, 0.05);
        border-radius: 0.5rem;
    }

    .reset-button {
        margin-top: 2rem;
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 68, 68, 0.1);
        color: #ff4444;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    .reset-button:hover {
        background: rgba(255, 68, 68, 0.2);
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .badges-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .profile-content {
            padding: 1rem;
        }
    }
</style>
