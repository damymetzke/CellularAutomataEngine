import { init, step } from "./GridLogic.js";
import { ConwayRuleSet } from "./Rulesets/Conway.js";

const N = 20;

init(N, new ConwayRuleSet());

document.getElementById("step-button").addEventListener("click", () =>
{
    step(N);
});