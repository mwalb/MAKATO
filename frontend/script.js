/**
 * ============================================================================
 * KOKOTOA MAKATO - MAIN SCRIPT
 * ============================================================================
 * Depends on: data.js (TZ_NETWORKS, TX_TYPE_LABELS, TX_TYPE_SHORT, MIN_AMOUNT, MAX_AMOUNT)
 * ============================================================================
 */

(function () {
    "use strict";

    // ===================== DOM REFERENCES =====================
    const networkGrid         = document.getElementById("networkGrid");
    const transactionTypes    = document.querySelectorAll(".type-option");
    const amountInput         = document.getElementById("amountInput");
    const amountError         = document.getElementById("amountError");
    const quickChips          = document.querySelectorAll(".quick-chip");
    const form                = document.getElementById("transactionForm");
    const resultsSection      = document.getElementById("resultsSection");
    const comparisonSection   = document.getElementById("comparisonSection");
    const resultNetwork       = document.getElementById("resultNetwork");
    const resultAmount        = document.getElementById("resultAmount");
    const resultType          = document.getElementById("resultType");
    const resultFee           = document.getElementById("resultFee");
    const resultTotal         = document.getElementById("resultTotal");
    const adviceBestBox       = document.getElementById("adviceBestBox");
    const adviceBestText      = document.getElementById("adviceBestText");
    const adviceBox           = document.getElementById("adviceBox");
    const adviceText          = document.getElementById("adviceText");
    const whatsappBtn         = document.getElementById("whatsappBtn");
    const comparisonTableBody = document.getElementById("comparisonTableBody");
    const themeToggle         = document.getElementById("themeToggle");
    const themeIcon           = document.getElementById("themeIcon");
    const themeLabel          = document.querySelector(".theme-label");

    // NA YA KUTOLEA elements
    const kutoleaBtn          = document.getElementById("kutoleaBtn");
    const kutoleaPanel        = document.getElementById("kutoleaPanel");
    const kutoleaNetwork      = document.getElementById("kutoleaNetwork");
    const kutoleaAmount       = document.getElementById("kutoleaAmount");
    const kutoleaCalcBtn      = document.getElementById("kutoleaCalculateBtn");
    const kutoleaResult       = document.getElementById("kutoleaResult");
    const kutoleaDesiredAmt   = document.getElementById("kutoleaDesiredAmount");
    const kutoleaSendFee      = document.getElementById("kutoleaSendFee");
    const kutoleaWithdrawFee  = document.getElementById("kutoleaWithdrawFee");
    const kutoleaTotalSend    = document.getElementById("kutoleaTotalSend");

    // Scroll targets
    const formSection         = document.getElementById("form-section");
    const typeGroup           = document.getElementById("type-group");
    const amountGroup         = document.getElementById("amount-group");

    // ===================== STATE =====================
    let selectedNetworkId = null;
    let lastCalculatedAmount = 0;
    let lastCalculatedType = "";

    // ===================== INIT =====================
    function init() {
        if (typeof TZ_NETWORKS === "undefined") {
            console.error("data.js not loaded!");
            networkGrid.innerHTML = '<p style="color:var(--fee);padding:20px">Hitilafu: data.js haijapakiwa.</p>';
            return;
        }
        renderNetworks();
        populateKutoleaDropdown();
        setupEventListeners();
        loadTheme();
    }

    // ===================== SCROLL HELPER =====================
    function scrollToElement(el) {
        if (!el) return;
        const topBarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 92;
        const y = el.getBoundingClientRect().top + window.pageYOffset - topBarHeight - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    // ===================== RENDER NETWORKS =====================
    function renderNetworks() {
        networkGrid.innerHTML = TZ_NETWORKS.map((net) => `
            <div class="network-card" data-id="${net.id}" title="${net.name}">
                <img class="net-icon" src="assets/${net.logo}" alt="${net.shortName}" onerror="this.style.display='none'">
                <div class="net-name">${net.shortName}</div>
            </div>
        `).join("");
    }

    // ===================== POPULATE KUTOLEA DROPDOWN =====================
    function populateKutoleaDropdown() {
        kutoleaNetwork.innerHTML = '<option value="">-- Chagua Mtandao --</option>' +
            TZ_NETWORKS.map((n) => `<option value="${n.id}">${n.name}</option>`).join("");
    }

    // ===================== EVENT LISTENERS =====================
    function setupEventListeners() {
        // Network selection → scroll to transaction type
        networkGrid.addEventListener("click", function (e) {
            const card = e.target.closest(".network-card");
            if (!card) return;
            document.querySelectorAll(".network-card").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            selectedNetworkId = card.dataset.id;
            // Auto-scroll to transaction type section
            setTimeout(() => scrollToElement(typeGroup), 150);
        });

        // Transaction type selection → scroll to amount input
        transactionTypes.forEach((label) => {
            label.addEventListener("click", function () {
                transactionTypes.forEach((l) => l.classList.remove("active"));
                label.classList.add("active");
                label.querySelector('input[type="radio"]').checked = true;
                // Auto-scroll to amount input
                setTimeout(() => scrollToElement(amountGroup), 150);
            });
        });

        // Quick amount chips → focus input and scroll to calculate button
        quickChips.forEach((chip) => {
            chip.addEventListener("click", function () {
                amountInput.value = chip.dataset.amount;
                amountError.classList.remove("show");
                amountInput.focus();
                // Scroll to show the calculate button
                setTimeout(() => {
                    const btn = document.getElementById("calculateBtn");
                    scrollToElement(btn);
                }, 150);
            });
        });

        // Form submit
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            calculate();
        });

        // Theme toggle
        themeToggle.addEventListener("click", toggleTheme);

        // NA YA KUTOLEA toggle
        kutoleaBtn.addEventListener("click", function () {
            const isOpen = kutoleaPanel.classList.contains("show");
            if (isOpen) {
                kutoleaPanel.classList.remove("show");
                kutoleaBtn.classList.remove("open");
            } else {
                kutoleaPanel.classList.add("show");
                kutoleaBtn.classList.add("open");
                setTimeout(() => scrollToElement(kutoleaPanel), 200);
            }
        });

        // NA YA KUTOLEA calculate
        kutoleaCalcBtn.addEventListener("click", function () {
            calculateKutolea();
        });
    }

    // ===================== FEE LOOKUP =====================
    function getFee(networkId, txType, amount) {
        const network = TZ_NETWORKS.find((n) => n.id === networkId);
        if (!network || !network.tiers) return 0;
        for (const tier of network.tiers) {
            if (amount >= tier.min && amount <= tier.max) {
                return tier[txType] || 0;
            }
        }
        const lastTier = network.tiers[network.tiers.length - 1];
        return lastTier[txType] || 0;
    }

    // ===================== FORMATTING =====================
    function formatMoney(amount) {
        return "TSh " + amount.toLocaleString("en-US");
    }

    // ===================== MAIN CALCULATION =====================
    function calculate() {
        const rawValue = amountInput.value.trim();
        const amount = parseInt(rawValue, 10);
        const minAmt = typeof MIN_AMOUNT !== "undefined" ? MIN_AMOUNT : 1;
        const maxAmt = typeof MAX_AMOUNT !== "undefined" ? MAX_AMOUNT : 10000000;

        if (!rawValue || isNaN(amount) || amount < minAmt) {
            amountError.textContent = "Tafadhali weka kiasi sahihi";
            amountError.classList.add("show");
            return;
        }
        if (amount > maxAmt) {
            amountError.textContent = "Kiasi kikubwa mno. Weka chini ya " + formatMoney(maxAmt);
            amountError.classList.add("show");
            return;
        }

        amountError.classList.remove("show");

        if (!selectedNetworkId) {
            selectedNetworkId = TZ_NETWORKS[0].id;
            const firstCard = document.querySelector('.network-card[data-id="' + selectedNetworkId + '"]');
            if (firstCard) firstCard.classList.add("active");
        }

        const txType = document.querySelector('input[name="transactionType"]:checked').value;
        const fee = getFee(selectedNetworkId, txType, amount);
        const total = amount + fee;

        lastCalculatedAmount = amount;
        lastCalculatedType = txType;

        // Render result card
        const net = TZ_NETWORKS.find((n) => n.id === selectedNetworkId);
        resultNetwork.innerHTML = `
            <img src="assets/${net.logo}" alt="${net.shortName}" onerror="this.style.display='none'">
            ${net.name}
        `;
        resultAmount.textContent = formatMoney(amount);
        resultType.textContent = TX_TYPE_LABELS[txType] || txType;
        resultFee.textContent = formatMoney(fee);
        resultTotal.textContent = formatMoney(total);

        // Best network advice
        renderBestNetworkAdvice(amount, txType, selectedNetworkId, fee);

        // Savings advice
        renderSavingsAdvice(net, txType, amount, fee);

        // WhatsApp share
        const shareText =
            `Kokotoa Makato:%0A%0A` +
            `Mtandao: ${net.name}%0A` +
            `Kiasi: ${formatMoney(amount)}%0A` +
            `Aina: ${TX_TYPE_LABELS[txType] || txType}%0A` +
            `Makato: ${formatMoney(fee)}%0A` +
            `Jumla: ${formatMoney(total)}%0A%0A` +
            `https://kokotoamakato.com`;
        whatsappBtn.href = "https://wa.me/?text=" + shareText;

        // Show sections
        resultsSection.classList.add("show");
        comparisonSection.classList.add("show");

        // Render comparison table
        renderComparisonTable(amount, txType);

        // Pre-fill kutolea amount
        kutoleaAmount.value = amount;

        // Scroll to results
        setTimeout(() => scrollToElement(resultsSection), 100);
    }

    // ===================== BEST NETWORK ADVICE =====================
    function renderBestNetworkAdvice(amount, txType, currentNetId, currentFee) {
        let bestNet = null;
        let bestFee = Infinity;

        TZ_NETWORKS.forEach((n) => {
            const f = getFee(n.id, txType, amount);
            if (f < bestFee) {
                bestFee = f;
                bestNet = n;
            }
        });

        if (!bestNet) return;

        const currentNet = TZ_NETWORKS.find((n) => n.id === currentNetId);
        const savings = currentFee - bestFee;

        let html = "";
        if (bestNet.id === currentNetId) {
            html = `<strong>${bestNet.name}</strong> ndiyo mtandao bora kwa sasa kwa muamala wa ${TX_TYPE_LABELS[txType] || txType} wa <strong>${formatMoney(amount)}</strong> ` +
                   `kwa kuwa una makato madogo zaidi ya <strong>${formatMoney(bestFee)}</strong>. Hongera umeshachagua mtandao bora!`;
        } else {
            html = `<strong>${bestNet.name}</strong> ndiyo mtandao bora kwa muamala huu. ` +
                   `Ungeokoa <strong>${formatMoney(savings)}</strong> ukigeuka kutoka ${currentNet.name} kwenda ${bestNet.name}. ` +
                   `Makato yao ni <strong>${formatMoney(bestFee)}</strong> tu badala ya ${formatMoney(currentFee)}.`;
        }

        adviceBestText.innerHTML = html;
        adviceBestBox.classList.add("show");
    }

    // ===================== SAVINGS ADVICE =====================
    function renderSavingsAdvice(net, txType, amount, fee) {
        const feePercent = amount > 0 ? ((fee / amount) * 100).toFixed(1) : "0.0";
        let advice = "";

        if (fee === 0) {
            advice = `Hongera! Muamala wa ${formatMoney(amount)} ni bure kwa mtandao wa ${net.name}. Endelea kutumia huduma hii kuokoa zaidi.`;
        } else if (parseFloat(feePercent) > 5) {
            advice = `Makato ya ${formatMoney(fee)} (${feePercent}%) ni juu kidogo. Fikiria kutumia kiasi kidogo au mtandao mwingine wa gharama nafuu.`;
        } else {
            advice = `Makato ya ${formatMoney(fee)} (${feePercent}%) ni ya kawaida kwa kiasi hiki. Endelea kufanya hesabu ili kuona mtandao bora zaidi.`;
        }

        adviceText.textContent = advice;
        adviceBox.classList.add("show");
    }

    // ===================== COMPARISON TABLE =====================
    function renderComparisonTable(amount, txType) {
        comparisonTableBody.innerHTML = TZ_NETWORKS.map((n) => {
            const sameFee = getFee(n.id, "send_same", amount);
            const otherFee = getFee(n.id, "send_other", amount);
            const withdrawFee = getFee(n.id, "withdraw", amount);
            const chosenFee = getFee(n.id, txType, amount);
            const isActive = n.id === selectedNetworkId;

            return `
                <tr class="${isActive ? "active-row" : ""}">
                    <td>
                        <div style="display:flex;align-items:center;gap:8px">
                            <img src="assets/${n.logo}" alt="" width="24" height="24" style="border-radius:50%;object-fit:cover;border:1px solid var(--border)" onerror="this.style.display='none'">
                            <strong>${n.shortName}</strong>
                        </div>
                    </td>
                    <td>${formatMoney(sameFee)}</td>
                    <td>${formatMoney(otherFee)}</td>
                    <td>${formatMoney(withdrawFee)}</td>
                    <td class="${isActive ? "highlight" : ""}">${formatMoney(chosenFee)}</td>
                </tr>
            `;
        }).join("");
    }

    // ===================== NA YA KUTOLEA =====================
    function calculateKutolea() {
        const recipientNetworkId = kutoleaNetwork.value;
        const rawValue = kutoleaAmount.value.trim();
        const desiredAmount = parseInt(rawValue, 10);

        if (!recipientNetworkId) {
            alert("Tafadhali chagua mtandao wa mpokeaji kwanza.");
            return;
        }
        if (!rawValue || isNaN(desiredAmount) || desiredAmount < 1) {
            alert("Tafadhali weka kiasi sahihi cha kuchukua.");
            return;
        }

        // Determine sender network (use selected or default to first)
        const senderNetworkId = selectedNetworkId || TZ_NETWORKS[0].id;

        // Determine send type: same network or cross-network
        const sendType = (senderNetworkId === recipientNetworkId) ? "send_same" : "send_other";

        // Find sendAmount such that: sendAmount - withdrawFee(sendAmount) >= desiredAmount
        let sendAmount = desiredAmount;
        let withdrawFee = getFee(recipientNetworkId, "withdraw", sendAmount);

        let found = false;
        for (let test = desiredAmount; test <= desiredAmount + 200000; test += 100) {
            const wf = getFee(recipientNetworkId, "withdraw", test);
            if (test - wf >= desiredAmount) {
                sendAmount = test;
                withdrawFee = wf;
                found = true;
                break;
            }
        }

        // Fine-tune downward
        if (found) {
            for (let test = sendAmount - 99; test >= desiredAmount; test--) {
                if (test < desiredAmount) break;
                const wf = getFee(recipientNetworkId, "withdraw", test);
                if (test - wf >= desiredAmount) {
                    sendAmount = test;
                    withdrawFee = wf;
                } else {
                    break;
                }
            }
        }

        if (!found) {
            withdrawFee = getFee(recipientNetworkId, "withdraw", desiredAmount);
            sendAmount = desiredAmount + withdrawFee;
            const wf2 = getFee(recipientNetworkId, "withdraw", sendAmount);
            if (wf2 !== withdrawFee) {
                sendAmount = desiredAmount + wf2;
                withdrawFee = wf2;
            }
        }

        // Calculate send fee based on sendAmount
        const sendFee = getFee(senderNetworkId, sendType, sendAmount);
        const totalSend = sendAmount + sendFee;

        // Update display
        document.getElementById("kutoleaDesiredAmount").textContent = formatMoney(desiredAmount);
        document.getElementById("kutoleaSendFee").textContent = formatMoney(sendFee);
        document.getElementById("kutoleaWithdrawFee").textContent = formatMoney(withdrawFee);
        document.getElementById("kutoleaTotalSend").textContent = formatMoney(totalSend);

        kutoleaResult.classList.add("show");
        setTimeout(() => scrollToElement(kutoleaResult), 100);
    }

    // ===================== THEME =====================
    function loadTheme() {
        const saved = localStorage.getItem("makato-theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = saved === "dark" || (!saved && prefersDark);

        if (isDark) {
            document.documentElement.setAttribute("data-theme", "dark");
            themeIcon.textContent = "☀️";
            themeLabel.textContent = "Mwangaza";
        } else {
            document.documentElement.removeAttribute("data-theme");
            themeIcon.textContent = "🌙";
            themeLabel.textContent = "Giza";
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("makato-theme", "light");
            themeIcon.textContent = "🌙";
            themeLabel.textContent = "Giza";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("makato-theme", "dark");
            themeIcon.textContent = "☀️";
            themeLabel.textContent = "Mwangaza";
        }
    }

    // ===================== START =====================
    init();
})();