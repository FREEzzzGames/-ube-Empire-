(function () {
    "use strict";

    let running = false;
    let animationFrame = null;

    let lastFrameTime = 0;
    let saveTimer = 0;

    const SAVE_INTERVAL = 5000;

    const Game = {

        start() {

            if (running) {
                return;
            }

            running = true;

            lastFrameTime = performance.now();
            saveTimer = 0;

            console.log("[Game] Started");

            animationFrame =
                requestAnimationFrame(loop);
        },


        stop() {

            if (!running) {
                return;
            }

            running = false;

            if (animationFrame !== null) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame = null;
            }

            saveGame();

            console.log("[Game] Stopped");
        },


        isRunning() {

            return running;
        }
    };


    function loop(currentTime) {

        if (!running) {
            return;
        }

        let delta =
            (currentTime - lastFrameTime) / 1000;

        lastFrameTime = currentTime;

        // Защита после сворачивания приложения
        if (delta < 0) {
            delta = 0;
        }

        if (delta > 0.25) {
            delta = 0.25;
        }

        update(delta);

        render();

        animationFrame =
            requestAnimationFrame(loop);
    }


    function update(delta) {

        /*
         * Обновляем экономику.
         *
         * Экономика использует реальное время,
         * поэтому игра продолжает правильно
         * считать доход после паузы.
         */

        GameEconomy.update(
            Date.now()
        );


        /*
         * Автосохранение каждые 5 секунд.
         */

        saveTimer += delta;

        if (saveTimer >= SAVE_INTERVAL / 1000) {

            saveTimer = 0;

            saveGame();
        }
    }


    function render() {

        /*
         * Пока UI не подключён.
         *
         * В будущем сюда будут приходить:
         *
         * деньги
         * энергия
         * уровень
         * XP
         * производство
         * анимации
         */

        document.dispatchEvent(
            new CustomEvent("game:render")
        );
    }


    function saveGame() {

        const state =
            GameState.getState();

        GameStorage.save(state);
    }


    /*
     * Сохраняем игру перед закрытием страницы.
     */

    window.addEventListener(
        "beforeunload",
        saveGame
    );


    /*
     * Сохраняем игру, когда Telegram
     * или браузер отправляет приложение
     * в фон.
     */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                saveGame();
            }
        }
    );


    window.Game = Game;

})();
