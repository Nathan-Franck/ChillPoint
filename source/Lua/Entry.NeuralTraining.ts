import { SDL, sdl } from "./Lib.SDL";
import { External } from "./Util.FFI";
import { renderer } from "./Game.Init";
import { ffi } from "./Util.FFI";

ffi.load("tensorflow");

// 🧪 Generate simple images to classify using simple custom neural network
const dimension = 16;
const colors = 3;
const pixels = [];
for (let y = 0; y < dimension; y++) {
    for (let x = 0; x < dimension; x++) {
        const index = (x + y * dimension) * colors;
        const distance_from_centre = Math.sqrt(Math.pow(x - dimension / 2, 2) + Math.pow(y - dimension / 2, 2));
        if (distance_from_centre > dimension / 2) {
            pixels[index + 0] = 0;
            pixels[index + 1] = 0;
            pixels[index + 2] = 0;
        } else {
            pixels[index + 0] = 255;
            pixels[index + 1] = 255;
            pixels[index + 2] = 255;
        }
    }
}


// sdl.SDL_RenderClear(renderer);
// sdl.SDL_RenderPresent(renderer);

sdl.SDL_RenderClear(renderer);
for (let y = 0; y < dimension; y++) {
    for (let x = 0; x < dimension; x++) {
        const index = (x + y * dimension) * colors;
        set_pixel_easy(renderer, x, y, pixels[index + 0], pixels[index + 1], pixels[index + 2]);
    }
}
sdl.SDL_RenderPresent(renderer);

export function set_pixel_easy(renderer: External<"SDL_Renderer*">, x: number, y: number, r: number, g: number, b: number) {
    sdl.SDL_SetRenderDrawColor(renderer, r, g, b, 255);
    sdl.SDL_RenderDrawPoint(renderer, x, y);
}

sdl.SDL_Delay(3000);