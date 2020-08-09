import { init, step } from "./GridLogic.js";
import { ConwayRuleSet } from "./Rulesets/Conway.js";
import { RuleSet } from "./Rulesets/Ruleset.js";

let timer: number = 0;

const N = 20;

function setupCellControls(ruleSet: RuleSet)
{
    const controls = document.getElementById("cell-controls");
    controls.innerHTML = "";

    const cycleElement = document.createElement("li");
    cycleElement.innerHTML = `<img src="./res/cycle.svg" alt="cycle cells"><span>Cycle</span>`;

    controls.appendChild(cycleElement);

    ruleSet.cells.forEach(({ tag, color }) =>
    {
        const cellElement = document.createElement("li");
        cellElement.innerHTML = `<span style="background-color: ${color};"></span><span>${tag}</span>`;
        controls.appendChild(cellElement);
    });
}

setupCellControls(new ConwayRuleSet());
init(N, new ConwayRuleSet());

document.getElementById("step-once").addEventListener("click", () =>
{
    step(N);
});

document.getElementById("start-stepping").addEventListener("click", () =>
{
    if (timer !== 0)
    {
        window.clearInterval(timer);
    }

    timer = window.setInterval(() =>
    {
        step(N);
    }, 1000 / (<HTMLInputElement>document.getElementById("speed-input")).valueAsNumber);
});

document.getElementById("stop-stepping").addEventListener("click", () =>
{
    if (timer === 0)
    {
        return;
    }

    window.clearInterval(timer);
    timer = 0;
});