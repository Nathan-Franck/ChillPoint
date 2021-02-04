import { SDL, sdl } from "./Lib.SDL";

sdl.SDL_Init(SDL.SDL_INIT_VIDEO);
export const window = sdl.SDL_CreateWindow(
    "SDL Tutorial",
    SDL.SDL_WINDOWPOS_UNDEFINED,
    SDL.SDL_WINDOWPOS_UNDEFINED,
    800,
    600,
    0, //SDL.SDL_WINDOW_FULLSCREEN, //
)!;

export const renderer = sdl.SDL_CreateRenderer(window, -1, SDL.SDL_RENDERER_ACCELERATED & SDL.SDL_RENDERER_PRESENTVSYNC )!;
sdl.SDL_SetRenderDrawColor(renderer, 0xFF, 0, 0xFF, 0xFF);

function sleep(time: number) {
  if (time > 0) os.execute(`ping -n ${ time + 1 } localhost > NUL`)
}

const routine_example = coroutine.create((starting_thing) => {
    print(`Hello from another thread! ${starting_thing}`);
    const [result_from_main] = coroutine.yield("result from thread");
    print(`Hello from another thread! ${result_from_main}`);
});

coroutine.resume(routine_example, "hello!");
coroutine.resume(routine_example, "hey_there!");