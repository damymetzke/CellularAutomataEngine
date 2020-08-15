import { init, step, serialize, deserialize } from "./GridLogic.js";
import { SquareGridShape } from "./GridShape.js";
import { RULE_SETS } from "./RuleSetCollection.js";
import { loadPages } from "./RulesetSelectionLogic.js";
import { setupUi } from "./UiController.js";

let timer: number = 0;

const DEFAULT_SIZE = 20;

let currentSize = DEFAULT_SIZE;
let currentRuleSet = RULE_SETS[ 0 ];
let currentShape = SquareGridShape.PLANE;

setupUi(currentRuleSet);
init(DEFAULT_SIZE, currentRuleSet, SquareGridShape.PLANE);

document.getElementById("step-once").addEventListener("click", () =>
{
    step();
});

document.getElementById("start-stepping").addEventListener("click", () =>
{
    if (timer !== 0)
    {
        window.clearInterval(timer);
    }

    timer = window.setInterval(() =>
    {
        step();
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

document.getElementById("set-size").addEventListener("click", () =>
{
    const sizeElement = <HTMLInputElement>document.getElementById("size-input");
    const newSize = sizeElement.valueAsNumber;

    if (newSize <= 0)
    {
        return;
    }

    currentSize = newSize;
    init(newSize, currentRuleSet, currentShape);
});

document.getElementById("copy-grid").addEventListener("click", () =>
{
    const copySource = <HTMLTextAreaElement>document.getElementById("port-field");
    copySource.value = serialize();

    copySource.select();
    document.execCommand("copy");
});

document.getElementById("paste-grid").addEventListener("click", () =>
{
    const pasteTarget = <HTMLTextAreaElement>document.getElementById("port-field");

    deserialize(pasteTarget.value);
});

document.getElementById("select-ruleset").addEventListener("click", () =>
{
    document.getElementById("ruleset-select-window").classList.add("visible");
});

document.getElementById("ruleset-select-window--exit").addEventListener("click", () =>
{
    document.getElementById("ruleset-select-window").classList.remove("visible");
});

const shapeSelection = <HTMLSelectElement>document.getElementById("select-shape");

shapeSelection.addEventListener("change", () =>
{
    currentShape = <SquareGridShape>(Number(shapeSelection.value));
    console.log(currentShape);
    init(currentSize, currentRuleSet, currentShape);
});

loadPages(RULE_SETS);