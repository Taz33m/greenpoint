<!-- +page.svelte -->
<script>
    import { profile } from '$lib/stores/profile';
    import { journey } from '$lib/stores/journey';
    import { fade, scale } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import PaymentModal from './PaymentModal.svelte';
    import JourneyChart from '$lib/components/JourneyChart.svelte';

    // Complete profile step when viewing
    journey.completeStep('profile');

    let selectedBadge = null;
    let showPaymentModal = false;
    let currentOffset = {
        type: '',
        amount: 0,
        cost: 0,
        co2: 0
    };

    function handleOffset(type, costPer100kg, offsetAmount) {
        const totalCO2 = $profile.totalCarbonFootprint;
        const units = Math.ceil(totalCO2 / offsetAmount);
        const cost = units * costPer100kg;

        currentOffset = {
            type,
            cost,
            co2: totalCO2
        };
        showPaymentModal = true;
    }

    function handlePaymentConfirm() {
        // TODO: Integrate with payment provider
        alert(`Thank you! Your payment of $${currentOffset.cost} for the ${currentOffset.type} project has been processed.\n\nYou have successfully offset ${currentOffset.co2.toFixed(1)} kg of CO₂!`);
        showPaymentModal = false;

        // Update profile with offset info
        profile.update(p => ({
            ...p,
            carbonOffset: (p.carbonOffset || 0) + currentOffset.co2
        }));
    }
</script>

