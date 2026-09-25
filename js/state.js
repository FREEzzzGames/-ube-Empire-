(function () {
    "use strict";

    const DEFAULT_STATE = {

        version: 1,

        player: {

            id: null,

            name: "Player",

            username: "",

            level: 1,

            xp: 0,

            money: 1000,

            energy: 100,

            totalEarned: 0,

            totalSpent: 0
        },

        economy: {

            incomePerSecond: 0,

            energyPerSecond: 0,

            lastUpdate: Date.now()
        },

        upgrades: {},

        assets: {},

        corporations: {},

        avatar: {

            gender: 0,

            head: 0,

            torso: 0,

            legs: 0,

            accessory: 0
        },

        studio: {

            walls: 0,

            neon: 0,

            poster: 0,

            pet: 0
        },

        settings: {

            language: "en",

            sound: true,

            vibration: true
        }
    };

    let state = structuredClone(DEFAULT_STATE);

    function getState() {

        return state;
    }

    function resetState() {

        state = structuredClone(DEFAULT_STATE);

        state.economy.lastUpdate = Date.now();

        return state;
    }

    function replaceState(newState) {

        if (!newState || typeof newState !== "object") {
            return false;
        }

        state = {

            ...structuredClone(DEFAULT_STATE),

            ...newState
        };

        return true;
    }

    function set(path, value) {

        const parts = path.split(".");

        let target = state;

        for (let i = 0; i < parts.length - 1; i++) {

            const key = parts[i];

            if (
                !target[key] ||
                typeof target[key] !== "object"
            ) {
                target[key] = {};
            }

            target = target[key];
        }

        target[parts[parts.length - 1]] = value;
    }

    function get(path, fallback = null) {

        const parts = path.split(".");

        let value = state;

        for (const key of parts) {

            if (
                value === null ||
                value === undefined ||
                !(key in value)
            ) {
                return fallback;
            }

            value = value[key];
        }

        return value;
    }

    window.GameState = {

        DEFAULT_STATE,

        getState,

        resetState,

        replaceState,

        set,

        get
    };

})();
