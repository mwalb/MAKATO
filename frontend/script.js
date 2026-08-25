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
    const kutoleaTotalSend    = document.getElementById("kutoleaTotalSend");

    // Lipa Namba result elements
    const lipaNambaNetworkRow = document.getElementById("lipaNambaNetworkRow");
    const lipaNambaAgentRow   = document.getElementById("lipaNambaAgentRow");
    const lipaNambaTotalRow   = document.getElementById("lipaNambaTotalRow");
    const lipaNambaNetworkFee = document.getElementById("lipaNambaNetworkFee");
    const lipaNambaAgentFee   = document.getElementById("lipaNambaAgentFee");
    const lipaNambaTotalFee   = document.getElementById("lipaNambaTotalFee");
    const merchantReceives    = document.getElementById("merchantReceives");

    // Scroll targets
    const typeGroup           = document.getElementById("type-group");
    const amountGroup         = document.getElementById("amount-group");

    // ===================== STATE =====================
    let selectedNetworkId = null;
    let lastCalculatedAmount = 0;
    let lastCalculatedType = "";

    // ===================== COMMA FORMATTING HELPERS =====================
    function formatWithCommas(value) {
        // Remove all non-digit characters first
        const digits = value.replace(/[^0-9]/g, '');
        if (!digits) return '';
        // Format with commas
        return parseInt(digits, 10).toLocaleString('en-US');
    }

    function stripCommas(value) {
        return value.replace(/[^0-9]/g, '');
    }

    function parseAmount(value) {
        const raw = stripCommas(value);
        return raw ? parseInt(raw, 10) : NaN;
    }

    function setupCommaInput(input) {
        input.addEventListener('input', function(e) {
            const cursorPos = input.selectionStart;
            const oldLength = input.value.length;
            const oldCommasBefore = (input.value.slice(0, cursorPos).match(/,/g) || []).length;

            const formatted = formatWithCommas(input.value);
            input.value = formatted;

            const newCommasBefore = (formatted.slice(0, cursorPos).match(/,/g) || []).length;
            const newCursorPos = cursorPos + (newCommasBefore - oldCommasBefore);
            input.setSelectionRange(newCursorPos, newCursorPos);
        });

        input.addEventListener('blur', function() {
            input.value = formatWithCommas(input.value);
        });
    }

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
        setupCommaInput(amountInput);
        setupCommaInput(kutoleaAmount);
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
            setTimeout(() => scrollToElement(typeGroup), 150);
        });

        // Transaction type selection → scroll to amount input
        transactionTypes.forEach((label) => {
            label.addEventListener("click", function () {
                transactionTypes.forEach((l) => l.classList.remove("active"));
                label.classList.add("active");
                label.querySelector('input[type="radio"]').checked = true;
                setTimeout(() => scrollToElement(amountGroup), 150);
            });
        });

        // Quick amount chips → format with commas and scroll to calculate button
        quickChips.forEach((chip) => {
            chip.addEventListener("click", function () {
                const val = parseInt(chip.dataset.amount, 10);
                amountInput.value = val.toLocaleString('en-US');
                amountError.classList.remove("show");
                amountInput.focus();
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
        const rawValue = amountInput.value;
        const amount = parseAmount(rawValue);
        const minAmt = typeof MIN_AMOUNT !== "undefined" ? MIN_AMOUNT : 1;
        const maxAmt = typeof MAX_AMOUNT !== "undefined" ? MAX_AMOUNT : 10000000;

        if (isNaN(amount) || amount < minAmt) {
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

        // Handle Lipa Namba special display
        if (txType === "lipa_namba") {
            const lnFee = getLipaNambaFee(amount);
            const lipaTotal = amount + lnFee.total;

            // Hide standard fee row, show Lipa Namba breakdown
            document.querySelector(".breakdown-row.fee-row").style.display = "none";
            lipaNambaNetworkRow.style.display = "flex";
            lipaNambaAgentRow.style.display = "flex";
            lipaNambaTotalRow.style.display = "flex";

            lipaNambaNetworkFee.textContent = formatMoney(lnFee.network);
            lipaNambaAgentFee.textContent = formatMoney(lnFee.agent);
            lipaNambaTotalFee.textContent = formatMoney(lnFee.total);

            // For Lipa Namba: Jumla Inayotakiwa Iwepo Simuni = Kiasi + Makato Yote
            resultFee.textContent = formatMoney(lnFee.total);
            resultTotal.textContent = formatMoney(lipaTotal);
        } else {
            // Standard display
            document.querySelector(".breakdown-row.fee-row").style.display = "flex";
            lipaNambaNetworkRow.style.display = "none";
            lipaNambaAgentRow.style.display = "none";
            lipaNambaTotalRow.style.display = "none";

            resultFee.textContent = formatMoney(fee);
            resultTotal.textContent = formatMoney(total);
        }

        // Best network advice
        renderBestNetworkAdvice(amount, txType, selectedNetworkId, fee);

        // Savings advice
        renderSavingsAdvice(net, txType, amount, fee);

        // WhatsApp share
        let shareText = "";
        if (txType === "lipa_namba") {
            const lnFee = getLipaNambaFee(amount);
            const lipaTotal = amount + lnFee.total;
            shareText =
                `Kokotoa Makato - Lipa Namba:%0A%0A` +
                `Mtandao: ${net.name}%0A` +
                `Kiasi cha Muamala: ${formatMoney(amount)}%0A` +
                `Aina ya muamala: ${TX_TYPE_LABELS[txType] || txType}%0A` +
                `Makato ya Mtandao: ${formatMoney(lnFee.network)}%0A` +
                `Nyongeza ya Wakala: ${formatMoney(lnFee.agent)}%0A` +
                `Jumla ya Makato: ${formatMoney(lnFee.total)}%0A` +
                `Inayotakiwa Simuni: ${formatMoney(lipaTotal)}%0A%0A` +
                `https://kokotoamakato.com`;
        } else {
            shareText =
                `Kokotoa Makato:%0A%0A` +
                `Mtandao: ${net.name}%0A` +
                `Kiasi: ${formatMoney(amount)}%0A` +
                `Aina ya muamala: ${TX_TYPE_LABELS[txType] || txType}%0A` +
                `Makato: ${formatMoney(fee)}%0A` +
                `Inayotakiwa Simuni: ${formatMoney(total)}%0A%0A` +
                `https://kokotoamakato.com`;
        }
        whatsappBtn.href = "https://wa.me/?text=" + shareText;

        // Show sections
        resultsSection.classList.add("show");
        comparisonSection.classList.add("show");

        // Render comparison table
        renderComparisonTable(amount, txType);

        // Pre-fill kutolea amount
        kutoleaAmount.value = amount.toLocaleString('en-US');

        // Scroll to results
        setTimeout(() => scrollToElement(resultsSection), 100);
    }

    // ===================== BEST NETWORK ADVICE =====================
    function renderBestNetworkAdvice(amount, txType, currentNetId, currentFee) {
        // For Lipa Namba, all networks charge the same
        if (txType === "lipa_namba") {
            const lnFee = getLipaNambaFee(amount);
            const lipaTotal = amount + lnFee.total;
            adviceBestText.innerHTML = 
                `Kwa malipo ya <strong>${formatMoney(amount)}</strong> kupitia <strong>Lipa Namba</strong>, ` +
                `makato ni <strong>sawa kwa mitandao yote</strong>. ` +
                `Makato ya mtandao: <strong>${formatMoney(lnFee.network)}</strong>, ` +
                `nyongeza ya wakala: <strong>${formatMoney(lnFee.agent)}</strong>. ` +
                `Jumla ya makato: <strong>${formatMoney(lnFee.total)}</strong>. ` +
                `Inayotakiwa Simuni: <strong>${formatMoney(lipaTotal)}</strong>.`;
            adviceBestBox.classList.add("show");
            return;
        }

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
        // Lipa Namba special advice
        if (txType === "lipa_namba") {
            const lnFee = getLipaNambaFee(amount);
            const lipaTotal = amount + lnFee.total;
            const feePercent = amount > 0 ? ((lnFee.total / amount) * 100).toFixed(1) : "0.0";
            let advice = "";

            if (lnFee.total === 0) {
                advice = `Hongera! Malipo ya ${formatMoney(amount)} kupitia Lipa Namba ni bure. Inayotakiwa Simuni ni ${formatMoney(amount)}.`;
            } else if (parseFloat(feePercent) > 5) {
                advice = `Makato ya Lipa Namba kwa ${formatMoney(amount)} ni ${formatMoney(lnFee.total)} (${feePercent}%). ` +
                         `Inayotakiwa Simuni ni ${formatMoney(lipaTotal)}. Fikiria kufanya malipo kwa kiasi kingine kama inawezekana.`;
            } else {
                advice = `Makato ya Lipa Namba kwa ${formatMoney(amount)} ni ${formatMoney(lnFee.total)} (${feePercent}%). ` +
                         `Inayotakiwa Simuni ni ${formatMoney(lipaTotal)}. Hii ni ya kawaida kwa kiasi hiki.`;
            }
            adviceText.textContent = advice;
            adviceBox.classList.add("show");
            return;
        }

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
        const lipaFee = txType === "lipa_namba" ? getLipaNambaFee(amount).total : getFee(TZ_NETWORKS[0].id, "lipa_namba", amount);

        comparisonTableBody.innerHTML = TZ_NETWORKS.map((n) => {
            const sameFee = getFee(n.id, "send_same", amount);
            const otherFee = getFee(n.id, "send_other", amount);
            const withdrawFee = getFee(n.id, "withdraw", amount);
            const lipaNambaFee = getFee(n.id, "lipa_namba", amount);
            const chosenFee = txType === "lipa_namba" ? lipaNambaFee : getFee(n.id, txType, amount);
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
                    <td>${formatMoney(lipaNambaFee)}</td>
                    <td class="${isActive ? "highlight" : ""}">${formatMoney(chosenFee)}</td>
                </tr>
            `;
        }).join("");
    }

    // ===================== NA YA KUTOLEA =====================
    function calculateKutolea() {
        const recipientNetworkId = kutoleaNetwork.value;
        const rawValue = kutoleaAmount.value;
        const desiredAmount = parseAmount(rawValue);

        if (!recipientNetworkId) {
            alert("Tafadhali chagua mtandao wa mpokeaji kwanza.");
            return;
        }
        if (isNaN(desiredAmount) || desiredAmount < 1) {
            alert("Tafadhali weka kiasi sahihi cha kuchukua.");
            return;
        }

        // Determine sender network
        const senderNetworkId = selectedNetworkId || TZ_NETWORKS[0].id;
        const sendType = (senderNetworkId === recipientNetworkId) ? "send_same" : "send_other";

        // Step 1: Find walletAmount such that walletAmount - withdrawFee(walletAmount) >= desiredAmount
        let walletAmount = desiredAmount;
        let withdrawFee = getFee(recipientNetworkId, "withdraw", walletAmount);

        let found = false;
        for (let test = desiredAmount; test <= desiredAmount + 500000; test += 100) {
            const wf = getFee(recipientNetworkId, "withdraw", test);
            if (test - wf >= desiredAmount) {
                walletAmount = test;
                withdrawFee = wf;
                found = true;
                break;
            }
        }

        // Fine-tune downward
        if (found) {
            for (let test = walletAmount - 1; test >= desiredAmount; test--) {
                if (test < desiredAmount) break;
                const wf = getFee(recipientNetworkId, "withdraw", test);
                if (test - wf >= desiredAmount) {
                    walletAmount = test;
                    withdrawFee = wf;
                } else {
                    break;
                }
            }
        }

        // Fallback
        if (!found) {
            withdrawFee = getFee(recipientNetworkId, "withdraw", desiredAmount);
            walletAmount = desiredAmount + withdrawFee;
            const wf2 = getFee(recipientNetworkId, "withdraw", walletAmount);
            if (wf2 !== withdrawFee) {
                walletAmount = desiredAmount + wf2;
                withdrawFee = wf2;
            }
        }

        // Step 2: Calculate send fee
        const sendFee = getFee(senderNetworkId, sendType, walletAmount);
        const totalSend = walletAmount + sendFee;

        // Update display
        document.getElementById("kutoleaDesiredAmount").textContent = formatMoney(desiredAmount);
        document.getElementById("kutoleaSendFee").textContent = formatMoney(sendFee);
        document.getElementById("kutoleaWithdrawFee").textContent = formatMoney(withdrawFee);
        document.getElementById("kutoleaWalletAmount").textContent = formatMoney(walletAmount);
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