import { RuleSet, CellType, SurroundArray, MOOR_NEIGBORS, NeighborTemplate } from "./Ruleset.js";

const CONWAY_DESCRIPTION = `
No description yet.
`;

export enum ImmigrationCell
{
    DEAD = 0,
    RED = 1,
    BLUE = 2
}

export class ImmigrationRuleSet implements RuleSet
{
    constructor ()
    {

    }

    calculateStep(center: number, surround: SurroundArray): number
    {
        const [ numAlive, score ] = surround.reduce((total, cell) =>
        {
            const [ totalNumAlive, totalScore ] = total;
            const isAlive: number = (cell === ImmigrationCell.DEAD) ? 0 : 1;
            const additionalScore = (cell === ImmigrationCell.DEAD)
                ? 0
                : (cell === ImmigrationCell.RED) ? 1 : -1;

            return [ totalNumAlive + isAlive, totalScore + additionalScore ];
        }, [ 0, 0 ]);

        if (center === ImmigrationCell.DEAD) //dead
        {
            if (numAlive === 3)
            {
                return score > 0 ? ImmigrationCell.RED : ImmigrationCell.BLUE;
            }
            return ImmigrationCell.DEAD;
        }

        //alive
        if (numAlive === 2 || numAlive === 3)
        {
            return center;
        }
        return ImmigrationCell.DEAD;
    }
    cells: CellType[] = [
        {
            value: ImmigrationCell.DEAD,
            tag: "Dead",
            color: "#222222"
        },
        {
            value: ImmigrationCell.RED,
            tag: "Red",
            color: "#cc4444"
        },
        {
            value: ImmigrationCell.BLUE,
            tag: "Blue",
            color: "#4444cc"
        }
    ];
    name: string = "Immigration";
    description: string = CONWAY_DESCRIPTION;
    neighbors: NeighborTemplate = MOOR_NEIGBORS;
}