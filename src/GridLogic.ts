import { RuleSet } from "./Rulesets/Ruleset.js";

const CELL_GAP_RATIO: number = 0.05;

const GAP_COLOR: string = "#544444";

const SURROUND_TEMPLATE = [
    [ -1, -1 ], [ 0, -1 ], [ 1, -1 ],
    [ -1, 0 ], [ 1, 0 ],
    [ -1, 1 ], [ 0, 1 ], [ 1, 1 ]
];

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


export function setToCycle()
{
    editMode = EditMode.CYCLE;
}

export function setToSelected(selected: number)
{
    editMode = EditMode.SELECTED;
    selectedCell = selected;
}

export function buildGridBackground(n: number): void
{
    /*
     * ALGORITHM:
     * calculates the cell gap size such that CELL_SIZE * CELL_GAP_RATIO = GAP_SIZE
     * derived from the following 2 formulas:
     * * GAP_SIZE = GAP_RATIO * CELL_SIZE
     * * (n * CELLSIZE) + ((n+1) * GAP_SIZE) = 1 
     */
    const cellGapSize = CELL_GAP_RATIO / (n * CELL_GAP_RATIO + n + CELL_GAP_RATIO);

    const cellGapStep = (1 / n) * (1 - cellGapSize);

    const backgroundElement = <SVGGElement><HTMLOrSVGElement>document.getElementById("grid-background");

    backgroundElement.innerHTML = "";

    for (let i = 0; i < n + 1; ++i)
    {
        const offset = i * cellGapStep;

        const horizontalLine = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        horizontalLine.setAttribute("x", "0");
        horizontalLine.setAttribute("y", String(offset));
        horizontalLine.setAttribute("width", "1");
        horizontalLine.setAttribute("height", String(cellGapSize));
        horizontalLine.setAttribute("fill", GAP_COLOR);

        const verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        verticalLine.setAttribute("y", "0");
        verticalLine.setAttribute("x", String(offset));
        verticalLine.setAttribute("height", "1");
        verticalLine.setAttribute("width", String(cellGapSize));
        verticalLine.setAttribute("fill", GAP_COLOR);

        backgroundElement.appendChild(horizontalLine);
        backgroundElement.appendChild(verticalLine);
    }
}

export function buildGridCells(n: number): void
{
    /*
     * ALGORITHM:
     * calculates the cell gap size such that CELL_SIZE * CELL_GAP_RATIO = GAP_SIZE
     * derived from the following 2 formulas:
     * * GAP_SIZE = GAP_RATIO * CELL_SIZE
     * * (n * CELLSIZE) + ((n+1) * GAP_SIZE) = 1 
     */
    const cellGapSize = CELL_GAP_RATIO / (n * CELL_GAP_RATIO + n + CELL_GAP_RATIO);

    const cellSize = cellGapSize / CELL_GAP_RATIO;

    const cellStep = cellGapSize + cellSize;

    const cellElement = <SVGGElement><HTMLOrSVGElement>document.getElementById("grid-cells");
    cellElement.innerHTML = "";

    grid = [];
    grid.length = n * n;

    for (let y = 0; y < n; ++y)
    {
        const offsetY = cellGapSize + (y * cellStep);
        for (let x = 0; x < n; ++x)
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

            grid[ y * n + x ] = cell;
        }
    }
}

function tmpRuleSet(center: number, surround: number[]): number
{
    const numAlive = surround.reduce((total, cell) => total + (cell === 0 ? 0 : 1));

    if (center === 0) //dead
    {
        if (numAlive === 3)
        {
            return 1;
        }
        return 0;
    }

    //alive
    if (numAlive === 2 || numAlive === 3)
    {
        return 1;
    }
    return 0;

}

export function step(n: number, ruleSet: RuleSet)
{
    let currentGrid: number[] = grid.map(element => Number(element.dataset.value));
    let nextGrid: number[] = [];
    nextGrid.length = n * n;

    for (let y = 0; y < n; ++y)
    {
        for (let x = 0; x < n; ++x)
        {
            const center = currentGrid[ y * n + x ];
            const surround = SURROUND_TEMPLATE.map(([ offsetX, offsetY ]) =>
            {
                const surroundX = x + offsetX;
                const surroundY = y + offsetY;

                if (
                    surroundX < 0
                    || surroundY < 0
                    || surroundX >= n
                    || surroundY >= n
                )
                {
                    return 0;
                }

                return currentGrid[ surroundY * n + surroundX ];

            });

            nextGrid[ y * n + x ] = ruleSet.calculateStep(center, <any>surround);
        }
    }

    for (let i = 0; i < n * n; ++i)
    {
        grid[ i ].dataset.value = String(nextGrid[ i ]);
        grid[ i ].setAttribute("fill", colorMap[ nextGrid[ i ] ]);
    }
}

export function init(n: number, ruleSet: RuleSet)
{
    colorMap = {};
    cycleMap = {};
    editMode = EditMode.CYCLE;
    ruleSet.cells.forEach((cell, index) =>
    {
        colorMap[ cell.value ] = cell.color;
        cycleMap[ cell.value ] = (index < ruleSet.cells.length - 1) ? ruleSet.cells[ index + 1 ].value : ruleSet.cells[ 0 ].value;
    });

    buildGridBackground(n);
    buildGridCells(n);
}