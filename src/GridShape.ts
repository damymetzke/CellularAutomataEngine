export enum TileShape
{
    TRIANGLE,
    SQUARE,
    HEXAGON
}

export enum SquareGridShape
{
    PLANE,
    STRIP,
    TORUS
}

export type GridShape = {
    tile: TileShape.SQUARE;
    shape: SquareGridShape;
};