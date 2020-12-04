import { sdl, SDL } from "./Lib.SDL";
import { SDL_IMG, sdl_img } from "./Lib.SDL.Img";
import { ForeignFunction } from "./Util.FFI";
import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";
const curve: SmoothCurve = { x_range: [0.0, 1.0], y_values: [0.0, 1.0, 0.0] };
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
    print(val / 10, SmoothCurve.sample(curve, val / 10));
});
const new_vec = Vec2.add([1, 2], [3, 4]);
print("Hey! HO!");
export const ffi = require("ffi") as {
    cdef: (this: void, header: string) => void,
    load: <T>(this: void, file: string) => T,
    string: (string: any) => string,
};
sdl.SDL_Init(SDL.SDL_INIT_VIDEO);
const window = sdl.SDL_CreateWindow(
    "SDL Tutorial",
    SDL.SDL_WINDOWPOS_UNDEFINED,
    SDL.SDL_WINDOWPOS_UNDEFINED,
    800,
    600,
    SDL.SDL_WINDOW_FULLSCREEN,
);
const renderer = sdl.SDL_CreateRenderer(window, -1, SDL.SDL_RENDERER_ACCELERATED | SDL.SDL_RENDERER_PRESENTVSYNC);
sdl.SDL_SetRenderDrawColor(renderer, 0xFF, 0, 0xFF, 0xFF);
sdl_img.IMG_Init(SDL_IMG.IMG_INIT_PNG);
const screen_surface = sdl.SDL_GetWindowSurface(window);
const path = ForeignFunction.ffi.string(sdl.SDL_GetBasePath()) + "ball.bmp";
const loaded_surface = sdl_img.IMG_Load(path);
const new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface);
print(loaded_surface);
type SoA<T> = {
    [key in keyof T]: T[key][]
};
type AoS<T> = T[];
type Thing = {
    a: string,
    b: number,
};
type SoA_Thing = SoA<Thing>;
type AoS_Thing = AoS<Thing>;
ForeignFunction.ffi.cdef(`
    typedef struct SDL_Rect
    {
        int x, y;
        int w, h;
    } SDL_Rect;

    typedef struct SDL_Keysym
    {
        int scancode;      /**< SDL physical key code - see ::SDL_Scancode for details */
        int sym;            /**< SDL virtual key code - see ::SDL_Keycode for details */
        int mod;                 /**< current key modifiers */
        int unused;
    } SDL_Keysym;

    typedef struct{
        int scancode;
        int sym;
        int mod;
        int unicode;
    } SDL_keysym;

    typedef struct{
        int type;
        int state;
        SDL_keysym keysym;
    } SDL_KeyboardEvent;

    /**
     *  \brief Mouse motion event structure (event.motion.*)
     */
    typedef struct SDL_MouseMotionEvent
    {
        int type;        /**< ::SDL_MOUSEMOTION */
        int timestamp;   /**< In milliseconds, populated using SDL_GetTicks() */
        int windowID;    /**< The window with mouse focus, if any */
        int which;       /**< The mouse instance id, or SDL_TOUCH_MOUSEID */
        int state;       /**< The current button state */
        int x;           /**< X coordinate, relative to window */
        int y;           /**< Y coordinate, relative to window */
        int xrel;        /**< The relative motion in the X direction */
        int yrel;        /**< The relative motion in the Y direction */
    } SDL_MouseMotionEvent;

    /**
     *  \brief Mouse button event structure (event.button.*)
     */
    typedef struct SDL_MouseButtonEvent
    {
        int type;        /**< ::SDL_MOUSEBUTTONDOWN or ::SDL_MOUSEBUTTONUP */
        int timestamp;   /**< In milliseconds, populated using SDL_GetTicks() */
        int windowID;    /**< The window with mouse focus, if any */
        int which;       /**< The mouse instance id, or SDL_TOUCH_MOUSEID */
        int button;       /**< The mouse button index */
        int state;        /**< ::SDL_PRESSED or ::SDL_RELEASED */
        int clicks;       /**< 1 for single-click, 2 for double-click, etc. */
        int padding1;
        int x;           /**< X coordinate, relative to window */
        int y;           /**< Y coordinate, relative to window */
    } SDL_MouseButtonEvent;

    typedef union SDL_Event
    {
        int type;                    /**< Event type, shared with all events */
        // SDL_CommonEvent common;         /**< Common event data */
        // SDL_DisplayEvent display;       /**< Display event data */
        // SDL_WindowEvent window;         /**< Window event data */
        SDL_KeyboardEvent key;          /**< Keyboard event data */
        // SDL_TextEditingEvent edit;      /**< Text editing event data */
        // SDL_TextInputEvent text;        /**< Text input event data */
        SDL_MouseMotionEvent motion;    /**< Mouse motion event data */
        SDL_MouseButtonEvent button;    /**< Mouse button event data */
        // SDL_MouseWheelEvent wheel;      /**< Mouse wheel event data */
        // SDL_JoyAxisEvent jaxis;         /**< Joystick axis event data */
        // SDL_JoyBallEvent jball;         /**< Joystick ball event data */
        // SDL_JoyHatEvent jhat;           /**< Joystick hat event data */
        // SDL_JoyButtonEvent jbutton;     /**< Joystick button event data */
        // SDL_JoyDeviceEvent jdevice;     /**< Joystick device change event data */
        // SDL_ControllerAxisEvent caxis;      /**< Game Controller axis event data */
        // SDL_ControllerButtonEvent cbutton;  /**< Game Controller button event data */
        // SDL_ControllerDeviceEvent cdevice;  /**< Game Controller device event data */
        // SDL_AudioDeviceEvent adevice;   /**< Audio device event data */
        // SDL_SensorEvent sensor;         /**< Sensor event data */
        // SDL_QuitEvent quit;             /**< Quit request event data */
        // SDL_UserEvent user;             /**< Custom event data */
        // SDL_SysWMEvent syswm;           /**< System dependent window event data */
        // SDL_TouchFingerEvent tfinger;   /**< Touch finger event data */
        // SDL_MultiGestureEvent mgesture; /**< Gesture event data */
        // SDL_DollarGestureEvent dgesture; /**< Gesture event data */
        // SDL_DropEvent drop;             /**< Drag and drop event data */

        /* This is necessary for ABI compatibility between Visual C++ and GCC
        Visual C++ will respect the push pack pragma and use 52 bytes for
        this structure, and GCC will use the alignment of the largest datatype
        within the union, which is 8 bytes.

        So... we'll add padding to force the size to be 56 bytes for both.
        */
        int padding[56];
    } SDL_Event;
`);
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
    const rotation = frames * 3.14 / 360 + i; const distance = 50 + Math.cos(i) * 100;
    vecs[i] = { x: Math.cos(rotation) * distance, y: Math.sin(rotation) * distance };
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