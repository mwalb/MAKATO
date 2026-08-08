/**
 * ============================================================================
 * TANZANIA MOBILE MONEY CALCULATOR — CORE LOGIC
 * ============================================================================
 */

// State
let selectedNetworkId = TZ_NETWORKS[0].id;
let selectedTxType = 'send_same';

// DOM Elements
const networkGrid = document.getElementById('networkGrid');
const transactionForm = document.getElementById('transactionForm');
const transactionTypes = document.getElementById('transactionTypes');
const amountInput = document.getElementById('amountInput');
const amountError = document.getElementById('amountError');
const calculateBtn = document.getElementById('calculateBtn');
const quickAmounts = document.getElementById('quickAmounts');

const resultsSection = document.getElementById('resultsSection');
const resultNetwork = document.getElementById('resultNetwork');
const resultAmount = document.getElementById('resultAmount');
const resultType = document.getElementById('resultType');
const resultFee = document.getElementById('resultFee');
const resultTotal = document.getElementById('resultTotal');

const adviceBox = document.getElementById('adviceBox');
const adviceTitle = document.getElementById('adviceTitle');
const adviceText = document.getElementById('adviceText');

const whatsappBtn = document.getElementById('whatsappBtn');

const comparisonSection = document.getElementById('comparisonSection');
const comparisonTableBody = document.getElementById('comparisonTableBody');

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    renderNetworkGrid();
    setupEventListeners();
    setupQuickAmounts();
    updateTypeSelectionUI();
}

// ============================================================================
// NETWORK GRID RENDERING
// ============================================================================

function renderNetworkGrid() {
    networkGrid.innerHTML = '';
    
    TZ_NETWORKS.forEach(network => {
        const card = document.createElement('div');
        card.className = `network-card ${network.id === selectedNetworkId ? 'active' : ''}`;
        card.dataset.networkId = network.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-pressed', network.id === selectedNetworkId);
        
        card.innerHTML = `
            <div class="network-icon">
                <img src="assets/${network.logo}" alt="${network.name}">
            </div>
            <span class="network-name">${network.shortName}</span>
        `;
        
        // Click handler
        card.addEventListener('click', () => selectNetwork(network.id));
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectNetwork(network.id);
            }
        });
        
        networkGrid.appendChild(card);
    });
}

function selectNetwork(networkId) {
    selectedNetworkId = networkId;
    
    // Update UI
    document.querySelectorAll('.network-card').forEach(card => {
        const isActive = card.dataset.networkId === networkId;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-pressed', isActive);
    });
    
    // AUTO-SCROLL to transaction type section
    const formSection = document.getElementById('form-section');
    if (formSection) {
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    // If results are already showing, recalculate
    if (resultsSection.style.display !== 'none') {
        const amount = parseFloat(amountInput.value);
        if (amount && amount >= MIN_AMOUNT) {
            calculateAndDisplay(amount);
        }
    }
}

// ============================================================================
// TRANSACTION TYPE SELECTION
// ============================================================================

function setupEventListeners() {
    // Transaction type radio buttons
    const typeOptions = transactionTypes.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            selectedTxType = radio.value;
            updateTypeSelectionUI();
            
            // Recalculate if visible
            const amount = parseFloat(amountInput.value);
            if (resultsSection.style.display !== 'none' && amount && amount >= MIN_AMOUNT) {
                calculateAndDisplay(amount);
            }
        });
    });
    
    // Form submission
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCalculate();
    });
    
    // Amount input validation cleanup
    amountInput.addEventListener('input', () => {
        amountInput.classList.remove('error');
        amountError.classList.remove('visible');
    });
    
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCalculate();
        }
    });
}

function updateTypeSelectionUI() {
    const options = transactionTypes.querySelectorAll('.type-option');
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        option.classList.toggle('active', radio.checked);
    });
}

// ============================================================================
// QUICK AMOUNT CHIPS
// ============================================================================

