<!-- +layout.svelte -->
<script>
    import { journey } from '$lib/stores/journey';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    const stepOrder = ['start', 'transport', 'destination', 'results', 'profile'];
    
    $: currentStepIndex = stepOrder.indexOf($journey.currentStep);
    $: canGoBack = currentStepIndex > 0;
    $: canGoForward = (
        currentStepIndex < stepOrder.length - 1 && 
        $journey.steps[stepOrder[currentStepIndex]]?.completed
    );

    function goBack() {
        if (!canGoBack) return;
        const prevStep = stepOrder[currentStepIndex - 1];
        journey.setCurrentStep(prevStep);
        goto(`/journey/${prevStep}`);
    }

    function goForward() {
        if (!canGoForward) return;
        const nextStep = stepOrder[currentStepIndex + 1];
        journey.setCurrentStep(nextStep);
        goto(`/journey/${nextStep}`);
    }

    $: journeySteps = $journey.steps;
    $: currentStep = $journey.currentStep;
</script>

<div class="journey-container">
    <nav class="progress-nav">
        <div class="nav-controls">
            <button 
                class="nav-button" 
                on:click={goBack} 
                disabled={!canGoBack}
                aria-label="Go back"
            >
                ←
            </button>
        <div class="logo" in:fly="{{ y: -20, duration: 1000 }}">🟢 GreenPoint</div>
            <button 
                class="nav-button" 
                on:click={goForward} 
                disabled={!canGoForward}
                aria-label="Go forward"
            >
                →
            </button>
        </div>
        <div class="progress-bar">
            <div class="step {currentStep === 'start' ? 'active' : ''} {journeySteps.start?.completed ? 'completed' : ''}">
                <span class="emoji">📍</span>
                <span class="label">Start</span>
            </div>
            <div class="step {currentStep === 'transport' ? 'active' : ''} {journeySteps.transport?.completed ? 'completed' : ''}">
                <span class="emoji">{journeySteps.transport?.emoji || '🚗'}</span>
                <span class="label">Transport</span>
            </div>
            <div class="step {currentStep === 'destination' ? 'active' : ''} {journeySteps.destination?.completed ? 'completed' : ''}">
                <span class="emoji">📍</span>
                <span class="label">Destination</span>
            </div>
            <div class="step {currentStep === 'results' ? 'active' : ''} {journeySteps.results?.completed ? 'completed' : ''}">
                <span class="emoji">📊</span>
                <span class="label">Results</span>
            </div>
            <div class="step {currentStep === 'profile' ? 'active' : ''} {journeySteps.profile?.completed ? 'completed' : ''}">
                <span class="emoji">👤</span>
                <span class="label">Profile</span>
            </div>
        </div>
    </nav>

    <main in:fade="{{ duration: 300 }}">
        <slot />
    </main>
</div>

<style>
    .journey-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%);
        padding: 2rem;
    }

    .progress-nav {
        max-width: 800px;
        margin: 0 auto 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .nav-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .nav-button {
        background: white;
        border: 2px solid rgba(0, 179, 0, 0.1);
        color: var(--primary-color);
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }

    .nav-button:not(:disabled):hover {
        transform: scale(1.1);
        border-color: var(--primary-color);
        background: rgba(0, 179, 0, 0.05);
    }

    .nav-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }

    .progress-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        margin: 0 1rem;
    }

    .progress-bar::before {
        content: '';
        position: absolute;
        left: 3.5rem;
        right: 3.5rem;
        height: 2px;
        background: var(--primary-color);
        opacity: 0.2;
        top: 50%;
        transform: translateY(-50%);
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        z-index: 1;
    }

    .step .emoji {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: white;
        border: 2px solid rgba(0, 179, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    }

    .step .label {
        font-size: 0.8rem;
        color: #666;
        font-weight: 500;
        white-space: nowrap;
    }

    .step.active .emoji {
        border-color: var(--primary-color);
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 179, 0, 0.2);
    }

    .step.active .label {
        color: var(--primary-color);
        font-weight: bold;
    }

    .step.completed .emoji {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
    }

    .step.completed .label {
        color: var(--primary-color);
    }

    main {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
</style>
