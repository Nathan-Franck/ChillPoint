import { renderer, window } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { SDL_IMG, sdl_img } from "./Lib.SDL.Img";
import { External, ffi } from "./Util.FFI";
import { Scripting } from "./Util.Scripting";

function load_texture(path: string) {
    const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
    const loaded_surface = sdl_img.IMG_Load(full_path);
    const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
    return new_texture;
}

let frames = 0;
let time = os.clock();
const vecs = [];
function map<T, U>(arr: T[], callback: (arg: T) => U): U[] {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result[i] = callback(arr[i]);
    }
    return result;
}
const sheets = {
    "snowball": [{
        start: [0, 0],
        dimensions: [16, 16]
    }],
    "seagull": [{
        start: [0, 0],
        dimensions: [24, 24]
    }, {
        start: [24, 0],
        dimensions: [24, 24]
    }, {
        start: [48, 0],
        dimensions: [24, 24]
    }, {
        start: [72, 0],
        dimensions: [24, 24]
    }],
    "feather": [{
        start: [0, 0],
        dimensions: [4, 8]
    }, {
        start: [8, 0],
        dimensions: [4, 8]
    }, {
        start: [16, 0],
        dimensions: [4, 8]
    }],
    "snow_particle": [{
        start: [0, 0],
        dimensions: [5, 5]
    }],
} as const;
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
    const screen_rect = ffi.new("SDL_Rect", [
        x, y,
        ...sprite.dimensions
    ]);
    const sprite_rect = ffi.new("SDL_Rect", [
        ...sprite.start,
        ...sprite.dimensions,
    ]);
    sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
}
const count = 0; for (let i = 0; i < count; i++) {
    vecs[i] = { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 };
}
const event = ffi.new("SDL_Event"); const intPtr = ffi.typeof("int[1]");
let mouse_position = { x: 0, y: 0 };
while (true) {
    while (sdl.SDL_PollEvent(event) > 0) {
        switch (event.type) {
            case SDL.SDL_KEYDOWN:
                print("Key press detected"); break;
            case SDL.SDL_KEYUP:
                print("Key release detected"); break;
            case SDL.SDL_MOUSEMOTION:
                const mouse_x = intPtr(); const mouse_y = intPtr();
                sdl.SDL_GetMouseState(mouse_x, mouse_y); mouse_position = { x: mouse_x[0], y: mouse_y[0] };
                break;
            default: break;
        }
    }
    sdl.SDL_RenderClear(renderer);
    for (let i = 0; i < count; i++) { draw_item(vecs[i]); }
    draw_item(mouse_position);
    sdl.SDL_RenderPresent(renderer);
    frames++; if (frames % 500 == 0) { print((os.clock() - time) / frames * 1000); }
}