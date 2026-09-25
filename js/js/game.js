(function () {
    "use strict";

    let running = false;

    let lastFrame = 0;

    let saveTimer = 0;

    const Game = {

        start() {

            if (running) {
                return;
            }

            running = true;

            lastFrame =
                performance.now();

            requestAnimationFrame(
                loop
            );
        },

        stop() {

            running = false;
        },

        isRunning() {

            return running;
        }
    };

    function loop(timestamp) {

        if (!running) {
            return;
        }

        const delta =
            Math.min(
                (timestamp - lastFrame) / 1000,
                0.25
            );

        lastFrame = timestamp;

        update(delta);

        render();

        requestAnimationFrame(
            loop
        );
    }

    function update(delta) {

        GameEconomy.update(
            Date.now()
        );

        saveTimer += delta;

        if (saveTimer >= 5) {

            saveTimer = 0;

            GameStorage.save(
                GameState.getState()
            );
        }
    }

    function render() {

        document.dispatchEvent(
            new CustomEvent(
                "game:render"
            )
        );
    }

    window.Game = Game;

})();
