<script>
    import { leaderboard } from '$lib/stores/leaderboard';
    import { fade, slide } from 'svelte/transition';

    let selectedTimeframe = 'monthly';
    let selectedCategory = 'points';

    function formatNumber(num) {
        return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
    }

    function handleTimeframeChange(timeframe) {
        selectedTimeframe = timeframe;
        leaderboard.setTimeframe(timeframe);
        leaderboard.refreshData();
    }

    function handleCategoryChange(category) {
        selectedCategory = category;
        leaderboard.setCategory(category);
        leaderboard.refreshData();
    }
</script>

<div class="leaderboard">
    <div class="leaderboard-header">
        <div class="filters">
            <div class="filter-group">
                <button 
                    class:active={selectedTimeframe === 'weekly'}
                    on:click={() => handleTimeframeChange('weekly')}
                >Weekly</button>
                <button 
                    class:active={selectedTimeframe === 'monthly'}
                    on:click={() => handleTimeframeChange('monthly')}
                >Monthly</button>
                <button 
                    class:active={selectedTimeframe === 'allTime'}
                    on:click={() => handleTimeframeChange('allTime')}
                >All Time</button>
            </div>
            <div class="filter-group">
                <button 
                    class:active={selectedCategory === 'points'}
                    on:click={() => handleCategoryChange('points')}
                >Points</button>
                <button 
                    class:active={selectedCategory === 'carbonOffset'}
                    on:click={() => handleCategoryChange('carbonOffset')}
                >Carbon Offset</button>
            </div>
        </div>
    </div>

    <div class="leaderboard-content">
        {#each $leaderboard.users as user, index (user.id)}
            <div 
                class="leaderboard-row"
                class:top-three={index < 3}
                in:slide={{ duration: 300, delay: index * 50 }}
            >
                <div class="rank">
                    {#if index < 3}
                        <span class="medal">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                    {:else}
                        {user.rank}
                    {/if}
                </div>
                <div class="user-info">
                    <span class="name">{user.name}</span>
                    <div class="badges">
                        {#each user.badges as badge}
                            <span class="badge">{badge}</span>
                        {/each}
                    </div>
                </div>
                <div class="score">
                    {#if selectedCategory === 'points'}
                        <span class="points">{formatNumber(user.points)}</span>
                        <span class="label">pts</span>
                    {:else}
                        <span class="carbon">{formatNumber(user.carbonOffset)}</span>
                        <span class="label">kg</span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .leaderboard {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }

    .leaderboard-header {
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
    }

    .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .filter-group {
        display: flex;
        gap: 0.5rem;
    }

    button {
        background: #f5f5f5;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover {
        background: #ebebeb;
    }

    button.active {
        background: var(--primary-color);
        color: white;
    }

    .leaderboard-content {
        padding: 1rem;
    }

    .leaderboard-row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        background: #f9f9f9;
        transition: all 0.2s;
    }

    .leaderboard-row:hover {
        transform: translateX(4px);
        background: #f5f5f5;
    }

    .leaderboard-row.top-three {
        background: rgba(0, 179, 0, 0.05);
    }

    .rank {
        font-size: 1.1rem;
        font-weight: 500;
        color: #666;
        width: 2rem;
        text-align: center;
    }

    .medal {
        font-size: 1.2rem;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .name {
        font-weight: 500;
        color: #333;
    }

    .badges {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .badge {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        background: rgba(0, 179, 0, 0.1);
        color: #00b300;
        border-radius: 1rem;
    }

    .score {
        text-align: right;
        font-weight: 500;
    }

    .points {
        color: var(--primary-color);
    }

    .carbon {
        color: #00b300;
    }

    .label {
        font-size: 0.8rem;
        color: #666;
        margin-left: 0.25rem;
    }

    @media (max-width: 640px) {
        .filters {
            flex-direction: column;
        }

        .leaderboard-row {
            padding: 0.75rem;
        }

        .badges {
            display: none;
        }
    }
</style>
