// Can't use tuples because of JSON incompatibility.
type Model = {
    texture_size: number[]; // [width, height]
    elements: ModelElement[];
};

type ModelElement = {
    name?: string;
    from: number[]; // [x, y, z]
    to: number[]; // [x, y, z]
    faces: {
        [direction in Direction]?: {
            uv: number[]; // [x1, y1, x2, y2]
            texture: string;
        };
    };
}

type Direction = "up" | "down" | "north" | "south" | "east" | "west";