import { init, step } from "./GridLogic.js";
import { ConwayRuleSet } from "./Rulesets/Conway.js";

let timer: number = 0;

const N = 20;

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