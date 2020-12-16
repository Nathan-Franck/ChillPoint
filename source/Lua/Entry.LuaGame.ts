import { renderer, window } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { ffi, Refs } from "./Util.FFI";
import { Scripting } from "./Util.Scripting";

function load_texture(path: string) {
    const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
    const loaded_surface = sdl_img.IMG_Load(full_path);
    const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
    return new_texture;
}

let frames = 0;
let time = os.clock();
const positions = [];
const sheet_inputs = {
    "seagull.bmp": [
        { x: 0, y: 0, w: 24, h: 24 },
        { x: 24, y: 0, w: 24, h: 24 },
        { x: 48, y: 0, w: 24, h: 24 },
        { x: 72, y: 0, w: 24, h: 24 }],
    "feather.bmp": [
        { x: 0, y: 0, w: 4, h: 8 },
        { x: 8, y: 0, w: 4, h: 8 },
        { x: 16, y: 0, w: 4, h: 8 }],
    "snowball.bmp": [{ x: 0, y: 0, w: 16, h: 16 }],
    "snow_particle.bmp": [{ x: 0, y: 0, w: 5, h: 5 }],
};

export namespace Heap {
    export type Type<T> = { value: T, time: number, nodes: [Type<T>, Type<T>] } | undefined;
    export function insert<T>(heap: Type<T>, value: T, time: number) {
        let current = heap;
        while(current != undefined) {
            
        }
    }
}
// export class Heap<T> {

//     constructor(private heap: {}) {

//     }
//     add(time: number, value: T) {

//     }
// }

// namespace EventLoop {
//     type Promise<T> = { then: <U>(result: T) => U };
//     const time_queue = 
//     export function Wait(seconds: number): Promise<void> {
//         return 
//     }
//     export function promise<T extends Promise<any>>(resolve: (result: T) => void) {

//     }
// }

// const prom = new Promise<"hi">((resolve) => { resolve("hi") }).
//     then(result => new Promise<"hihi">((resolve) => resolve(<const>`${result}hi`))).
//     then(result => print(result));

const sheets = Scripting.transform_object(sheet_inputs, (sprites, image_path: `${string}.bmp`) => ({
    texture: load_texture(image_path),
    sprites
}));
const sheet = sheets["seagull.bmp"];
const sprite = sheet.sprites[3];
function draw_item(item: { x: number, y: number }) {
    const { x, y } = item;
    const screen_rect = ffi.new("SDL_Rect", { x, y, w: sprite.w, h: sprite.h });
    const sprite_rect = ffi.new("SDL_Rect", sprite);
    sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
}
const count = 5000;
for (let i = 0; i < count; i++) {
    positions[i] = { x: Math.random() * 800, y: Math.random() * 600 };
}
const event = ffi.new("SDL_Event");
let mouse_position = { x: 0, y: 0 };
while (true) {
    while (sdl.SDL_PollEvent(event) > 0) {
        switch (event.type) {
            case SDL.SDL_KEYDOWN:
                print("Key press detected"); break;
            case SDL.SDL_KEYUP:
                print("Key release detected"); break;
            case SDL.SDL_MOUSEMOTION:
                const refs = Refs.create({ x: "int", y: "int" });
                const button_state = SDL.SDL_GetMouseState(refs);
                mouse_position = Refs.result(refs);
                break;
            default: break;
        }
    }
    sdl.SDL_RenderClear(renderer);

    for (let i = 0; i < count; i++) { draw_item(positions[i]); }
    draw_item(mouse_position);

    sdl.SDL_RenderPresent(renderer);

    frames++;
    if (frames % 500 == 0) { print((os.clock() - time) / frames * 1000); }
}
