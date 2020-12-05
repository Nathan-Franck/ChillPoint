import { sdl, SDL } from "./Lib.SDL";
import { SDL_IMG, sdl_img } from "./Lib.SDL.Img";
import { ForeignFunction } from "./Util.FFI";

sdl_img.IMG_Init(SDL_IMG.IMG_INIT_PNG);
const screen_surface = sdl.SDL_GetWindowSurface(window);
const path = ForeignFunction.ffi.string(sdl.SDL_GetBasePath()) + "ball.bmp";
const loaded_surface = sdl_img.IMG_Load(path);
const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
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
function draw_item(item: { x: number, y: number }) {
    const { x, y } = item;
    const rect = ForeignFunction.ffi.new("SDL_Rect", [x, y, 32, 32]);
    sdl.SDL_RenderCopy(renderer, new_texture, null, rect);
}
const count = 0; for (let i = 0; i < count; i++) {
    vecs[i] = { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 };
}
const event = ForeignFunction.ffi.new("SDL_Event"); const intPtr = ForeignFunction.ffi.typeof("int[1]");
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