/* 
Pity Counter

*/

let htmlElements = {};
let stats = {};
let upgrades = {};
let colors = {
    unpurchaseableBackground: "#454545",
    unpurchaseableText: "#fff",
    purchaseableBackground: "#C9EFC7",
    purchaseableText: "#1a237e",
    cappedBackground: "#1a237e",
    cappedText: "#fff"
};

function startGame() {
    htmlElements = {
        playButton: document.getElementById("play-button"),
        game: document.getElementById("game-div"),
        
        playerBalance: document.getElementById("player-balance"),
        botBalance: document.getElementById("bot-balance"),
        stockPrice: document.getElementById("stock-price"),
        month: document.getElementById("month"),
        streak: document.getElementById("streak"),
        
        restartButton: document.getElementById("restart-button"),
        contactButton: document.getElementById("contact-button"),
        lowerButton: document.getElementById("lower-button"),
        higherButton: document.getElementById("higher-button"),
    }

    stats = {
        playerBalance: 100.00,
        botBalance: 100.00,
        botInterest: 0.07,
        startStockPrice: 100.00,
        stockPrice: 100.00,
        nextStockPrice: 0,
        minStockPrice: 25,
        month: 1,
        maxMonths: 360,
        streak: 0,
        forgiveCounter: 0,
        maxPercentage: 25,
        percentage: 0,
        prize: 0,
        loss: 0,
    }
    
    upgrades = {
        streakForgive: {
            currentAmount: 0,
            totalAmount: 0,
            temporary: true,
            amountFormat: "integer",
            amountCap: 10,
            amountCapHit: false,
            price: 50.00,
            unlockStatus: false,
            unlockPrice: 100.00,
            amountChange: 1,
            amountChangeDirection: "increase",
            amountChangeMethod: "linear",
            priceIncrease: 1.1,
            priceIncreaseMethod: "exponential",
            htmlButton: document.getElementById("streak-forgive-button"),
            htmlAmount: document.getElementById("streak-forgive-amount"),
            htmlPrice: document.getElementById("streak-forgive-price")
        },
        winMulti: {
            currentAmount: 1.00,
            totalAmount: 1.00,
            temporary: false,
            amountFormat: "decimal",
            amountCap: 5,
            amountCapHit: false,
            price: 150.00,
            unlockStatus: false,
            unlockPrice: 125.00,
            amountChange: 1.1,
            amountChangeDirection: "increase",
            amountChangeMethod: "exponential",
            priceIncrease: 1.1,
            priceIncreaseMethod: "exponential",
            htmlButton: document.getElementById("win-multi-button"),
            htmlAmount: document.getElementById("win-multi-amount"),
            htmlPrice: document.getElementById("win-multi-price")
        },
        loseMulti: {
            currentAmount: 1.00,
            totalAmount: 1.00,
            temporary: false,
            amountFormat: "decimal",
            amountCap: 0.5,
            amountCapHit: false,
            price: 250.00,
            unlockStatus: false,
            unlockPrice: 200.00,
            amountChange: 0.9,
            amountChangeDirection: "decrease",
            amountChangeMethod: "exponential",
            priceIncrease: 1.1,
            priceIncreaseMethod: "exponential",
            htmlButton: document.getElementById("lose-multi-button"),
            htmlAmount: document.getElementById("lose-multi-amount"),
            htmlPrice: document.getElementById("lose-multi-price")
        }
    }

    htmlElements.playButton.classList.add("hidden");
    htmlElements.game.classList.remove("hidden");
    htmlElements.restartButton.classList.add("hidden");
    htmlElements.contactButton.classList.add("hidden");
    htmlElements.lowerButton.classList.remove("hidden");
    htmlElements.higherButton.classList.remove("hidden");

    updateNumbers();

    for (let upgradeItem in upgrades) {
        if (upgrades[upgradeItem].amountFormat == "integer") {
            upgrades[upgradeItem].htmlAmount.innerHTML = upgrades[upgradeItem].currentAmount;
        } else if (upgrades[upgradeItem].amountFormat == "decimal") {
            upgrades[upgradeItem].htmlAmount.innerHTML = upgrades[upgradeItem].currentAmount.toFixed(2);
        }
        upgrades[upgradeItem].htmlPrice.innerHTML = "$" + upgrades[upgradeItem].price.toFixed(2);
        upgrades[upgradeItem].htmlButton.style.backgroundColor = colors.unpurchaseableBackground;
        upgrades[upgradeItem].htmlButton.style.color = colors.unpurchaseableText;
        upgrades[upgradeItem].htmlButton.classList.add("hidden");
    }
}

