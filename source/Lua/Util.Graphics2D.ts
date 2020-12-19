import { renderer } from "./Game.Init";
import { sdl } from "./Lib.SDL";
import { sdl_img } from "./Lib.SDL.Img";
import { ffi } from "./Util.FFI";

export namespace Graphics2D {
    function load_texture(path: string) {
        const full_path = ffi.string(sdl.SDL_GetBasePath()) + path;
        const loaded_surface = sdl_img.IMG_Load(full_path)!;
        sdl.SDL_SetColorKey(loaded_surface, 1, sdl.SDL_MapRGB(loaded_surface.format, 255, 0, 255));
        const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
        return new_texture;
    }
    type Sprite = { x: number, y: number, w: number, h: number };
    type Sheet = {
        readonly sprites: readonly Sprite[],
        readonly texture: External<"SDL_Texture*"> | null,
        readonly animations?: { readonly [key: string]: readonly number[] }
    };

    export function load_sheets<T extends { [key: string]: Pick<Sheet, "animations" | "sprites"> }>(sheet_inputs: T) {
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

    export function draw_sprite(item: { sheet: Sheet, sprite: number, position: { x: number, y: number } }) {
        const sheet = item.sheet;
        const sprite = sheet.sprites[item.sprite];
        const { x, y } = item.position;
        const screen_rect = ffi.new("SDL_Rect", { x, y, w: sprite.w * 2, h: sprite.h * 2 });
        const sprite_rect = ffi.new("SDL_Rect", sprite);
        sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect);
    }

    export function loop_animation<T extends Required<Pick<Sheet, "animations">>>(params: { sheet: T, animation: keyof T["animations"] }) {
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
}