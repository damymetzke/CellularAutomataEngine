import { RuleSet, CellType, SurroundArray, NeighborTemplate, MOOR_NEIGBORS } from "../Ruleset.js";

const CONWAY_DESCRIPTION = `
no description yet...
`;

export enum MazeCell
{
    PATH = 0,
    WALL = 1
}

export class MazeRuleSet implements RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number
    {
        const numAlive = surround.reduce((total, cell) => cell === MazeCell.PATH ? total : total + 1);

        if (center === MazeCell.PATH) //dead
        {
            if (numAlive === 3)
            {
                return MazeCell.WALL;
            }
            return MazeCell.PATH;
        }

        //alive
        if (numAlive >= 1 && numAlive < 6)
        {
            return MazeCell.WALL;
        }
        return MazeCell.PATH;
    }
    cells: CellType[] = [
        {
            value: MazeCell.PATH,
            tag: "Path",
            color: "#222222"
        },
        {
            value: MazeCell.WALL,
            tag: "Wall",
            color: "#22aa22"
        }
    ];
    categorization: string = "popular.maze";
    name: string = "Maze";
    description: string = CONWAY_DESCRIPTION;
    neighbors: NeighborTemplate = MOOR_NEIGBORS;
}