function endGame() {
    let spread = Math.abs(stats.playerBalance - stats.botBalance);
    if (stats.playerBalance < stats.botBalance) {
        alert(`Sorry, you lost! You couldn't beat the bot by $${spread.toFixed(2)}.\n` +
        `How pathetic! How about we try again?`);
    } else if (stats.playerBalance > stats.botBalance) {
        alert(`Great job! You beat the bot by $${spread.toFixed(2)}!\n` +
        `Maybe we should hire you as an analyst instead of as a client...\n` +
        `Anyway, time to restart!`);
    } else {
        alert(`I don't know how you did it, but both of you managed to get $${stats.playerBalance.toFixed(2)}!\n` +
        `Congrats, I guess? Give it another go and see if you can do better.`);
    }
    // Set buttons to hidden states
    htmlElements.restartButton.classList.remove("hidden");
    htmlElements.contactButton.classList.remove("hidden");
    htmlElements.lowerButton.classList.add("hidden");
    htmlElements.higherButton.classList.add("hidden");
}

function updateNumbers() {
    htmlElements.playerBalance.innerHTML = "$" + stats.playerBalance.toFixed(2);
    htmlElements.botBalance.innerHTML = "$" + stats.botBalance.toFixed(2);
    htmlElements.stockPrice.innerHTML = "$" + stats.stockPrice.toFixed(2);
    htmlElements.month.innerHTML = stats.month;
    htmlElements.streak.innerHTML = stats.streak;
}

function guess(playerGuess) {
    stats.percentage = Math.round((Math.random() * stats.maxPercentage) * 100) / 100;
    let negativeCheck = Math.round(Math.random());
    let percentageChange = stats.percentage;
    if (negativeCheck == 0) {
        percentageChange *= -0.01;
    } else {
        percentageChange *= 0.01;
    }
    stats.nextStockPrice = stats.stockPrice * (percentageChange+ 1);
    let difference = Math.abs(stats.stockPrice - stats.nextStockPrice);
    stats.prize = difference * upgrades.winMulti.currentAmount;
    stats.loss = difference * upgrades.loseMulti.currentAmount;

    if (playerGuess == "lower") {
        lower();
    } else if (playerGuess == "higher") {
        higher();
    }

    if (stats.nextStockPrice <= stats.minStockPrice) {
        alert(`Having a little trouble there? Let me give you a hand.\n` +
			`Injecting cash flow into the company, stock soars back to $100!`);
		stats.nextStockPrice = stats.startStockPrice;
    }

    stats.botBalance *= 1 + (stats.botInterest / 12);
    stats.stockPrice = stats.nextStockPrice;
    stats.month++;

    updateNumbers();

    if (stats.month >= stats.maxMonths || stats.playerBalance <= 0) {
        endGame();
    } else {
        unlockFeature();
        updateButtonColor();
    }
}

function lower() {
    if (stats.nextStockPrice < stats.stockPrice) {
        stats.streak++;
        stats.prize *= stats.streak;
        stats.playerBalance += stats.prize;
        alert(`You were right! The stock dropped ${stats.percentage.toFixed(2)}%!\n` + 
		`The next price is $${stats.nextStockPrice.toFixed(2)}.\n` + 
		`Your streak is ${stats.streak}, multiplying your winnings by ${stats.streak}x.\n` + 
		`You win $${stats.prize.toFixed(2)}!`);
    } else if (stats.nextStockPrice > stats.stockPrice) {
        if (upgrades.streakForgive.currentAmount > 0 && stats.streak >= 2) {
            upgrades.streakForgive.currentAmount--;
            upgrades.streakForgive.htmlAmount.innerHTML = upgrades.streakForgive.currentAmount;
            alert(`You were wrong. The stock rose ${stats.percentage.toFixed(2)}%!\n` + 
            `The next price is $${stats.nextStockPrice.toFixed(2)}.\n` + 
            `Your streak was saved by your forgiveness, keeping it at ${stats.streak}.\n` + 
            `You lose $${stats.loss.toFixed(2)}.`);
        } else {
            stats.streak = 0;
            alert(`You were wrong. The stock rose ${stats.percentage.toFixed(2)}%!\n` + 
            `The next price is $${stats.nextStockPrice.toFixed(2)}.\n` + 
            `Your streak is back to ${stats.streak}.\n` + 
            `You lose $${stats.loss.toFixed(2)}.`);
        }
        stats.playerBalance -= stats.loss;
    } else if (stats.nextStockPrice == stats.stockPrice) {
        stats.streak++;
        stats.prize *= stats.streak;
        stats.playerBalance += stats.nextStockPrice * upgrades.winMulti.currentAmount * stats.streak;
        alert(`There is no way you would have been right, the price stayed the same!\n` + 
		`Your streak is ${stats.streak}, multiplying your winnings by ${stats.streak}x.\n` + 
		`You win $${stats.prize.toFixed(2)}!`);
    }
}

