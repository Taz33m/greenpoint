import { writable } from 'svelte/store';

// Mock leaderboard data
const mockUsers = [
    {
        id: 1,
        name: 'Emma Green',
        points: 2850,
        carbonOffset: 425.5,
        badges: ['Earth Champion', 'Carbon Warrior'],
        rank: 1
    },
    {
        id: 2,
        name: 'James Wilson',
        points: 2720,
        carbonOffset: 380.2,
        badges: ['Eco Pioneer'],
        rank: 2
    },
    {
        id: 3,
        name: 'Sarah Chen',
        points: 2680,
        carbonOffset: 350.8,
        badges: ['Green Commuter'],
        rank: 3
    },
    {
        id: 4,
        name: 'Michael Brown',
        points: 2450,
        carbonOffset: 320.5,
        badges: ['Carbon Reducer'],
        rank: 4
    },
    {
        id: 5,
        name: 'Lisa Martinez',
        points: 2380,
        carbonOffset: 290.3,
        badges: ['Eco Starter'],
        rank: 5
    },
    {
        id: 6,
        name: 'David Kim',
        points: 2200,
        carbonOffset: 275.6,
        badges: ['Green Traveler'],
        rank: 6
    },
    {
        id: 7,
        name: 'Rachel Taylor',
        points: 2150,
        carbonOffset: 260.4,
        badges: ['Climate Ally'],
        rank: 7
    },
    {
        id: 8,
        name: 'Alex Patel',
        points: 2080,
        carbonOffset: 245.2,
        badges: ['Eco Friend'],
        rank: 8
    }
];

function createLeaderboardStore() {
    const { subscribe, set, update } = writable({
        users: mockUsers,
        timeframe: 'monthly', // 'weekly', 'monthly', 'allTime'
        category: 'points' // 'points', 'carbonOffset'
    });

    return {
        subscribe,
        setTimeframe: (timeframe) => update(state => ({ ...state, timeframe })),
        setCategory: (category) => update(state => ({ ...state, category })),
        // Simulate updating leaderboard data
        refreshData: () => {
            update(state => {
                const shuffled = [...state.users].sort(() => Math.random() - 0.5);
                return {
                    ...state,
                    users: shuffled.map((user, index) => ({
                        ...user,
                        rank: index + 1
                    }))
                };
            });
        }
    };
}

export const leaderboard = createLeaderboardStore();
