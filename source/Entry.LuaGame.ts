import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

const curve: SmoothCurve = { x_range: [0.0, 1.0], y_values: [0.0, 1.0, 0.0] };

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
    print(val / 10, SmoothCurve.sample(curve, val / 10));
});

const new_vec = Vec2.add([1, 2], [3, 4]);

print("Hey! HO!");

const ffi = require("ffi") as {
    cdef: (this: void, header: string) => void,
    load: <T>(this: void, file: string) => T,
};
ffi.cdef(`
    int SDL_Init(int flags);
    typedef enum
    {
        SDL_WINDOW_FULLSCREEN = 0x00000001,         /**< fullscreen window */
        SDL_WINDOW_OPENGL = 0x00000002,             /**< window usable with OpenGL context */
        SDL_WINDOW_SHOWN = 0x00000004,              /**< window is visible */
        SDL_WINDOW_HIDDEN = 0x00000008,             /**< window is not visible */
        SDL_WINDOW_BORDERLESS = 0x00000010,         /**< no window decoration */
        SDL_WINDOW_RESIZABLE = 0x00000020,          /**< window can be resized */
        SDL_WINDOW_MINIMIZED = 0x00000040,          /**< window is minimized */
        SDL_WINDOW_MAXIMIZED = 0x00000080,          /**< window is maximized */
        SDL_WINDOW_INPUT_GRABBED = 0x00000100,      /**< window has grabbed input focus */
        SDL_WINDOW_INPUT_FOCUS = 0x00000200,        /**< window has input focus */
        SDL_WINDOW_MOUSE_FOCUS = 0x00000400,        /**< window has mouse focus */
        SDL_WINDOW_FULLSCREEN_DESKTOP = ( SDL_WINDOW_FULLSCREEN | 0x00001000 ),
        SDL_WINDOW_FOREIGN = 0x00000800,            /**< window not created by SDL */
        SDL_WINDOW_ALLOW_HIGHDPI = 0x00002000,      /**< window should be created in high-DPI mode if supported.
                                                         On macOS NSHighResolutionCapable must be set true in the
                                                         application's Info.plist for this to have any effect. */
        SDL_WINDOW_MOUSE_CAPTURE = 0x00004000,      /**< window has mouse captured (unrelated to INPUT_GRABBED) */
        SDL_WINDOW_ALWAYS_ON_TOP = 0x00008000,      /**< window should always be above others */
        SDL_WINDOW_SKIP_TASKBAR  = 0x00010000,      /**< window should not be added to the taskbar */
        SDL_WINDOW_UTILITY       = 0x00020000,      /**< window should be treated as a utility window */
        SDL_WINDOW_TOOLTIP       = 0x00040000,      /**< window should be treated as a tooltip */
        SDL_WINDOW_POPUP_MENU    = 0x00080000,      /**< window should be treated as a popup menu */
        SDL_WINDOW_VULKAN        = 0x10000000,       /**< window usable for Vulkan surface */
        SDL_INIT_VIDEO = 0x00000020,
        SDL_WINDOWPOS_UNDEFINED = 0x1FFF0000,
    } SDL_WindowFlags;
    extern void* SDL_CreateWindow(const char *title, int x, int y, int w, int h, int flags);
`)


const sdl2 = ffi.load<{
    SDL_INIT_VIDEO: 0x00000020;
    SDL_WINDOWPOS_UNDEFINED: 0x1FFF0000,
    SDL_WINDOW_SHOWN: 0x00000004,
    SDL_Init: (this: void, arg: number) => void;
    SDL_CreateWindow: (this: void, title: string, x: number, y: number, w: number, h: number, flags: number) => {}
}>("SDL2");

const screen_width = 640;
const screen_height = 480;
sdl2.SDL_Init(sdl2.SDL_INIT_VIDEO);
const window = sdl2.SDL_CreateWindow( "SDL Tutorial", sdl2.SDL_WINDOWPOS_UNDEFINED, sdl2.SDL_WINDOWPOS_UNDEFINED, screen_width, screen_height, sdl2.SDL_WINDOW_SHOWN );


