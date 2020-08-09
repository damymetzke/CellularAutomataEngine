import { RuleSet, CellType, SurroundArray } from "./Ruleset.js";

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
    description: string = `
    <p>
        Conways game of live ...
    </p>
    <p>
        Some more info or something...
    </p>
    `;
}