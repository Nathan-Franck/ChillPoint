

export type SmoothCurve = {
	y_values: number[],
	x_range: [number, number],
}

export namespace SmoothCurve {
	export function sample(curve: SmoothCurve, time: number) {
		const smooth_index =
			(time - curve.x_range[0]) /
			(curve.x_range[1] - curve.x_range[0]) *
			(curve.y_values.length - 1);
		const index = Math.floor(smooth_index);
		const current = Math.min(Math.max(index, 0), curve.y_values.length - 1);
		const next = Math.min(Math.max(index + 1, 0), curve.y_values.length - 1);
		const lerp = smooth_index - index;
		return curve.y_values[current] * (1 - lerp) + curve.y_values[next] * lerp;
	}
}