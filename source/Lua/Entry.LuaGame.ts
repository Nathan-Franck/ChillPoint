import { renderer } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { External, ffi, FFI } from "./Util.FFI";
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
const sheets = {
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
