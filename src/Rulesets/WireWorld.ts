import { RuleSet, CellType, SurroundArray, MOOR_NEIGBORS, NeighborTemplate } from "./Ruleset.js";

export enum WireWorldCell
{
    EMPTY = 0,
    ELECTRON_HEAD = 1,
    ELECTRON_TAIL = 2,
    CONDUCTOR = 3
}

export class WireWorldRuleSet implements RuleSet
{
    calculateStep(center: number, surround: SurroundArray): number
    {
        switch (center)
        {
            case WireWorldCell.EMPTY:
                return WireWorldCell.EMPTY;
            case WireWorldCell.ELECTRON_HEAD:
                return WireWorldCell.ELECTRON_TAIL;
            case WireWorldCell.ELECTRON_TAIL:
                return WireWorldCell.CONDUCTOR;
            case WireWorldCell.CONDUCTOR:

                const numElectronHeads = surround.reduce((total, cell) => (cell === WireWorldCell.ELECTRON_HEAD) ? total + 1 : total, 0);

                return (numElectronHeads === 1 || numElectronHeads === 2)
                    ? WireWorldCell.ELECTRON_HEAD
                    : WireWorldCell.CONDUCTOR;

                break;
        }
    }
    cells: CellType[] = [
        {
            value: WireWorldCell.EMPTY,
            tag: "Empty",
            color: "#222222"
        },
        {
            value: WireWorldCell.ELECTRON_HEAD,
            tag: "Electron Head",
            color: "#4444cc"
        },
        {
            value: WireWorldCell.ELECTRON_TAIL,
            tag: "Electron Tail",
            color: "#cc4444"
        },
        {
            value: WireWorldCell.CONDUCTOR,
            tag: "Conductor",
            color: "#cccc44"
        }
    ];
    name: string = "Wire World";
    description: string = "No description yet";
    neighbors: NeighborTemplate = MOOR_NEIGBORS;
}