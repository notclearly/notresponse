'use strict';

let userFreeMintLeft = 0;
let userNftBalance = 0;
let nftCost = 0.0003; 
let isWalletConnected = false;

document.addEventListener('DOMContentLoaded', () => {
    const mintInput = document.getElementById('mint_amount');
    const btnMinus = document.getElementById('btn_minus');
    const btnPlus = document.getElementById('btn_plus');
    const btnMax = document.getElementById('btn_max');
    const mintError = document.getElementById('mint_error');
    const freeInfo = document.getElementById('mint_freeinfo');
    const priceInfo = document.getElementById('mint_priceinfo');
    const mintBtn = document.getElementById('mint_button');
    const connectBtn = document.getElementById('connect_button');

    const MIN_MINT = 1;
    const MAX_MINT = 200;

    function updateInput(val) {
        mintInput.value = val;
        mintError.style.display = 'none';
        updatePriceInfo();
    }

    btnMinus.addEventListener('click', () => {
        let val = parseInt(mintInput.value) || MIN_MINT;
        if (val > MIN_MINT) {
            updateInput(val - 1);
        }
    });

    btnPlus.addEventListener('click', () => {
        let val = parseInt(mintInput.value) || MIN_MINT;
        if (val < MAX_MINT) {
            updateInput(val + 1);
        }
    });

    btnMax.addEventListener('click', () => {
        updateInput(MAX_MINT);
    });

    mintInput.addEventListener('input', () => {
        let val = parseInt(mintInput.value) || '';
        if (val === '') {
            mintInput.value = '';
            priceInfo.textContent = '';
            return;
        }
        if (val < MIN_MINT) {
            updateInput(MIN_MINT);
        } else if (val > MAX_MINT) {
            updateInput(MAX_MINT);
        } else {
            updatePriceInfo();
        }
    });

    function updatePriceInfo() {
        let amount = parseInt(mintInput.value) || 1;
        let freeLeft = Math.max(3 - userNftBalance, 0);

        
        let globalFreeLeft = typeof window.free_supply_left !== "undefined" ? parseInt(window.free_supply_left) : undefined;
        if (globalFreeLeft !== undefined && globalFreeLeft <= 0) {
            freeLeft = 0;
        } else if (globalFreeLeft !== undefined) {
            freeLeft = Math.min(freeLeft, globalFreeLeft);
        }

        let paidCount = Math.max(amount - freeLeft, 0);
        let price = paidCount * nftCost;
        if (!isWalletConnected) {
            freeInfo.textContent = "Connect wallet to see free mint right";
        } else if (freeLeft > 0) {
            freeInfo.textContent = `You have ${freeLeft} free mint${freeLeft > 1 ? 's' : ''} left.`;
        } else {
            freeInfo.textContent = `No free mint left.`;
        }
        priceInfo.textContent = `Total: ${price === 0 ? "FREE" : price.toFixed(2) + " Ape"}`;
    }

    mintBtn.addEventListener('click', () => {
        const amount = parseInt(mintInput.value);
        if (!amount || amount < MIN_MINT || amount > MAX_MINT) {
            mintError.textContent = `Please enter a mint amount between ${MIN_MINT} and ${MAX_MINT}.`;
            mintError.style.display = 'block';
        } else if (!isWalletConnected) {
            mintError.textContent = "Please connect your wallet.";
            mintError.style.display = 'block';
        } else {
            mintError.style.display = 'none';
            if (typeof mint === 'function') mint();
        }
    });

    if (window.ethereum) {
        connectBtn.classList.add('btn--wallet');
    }

    window.onWalletConnected = async function(account, balance, cost) {
        isWalletConnected = !!account;
        userNftBalance = balance;
        nftCost = cost || 0.0003;
        updatePriceInfo();
    };

    updatePriceInfo();

    window.onUserNftBalanceUpdated = function(balance) {
        userNftBalance = balance;
        updatePriceInfo();
    };
});