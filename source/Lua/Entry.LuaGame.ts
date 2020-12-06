import { renderer, window } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { External, ffi, FFI } from "./Util.FFI";
import { Scripting } from "./Util.Scripting";
import { ExcludeFromTuple, ExtractFromTuple } from "./Util.Tuple";

function load_texture(path: string) {
    const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
    const loaded_surface = sdl_img.IMG_Load(full_path);
    const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
    return new_texture;
}

let frames = 0;
let time = os.clock();
const positions = [];
const sheets = <const>{
    "seagull": [
        { x: 0, y: 0, w: 24, h: 24 },
        { x: 24, y: 0, w: 24, h: 24 },
        { x: 48, y: 0, w: 24, h: 24 },
        { x: 72, y: 0, w: 24, h: 24 }],
    "feather": [
        { x: 0, y: 0, w: 4, h: 8 },
        { x: 8, y: 0, w: 4, h: 8 },
        { x: 16, y: 0, w: 4, h: 8 }],
    "snowball": [{ x: 0, y: 0, w: 16, h: 16 }],
    "snow_particle": [{ x: 0, y: 0, w: 5, h: 5 }],
};

const sprites = Scripting.get_keys(sheets).
    reduce((sprites, key) => {
        return {
            ...sprites,
            [key]: {
                texture: load_texture(`${key}.bmp`),
                sprites: sheets[key],
            }
        };
    }, {} as { [key in keyof typeof sheets]: {
        texture: External<"SDL_Texture*">,
        sprites: typeof sheets[key],
    } });
function draw_item(item: { x: number, y: number }) {
    const { x, y } = item;
    const sheet = sprites.seagull;
    const sprite = sheet.sprites[3];
    const screen_rect = ffi.new("SDL_Rect", { ...sprite, x, y });
    const sprite_rect = ffi.new("SDL_Rect", sprite);
    sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
}
const count = 0; for (let i = 0; i < count; i++) {
    positions[i] = { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 };
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
                type Cool<T extends (...args: any[]) => any, U extends keyof FFI.BaseTypeLookup> =
                    ExcludeFromTuple<Parameters<T>, External<`${U}*`>>;
                type PostCool<T extends (...args: any[]) => any, U extends keyof FFI.BaseTypeLookup, V = ExtractFromTuple<Parameters<T>, External<`${U}*`>>> =
                    Cool<T, U> extends any[] ?
                    (...args: Cool<T, U>) => {
                        [key in keyof V]:
                        key extends `${number}` ? FFI.BaseTypeLookup[U] : V[key]
                    } : never;

                type RetrieverBlueprint<T extends any[], K extends keyof FFI.BaseTypeLookup> = T extends [] ? [] :
                    T extends [infer H, ...infer R] ?
                    H extends External<`${K}*`> ? ["*", ...RetrieverBlueprint<R, K>] : [H, ...RetrieverBlueprint<R, K>] : T

                type RetrieverReturns<T extends any[], K extends keyof FFI.BaseTypeLookup> = T extends [] ? [] :
                    T extends [infer H, ...infer R] ?
                    H extends "*" ? [FFI.BaseTypeLookup[K], ...RetrieverReturns<R, K>] : [...RetrieverReturns<R, K>] : T

                function Esgetit<
                    V extends RetrieverBlueprint<Parameters<T>, K>,
                    K extends keyof FFI.BaseTypeLookup,
                    T extends (...args: any[]) => any
                >(func: T, return_key: K, args: V): RetrieverReturns<V, K>  {
                    return {} as RetrieverReturns<V, K>
                }

                const whats_this = Esgetit(sdl.SDL_GetMouseState, "int", ["*", "*"]);
                whats_this.map(huh => huh);

                const whats_that = Esgetit(sdl.SDL_GetWindowMinimumSize, "int", [window, "*", "*"]);

                // const cool = {} as PostCool<typeof sdl.SDL_GL_GetAttribute, "int">;
                type Temp = typeof sdl.SDL_GetWindowMinimumSize;
                type WhatYouIs = ExtractFromTuple<Parameters<typeof sdl.SDL_GetWindowMinimumSize>, External<`${"int"}*`>>
                type ExcludeThisWhat = Exclude<Parameters<Temp>[number], External<"int*">>;
                type ButThisWorksHuh = External<"SDL_Window*">;
                type AndThis = ExcludeFromTuple<Parameters<Temp>, External<"SDL_Window*">>;
                const cool = {} as PostCool<Temp, "int">;
                const [
                    waaaa,
                    waaaa2,
                    waaaa3,
                ] = cool(0);
                const hey = waaaa + 1;


                const mouse_x = FFI.new_array("int[1]");
                const mouse_y = FFI.new_array("int[1]");
                sdl.SDL_GetMouseState(mouse_x, mouse_y);
                mouse_position = { x: mouse_x[0], y: mouse_y[0] };
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
