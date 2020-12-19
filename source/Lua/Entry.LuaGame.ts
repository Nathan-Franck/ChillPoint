import { renderer } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { ffi, Refs } from "./Util.FFI";
import { Graphics2D } from "./Util.Graphics2D";
import { Scripting } from "./Util.Scripting";
import { Vec2 } from "./Util.VecMath";

let frames = 0;
const sheets = Graphics2D.load_sheets(<const>{
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
            { x: 16, y: 0, w: 8, h: 4 },
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
    }
});
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


    for (let i = 0; i < count; i++) {
        Graphics2D.draw_sprite({
            ...Graphics2D.loop_animation({ sheet: sheets["seagull.bmp"], animation: "fly" }),
            position: positions[i]
        });
    }
    Graphics2D.draw_sprite({
        ...Graphics2D.loop_animation({ sheet: sheets["feather.bmp"], animation: "float" }),
        position: mouse_position
    });
    Graphics2D.draw_sprite({
        sheet: sheets["player.bmp"],
        sprite: 0,
        position: player.position
    });

    sdl.SDL_RenderPresent(renderer);

    frames++;
    //if (frames % 500 == 0) { print((time - start_time) / frames); }
}
