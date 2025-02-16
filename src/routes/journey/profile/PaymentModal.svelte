<script>
    import { fade, scale } from 'svelte/transition';
    
    export let show = false;
    export let onClose = () => {};
    export let onConfirm = () => {};
    export let project = {
        type: '',
        cost: 0,
        co2: 0
    };
</script>

{#if show}
<div class="modal" in:fade="{{ duration: 200 }}" on:click={onClose}>
    <div class="modal-content" in:scale="{{ duration: 300 }}" on:click|stopPropagation>
        <h2>Confirm Carbon Offset</h2>
        
        <div class="project-summary">
            <h3>Project Details</h3>
            <div class="detail">
                <span>Type:</span>
                <span class="value">{project.type} Project</span>
            </div>
            <div class="detail">
                <span>CO₂ to Offset:</span>
                <span class="value">{project.co2.toFixed(1)} kg</span>
            </div>
            <div class="detail">
                <span>Total Cost:</span>
                <span class="value">${project.cost}</span>
            </div>
        </div>

        <div class="payment-form">
            <div class="form-group">
                <label for="card">Card Number</label>
                <input type="text" id="card" placeholder="4242 4242 4242 4242" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="expiry">Expiry</label>
                    <input type="text" id="expiry" placeholder="MM/YY" />
                </div>
                <div class="form-group">
                    <label for="cvc">CVC</label>
                    <input type="text" id="cvc" placeholder="123" />
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="cancel" on:click={onClose}>Cancel</button>
            <button class="confirm" on:click={onConfirm}>Confirm Payment</button>
        </div>
    </div>
</div>
{/if}

<style>
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

    h2 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-color);
    }

    .project-summary {
        background: rgba(0, 179, 0, 0.03);
        padding: 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
    }

    .project-summary h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #444;
    }

    .detail {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .detail .value {
        font-weight: 500;
        color: #444;
    }

    .payment-form {
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: #666;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 0.9rem;
    }

    input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .cancel {
        background: #f5f5f5;
        border: none;
        color: #666;
    }

    .confirm {
        background: var(--primary-color);
        border: none;
        color: white;
    }

    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
