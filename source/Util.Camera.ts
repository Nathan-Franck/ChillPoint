import { Binds } from "./Util.ShaderBuilder";

export namespace Camera {
	export const environment = {
		includes: `
				vec2 camera_transform(vec3 world_position) {
					vec2 ortho_position =
						world_position.x * vec2(1.0, 0.5) +
						world_position.y * vec2(-1.0, 0.5) +
						world_position.z * vec2(0.0, 1.0);
					return vec2((
						ortho_position -
						camera_position
					) / camera_size);
				}
			`,
		globals: {
			"camera_size": { type: "uniform", unit: "vec2", count: 1 },
			"camera_position": { type: "uniform", unit: "vec2", count: 1 },
		},
	} as const;

	export type Transform = Binds<typeof environment["globals"]>;
}