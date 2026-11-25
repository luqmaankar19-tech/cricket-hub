
let currentInnings = 1;
let matchFinished = false;

let indiaRuns = 185;
let partnershipRuns = 0;
let indiaWickets = 4;
let indiaBalls = 108;

let australiaRuns = 0;
let australiaWickets = 0;
let australiaBalls = 0;

const target = 186;
const maxBalls = 120;

function updateScoreboard() {
    // Main scoreboard
    document.getElementById("india-score").textContent =
        `India: ${indiaRuns}/${indiaWickets} (${Math.floor(indiaBalls / 6)}.${indiaBalls % 6} Overs)`;

    document.getElementById("australia-score").textContent =
        currentInnings === 1
            ? "Australia: Yet to Bat"
            : `Australia: ${australiaRuns}/${australiaWickets} (${Math.floor(australiaBalls / 6)}.${australiaBalls % 6} Overs)`;
// Run Chase Tracker
// Current Run Rate
let runs = currentInnings === 1 ? indiaRuns : australiaRuns;
let balls = currentInnings === 1 ? indiaBalls : australiaBalls;

let runRate = balls > 0 ? (runs / balls) * 6 : 0;

document.getElementById("current-run-rate").textContent =
    `Current Run Rate: ${runRate.toFixed(2)}`;
    // Over Progress Bar
let currentBalls = currentInnings === 1 ? indiaBalls : australiaBalls;

let progress = Math.min((currentBalls / 120) * 100, 100);
document.getElementById("overs-display").textContent =
    `Overs Completed: ${Math.floor(currentBalls / 6)}.${currentBalls % 6} / 20`;

document.getElementById("over-progress-fill").style.width =
    progress + "%";
    document.getElementById("partnership").textContent =
    `Partnership: ${partnershipRuns} Runs`;
    // Required Run Rate
let runsNeeded = target - australiaRuns;
let ballsLeft = maxBalls - australiaBalls;

let requiredRate = ballsLeft > 0
    ? (Math.max(runsNeeded, 0) / ballsLeft) * 6
    : 0;

document.getElementById("required-run-rate").textContent =
    currentInnings === 1
        ? "Required Run Rate: Waiting for second innings"
        : `Required Run Rate: ${requiredRate.toFixed(2)}`;
document.getElementById("target-score").textContent =
    `Target: ${target}`;

document.getElementById("runs-required").textContent =
    currentInnings === 1
        ? "Runs Required: Waiting for second innings"
        : `Runs Required: ${Math.max(target - australiaRuns, 0)}`;

document.getElementById("balls-remaining").textContent =
    currentInnings === 1
        ? "Balls Remaining: 120"
        : `Balls Remaining: ${Math.max(maxBalls - australiaBalls, 0)}`;
    // Bottom scoreboard
    document.getElementById("bottom-india-score").textContent =
        `India: ${indiaRuns}/${indiaWickets}`;

    document.getElementById("bottom-india-overs").textContent =
        `Overs: ${Math.floor(indiaBalls / 6)}.${indiaBalls % 6}`;

    document.getElementById("bottom-australia-score").textContent =
        currentInnings === 1
            ? "Australia: Yet to Bat"
            : `Australia: ${australiaRuns}/${australiaWickets}`;

    document.getElementById("bottom-match-status").textContent =
        matchFinished
            ? "Match Completed"
            : currentInnings === 1
                ? "India is batting"
                : "Australia is batting";
}

function addRuns(runs) {
    if (matchFinished) return;

    if (currentInnings === 1) {
        if (indiaBalls >= maxBalls || indiaWickets >= 10) return;

        indiaRuns += runs;
        partnershipRuns += runs;
        document.getElementById("last-ball").textContent =
    runs === 4 ? "Last Ball: FOUR" :
    runs === 6 ? "Last Ball: SIX" :
    `Last Ball: ${runs} Run`;
        indiaBalls++;
    } else {
        if (australiaBalls >= maxBalls || australiaWickets >= 10) return;

        australiaRuns += runs;
        partnershipRuns += runs;
        document.getElementById("last-ball").textContent =
    runs === 4 ? "Last Ball: FOUR" :
    runs === 6 ? "Last Ball: SIX" :
    `Last Ball: ${runs} Run`;
        australiaBalls++;
    }

    updateScoreboard();
    checkMatchResult();
}

function addWicket() {
    if (matchFinished) return;

    if (currentInnings === 1) {
        if (indiaWickets >= 10 || indiaBalls >= maxBalls) return;
        indiaWickets++;
        document.getElementById("last-ball").textContent = "Last Ball: WICKET";
        partnershipRuns = 0;
        indiaBalls++;
    } else {
        if (australiaWickets >= 10 || australiaBalls >= maxBalls) return;
        australiaWickets++;
        document.getElementById("last-ball").textContent = "Last Ball: WICKET";
        partnershipRuns = 0;
        australiaBalls++;
    }

    updateScoreboard();
    checkMatchResult();
}

function checkMatchResult() {
    if (currentInnings === 2 && australiaRuns >= target) {
        finishMatch("Australia wins!");
    } else if (
        currentInnings === 2 &&
        (australiaWickets >= 10 || australiaBalls >= maxBalls)
    ) {
        if (australiaRuns === indiaRuns) {
            finishMatch("Match tied!");
        } else {
            finishMatch("India wins!");
        }
    }
}

function finishMatch(result) {
    matchFinished = true;
    document.getElementById("match-status").textContent = result;
    document.getElementById("australia-status").textContent = "Innings Completed";
    document.getElementById("end-innings").textContent = "Match Completed";
    updateScoreboard();
}

// Run buttons
document.getElementById("add-run").addEventListener("click", function() {
    addRuns(1);
});

document.getElementById("add-four").addEventListener("click", function() {
    addRuns(4);
});

document.getElementById("add-six").addEventListener("click", function() {
    addRuns(6);
});

document.getElementById("add-wicket").addEventListener("click", addWicket);

// End innings button
document.getElementById("end-innings").addEventListener("click", function() {
    if (matchFinished) return;

    if (currentInnings === 1) {
        currentInnings = 2;
        partnershipRuns = 0;

        document.getElementById("india-status").textContent = "Innings Completed";
        document.getElementById("australia-status").textContent = "Currently Batting";

        document.getElementById("match-status").textContent =
            `Australia needs ${target} runs to win`;

        document.getElementById("end-innings").textContent = "End Match";

        updateScoreboard();
    } else {
        if (australiaRuns === indiaRuns) {
            finishMatch("Match tied!");
        } else if (australiaRuns > indiaRuns) {
            finishMatch("Australia wins!");
        } else {
            finishMatch("India wins!");
        }
    }
});

// Initial display
updateScoreboard();
// Match timer
let matchSeconds = 0;

setInterval(function() {
    if (matchFinished) return;

    matchSeconds++;

    let minutes = Math.floor(matchSeconds / 60);
    let seconds = matchSeconds % 60;

    document.getElementById("match-timer").textContent =
        `Match Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}, 1000);
