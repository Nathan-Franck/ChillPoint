import { Vec2 } from "./Util.VecMath";

export namespace Indexing {
    export function to_index(vec: Vec2, width: number): number {
        return vec[0] + vec[1] * width;
    }
    export function to_index_bounded(vec: Vec2, width: number): number | null {
        if (vec[0] < 0 || vec[0] >= width || vec[1] < 0 || vec[1] >= width) {
            return null;
        }
        const index = to_index(vec, width);
        if (index < 0 || index >= width * width) {
            console.log("What");
        }
        return index;
    }
}