function setupQuickAmounts() {
    const chips = quickAmounts.querySelectorAll('.quick-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const amount = chip.dataset.amount;
            amountInput.value = amount;
            amountInput.classList.remove('error');
            amountError.classList.remove('visible');
            
            // Visual feedback
            chips.forEach(c => {
                c.style.borderColor = '';
                c.style.color = '';
            });
            chip.style.borderColor = 'var(--color-primary)';
            chip.style.color = 'var(--color-primary)';
            
            // Auto-calculate
            handleCalculate();
        });
    });
}

// ============================================================================
// CALCULATION ENGINE
// ============================================================================

function handleCalculate() {
    const rawValue = amountInput.value.trim();
    const amount = parseFloat(rawValue);
    
    // Validation
    if (!rawValue || isNaN(amount) || amount < MIN_AMOUNT) {
        amountInput.classList.add('error');
        amountError.classList.add('visible');
        amountInput.focus();
        return;
    }
    
    if (amount > MAX_AMOUNT) {
        amountInput.classList.add('error');
        amountError.textContent = `Kiasi kikubwa zaidi ni TSh ${formatNumber(MAX_AMOUNT)}`;
        amountError.classList.add('visible');
        return;
    }
    
    amountInput.classList.remove('error');
    amountError.classList.remove('visible');
    amountError.textContent = 'Tafadhali weka kiasi sahihi';
    
    calculateAndDisplay(amount);
}

function findFee(networkId, amount, txType) {
    const network = TZ_NETWORKS.find(n => n.id === networkId);
    if (!network) return 0;
    
    const tier = network.tiers.find(t => amount >= t.min && amount <= t.max);
    if (!tier) return 0;
    
    return tier[txType] || 0;
}

