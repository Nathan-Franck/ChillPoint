import { renderer } from "./Game.Init";
import { sdl, SDL } from "./Lib.SDL";
import { ffi, Refs } from "./Util.FFI";
import { Graphics2D } from "./Util.Graphics2D";
import { Scripting } from "./Util.Scripting";
import { JSON } from "./JSON";

let frames = 0;

// ⚙ Aspects of the game tweakable for design or player comfort
const settings = <const>{
    controls: { left: SDL.SDL_SCANCODE_LEFT, right: SDL.SDL_SCANCODE_RIGHT, fire: SDL.SDL_SCANCODE_SPACE },
};

const player_stats = <const>{
    speed: 0.25,
};

const sheets = Graphics2D.load_sheets(renderer, <const>{
    "seagull.bmp": {
        sprites: {
            0: { x: 0, y: 0, w: 24, h: 24 },
            1: { x: 24, y: 0, w: 24, h: 24 },
            2: { x: 48, y: 0, w: 24, h: 24 },
            3: { x: 72, y: 0, w: 24, h: 24 }
        },
        animations: {
            fly: [0, 0, 2, 1, 1, 2],
            die: [3],
        },
    },
    "player.bmp": {
        sprites: {
            0: { x: 0, y: 0, w: 27, h: 48 },
        },
    },
    "feather.bmp": {
        sprites: {
            0: { x: 0, y: 0, w: 8, h: 4 },
            1: { x: 8, y: 0, w: 8, h: 4 },
            2: { x: 16, y: 0, w: 8, h: 4 },
        },
        animations: { float: [0, 0, 1, 2, 2, 1] }
    },
    "snowball.bmp": {
        sprites: { 0: { x: 0, y: 0, w: 16, h: 16 } },
    },
    "snow_particle.bmp": {
        sprites: { 0: { x: 0, y: 0, w: 5, h: 5 } },
    },
    "background.bmp": {
        sprites: { 0: { x: 0, y: 0, w: 800, h: 600 } },
    },
    "eye.bmp": {
        sprites: { 0: { x: 0, y: 0, w: 4, h: 4 } },
    },
    "mouth.bmp": {
        sprites: { 0: { x: 0, y: 0, w: 9, h: 4 } },
    },
});


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

const count = 500;
const positions = [];
for (let i = 0; i < count; i++) {
    positions[i] = { x: Math.random() * 800, y: Math.random() * 600 };
}

print(JSON.stringify({ hey: "ho", what: 123 }));
print(JSON.stringify(["ha", 123]));

const face_position = { x: 400, y: 340 };
type Vec2 = { x: number, y: number };
const add = (a: Vec2, b: Vec2) => ({ x: a.x + b.x, y: a.y + b.y });
const face = <const>[
    {
        sprite: "eye.bmp",
        position: { x: -10, y: -8 },
    },
    {
        sprite: "eye.bmp",
        position: { x: 9, y: -4 },
    },
    {
        sprite: "mouth.bmp",
        position: { x: -4, y: 5 },
    }
];

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
                for (const key of Scripting.get_keys(settings.controls)) {
                    if (event.key.keysym.mod != settings.controls[key]) continue;
                    player.input[key] = time;
                };
                break;
            }
            case SDL.SDL_KEYUP:
                for (const key of Scripting.get_keys(settings.controls)) {
                    if (event.key.keysym.mod != settings.controls[key]) continue;
                    player.input[key] = 0;
                };
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
        const direction = sign(player.input.left - player.input.right);
        player.position.x += direction * player_stats.speed * delta_time;
    }

    // 🪶 Lots of feathers
    {
        const { sheet, sprite } = Graphics2D.loop_animation({ time, sheet: sheets["seagull.bmp"], animation: "fly" });
        for (let i = 0; i < count; i++) {
            Graphics2D.draw_sprite(renderer, {
                sheet,
                sprite,
                position: positions[i],
            });
        }
    }
    // 🕊 Bird follows mouse
    const { sheet, sprite } = Graphics2D.loop_animation({ time, sheet: sheets["feather.bmp"], animation: "float" });
    Graphics2D.draw_sprite(renderer, {
        sheet,
        sprite,
        position: mouse_position,
    });

    // ⏭ Cursor controlled player
    Graphics2D.draw_sprite(renderer, {
        sheet: sheets["player.bmp"],
        sprite: 0,
        position: player.position,
    });

    face.forEach(item => {
        Graphics2D.draw_sprite(renderer, {
            sheet: sheets[item.sprite],
            sprite: 0,
            position: add(face_position, item.position),
        })
    });

    sdl.SDL_RenderPresent(renderer);

    frames++;
    if (frames % 100 == 0) { print(`${(time - start_time) / frames}`); }
}
