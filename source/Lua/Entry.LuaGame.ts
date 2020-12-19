import { renderer, window } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { External, FFI, ffi, Refs } from "./Util.FFI";
import { Scripting } from "./Util.Scripting";
import { Vec2 } from "./Util.VecMath";

function load_texture(path: string) {
    const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
    const loaded_surface = sdl_img.IMG_Load(full_path)!;
    sdl.SDL_SetColorKey(loaded_surface, 1, sdl.SDL_MapRGB(loaded_surface.format, 255, 0, 255));
    const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
    return new_texture;
}
function load_sheets<T extends { [key: string]: { sprites: any, animations?: any } }>(sheet_inputs: T) {
    return Scripting.reduce_keys<T, {
        [key in keyof T]: T[key] & { texture: ReturnType<typeof load_texture> }
    }>(sheet_inputs, (sheets, image_path) => ({
        ...sheets,
        [image_path]: {
            texture: load_texture(image_path as string),
            sprites: sheet_inputs[image_path].sprites,
            animations: sheet_inputs[image_path].animations,
        },
    }));
}

let frames = 0;
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
    "player.bmp": {
        sprites: [
            { x: 0, y: 0, w: 27, h: 48 },
        ],
    },
    "feather.bmp": {
        sprites: [
            { x: 0, y: 0, w: 8, h: 4 },
            { x: 8, y: 0, w: 8, h: 4 },
            { x: 16, y: 0, w: 8, h: 4 }
        ],
        animations: {
            float: [0, 0, 0, 1, 2, 2, 2, 1],
        }
    },
    "snowball.bmp": {
        sprites: [{ x: 0, y: 0, w: 16, h: 16 }],
    },
    "snow_particle.bmp": {
        sprites: [{ x: 0, y: 0, w: 5, h: 5 }],
    },
    "background.bmp": {
        sprites: [{ x: 0, y: 0, w: 800, h: 600 }],
    },
};
const sheets = load_sheets(sheet_inputs);
type Sprite = { x: number, y: number, w: number, h: number };
type Sheet = {
    readonly sprites: readonly Sprite[],
    readonly texture: External<"SDL_Texture*"> | null,
    readonly animations?: { readonly [key: string]: readonly number[] }
};
function draw_item(item: { sheet: Sheet, sprite: number, position: { x: number, y: number } }) {
    const sheet = item.sheet;
    const sprite = sheet.sprites[item.sprite];
    const { x, y } = item.position;
    const screen_rect = ffi.new("SDL_Rect", { x, y, w: sprite.w * 2, h: sprite.h * 2 });
    const sprite_rect = ffi.new("SDL_Rect", sprite);
    sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
}

// ⚙ Aspects of the game tweakable for design or player comfort
const settings = {
    controls: { left: SDL.SDL_SCANCODE_LEFT, right: SDL.SDL_SCANCODE_RIGHT, fire: SDL.SDL_SCANCODE_SPACE },
} as const;

const player_stats = {
    speed: 0.25,
} as const;

// 🏃‍♀️ Main player character state, should remain fairly constant throughout gameplay
const player = {
    input: {
        left: 0,
        right: 0,
        fire: 0,
    },
    position: { x: 400, y: 300 },
    last_fire_time: 0,
    jump_velocity: undefined as Vec2 | undefined
};

const count = 5;
const positions = [];
for (let i = 0; i < count; i++) {
    positions[i] = { x: Math.random() * 800, y: Math.random() * 600 };
}

const event = ffi.new("SDL_Event");
let time = sdl.SDL_GetTicks();
const start_time = time;
let mouse_position = { x: 0, y: 0 };
while (true) {
    const next_time = sdl.SDL_GetTicks();
    const delta_time = next_time - time;
    time = sdl.SDL_GetTicks();
    while (sdl.SDL_PollEvent(event) > 0) {
        switch (event.type) {
            case SDL.SDL_KEYDOWN: {
                Scripting.get_keys(settings.controls).forEach(key => {
                    if (event.key.keysym.mod != settings.controls[key]) return;
                    player.input[key] = time;
                });
                break;
            }
            case SDL.SDL_KEYUP:
                Scripting.get_keys(settings.controls).forEach(key => {
                    if (event.key.keysym.mod != settings.controls[key]) return;
                    player.input[key] = 0;
                });
                break;
            case SDL.SDL_MOUSEMOTION: {
                const refs = Refs.create({ x: "int", y: "int" });
                const button_state = SDL.SDL_GetMouseState(refs);
                mouse_position = Refs.result(refs);
                break;
            }
            default: break;
        }
    }
    sdl.SDL_RenderClear(renderer);
    sdl.SDL_RenderCopy(renderer, sheets["background.bmp"].texture, null, null);

    // 🏃‍♀️ Basic player movement
    {
        function sign(value: number) {
            if (value == 0) return 0;
            return value / Math.abs(value);
        }
        const direction = sign(player.input.right - player.input.left);
        player.position.x += direction * delta_time * player_stats.speed;
    }

    function loop_animation<T extends Required<Pick<Sheet, "animations">>>(params: { sheet: T, animation: keyof T["animations"] }) {
        const sheet = params.sheet;
        const { animations } = sheet;
        type Anim = typeof animations;
        const animation = animations?.[params.animation as keyof Anim];
        const animation_index = Math.floor(time / 100) % animation.length;
        return {
            ...params,
            sprite: animation[animation_index],
        }
    }

    for (let i = 0; i < count; i++) {
        draw_item({
            ...loop_animation({ sheet: sheets["seagull.bmp"], animation: "fly" }),
            position: positions[i]
        });
    }
    draw_item({
        ...loop_animation({ sheet: sheets["feather.bmp"], animation: "float" }),
        position: mouse_position
    });
    draw_item({
        sheet: sheets["player.bmp"],
        sprite: 0,
        position: player.position
    });

    sdl.SDL_RenderPresent(renderer);

    frames++;
    //if (frames % 500 == 0) { print((time - start_time) / frames); }
}
