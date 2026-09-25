(function () {
    "use strict";

    const Economy = {

        update(now = Date.now()) {

            const state = GameState.getState();

            const lastUpdate =
                state.economy.lastUpdate || now;

            let elapsed =
                (now - lastUpdate) / 1000;

            // Защита от неправильного времени
            if (elapsed < 0) {
                elapsed = 0;
            }

            // Максимум 24 часа за один расчёт
            if (elapsed > 86400) {
                elapsed = 86400;
            }

            const income =
                state.economy.incomePerSecond * elapsed;

            const energy =
                state.economy.energyPerSecond * elapsed;

            if (income > 0) {

                state.player.money += income;

                state.player.totalEarned += income;
            }

            if (energy !== 0) {

                state.player.energy += energy;
            }

            // Ограничиваем энергию
            if (state.player.energy > 100) {
                state.player.energy = 100;
            }

            if (state.player.energy < 0) {
                state.player.energy = 0;
            }

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

            const state = GameState.getState();

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

            const state = GameState.getState();

            if (state.player.money < amount) {
                return false;
            }

            state.player.money -= amount;

            state.player.totalSpent += amount;

            return true;
        },


        canAfford(amount) {

            amount = Number(amount);

            if (!Number.isFinite(amount)) {
                return false;
            }

            return (
                GameState.get(
                    "player.money",
                    0
                ) >= amount
            );
        },


        getMoney() {

            return GameState.get(
                "player.money",
                0
            );
        },


        getEnergy() {

            return GameState.get(
                "player.energy",
                0
            );
        },


        getIncomePerSecond() {

            return GameState.get(
                "economy.incomePerSecond",
                0
            );
        },


        getEnergyPerSecond() {

            return GameState.get(
                "economy.energyPerSecond",
                0
            );
        }
    };


    window.GameEconomy = Economy;

})();
