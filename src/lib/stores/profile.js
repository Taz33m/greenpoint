import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const storedProfile = browser && localStorage.getItem('userProfile');
const initialProfile = storedProfile ? JSON.parse(storedProfile) : {
    journeys: [],
    totalCarbonFootprint: 0,
    totalPoints: 0,
    badges: new Set(), // Will be converted to/from Array for storage
    lastUpdated: null
};

const createProfileStore = () => {
    const { subscribe, set, update } = writable(initialProfile);

    return {
        subscribe,
        addJourney: (journey) => update(profile => {
            const newProfile = {
                ...profile,
                journeys: [{
                    date: new Date().toISOString(),
                    from: journey.start.location,
                    to: journey.destination.location,
                    mode: journey.transport.mode,
                    carbonFootprint: journey.analysis.carbonFootprint.total,
                    points: journey.analysis.points,
                    badge: journey.analysis.badge
                }, ...profile.journeys].slice(0, 50), // Keep last 50 journeys
                totalCarbonFootprint: profile.totalCarbonFootprint + journey.analysis.carbonFootprint.total,
                totalPoints: profile.totalPoints + journey.analysis.points,
                lastUpdated: new Date().toISOString()
            };

            // Add new badge if it doesn't exist
            if (journey.analysis.badge) {
                newProfile.badges = new Set([...profile.badges, journey.analysis.badge]);
            }

            // Save to localStorage
            if (browser) {
                const storageProfile = {
                    ...newProfile,
                    badges: Array.from(newProfile.badges)
                };
                localStorage.setItem('userProfile', JSON.stringify(storageProfile));
            }

            return newProfile;
        }),
        reset: () => {
            const newProfile = {
                journeys: [],
                totalCarbonFootprint: 0,
                totalPoints: 0,
                badges: new Set(),
                lastUpdated: null
            };
            if (browser) {
                localStorage.removeItem('userProfile');
            }
            set(newProfile);
        }
    };
};

export const profile = createProfileStore();
