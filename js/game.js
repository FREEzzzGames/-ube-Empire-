<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">

<title>Tube Empire</title>

<style>
*{
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
}

html,body{
    margin:0;
    padding:0;
    min-height:100%;
    background:#080b12;
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
            circle at 50% 10%,
            #303b70 0%,
            #141a2d 40%,
            #080b12 85%
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
    padding:7px 10px;
    border-radius:10px;
    background:#17251d;
    color:#72f7a0;
    font-size:12px;
    font-weight:bold;
}

.balance{
    padding:18px;
    text-align:center;
    border:1px solid #3b486c;
    border-radius:18px;
    background:#111726;
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
    border:1px solid #303b57;
    border-radius:14px;
    background:#111624;
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
    border:1px solid #35415f;
    border-radius:22px;
    background:#101522;
}

.title{
    font-size:22px;
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
    border:5px solid #6178c0;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    background:
        radial-gradient(
            circle,
            #344579,
            #182341 55%,
            #0c1120
        );
    box-shadow:0 0 35px #526fc088;
    cursor:pointer;
    user-select:none;
    touch-action:manipulation;
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
    min-height:22px;
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
    margin-bottom:6px;
    color:#8b96ae;
    font-size:12px;
}

.energy-bar{
    height:10px;
    overflow:hidden;
    border-radius:10px;
    background:#080b12;
}

.energy-fill{
    width:100%;
    height:100%;
    background:linear-gradient(
        90deg,
        #58d9ff,
        #8d7cff
    );
}

/* =========================
   UPGRADE
========================= */

.upgrade-box{
    margin-top:18px;
    padding:18px;
    border:2px solid #596fff;
    border-radius:18px;
    background:
        linear-gradient(
            135deg,
            #192342,
            #11182c
        );
    box-shadow:0 0 20px #596fff33;
}

.upgrade-title{
    font-size:18px;
    font-weight:900;
}

.upgrade-info{
    margin-top:8px;
    color:#aab4cc;
    font-size:13px;
    line-height:1.6;
}

.upgrade-button{
    width:100%;
    margin-top:14px;
    padding:16px;
    border:0;
    border-radius:14px;
    background:linear-gradient(
        135deg,
        #6b7cff,
        #854dff
    );
    color:white;
    font-size:16px;
    font-weight:900;
    cursor:pointer;
    box-shadow:0 5px 20px #684cff55;
}

.upgrade-button:disabled{
    background:#3a4052;
    color:#858da0;
    box-shadow:none;
    opacity:1;
}

.upgrade-button:not(:disabled):active{
    transform:scale(.97);
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
            <div class="stat-value" id="clickIncome">1.00 €</div>
        </div>

    </div>

    <div class="card">

        <div class="title">СТУДИЯ</div>

        <div class="subtitle">
            Развивай канал и увеличивай доход
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
                <div class="energy-fill" id="energy"></div>
            </div>

        </div>

        <!-- УЛУЧШЕНИЕ -->

        <div class="upgrade-box">

            <div class="upgrade-title">
                🚀 УЛУЧШЕНИЕ СТУДИИ
            </div>

            <div class="upgrade-info" id="upgradeInfo">
                Уровень 1
            </div>

            <button
                class="upgrade-button"
                id="upgradeButton"
                type="button"
            >
                🚀 УЛУЧШИТЬ
            </button>

        </div>

        <div class="buttons">

            <button
                class="bonus"
                id="bonus"
                type="button"
            >
                🎁 БОНУС +100 €
            </button>

            <button
                id="save"
                type="button"
            >
                💾 СОХРАНИТЬ
            </button>

        </div>

    </div>

    <div class="footer">
        Tube Empire • Studio v3
    </div>

</div>

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

const clickIncome =
    document.getElementById("clickIncome");

const upgradeInfo =
    document.getElementById("upgradeInfo");

const upgradeButton =
    document.getElementById("upgradeButton");

const tap =
    document.getElementById("tap");

const bonus =
    document.getElementById("bonus");

const saveButton =
    document.getElementById("save");


function state(){
    return GameState.getState();
}


function save(){
    GameStorage.save(state());
}


function formatMoney(value){

    return Number(value).toLocaleString(
        "de-DE",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    ) + " €";

}


function getStudioLevel(){

    return Number(
        GameState.get(
            "upgrades.studio",
            1
        )
    ) || 1;

}


function setStudioLevel(level){

    GameState.set(
        "upgrades.studio",
        level
    );

}


function getClickIncome(){

    return getStudioLevel();

}


function getUpgradeCost(){

    const level =
        getStudioLevel();

    return Math.floor(
        100 *
        Math.pow(
            2,
            level - 1
        )
    );

}


function render(){

    const current =
        state();

    const player =
        current.player;

    const level =
        getStudioLevel();

    const income =
        getClickIncome();

    const cost =
        getUpgradeCost();

    money.textContent =
        formatMoney(
            player.money
        );

    views.textContent =
        Math.floor(
            player.totalEarned || 0
        ).toLocaleString("de-DE");

    clickIncome.textContent =
        formatMoney(
            income
        );

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
        Math.floor(
            currentEnergy
        ) + " / 100";

    upgradeInfo.innerHTML =
        "Текущий уровень: <b>" +
        level +
        "</b><br>" +
        "Доход за клик: <b>" +
        formatMoney(income) +
        "</b><br>" +
        "Стоимость следующего уровня: <b>" +
        formatMoney(cost) +
        "</b>";

    upgradeButton.textContent =
        "🚀 УЛУЧШИТЬ ЗА " +
        formatMoney(cost);

    upgradeButton.disabled
