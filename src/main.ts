import { init, step, setToCycle, setToSelected, serialize, deserialize } from "./GridLogic.js";
import { ConwayRuleSet } from "./Rulesets/Conway.js";
import { WireWorldRuleSet } from "./Rulesets/WireWorld.js";
import { RuleSet } from "./Rulesets/Ruleset.js";
import { BriansBrainRuleSet } from "./Rulesets/BriansBrain.js";
import { SeedsRuleSet } from "./Rulesets/Seeds.js";
import { ImmigrationRuleSet } from "./Rulesets/Immigration.js";
import { SquareGridShape } from "./GridShape.js";
import { MazeRuleSet } from "./Rulesets/Maze.js";
import { MazectricRuleSet } from "./Rulesets/Mazectric.js";

let timer: number = 0;

const DEFAULT_SIZE = 20;

const RULE_SETS = [
    new ConwayRuleSet(),
    new ImmigrationRuleSet(),
    new WireWorldRuleSet(),
    new BriansBrainRuleSet(),
    new SeedsRuleSet(),
    new MazeRuleSet(),
    new MazectricRuleSet()
];

let currentSize = DEFAULT_SIZE;
let currentRuleSet = RULE_SETS[ 0 ];
let currentShape = SquareGridShape.PLANE;

function setupCellControls(ruleSet: RuleSet)
{
    const controls = document.getElementById("cell-controls");
    controls.innerHTML = "";

    const cycleElement = document.createElement("li");
    cycleElement.innerHTML = `<img src="./res/cycle.svg" alt="cycle cells"><span>Cycle</span>`;
    cycleElement.id = "cell-control--active";
    cycleElement.addEventListener("click", () =>
    {
        const previousActive = document.getElementById("cell-control--active");
        if (previousActive === cycleElement)
        {
            return;
        }

        previousActive.id = "";

        cycleElement.id = "cell-control--active";

        setToCycle();
    });

    controls.appendChild(cycleElement);

    ruleSet.cells.forEach(({ tag, color, value }) =>
    {
        const cellElement = document.createElement("li");
        cellElement.innerHTML = `<span style="background-color: ${color};"></span><span>${tag}</span>`;

        cellElement.addEventListener("click", () =>
        {
            const previousActive = document.getElementById("cell-control--active");
            if (previousActive === cellElement)
            {
                return;
            }

            previousActive.id = "";

            cellElement.id = "cell-control--active";

            setToSelected(value);
        });

        controls.appendChild(cellElement);
    });
}

function SetupDescription(ruleSet: RuleSet)
{
    const rulesetDescription = document.getElementById("ruleset-description");

    rulesetDescription.innerHTML = `
    <h4 id="ruleset-title">${ruleSet.name}</h4>
    <div>
        ${ruleSet.description}
    </div>
    `;
}

setupCellControls(currentRuleSet);
SetupDescription(currentRuleSet);
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

const ruleSetSelection = <HTMLSelectElement>document.getElementById("select-ruleset");

RULE_SETS.forEach((ruleSet, index) =>
{
    const newRuleSetOption = document.createElement("option");
    newRuleSetOption.value = String(index);
    newRuleSetOption.innerText = ruleSet.name;

    ruleSetSelection.appendChild(newRuleSetOption);
});

ruleSetSelection.addEventListener("change", () =>
{
    currentRuleSet = RULE_SETS[ ruleSetSelection.value ];
    setupCellControls(currentRuleSet);
    SetupDescription(currentRuleSet);
    init(currentSize, currentRuleSet, currentShape);
});

const shapeSelection = <HTMLSelectElement>document.getElementById("select-shape");

shapeSelection.addEventListener("change", () =>
{
    currentShape = <SquareGridShape>(Number(shapeSelection.value));
    console.log(currentShape);
    init(currentSize, currentRuleSet, currentShape);
});