<div class="profile-page" in:fade="{{ duration: 400 }}">
    <div class="stats-section" in:scale="{{ duration: 400, delay: 200 }}">
        <div class="stat">
            <span class="label">Total Points</span>
            <span class="value">{$profile.totalPoints}</span>
        </div>
        <div class="stat">
            <span class="label">Carbon Footprint</span>
            <span class="value">{$profile.totalCarbonFootprint.toFixed(1)} kg CO₂</span>
            {#if $profile.carbonOffset}
                <span class="offset-badge">Offset: {$profile.carbonOffset.toFixed(1)} kg</span>
            {/if}
        </div>
        <div class="stat">
            <span class="label">Journeys</span>
            <span class="value">{$profile.journeys.length}</span>
        </div>
    </div>

    <div class="badges-section" in:scale="{{ duration: 400, delay: 400 }}">
        <h2>Badges Earned</h2>
        <div class="badges-grid">
            {#each [...$profile.badges] as badge}
                <button 
                    class="badge" 
                    class:selected={selectedBadge === badge}
                    on:click={() => selectedBadge = selectedBadge === badge ? null : badge}
                >
                    <span class="badge-name">{badge}</span>
                </button>
            {/each}
        </div>
    </div>

    <div class="history-section" in:scale="{{ duration: 400, delay: 600 }}">
        <h2>Journey History</h2>
        <JourneyChart journeys={$profile.journeys} />
        <div class="history-list">
            {#if $profile.journeys.length === 0}
                <div class="empty-state">
                    No journeys recorded yet
                </div>
            {/if}
            {#each [...$profile.journeys].sort((a, b) => new Date(b.date) - new Date(a.date)) as journey}
                <div class="journey-card">
                    <div class="journey-header">
                        <div class="route">
                            <span class="location">{journey.from}</span>
                            <span class="arrow">→</span>
                            <span class="location">{journey.to}</span>
                        </div>
                        <span class="date">{new Date(journey.date).toLocaleDateString()}</span>
                    </div>
                    <div class="journey-stats">
                        <span class="stat">
                            <span class="label">Points</span>
                            <span class="value">{journey.points}</span>
                        </span>
                        <span class="stat">
                            <span class="label">CO₂</span>
                            <span class="value">{journey.carbonFootprint.toFixed(1)} kg</span>
                        </span>
                        {#if journey.carbonOffset}
                            <span class="stat">
                                <span class="label">Offset</span>
                                <span class="value offset">{journey.carbonOffset.toFixed(1)} kg</span>
                            </span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="offset-section" in:scale="{{ duration: 400, delay: 700 }}">
        <h2>Carbon Offset</h2>
        <div class="offset-content">
            <div class="offset-info">
                <p>Your total carbon footprint is <strong>{$profile.totalCarbonFootprint.toFixed(1)} kg CO₂</strong></p>
                <p>Offset your carbon footprint by contributing to verified environmental projects:</p>
            </div>
            <div class="offset-projects">
                <div class="project-card">
                    <h3>🌳 Forest Conservation</h3>
                    <p>Support rainforest conservation projects in Brazil</p>
                    <div class="project-details">
                        <span class="price">$5 per 100kg CO₂</span>
                        <button class="offset-button" on:click={() => handleOffset('forest', 5, 100)}>Offset Now</button>
                    </div>
                </div>
                <div class="project-card">
                    <h3>🌞 Solar Energy</h3>
                    <p>Fund solar power installations in developing communities</p>
                    <div class="project-details">
                        <span class="price">$7 per 100kg CO₂</span>
                        <button class="offset-button" on:click={() => handleOffset('solar', 7, 100)}>Offset Now</button>
                    </div>
                </div>
                <div class="project-card">
                    <h3>💨 Wind Power</h3>
                    <p>Support wind farm development in rural areas</p>
                    <div class="project-details">
                        <span class="price">$6 per 100kg CO₂</span>
                        <button class="offset-button" on:click={() => handleOffset('wind', 6, 100)}>Offset Now</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="action-buttons" in:scale="{{ duration: 400, delay: 800 }}">
        <button class="primary-button" on:click={() => {
            journey.reset();
            journey.setCurrentStep('start');
            goto('/journey/start');
        }}>
            Start New Journey
        </button>
    </div>
</div>

<PaymentModal
    show={showPaymentModal}
    project={currentOffset}
    onClose={() => showPaymentModal = false}
    onConfirm={handlePaymentConfirm}
/>

<style>
    .profile-page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .stats-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .stat {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .stat .label {
        font-size: 0.9rem;
        color: #666;
    }

    .stat .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }

    .offset-badge {
        display: block;
        font-size: 0.8rem;
        color: #00b300;
        background: rgba(0, 179, 0, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        margin-top: 0.5rem;
    }

    .badges-section, .history-section {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    h2 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    .badge {
        background: linear-gradient(135deg, #00b300 0%, #008000 100%);
        color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .badge.selected {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .journey-card {
        background: #f8f8f8;
        padding: 1rem;
        border-radius: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .journey-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .route {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .location {
        color: #333;
    }

    .arrow {
        color: var(--primary-color);
        opacity: 0.5;
    }

    .date {
        font-size: 0.8rem;
        color: #666;
    }

    .journey-stats {
        display: flex;
        gap: 1rem;
    }

    .journey-stats .stat {
        flex: 1;
        padding: 0.5rem;
        background: white;
        border-radius: 0.5rem;
    }

    .journey-stats .label {
        font-size: 0.8rem;
        color: #666;
    }

    .journey-stats .value {
        font-size: 1rem;
        color: var(--primary-color);
    }

    .transport {
        font-size: 1.2rem;
    }

    .journey-stats {
        display: flex;
        gap: 1rem;
    }

    .journey-stats .stat {
        background: none;
        padding: 0;
        box-shadow: none;
        flex-direction: row;
        gap: 0.25rem;
    }

    .journey-stats .label {
        font-size: 0.8rem;
    }

    .journey-stats .value {
        font-size: 0.9rem;
    }

    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-size: 0.9rem;
        background: #f8f8f8;
        border-radius: 0.75rem;
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

    @media (max-width: 640px) {
        .stats-section {
            grid-template-columns: 1fr;
        }

        .badges-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
    }
    .offset-section {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .offset-info {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .offset-info p {
        margin: 0.5rem 0;
        color: #444;
    }

    .offset-projects {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
    }

    .project-card {
        background: rgba(0, 179, 0, 0.03);
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid rgba(0, 179, 0, 0.1);
        transition: all 0.2s;
    }

    .project-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .project-card h3 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .project-card p {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 0.9rem;
    }

    .project-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    .price {
        font-weight: 500;
        color: #444;
    }

    .offset-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .offset-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 179, 0, 0.2);
    }

    /* Payment Modal Styles */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 400px;
        width: 90%;
    }
</style>
