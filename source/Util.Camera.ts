import { Const, Vec2 } from "./Util.Shaders"

export namespace Camera {
    export type Type = {
        includes: string;
        globals: {
            camera_size: Const<Vec2>;
            camera_position: Const<Vec2>;
            x_vector: Const<Vec2>;
            y_vector: Const<Vec2>;
            z_vector: Const<Vec2>;
        };
    }
    export const default_camera: Type = {
        includes: `
                vec2 camera_transform(vec3 world_position) {
                    vec2 ortho_position =
                        world_position.x * x_vector +
                        world_position.y * y_vector +
                        world_position.z * z_vector;
                    return vec2((
                        ortho_position -
                        camera_position
                    ) / camera_size);
                }
            `,
        globals: {
            "camera_size": {
                type: "const",
                x: 12 * window.innerWidth / window.innerHeight,
                y: 12,
            },
            "camera_position": { type: "const", x: 0, y: 0 },
            "x_vector": { type: "const", x: 1, y: 0.5 },
            "y_vector": { type: "const", x: -1, y: 0.5 },
            "z_vector": { type: "const", x: 0, y: 1 },
        },
    }
}