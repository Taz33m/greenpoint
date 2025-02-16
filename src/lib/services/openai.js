const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Get the most appropriate emoji for a transport mode
 * @param {string} transport - The transport mode description
 * @returns {Promise<string>} - The selected emoji
 */
export async function getTransportEmoji(transport) {
    const prompt = `Given the transport mode "${transport}", return only a single emoji that best represents this mode of transport. 
    Consider environmental impact in your selection.
    Response should be exactly one emoji character, nothing else.
    Examples:
    - "tesla model 3" → "🚗"
    - "walking" → "🚶"
    - "electric scooter" → "🛴"
    - "hybrid bus" → "🚌"`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that returns exactly one emoji character based on the transport mode provided. Nothing else.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 5
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API request failed');
        }

        const data = await response.json();
        const emoji = data.choices[0].message.content.trim();
        
        // Verify we got a single emoji
        if (emoji.length > 2) {
            throw new Error('Invalid emoji response');
        }

        return emoji;
    } catch (error) {
        console.error('Error getting transport emoji:', error);
        return '🚗'; // Fallback emoji
    }
}

/**
 * Calculate carbon footprint and get eco-friendly suggestions
 * @param {Object} journey - The journey details
 * @returns {Promise<Object>} - Carbon footprint and suggestions
 */
export async function analyzeJourney(journey) {
    console.log('Analyzing journey:', journey);
    const prompt = `Calculate environmental impact for this journey:
From: ${journey.start.location}
To: ${journey.destination.location}
Mode: ${journey.transport.mode}

Use these emissions factors (kg CO₂/mile):
Ground:
- Walk/Bike: 0
- E-Scooter/E-Bike: 0.035
- Electric Car: 0.08
- Hybrid Car: 0.12
- Regular Car: 0.22
- Bus: 0.1/passenger
- Train: 0.05/passenger

Air (multiply by RFI):
- Short (<500mi): 0.29 × RFI 2.0
- Medium (500-1500mi): 0.23 × RFI 2.3
- Long (>1500mi): 0.18 × RFI 2.7

Route factors:
- Urban: 1.2x
- Mixed: 1.3x
- Rural: 1.4x
- Air: Great circle + 50km takeoff/landing

Points: -10 to +10
- Zero emission: +8 to +10
- Electric: +3 to +7
- Public: +1 to +5
- Car: -3 to 0
- Flight: -5 to -1 (less for necessary long-haul)

Return this exact JSON:
{
    "distance": {
        "miles": 0,
        "routeType": "urban/rural/mixed/air",
        "routeFactor": 1.2
    },
    "carbonFootprint": {
        "total": 0,
        "perMile": 0,
        "rfi": null,
        "explanation": "Calculation method"
    },
    "alternatives": [
        "Alternative 1 with savings",
        "Alternative 2 with comparison",
        "Alternative 3 with practicality"
    ],
    "points": 0,
    "badge": "",
    "reasonings": [
        "Distance calculation",
        "Emissions method",
        "Points justification"
    ]
}`; 


    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an environmental impact analyst providing accurate and helpful insights about journey carbon footprints.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0,
                max_tokens: 500,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API request failed');
        }

        const data = await response.json();
        console.log('OpenAI response:', data);
        
        const content = data.choices[0].message.content.trim();
        console.log('Parsing content:', content);
        
        try {
            const result = JSON.parse(content);
            // Validate and process the result with distance information
            const processedResult = {
                distance: {
                    miles: Number(result.distance?.miles) || 0,
                    routeType: result.distance?.routeType || 'unknown',
                    routeFactor: Number(result.distance?.routeFactor) || 1
                },
                carbonFootprint: {
                    total: Math.max(0, Math.round(Number(result.carbonFootprint?.total) * 100) / 100) || 0,
                    perMile: Math.max(0, Math.round(Number(result.carbonFootprint?.perMile) * 100) / 100) || 0,
                    explanation: result.carbonFootprint?.explanation || 'No explanation provided'
                },
                alternatives: Array.isArray(result.alternatives) && result.alternatives.length === 3 ? 
                    result.alternatives : [
                        `Consider walking for distances under 2 miles`,
                        `Public transport is efficient for this journey`,
                        `Biking is eco-friendly for distances under 10 miles`
                    ],
                points: Math.max(-10, Math.min(10, Math.round(Number(result.points)))) || 0,
                badge: result.badge || null,
                reasonings: Array.isArray(result.reasonings) ? result.reasonings : []
            };
            
            console.log('Processed result:', processedResult);
            return processedResult;
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid response format from AI');
        }
        
        // Validate response format
        if (!result.carbonFootprint || typeof result.carbonFootprint !== 'number' ||
            !Array.isArray(result.alternatives) || result.alternatives.length !== 3 ||
            typeof result.points !== 'number' || result.points < -10 || result.points > 10) {
            throw new Error('Invalid response format from AI');
        }

        return {
            ...result,
            carbonFootprint: Math.round(result.carbonFootprint * 100) / 100, // Round to 2 decimal places
            points: Math.round(result.points) // Ensure whole numbers for points
        };
    } catch (error) {
        console.error('Error analyzing journey:', error);
        return {
            distance: {
                miles: 0,
                routeType: 'unknown',
                routeFactor: 1
            },
            carbonFootprint: {
                total: 0,
                perMile: 0,
                explanation: 'Could not calculate emissions'
            },
            alternatives: [
                'Consider walking for short distances',
                'Public transport is a green option',
                'Biking is eco-friendly and healthy'
            ],
            points: 0,
            reasonings: ['Error occurred during calculation']
        };
    }
}
