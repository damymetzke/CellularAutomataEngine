const CELL_GAP_RATIO: number = 0.05;

const GAP_COLOR: string = "#544444";

enum EditMode
{
    CYCLE,
    SELECTED
}

let editMode: EditMode = EditMode.CYCLE;
let cycleMap = {
    0: 1,
    1: 2,
    2: 0
};
let colorMap = {
    0: "#222222",
    1: "#cc4444",
    2: "#44cccc"
};

let grid: SVGRectElement[] = [];


function buildGridBackground(n: number): void
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

function buildEditableGridCells(n: number): void
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

    const backgroundElement = <SVGGElement><HTMLOrSVGElement>document.getElementById("grid-cells");

    console.log("Step = ", cellStep);

    grid = [];
    grid.length = n * n;

    for (let y = 0; y < n; ++y)
    {
        const offsetY = cellGapSize + (y * cellStep);
        console.log(offsetY);
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
                }
            });

            backgroundElement.appendChild(cell);

            grid[ y * n + x ] = cell;
        }
    }
}

const N = 8;

buildGridBackground(N);
buildEditableGridCells(N);