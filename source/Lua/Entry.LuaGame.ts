import { renderer, window } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { ffi, Refs } from "./Util.FFI";
import { Scripting } from "./Util.Scripting";

function load_texture(path: string) {
    const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
    const loaded_surface = sdl_img.IMG_Load(full_path)!;
    sdl.SDL_SetColorKey(loaded_surface, 1, sdl.SDL_MapRGB(loaded_surface.format, 255, 0, 255));
    const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
    return new_texture;
}

let frames = 0;
const positions = [];
const sheet_inputs = <const>{
    "seagull.bmp": {
        sprites: [
            { x: 0, y: 0, w: 24, h: 24 },
            { x: 24, y: 0, w: 24, h: 24 },
            { x: 48, y: 0, w: 24, h: 24 },
            { x: 72, y: 0, w: 24, h: 24 }
        ],
        animations: {
            fly: [0, 2, 1, 2],
        }
    },
    "feather.bmp": {
        sprites: [
            { x: 0, y: 0, w: 4, h: 8 },
            { x: 8, y: 0, w: 4, h: 8 },
            { x: 16, y: 0, w: 4, h: 8 }
        ],
        animations: {}
    },
    "snowball.bmp": {
        sprites: [{ x: 0, y: 0, w: 16, h: 16 }],
        animations: {}
    },
    "snow_particle.bmp": {
        sprites: [{ x: 0, y: 0, w: 5, h: 5 }],
        animations: {}
    },
    "background.bmp": {
        sprites: [{ x: 0, y: 0, w: 800, h: 600 }],
        animations: {}
    },
};

const sheets =  Scripting.get_keys(sheet_inputs).
    reduce((sheets, image_path) => ({
        ...sheets,
        [image_path]: {
            texture: load_texture(image_path),
            sprites: sheet_inputs[image_path].sprites,
            animations: sheet_inputs[image_path].animations,
        },
    }), {} as {
        [key in keyof typeof sheet_inputs]: typeof sheet_inputs[key] & { texture: ReturnType<typeof load_texture> }
    });
const sheet = sheets["seagull.bmp"];
const sh2eet = sheets["background.bmp"];
sh2eet.animations
let time = sdl.SDL_GetTicks();
function draw_item(item: { x: number, y: number }) {
    const animation = sheet.animations.fly;
    const animation_index = Math.floor(time / 100) % animation.length;
    const index = animation[animation_index];
    const sprite = sheet.sprites[index];
    const { x, y } = item;
    const screen_rect = ffi.new("SDL_Rect", { x, y, w: sprite.w * 2, h: sprite.h * 2 });
    const sprite_rect = ffi.new("SDL_Rect", sprite);
    sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
}
const count = 5;
for (let i = 0; i < count; i++) {
    positions[i] = { x: Math.random() * 800, y: Math.random() * 600 };
}
const event = ffi.new("SDL_Event");
let mouse_position = { x: 0, y: 0 };
while (true) {
    time = sdl.SDL_GetTicks();
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
    sdl.SDL_RenderCopy(renderer, sheets["background.bmp"].texture, null, null);

    for (let i = 0; i < count; i++) { draw_item(positions[i]); }
    draw_item(mouse_position);

    sdl.SDL_RenderPresent(renderer);

    frames++;
    //if (frames % 500 == 0) { print((os.clock() - time) / frames * 1000); }
}
