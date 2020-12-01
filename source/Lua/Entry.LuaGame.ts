import { sdl, SDL } from "./Lib.SDL";
import { SDL_IMG, sdl_img } from "./Lib.SDL.Img";
import { ForeignFunction } from "./Util.FFI";

import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

const curve: SmoothCurve = { x_range: [0.0, 1.0], y_values: [0.0, 1.0, 0.0] };

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
    print(val / 10, SmoothCurve.sample(curve, val / 10));
});

const new_vec = Vec2.add([1, 2], [3, 4]);

print("Hey! HO!");

export const ffi = require("ffi") as {
    cdef: (this: void, header: string) => void,
    load: <T>(this: void, file: string) => T,
    string: (string: any) => string,
};

const screen_width = 640;
const screen_height = 480;
sdl.SDL_Init(SDL.SDL_INIT_VIDEO);
const window = sdl.SDL_CreateWindow(
    "SDL Tutorial",
    SDL.SDL_WINDOWPOS_UNDEFINED,
    SDL.SDL_WINDOWPOS_UNDEFINED,
    screen_width,
    screen_height,
    SDL.SDL_WINDOW_SHOWN,
);
const renderer = sdl.SDL_CreateRenderer(window, -1, SDL.SDL_RENDERER_ACCELERATED);
sdl.SDL_SetRenderDrawColor(renderer, 0xFF, 0, 0xFF, 0xFF);

sdl_img.IMG_Init(SDL_IMG.IMG_INIT_PNG);
const screen_surface = sdl.SDL_GetWindowSurface(window);

const path = ForeignFunction.ffi.string(sdl.SDL_GetBasePath()) + "ball.bmp";
const loaded_surface = sdl_img.IMG_Load(path);
//const converted_surface = sdl.SDL_ConvertSurface( loaded_surface, (screen_surface as any).format, 0 );
const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
// sdl_img.SDL_FreeSurface(loaded_surface);
print(loaded_surface);

type SoA<T> = {
    [key in keyof T]: T[key][]
};

type AoS<T> = T[];


type Thing ={
    a: string,
    b: number,
}

type SoA_Thing = SoA<Thing>;
type AoS_Thing = AoS<Thing>;


ForeignFunction.ffi.cdef(`
    typedef struct SDL_Rect
    {
        int x, y;
        int w, h;
    } SDL_Rect;
`);

const items = [];
for (let i = 0; i < 1000; i ++) {
    
    const rotation = 0 * 3.14 / 360 + i;
    const distance = 50 + Math.cos(i) * 100;
    items.push({ x: 240 + Math.cos(rotation) * distance, y: 240 + Math.sin(rotation) * distance });
}

//While application is running
let frames = 0;
let time = os.clock();
while(true)
{
    //Clear screen
    sdl.SDL_RenderClear( renderer );

    //Render texture to screen
    for (let i = 0; i < items.length; i ++) {
        const item = items[i];
        const rect = ForeignFunction.ffi.new("SDL_Rect", [item.x, item.y, 32, 32]);
        sdl.SDL_RenderCopy( renderer, new_texture, null, rect );
    }

    //Update screen
    sdl.SDL_RenderPresent( renderer );

    frames ++;
    if (frames % 100 == 0) {
        print(frames / (os.clock() - time));
    }
}