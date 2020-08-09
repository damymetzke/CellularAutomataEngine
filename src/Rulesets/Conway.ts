import { RuleSet, CellType, SurroundArray } from "./Ruleset.js";

const CONWAY_DESCRIPTION = `
<p>
    <a href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life">Conway's Game of Life</a> is the most famous example of cellular automata.
    It was created by <a href="https://en.wikipedia.org/wiki/John_Horton_Conway">John Horton Conway</a> in 1970.
    CGOL is notable for 3 characteristics:
    <ul>
        <li>There is no explosive growth</li>
        <li>The outcome is chaotic and unpredictable</li>
        <li>The rules are extremely simple</li>
    </ul>
</p>
<p>
    CGOL can be described in 3 rules:
    <ul>
        <li>If a cell is dead, and has exactly 3 alive neighbors, it will become alive.</li>
        <li>If a cell is alive, and has either 2 or 3 living neighbors, it will remain alive.</li>
        <li>If the previous 2 rules do not apply the cell will become/remain dead.</li>
    </ul>
    A neighbor is any cell that touches the cell, including when they only touch corners.

    When looking at neighbors only the initial state matters; so any calculated value won't be used until the next generation.
</p>
<p>
    Due to its popularity many patterns and creations have been found in CGOL. This includes gliders (repeating patterns that will keep moving until they hit an obstacle), Oscillators (repeating patterns that remain stationary) and even machines capable of computation. CGOL is proven to be turing complete, meaning that with enough memory and time anything can be computed. This means that it's theoretically possible to run a virtual machine using CGOL; that is, if you're willing to endure the horrible perfomance.
</p>
`;

export enum ConwayCell
{
    DEAD = 0,
    ALIVE = 1
}

export class ConwayRuleSet implements RuleSet
{
    constructor ()
    {

    }

    calculateStep(center: number, surround: SurroundArray): number
    {
        const numAlive = surround.reduce((total, cell) => cell === ConwayCell.DEAD ? total : total + 1);

        if (center === ConwayCell.DEAD) //dead
        {
            if (numAlive === 3)
            {
                return ConwayCell.ALIVE;
            }
            return ConwayCell.DEAD;
        }

        //alive
        if (numAlive === 2 || numAlive === 3)
        {
            return ConwayCell.ALIVE;
        }
        return ConwayCell.DEAD;
    }
    cells: CellType[] = [
        {
            value: ConwayCell.DEAD,
            tag: "Dead",
            color: "#222222"
        },
        {
            value: ConwayCell.ALIVE,
            tag: "Alive",
            color: "#cccc44"
        }
    ];
    name: string = "Conway's Game of Life";
    description: string = CONWAY_DESCRIPTION;
}