function higher() {
    if (stats.nextStockPrice < stats.stockPrice) {
        if (upgrades.streakForgive.currentAmount > 0 && stats.streak >= 2) {
            upgrades.streakForgive.currentAmount--;
            upgrades.streakForgive.htmlAmount.innerHTML = upgrades.streakForgive.currentAmount;
            alert(`You were wrong. The stock dropped ${stats.percentage.toFixed(2)}%!\n` +
            `The next price is $${stats.nextStockPrice.toFixed(2)}.\n` +
            `Your streak was saved by your forgiveness, keeping it at ${stats.streak}.\n` +
            `You lose $${stats.loss.toFixed(2)}.`);
        } else {
            stats.streak = 0;
            alert(`You were wrong. The stock dropped ${stats.percentage.toFixed(2)}%!\n` +
            `The next price is $${stats.nextStockPrice.toFixed(2)}.\n` +
            `Your streak is back to ${stats.streak}.\n` +
            `You lose $${stats.loss.toFixed(2)}.`);
        }
        stats.playerBalance -= stats.loss;
    } else if (stats.nextStockPrice > stats.stockPrice) {
        stats.streak++;
        stats.prize *= stats.streak;
        stats.playerBalance += stats.prize;
        alert(`You were right! The stock rose ${stats.percentage.toFixed(2)}%!\n` +
		`The next price is $${stats.nextStockPrice.toFixed(2)}.\n` +
		`Your streak is ${stats.streak}, multiplying your winnings by ${stats.streak}x.\n` +
		`You win $${stats.prize.toFixed(2)}!`);
    } else if (stats.nextStockPrice == stats.stockPrice) {
        stats.streak++;
        stats.prize *= stats.streak;
        stats.playerBalance += stats.nextStockPrice * upgrades.winMulti.currentAmount * stats.streak;
        alert(`There is no way you would have been right, the price stayed the same!\n` +
		`Your streak is ${stats.streak}, multiplying your winnings by ${stats.streak}x.\n` +
		`You win $${stats.prize.toFixed(2)}!`);
    }
}

function unlockFeature() {
    for (let upgradeItem in upgrades) {
        if (stats.playerBalance >= upgrades[upgradeItem].unlockPrice && upgrades[upgradeItem].unlockStatus == false) {
            upgrades[upgradeItem].htmlButton.classList.remove("hidden");
            upgrades[upgradeItem].unlockStatus = true;
            updateButtonColor();
        }
    }
}

function buyUpgrade(upgrade) {
    if (stats.playerBalance >= upgrade.price && upgrade.amountCapHit == false) {
        stats.playerBalance -= upgrade.price;
        if (upgrade.amountChangeMethod == "linear") {
            upgrade.currentAmount += upgrade.amountChange;
            upgrade.totalAmount += upgrade.amountChange;
        } else if (upgrade.amountChangeMethod == "exponential") {
            upgrade.currentAmount *= upgrade.amountChange;
            upgrade.totalAmount *= upgrade.amountChange;
        }
        if (upgrade.priceIncreaseMethod == "linear") {
            upgrade.price += upgrade.priceIncrease;
        } else if (upgrade.priceIncreaseMethod == "exponential") {
            upgrade.price *= upgrade.priceIncrease;
        }
        htmlElements.playerBalance.innerHTML = "$" + stats.playerBalance.toFixed(2);
        upgrade.htmlPrice.innerHTML = "$" + upgrade.price.toFixed(2);

        if ((upgrade.amountChangeDirection == "increase" && (upgrade.currentAmount >= upgrade.amountCap || upgrade.totalAmount >= upgrade.amountCap)) ||
        (upgrade.amountChangeDirection == "decrease" && (upgrade.currentAmount <= upgrade.amountCap || upgrade.totalAmount <= upgrade.amountCap))) {
            upgrade.amountCapHit = true;
            if (upgrade.temporary == false) {
                upgrade.currentAmount = upgrade.amountCap;
            }
            upgrade.htmlPrice.innerHTML = "Capped";
        } else {
            upgrade.htmlPrice.innerHTML = "$" + upgrade.price.toFixed(2);
        }

        updateButtonColor();

        if (upgrade.amountFormat == "integer") {
            upgrade.htmlAmount.innerHTML = upgrade.currentAmount;
        } else if (upgrade.amountFormat == "decimal") {
            upgrade.htmlAmount.innerHTML = upgrade.currentAmount.toFixed(2);
        }
    }
}

function updateButtonColor() {
    for (let upgradeItem in upgrades) {
        if (upgrades[upgradeItem].amountCapHit == true) {
            upgrades[upgradeItem].htmlButton.style.backgroundColor = colors.cappedBackground;
            upgrades[upgradeItem].htmlButton.style.color = colors.cappedText;
        } else if (stats.playerBalance >= upgrades[upgradeItem].price) {
            upgrades[upgradeItem].htmlButton.style.backgroundColor = colors.purchaseableBackground;
            upgrades[upgradeItem].htmlButton.style.color = colors.purchaseableText;
        } else {
            upgrades[upgradeItem].htmlButton.style.backgroundColor = colors.unpurchaseableBackground;
            upgrades[upgradeItem].htmlButton.style.color = colors.unpurchaseableText;
        }
    }
}