function calculateAndDisplay(amount) {
    // Calculate for selected network
    const fee = findFee(selectedNetworkId, amount, selectedTxType);
    const total = amount + fee;
    
    // Get network details
    const network = TZ_NETWORKS.find(n => n.id === selectedNetworkId);
    
    // Render primary result
    renderPrimaryResult(network, amount, fee, total);
    
    // Generate smart advice
    generateAdvice(amount, fee);
    
    // Generate comparison table
    renderComparisonTable(amount);
    
    // Update WhatsApp link
    updateWhatsAppLink(network, amount, fee, total);
    
    // Show results
    resultsSection.style.display = '';
    comparisonSection.style.display = '';
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function renderPrimaryResult(network, amount, fee, total) {
    resultNetwork.innerHTML = `
        <div class="result-network-icon">
            <img src="assets/${network.logo}" alt="${network.name}">
        </div>
        <div class="result-network-info">
            <h3>${network.name}</h3>
            <p>${TX_TYPE_LABELS[selectedTxType]}</p>
        </div>
    `;
    
    resultAmount.textContent = `TSh ${formatNumber(amount)}`;
    resultType.textContent = TX_TYPE_LABELS[selectedTxType];
    resultFee.textContent = `TSh ${formatNumber(fee)}`;
    resultTotal.textContent = `TSh ${formatNumber(total)}`;
}

// ============================================================================
// SMART ADVICE ENGINE
// ============================================================================

function generateAdvice(amount, currentFee) {
    // Calculate fees for ALL networks for the SAME transaction type
    const allFees = TZ_NETWORKS.map(n => ({
        network: n,
        fee: findFee(n.id, amount, selectedTxType)
    }));
    
    // Sort by fee ascending
    allFees.sort((a, b) => a.fee - b.fee);
    
    const cheapest = allFees[0];
    const currentNetwork = TZ_NETWORKS.find(n => n.id === selectedNetworkId);
    const currentRank = allFees.findIndex(f => f.network.id === selectedNetworkId);
    
    // If already cheapest
    if (cheapest.network.id === selectedNetworkId) {
        const secondCheapest = allFees[1];
        const savings = currentFee - secondCheapest.fee;
        
        adviceTitle.textContent = 'Hongera! Hili ni Bei Nafuu';
        adviceText.innerHTML = `
            <strong>${currentNetwork.shortName}</strong> ndio mtandao wa bei nafuu zaidi kwa muamala huu.
            ${savings > 0 ? `Unaokoa <span class="savings-amount">TSh ${formatNumber(savings)}</span> ukilinganisha na ${secondCheapest.network.shortName}.` : ''}
        `;
        adviceBox.style.display = '';
        return;
    }
    
    // If not cheapest, show savings
    const savings = currentFee - cheapest.fee;
    const rankText = currentRank === allFees.length - 1 ? 'ghali zaidi' : `namba ${currentRank + 1}`;
    
    adviceTitle.textContent = 'Ushauri wa Akiba 💡';
    adviceText.innerHTML = `
        Kwa muamala huu, <strong>${cheapest.network.shortName}</strong> ni bei nafuu zaidi.
        ${currentNetwork.shortName} ni wa <strong>${rankText}</strong> kati ya mitandao yote.
        <br><br>
        Ukitumia <strong>${cheapest.network.shortName}</strong> badala ya ${currentNetwork.shortName}, 
        unaweza <span class="savings-amount">kuokoa TSh ${formatNumber(savings)}</span>!
    `;
    adviceBox.style.display = '';
}

// ============================================================================
// COMPARISON TABLE
// ============================================================================

function renderComparisonTable(amount) {
    comparisonTableBody.innerHTML = '';
    
    // Calculate fees for all networks for selected type to find cheapest
    const selectedFees = TZ_NETWORKS.map(n => findFee(n.id, amount, selectedTxType));
    const minFee = Math.min(...selectedFees);
    
    TZ_NETWORKS.forEach(network => {
        const feeSame = findFee(network.id, amount, 'send_same');
        const feeOther = findFee(network.id, amount, 'send_other');
        const feeWithdraw = findFee(network.id, amount, 'withdraw');
        const feeSelected = findFee(network.id, amount, selectedTxType);
        const totalSelected = amount + feeSelected;
        
        const isSelected = network.id === selectedNetworkId;
        const isCheapest = feeSelected === minFee;
        
        const row = document.createElement('tr');
        if (isSelected) row.classList.add('highlight-row');
        
        row.innerHTML = `
            <td>
                <div class="network-cell">
                    <span class="network-dot">
                        <img src="assets/${network.logo}" alt="${network.shortName}">
                    </span>
                    ${network.shortName}
                    ${isSelected ? '<span style="font-size:0.7rem; color:var(--color-primary); margin-left:4px;">(wewe)</span>' : ''}
                </div>
            </td>
            <td class="fee-cell ${isCheapest && selectedTxType === 'send_same' ? 'cheapest' : ''}">
                TSh ${formatNumber(feeSame)}
            </td>
            <td class="fee-cell ${isCheapest && selectedTxType === 'send_other' ? 'cheapest' : ''}">
                TSh ${formatNumber(feeOther)}
            </td>
            <td class="fee-cell ${isCheapest && selectedTxType === 'withdraw' ? 'cheapest' : ''}">
                TSh ${formatNumber(feeWithdraw)}
            </td>
            <td class="fee-cell" style="font-weight: 700;">
                TSh ${formatNumber(totalSelected)}
            </td>
        `;
        
        comparisonTableBody.appendChild(row);
    });
}

// ============================================================================
// WHATSAPP SHARE
// ============================================================================

function updateWhatsAppLink(network, amount, fee, total) {
    const typeLabel = TX_TYPE_LABELS[selectedTxType];
    const siteUrl = window.location.href;
    
    const message = 
`*Kokotoa Makato - Tanzania Mobile Money Calculator*%0A%0A` +
`💰 *Muamala Wangu*%0A` +
`• Mtandao: ${network.name}%0A` +
`• Aina: ${typeLabel}%0A` +
`• Kiasi: TSh ${formatNumber(amount)}%0A` +
`• Makato: TSh ${formatNumber(fee)}%0A` +
`• Jumla: TSh ${formatNumber(total)}%0A%0A` +
`🔗 Angalia makato yako: ${siteUrl}`;
    
    whatsappBtn.href = `https://wa.me/?text=${message}`;
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// ============================================================================
// BOOT
// ============================================================================

document.addEventListener('DOMContentLoaded', init);