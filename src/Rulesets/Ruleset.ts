export type NeighborTemplate = [ number, number ][];

export type SurroundArray = [ number, number, number, number, number, number, number, number ];

export type CellType =
    {
        value: number;
        tag: string;
        color: string;
    };

export const MOOR_NEIGBORS: NeighborTemplate = [
    [ -1, -1 ], [ +0, -1 ], [ +1, -1 ],
    [ -1, +0 ], /*center*/, [ +1, +0 ],
    [ -1, +1 ], [ +0, +1 ], [ +1, +1 ]

];

export const NEUMANN_NEIGHBORS = [
    /*-1, -1*/, [ +0, -1 ], /*+1, -1*/,
    [ -1, +0 ], /*+0, +0*/, [ +1, +0 ],
    /*-1, +1*/, [ +0, +1 ], /*+1, +1*/
];

export interface RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number;
    cells: CellType[];
    name: string;
    description: string;
    neighbors: NeighborTemplate;
}