<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">

<title>Tube Empire — Studio</title>

<style>
*{
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
}

html,body{
    margin:0;
    padding:0;
    min-height:100%;
    background:#090b12;
    color:#fff;
    font-family:Arial,Helvetica,sans-serif;
}

body{
    display:flex;
    justify-content:center;
}

.game{
    width:100%;
    max-width:520px;
    min-height:100vh;
    padding:16px;
    background:
        radial-gradient(
            circle at 50% 15%,
            #29335f 0%,
            #11172a 40%,
            #090b12 80%
        );
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:14px;
}

.logo{
    font-size:21px;
    font-weight:900;
}

.online{
    background:#17251d;
    color:#72f7a0;
    padding:7px 10px;
    border-radius:10px;
    font-size:12px;
    font-weight:bold;
}

.balance{
    padding:18px;
    text-align:center;
    border-radius:18px;
    background:#111726;
    border:1px solid #34405f;
}

.label{
    color:#8c97b0;
    font-size:12px;
    text-transform:uppercase;
}

.money{
    margin-top:5px;
    color:#72f7a0;
    font-size:38px;
    font-weight:900;
}

.stats{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:10px;
    margin-top:12px;
}

.stat{
    padding:14px;
    background:#111624;
    border:1px solid #29334b;
    border-radius:14px;
}

.stat-title{
    color:#78839d;
    font-size:11px;
}

.stat-value{
    margin-top:5px;
    font-size:20px;
    font-weight:bold;
}

.card{
    margin-top:14px;
    padding:20px;
    text-align:center;
    background:#101522;
    border:1px solid #303b59;
    border-radius:22px;
}

.title{
    font-size:21px;
    font-weight:900;
}

.subtitle{
    margin-top:6px;
    color:#8994ad;
    font-size:13px;
}

.tap{
    width:210px;
    height:210px;
    margin:25px auto 18px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    background:
        radial-gradient(
            circle,
            #344579 0%,
            #182341 55%,
            #0c1120 100%
        );
    border:5px solid #6178c0;
    box-shadow:0 0 35px #526fc088;
    user-select:none;
    touch-action:manipulation;
    cursor:pointer;
}

.tap:active{
    transform:scale(.94);
}

.play{
    font-size:65px;
}

.tap-text{
    margin-top:8px;
    font-size:13px;
    font-weight:bold;
}

.message{
    min-height:20px;
    color:#77eaff;
    font-size:13px;
    font-weight:bold;
}

.energy{
    margin-top:15px;
}

.energy-head{
    display:flex;
    justify-content:space-between;
    color:#8b96ae;
    font-size:12px;
    margin-bottom:6px;
}

.energy-bar{
    height:10px;
    background:#080b12;
    border-radius:10px;
    overflow:hidden;
}

.energy-fill{
    width:100%;
    height:100%;
    background:linear-gradient(90deg,#58d9ff,#8d7cff);
}

.buttons{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:10px;
    margin-top:15px;
}

button{
    padding:14px 8px;
    border:0;
    border-radius:13px;
    color:white;
    background:#252e48;
    font-size:14px;
    font-weight:bold;
    cursor:pointer;
}

.bonus{
    background:#5d55d9;
}

.footer{
    margin-top:15px;
    text-align:center;
    color:#566078;
    font-size:11px;
}
</style>
</head>

<body>

<div class="game">

    <div class="header">
        <div class="logo">🎬 TUBE EMPIRE</div>
        <div class="online">ONLINE</div>
    </div>

    <div class="balance">
        <div class="label">Баланс</div>
        <div class="money" id="money">0.00 €</div>
    </div>

    <div class="stats">

        <div class="stat">
            <div class="stat-title">ПРОСМОТРЫ</div>
            <div class="stat-value" id="views">0</div>
        </div>

        <div class="stat">
            <div class="stat-title">ДОХОД / КЛИК</div>
            <div class="stat-value">1.00 €</div>
        </div>

    </div>

    <div class="card">

        <div class="title">СТУДИЯ</div>

        <div class="subtitle">
            Нажимай и зарабатывай
        </div>

        <div class="tap" id="tap">

            <div>
                <div class="play">▶️</div>
                <div class="tap-text">НАЖМИ</div>
            </div>

        </div>

        <div class="message" id="message">
            ИГРА ГОТОВА — НАЖМИ ▶
        </div>

        <div class="energy">

            <div class="energy-head">
                <span>Энергия</span>
                <span id="energyText">100 / 100</span>
            </div>

            <div class="energy-bar">
                <div
                    class="energy-fill"
                    id="energy"
                ></div>
            </div>

        </div>

        <div class="buttons">

            <button
                class="bonus"
                id="bonus"
            >
                🎁 БОНУС +100 €
            </button>

        </div>

    </div>

    <div class="footer">
        Tube Empire • Connected Economy
    </div>

</div>

<!-- Общая система Tube Empire -->

<script src="js/state.js"></script>
<script src="js/storage.js"></script>
<script src="js/telegram.js"></script>
<script src="js/app.js"></script>
<script src="js/economy.js"></script>

<script>
"use strict";

const money =
    document.getElementById("money");

const views =
    document.getElementById("views");

const energy =
    document.getElementById("energy");

const energyText =
    document.getElementById("energyText");

const message =
    document.getElementById("message");

const tap =
    document.getElementById("tap");

const bonus =
    document.getElementById("bonus");


function render(){

    const state =
        GameState.getState();

    const player =
        state.player;

    money.textContent =
        Number(player.money).toLocaleString(
            "de-DE",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        ) + " €";

    views.textContent =
        Number(
            player.totalEarned || 0
        ).toLocaleString("de-DE");

    const currentEnergy =
        Math.max(
            0,
            Math.min(
                100,
                Number(player.energy) || 0
            )
        );

    energy.style.width =
        currentEnergy + "%";

    energyText.textContent =
        Math.floor(currentEnergy) +
        " / 100";
}


function save(){

    GameStorage.save(
        GameState.getState()
    );
}


function tapGame(){

    const state =
        GameState.getState();

    if(state.player.energy < 1){

        message.textContent =
            "⚡ Нет энергии";

        return;
    }

    GameEconomy.addMoney(1);

    state.player.energy -= 1;

    render();
    save();

    message.textContent =
        "Заработано +1.00 €";
}


function getBonus(){

    GameEconomy.addMoney(100);

    render();
    save();

    message.textContent =
        "🎁 Получен бонус +100 €";
}


tap.addEventListener(
    "click",
    tapGame
);

bonus.addEventListener(
    "click",
    getBonus
);


document.addEventListener(
    "game:render",
    render
);


/*
 * Запускаем общий игровой цикл.
 * Он отвечает за экономику,
 * сохранение и восстановление.
 */

if(window.Game){

    Game.start();

}


render();

</script>

</body>
</html>
