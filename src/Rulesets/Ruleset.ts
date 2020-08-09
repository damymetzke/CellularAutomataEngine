export type SurroundArray = [ number, number, number, number, number, number, number, number ];

export type CellType =
    {
        value: number;
        tag: string;
        color: string;
    };

export interface RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number;
    cells: CellType[];
    name: string;
    description: string;
}