import { RuleSet } from "./Ruleset.js";
import { SquareGridShape } from "./GridShape.js";
import { RULE_SETS } from "./RuleSetCollection.js";

const CELL_GAP_RATIO: number = 0.05;

const RULESET_MAP = (() =>
{
    let result = {};
    RULE_SETS.forEach((ruleSet) =>
    {
        result[ ruleSet.name ] = ruleSet;
    });
    return result;
})();

export enum EditMode
{
    CYCLE,
    SELECTED
}

let editMode: EditMode = EditMode.CYCLE;
let selectedCell: number = 0;
let cycleMap: any = {};
let colorMap: any = {};

let grid: SVGRectElement[] = [];

let currentSize: number = 20;
let currentRuleSet: RuleSet = null;
let currentShape: SquareGridShape = SquareGridShape.PLANE;


export function setToCycle()
{
    editMode = EditMode.CYCLE;
}

export function setToSelected(selected: number)
{
    editMode = EditMode.SELECTED;
    selectedCell = selected;
}

export function buildGridCells(): void
{
    /*
     * ALGORITHM:
     * calculates the cell gap size such that CELL_SIZE * CELL_GAP_RATIO = GAP_SIZE
     * derived from the following 2 formulas:
     * * GAP_SIZE = GAP_RATIO * CELL_SIZE
     * * (n * CELLSIZE) + ((n+1) * GAP_SIZE) = 1 
     */
    const cellGapSize = CELL_GAP_RATIO / (currentSize * CELL_GAP_RATIO + currentSize + CELL_GAP_RATIO);

    const cellSize = cellGapSize / CELL_GAP_RATIO;

    const cellStep = cellGapSize + cellSize;

    const cellElement = <SVGGElement><HTMLOrSVGElement>document.getElementById("grid-cells");
    cellElement.innerHTML = "";

    grid = [];
    grid.length = currentSize * currentSize;

    for (let y = 0; y < currentSize; ++y)
    {
        const offsetY = cellGapSize + (y * cellStep);
        for (let x = 0; x < currentSize; ++x)
        {
            const offsetX = cellGapSize + (x * cellStep);

            const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cell.setAttribute("x", String(offsetX));
            cell.setAttribute("y", String(offsetY));
            cell.setAttribute("width", String(cellSize));
            cell.setAttribute("height", String(cellSize));
            cell.setAttribute("fill", colorMap[ 0 ]);

            cell.dataset.value = "0";

            cell.addEventListener("click", () =>
            {
                switch (editMode)
                {
                    case EditMode.CYCLE:
                        const currentValue = Number(cell.dataset.value);
                        const nextValue = cycleMap[ currentValue ];
                        cell.dataset.value = String(nextValue);
                        cell.setAttribute("fill", colorMap[ nextValue ]);
                        break;
                    case EditMode.SELECTED:
                        cell.dataset.value = String(selectedCell);
                        cell.setAttribute("fill", colorMap[ selectedCell ]);
                        break;
                }
            });

            cellElement.appendChild(cell);

            grid[ y * currentSize + x ] = cell;
        }
    }
}

function overFlowRuleWrap(size: number, position: number): number
{
    if (position < 0)
    {
        return size + position;
    }
    if (position >= size)
    {

        return position - size;
    }

    return position;
}

function overFlowRuleNull(size: number, position: number): number
{
    if (position < 0 || position >= size)
    {
        return null;
    }

    return position;
}

const SHAPE_MAP = {
    [ SquareGridShape.PLANE ]: [ overFlowRuleNull, overFlowRuleNull ],
    [ SquareGridShape.STRIP ]: [ overFlowRuleNull, overFlowRuleWrap ],
    [ SquareGridShape.TORUS ]: [ overFlowRuleWrap, overFlowRuleWrap ]
};

export function step()
{
    let currentGrid: number[] = grid.map(element => Number(element.dataset.value));
    let nextGrid: number[] = [];
    nextGrid.length = currentSize * currentSize;

    const [ overFlowRuleY, overFlowRuleX ] = SHAPE_MAP[ currentShape ];

    for (let y = 0; y < currentSize; ++y)
    {
        for (let x = 0; x < currentSize; ++x)
        {
            const center = currentGrid[ y * currentSize + x ];
            const surround = currentRuleSet.neighbors.map(([ offsetX, offsetY ]) =>
            {
                const surroundX = overFlowRuleX(currentSize, x + offsetX);
                const surroundY = overFlowRuleY(currentSize, y + offsetY);

                if (surroundX === null || surroundY === null)
                {
                    return 0;
                }

                return currentGrid[ surroundY * currentSize + surroundX ];

            });

            nextGrid[ y * currentSize + x ] = currentRuleSet.calculateStep(center, <any>surround);
        }
    }

    for (let i = 0; i < currentSize * currentSize; ++i)
    {
        grid[ i ].dataset.value = String(nextGrid[ i ]);
        grid[ i ].setAttribute("fill", colorMap[ nextGrid[ i ] ]);
    }
}

export function init(n: number, ruleSet: RuleSet, shape: SquareGridShape)
{
    currentSize = n;
    currentRuleSet = ruleSet;
    currentShape = shape;
    colorMap = {};
    cycleMap = {};
    editMode = EditMode.CYCLE;
    ruleSet.cells.forEach((cell, index) =>
    {
        colorMap[ cell.value ] = cell.color;
        cycleMap[ cell.value ] = (index < ruleSet.cells.length - 1) ? ruleSet.cells[ index + 1 ].value : ruleSet.cells[ 0 ].value;
    });

    // buildGridBackground(n);
    buildGridCells();
}

export function serialize(): string
{
    return JSON.stringify({
        name: currentRuleSet.name,
        gridSize: currentSize,
        shape: currentShape,
        states: grid.map(cell => cell.dataset.value)
    });
}

export function deserialize(rawJson: string): void
{
    const { name, gridSize, shape, states } = JSON.parse(rawJson);

    if (
        name === undefined
        || gridSize === undefined
        || shape === undefined
        || states === undefined
    )
    {
        const errorString = "Could not deserialized JSON, expected the following keys in JSON data:\n\tname\n\tgridSize\n\tstates";
        console.error(errorString);
        alert(errorString);
        return;
    }

    init(gridSize, RULESET_MAP[ name ], shape);

    grid.forEach((cell, index) =>
    {
        cell.dataset.value = states[ index ];
        cell.setAttribute("fill", colorMap[ states[ index ] ]);
    });
}