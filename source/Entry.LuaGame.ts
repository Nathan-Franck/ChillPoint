import { SmoothCurve } from "./Util.SmoothCurve";

const curve: SmoothCurve = { x_range: [0, 1], y_values: [0, 1, 0] }

console.log(SmoothCurve.sample(curve, 0.5));