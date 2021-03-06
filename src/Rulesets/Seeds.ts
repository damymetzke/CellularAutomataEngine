import { RuleSet, CellType, SurroundArray, MOOR_NEIGBORS, NeighborTemplate } from "../Ruleset.js";

export enum SeedsCell
{
    DEAD = 0,
    ALIVE = 1
}


export class SeedsRuleSet implements RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number
    {
        switch (center)
        {
            case SeedsCell.ALIVE:
                return SeedsCell.DEAD;

            case SeedsCell.DEAD:

                const numAlive = surround.reduce((sum, neighbor) => (neighbor == SeedsCell.ALIVE) ? sum + 1 : sum, 0);

                return (numAlive == 2)
                    ? SeedsCell.ALIVE
                    : SeedsCell.DEAD;
        }
    }
    cells: CellType[] = [
        {
            value: SeedsCell.DEAD,
            tag: "Dead",
            color: "#222222"
        },
        {
            value: SeedsCell.ALIVE,
            tag: "Alive",
            color: "#44cc44"
        }
    ];
    categorization: string = "popular.seeds";
    name: string = "Seeds";
    description: string = "No description yet";
    neighbors: NeighborTemplate = MOOR_NEIGBORS;
}