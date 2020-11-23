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

function load_library<Types, Constants>(args: {
    file_name: string,
    simplified_header: string,
    values: Constants,
    types: Types,
}): { types: Types, values: Constants } {
    
    ffi.cdef(args.simplified_header);
    return {
        types: ffi.load<Types>(args.file_name),
        values: args.values,
    };
}


const { types: sdl2_t, values: sdl2_v } = load_library({
    file_name: "SDL2",
    simplified_header: `
        int SDL_Init(int flags);
        extern void* SDL_CreateWindow(const char *title, int x, int y, int w, int h, int flags);
    `,
    types: {} as {
        SDL_Init: (this: void, arg: number) => void;
        SDL_CreateWindow: (this: void, title: string, x: number, y: number, w: number, h: number, flags: number) => {}
    },
    values: {
        /**< fullscreen window */
        SDL_WINDOW_FULLSCREEN: 0x00000001,       
        /**< window usable with OpenGL context */  
        SDL_WINDOW_OPENGL: 0x00000002,             
        /**< window is visible */
        SDL_WINDOW_SHOWN: 0x00000004,
        /**< window is not visible */
        SDL_WINDOW_HIDDEN: 0x00000008,          
           /**< no window decoration */   
        SDL_WINDOW_BORDERLESS: 0x00000010,     
            /**< window can be resized */ 
        SDL_WINDOW_RESIZABLE: 0x00000020,      
            /**< window is minimized */
        SDL_WINDOW_MINIMIZED: 0x00000040,      
            /**< window is maximized */
        SDL_WINDOW_MAXIMIZED: 0x00000080,      
        /**< window has grabbed input focus */
        SDL_WINDOW_INPUT_GRABBED: 0x00000100,    
          /**< window has input focus */  
        SDL_WINDOW_INPUT_FOCUS: 0x00000200,      
          /**< window has mouse focus */
        SDL_WINDOW_MOUSE_FOCUS: 0x00000400,      
        SDL_WINDOW_FULLSCREEN_DESKTOP: ( 0x00000001 | 0x00001000 ),
        /**< window not created by SDL */
        SDL_WINDOW_FOREIGN: 0x00000800,      
        /**< window should be created in high-DPI mode if supported.**/
        SDL_WINDOW_MOUSE_CAPTURE: 0x00004000,      
        /**< window should always be above others */
        SDL_WINDOW_ALWAYS_ON_TOP: 0x00008000,      
        /**< window should not be added to the taskbar */
        SDL_WINDOW_SKIP_TASKBAR : 0x00010000,      
        /**< window should be treated as a utility window */
        SDL_WINDOW_UTILITY      : 0x00020000,      
        /**< window should be treated as a tooltip */
        SDL_WINDOW_TOOLTIP      : 0x00040000,      
        /**< window should be treated as a popup menu */
        SDL_WINDOW_POPUP_MENU   : 0x00080000,      
         /**< window usable for Vulkan surface */
        SDL_WINDOW_VULKAN       : 0x10000000,      
        SDL_INIT_VIDEO: 0x00000020,
        SDL_WINDOWPOS_UNDEFINED: 0x1FFF0000,
    } as const
});

const screen_width = 640;
const screen_height = 480;
sdl2_t.SDL_Init(sdl2_v.SDL_INIT_VIDEO);
const window = sdl2_t.SDL_CreateWindow( "SDL Tutorial", sdl2_v.SDL_WINDOWPOS_UNDEFINED, sdl2_v.SDL_WINDOWPOS_UNDEFINED, screen_width, screen_height, sdl2_v.SDL_WINDOW_SHOWN );


