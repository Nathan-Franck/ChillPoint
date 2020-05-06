import { Vec3, Vec2 } from "./Util.Shaders";

export namespace VecMath {
    export function scale(vec: Vec2, rate: number): Vec2 {
        const out = {
            x: vec.x * rate,
            y: vec.y * rate,
        };
        return out;
    }
    export function add(vecA: Vec2, vecB: Vec2): Vec2 {
        const out = {
            x: vecA.x + vecB.x,
            y: vecA.y + vecB.y,
        };
        return out;
    }
    export function subtract(vecA: Vec2, vecB: Vec2): Vec2 {
        const out = {
            x: vecA.x - vecB.x,
            y: vecA.y - vecB.y,
        };
        return out;
    }
    export function magnitude(vec: Vec2): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    }
    export function sqrMagnitude(vec: Vec2): number {
        return vec.x * vec.x + vec.y * vec.y;
    }
    export function dot(vecA: Vec2, vecB: Vec2): number {
        return vecA.x * vecB.x + vecA.y * vecB.y;
    }
    export function negative(vec: Vec2): Vec2 {
        return {
            x: -vec.x,
            y: -vec.y,
        };
    }
    export function to_index(vec: Vec2, width: number): number {
        return vec.x + vec.y * width;
    }
    export function to_index_bounded(vec: Vec2, width: number): number | null {
        if (vec.x < 0 || vec.x >= width || vec.y < 0 || vec.y >= width) {
            return null;
        }
        const index = to_index(vec, width);
        if (index < 0 || index >= width * width) {
            console.log("What");
        }
        return index;
    }
}
export namespace Vec3Math {
    export function scale(vec: Vec3, rate: number): Vec3 {
        return {
            x: vec.x * rate,
            y: vec.y * rate,
            z: vec.z * rate,
        };
    }
    export function subtract(vecA: Vec3, vecB: Vec3): Vec3 {
        return {
            x: vecA.x - vecB.x,
            y: vecA.y - vecB.y,
            z: vecA.z - vecB.z,
        };
    }
    export function magnitude(vec: Vec3): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }
    export function normalize(vec: Vec3): Vec3 {
        const length = magnitude(vec);
        return scale(vec, 1 / (length == 0 ? 1 : length));
    }
    export function dot(vecA: Vec3, vecB: Vec3): number {
        return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
    }
    export function cross(vecA: Vec3, vecB: Vec3) {
        return {
            x: vecA.y * vecB.z - vecA.z * vecB.y,
            y: vecA.z * vecB.x - vecA.x * vecB.z,
            z: vecA.x * vecB.y - vecA.y * vecB.x,
        };
    }
}
