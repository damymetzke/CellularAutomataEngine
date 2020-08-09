import { buildGridBackground, buildGridCells, step } from "./GridLogic.js";

const N = 20;

buildGridBackground(N);
buildGridCells(N);

document.getElementById("step-button").addEventListener("click", () =>
{
    step(N);
});