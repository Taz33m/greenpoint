import { writable } from 'svelte/store';

// Initial journey state
const initialState = {
    steps: {
        start: {
            completed: false,
            location: '',
            emoji: '🗺️'
        },
        transport: {
            completed: false,
            mode: '',
            emoji: null
        },
        destination: {
            completed: false,
            location: '',
            emoji: '📍'
        },
        results: {
            completed: false,
            emoji: '📊'
        },
        profile: {
            completed: false,
            emoji: '👤'
        }
    },
    currentStep: 'start',
    points: 0,
    badges: [],
    carbonFootprint: null
};

function createJourneyStore() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        setLocation: (step, location) => update(state => {
            state.steps[step].location = location;
            state.steps[step].completed = true;
            return state;
        }),
        setTransport: (mode, emoji) => update(state => {
            state.steps.transport.mode = mode;
            state.steps.transport.emoji = emoji;
            state.steps.transport.completed = true;
            return state;
        }),
        setCurrentStep: (step) => update(state => {
            state.currentStep = step;
            return state;
        }),
        updatePoints: (points) => update(state => {
            state.points += points;
            return state;
        }),
        completeStep: (step) => update(state => {
            state.steps[step].completed = true;
            return state;
        }),
        reset: () => set({
            ...initialState,
            points: 0,
            badges: [],
            carbonFootprint: null
        }),
        addBadge: (badge) => update(state => {
            if (!state.badges.includes(badge)) {
                state.badges.push(badge);
            }
            return state;
        }),
        setCarbonFootprint: (footprint) => update(state => {
            state.carbonFootprint = footprint;
            return state;
        }),
        reset: () => set(initialState)
    };
}

export const journey = createJourneyStore();
