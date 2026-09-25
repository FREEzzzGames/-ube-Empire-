(function () {
    "use strict";

    const Economy = {

        update(now = Date.now()) {

            const state =
                GameState.getState();

            const last =
                state.economy.lastUpdate ||
                now;

            let elapsed =
                (now - last) / 1000;

            if (elapsed < 0) {
                elapsed = 0;
            }

            if (elapsed > 86400) {
                elapsed = 86400;
            }

            const income =
                state.economy.incomePerSecond *
                elapsed;

            const energy =
                state.economy.energyPerSecond *
                elapsed;

            state.player.money += income;

            state.player.totalEarned += income;

            state.player.energy += energy;

            state.economy.lastUpdate = now;

            return {

                income,

                energy,

                elapsed
            };
        },

        addMoney(amount) {

            amount = Number(amount);

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return false;
            }

            const state =
                GameState.getState();

            state.player.money += amount;

            state.player.totalEarned += amount;

            return true;
        },

        spendMoney(amount) {

            amount = Number(amount);

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return false;
            }

            const state =
                GameState.getState();

            if (
                state.player.money <
                amount
            ) {
                return false;
            }

            state.player.money -= amount;

            state.player.totalSpent += amount;

            return true;
        },

        canAfford(amount) {

            return (
                GameState.get(
                    "player.money",
                    0
                ) >= Number(amount)
            );
        }
    };

    window.GameEconomy = Economy;

})();
