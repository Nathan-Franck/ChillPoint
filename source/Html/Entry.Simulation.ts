import { Scripting } from "./Util.Scripting";
import { Vec2, Vec3, Quat } from "./Util.VecMath";

export namespace Simulation {

    export type ExamplerThinger = {
        position: [number, number],
        velocity: [number, number],
        speed: number,
    }

    export type Simulant = {
        [key: string]: number | number[],
    }

    export function generate_simulation<T extends Simulant>(proto: T) {
        type Simulation = {
            data: Float32Array,
        }
        type Behaviour = <In extends (keyof T)[], Out extends (keyof T)[]>(input: In) => { [key in Out[number]]: T[key] };

        const stats = (() => {
            const keys = Object.keys(proto);
            const lengths = keys.map(key => {
                const member = proto[key];
                return typeof member == "number" ? 1 : member.length
            });
            let index = 0;
            const offsets = lengths.map(length => {
                let offset = index;
                index += length;
                return offset;
            });
            const size = index;
            return { keys, lengths, offsets, size } as const;
        })();

        const sim: Simulation = {
            data: new Float32Array(1000),
        };

        return {
            new_behaviour: (keys: ReadonlyArray<keyof T>) => {
                const key: keyof T = 
                return sim.data.subarray(index);
            }
        }
    }

    export function run_example() {
        const simulation = generate_simulation<ExamplerThinger>({ position: [0, 0], velocity: [0, 0], speed: 0 });
        simulation.new_behaviour(["velocity"], (input) => {
            return Vec2.len(input);
        });
    }

    export function execute() {
        requestAnimationFrame(execute);
    }
}

export namespace StructuralSimulation {

    export type Board = {
        position: Vec3,
        velocity: Vec3,
        rotation: Quat,
        bend: Vec2,
        wobble: Vec2,
    }
    
    export type Stats = {
        dimensions: Vec3,
        rigidity: Vec2,
        dampening: Vec2,
    }

    export type Attachment = {
        board: Board,
        location: number,
    }
    export type Bond = [Attachment, Attachment];
    export type Collision = [Attachment, Attachment];


}

Simulation.run_example();