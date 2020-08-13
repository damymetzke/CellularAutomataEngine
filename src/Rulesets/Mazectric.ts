import { RuleSet, CellType, SurroundArray, NeighborTemplate, MOOR_NEIGBORS } from "./Ruleset.js";

const CONWAY_DESCRIPTION = `
no description yet...
`;

export enum MazectricCell
{
    PATH = 0,
    WALL = 1
}

export class MazectricRuleSet implements RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number
    {
        const numAlive = surround.reduce((total, cell) => cell === MazectricCell.PATH ? total : total + 1);

        if (center === MazectricCell.PATH) //dead
        {
            if (numAlive === 3)
            {
                return MazectricCell.WALL;
            }
            return MazectricCell.PATH;
        }

        //alive
        if (numAlive >= 1 && numAlive < 5)
        {
            return MazectricCell.WALL;
        }
        return MazectricCell.PATH;
    }
    cells: CellType[] = [
        {
            value: MazectricCell.PATH,
            tag: "Path",
            color: "#222222"
        },
        {
            value: MazectricCell.WALL,
            tag: "Wall",
            color: "#22aa22"
        }
    ];
    name: string = "Mazectric";
    description: string = CONWAY_DESCRIPTION;
    neighbors: NeighborTemplate = MOOR_NEIGBORS;
}