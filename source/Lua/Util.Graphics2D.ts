import { sdl } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { External, ffi } from "./Util.FFI";
import { Scripting, TupleKeys } from "./Util.Scripting";

export namespace Graphics2D {

    type List<T> = { readonly [key: number]: T }

    function load_texture(renderer: External<"SDL_Renderer*">, path: string) {
        const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
        const loaded_surface = sdl_img.IMG_Load(full_path)!;
        sdl.SDL_SetColorKey(loaded_surface, 1, sdl.SDL_MapRGB(loaded_surface.format, 255, 0, 255));
        const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
        return new_texture;
    }

    type Sprite = { x: number, y: number, w: number, h: number };

    export type Sheet<SpriteKeys extends number = number> = {
        readonly sprites: { readonly [key in SpriteKeys]: Sprite } & ReadonlyArray<Sprite>,
        readonly texture: External<"SDL_Texture*"> | null,
        readonly animations?: { readonly [key: string]: ReadonlyArray<SpriteKeys> }
    };

    export function validate_sheet<SpriteKeys extends number>(sheet: Required<Pick<Graphics2D.Sheet<SpriteKeys>, "sprites" | "animations">>) {
        return sheet;
    }

    export function load_sheets<T extends { [key: string]: Pick<Sheet, "animations" | "sprites"> }>(
        renderer: External<"SDL_Renderer*">,
        sheet_inputs: T
    ) {
        return Scripting.reduce_keys<T, {
            [key in keyof T]: T[key] & { texture: ReturnType<typeof load_texture> }
        }>(sheet_inputs, (sheets, image_path) => ({
            ...sheets,
            [image_path]: {
                texture: load_texture(renderer, image_path as string),
                sprites: sheet_inputs[image_path].sprites,
                animations: sheet_inputs[image_path].animations,
            },
        }));
    }

    export function draw_sprite(renderer: External<"SDL_Renderer*">, params: { sheet: Sheet, sprite: number, position: { x: number, y: number } }) {
        const sheet = params.sheet;
        const sprite = sheet.sprites[params.sprite];
        const { x, y } = params.position;
        const screen_rect = ffi.new("SDL_Rect", { x, y, w: sprite.w * 2, h: sprite.h * 2 });
        const sprite_rect = ffi.new("SDL_Rect", sprite);
        sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
    }

    export function loop_animation<T extends Required<Sheet>>(params: { time: number, sheet: T, animation: keyof T["animations"] }) {
        const { sheet } = params;
        const { animations } = sheet;
        type Anim = typeof animations;
        const selected_animation = animations?.[params.animation as keyof Anim];
        const animation_index = Math.floor(params.time / 100) % selected_animation.length;
        return {
            sheet,
            sprite: selected_animation[animation_index],
        }
    }
}