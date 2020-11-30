import { sdl, SDL } from "./Lib.SDL";
import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

const curve: SmoothCurve = { x_range: [0.0, 1.0], y_values: [0.0, 1.0, 0.0] };

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
    print(val / 10, SmoothCurve.sample(curve, val / 10));
});

const new_vec = Vec2.add([1, 2], [3, 4]);

print("Hey! HO!");

const screen_width = 640;
const screen_height = 480;
sdl.SDL_Init({ flags: SDL.SDL_INIT_VIDEO });
const window = sdl.SDL_CreateWindow({
    title: "SDL Tutorial",
    x: SDL.SDL_WINDOWPOS_UNDEFINED,
    y: SDL.SDL_WINDOWPOS_UNDEFINED,
    w: screen_width,
    h: screen_height,
    flags: SDL.SDL_WINDOW_SHOWN,
});

sdl.SDL_Delay({ ms: 2000 });

// const screen_width = 640;
// const screen_height = 480;
// sdl.SDL_Init(SDL.SDL_INIT_VIDEO);
// const window = sdl.SDL_CreateWindow(
//     "SDL Tutorial",
//     SDL.SDL_WINDOWPOS_UNDEFINED,
//     SDL.SDL_WINDOWPOS_UNDEFINED,
//     screen_width,
//     screen_height,
//     SDL.SDL_WINDOW_SHOWN,
// );

// sdl.SDL_Delay(2000);


print("done");