import { Vec2 } from "./Util.VecMath";

export namespace Weebles {

    export type State = {
        readonly simulants: readonly {
            position: Vec2,
        }[],
    }

    export function run() {
        let state: State = {
            simulants: new Array(10).map(() => ({
                position: [
                    Math.random(),
                    Math.random(),
                ],
            })),
        };

        requestAnimationFrame(() => {
            state = {
                ...state,
                simulants: state.simulants.map(simulant => {
                    return {
                        ...simulant,
                        position: [
                            simulant.position[0],
                            simulant.position[1],
                        ],
                    }
                }),
            };
        });
    }
}