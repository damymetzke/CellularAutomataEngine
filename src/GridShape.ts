export enum TileShape
{
    TRIANGLE,
    SQUARE,
    HEXAGON
}

export enum SquareGridShape
{
    PLANE = 0,
    STRIP = 1,
    TORUS = 2
}

export type GridShape = {
    tile: TileShape.SQUARE;
    shape: SquareGridShape;
};