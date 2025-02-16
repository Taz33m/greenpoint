<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    
    export let journeys = [];
    let canvas;
    let chart;

    $: if (chart && journeys) {
        updateChart();
    }

    onMount(() => {
        createChart();
        return () => {
            if (chart) chart.destroy();
        };
    });

    function createChart() {
        const ctx = canvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: getChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Your Journey Impact Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CO₂ (kg)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Journey Date'
                        }
                    }
                }
            }
        });
    }

    function updateChart() {
        chart.data = getChartData();
        chart.update();
    }

    function getChartData() {
        const sortedJourneys = [...journeys].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Calculate cumulative values
        let cumulativeFootprint = 0;
        let cumulativeOffset = 0;

        const footprintData = sortedJourneys.map(journey => {
            cumulativeFootprint += journey.carbonFootprint;
            return cumulativeFootprint;
        });

        const offsetData = sortedJourneys.map(journey => {
            cumulativeOffset += (journey.carbonOffset || 0);
            return cumulativeOffset;
        });

        return {
            labels: sortedJourneys.map(journey => new Date(journey.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Cumulative Carbon Footprint',
                    data: footprintData,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    fill: true
                },
                {
                    label: 'Carbon Offset',
                    data: offsetData,
                    borderColor: '#40c057',
                    backgroundColor: 'rgba(64, 192, 87, 0.1)',
                    fill: true
                }
            ]
        };
    }
</script>

<div class="chart-container">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 300px;
        margin: 1rem 0;
        background: white;
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
</style>
