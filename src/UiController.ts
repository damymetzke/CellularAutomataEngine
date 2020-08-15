import { RuleSet } from "./Ruleset.js";
import { setToCycle, setToSelected } from "./GridLogic.js";

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

export function setupUi(ruleset: RuleSet)
{
    setupCellControls(ruleset);
    SetupDescription(ruleset);
}