import { RuleSet, CellType, SurroundArray } from "./Ruleset.js";

export enum BriansBrainCell
{
    DEAD = 0,
    ALIVE = 1,
    DYING = 2
}


export class BriansBrainRuleSet implements RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number
    {
        switch (center)
        {
            case BriansBrainCell.ALIVE:
                return BriansBrainCell.DYING;

            case BriansBrainCell.DYING:
                return BriansBrainCell.DEAD;

            case BriansBrainCell.DEAD:

                const numAlive = surround.reduce((sum, neighbor) => (neighbor == BriansBrainCell.ALIVE) ? sum + 1 : sum, 0);

                return (numAlive == 2)
                    ? BriansBrainCell.ALIVE
                    : BriansBrainCell.DEAD;
        }
    }
    cells: CellType[] = [
        {
            value: BriansBrainCell.DEAD,
            tag: "Dead",
            color: "#222222"
        },
        {
            value: BriansBrainCell.ALIVE,
            tag: "Alive",
            color: "#4444cc"
        },
        {
            value: BriansBrainCell.DYING,
            tag: "Dying",
            color: "#cc4444"
        }
    ];
    name: string = "Brian's Brain";
    description: string = "no description yet";

}