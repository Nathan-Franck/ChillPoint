import { SmoothCurve } from "./Util.SmoothCurve";

const curve: SmoothCurve = { x_range: [0.0, 1.0], y_values: [0.0, 1.0, 0.0] };

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
    console.log(val / 10, SmoothCurve.sample(curve, val / 10));
});