import { SDL, sdl } from "./Lib.SDL";
import { ffi } from "./Util.FFI";

ffi.cdef(`
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

sdl.SDL_Init(SDL.SDL_INIT_VIDEO);
export const window = sdl.SDL_CreateWindow(
    "SDL Tutorial",
    SDL.SDL_WINDOWPOS_UNDEFINED,
    SDL.SDL_WINDOWPOS_UNDEFINED,
    800,
    600,
    0, //SDL.SDL_WINDOW_FULLSCREEN
)!;
export const renderer = sdl.SDL_CreateRenderer(window, -1, SDL.SDL_RENDERER_ACCELERATED | SDL.SDL_RENDERER_PRESENTVSYNC);
sdl.SDL_SetRenderDrawColor(renderer, 0xFF, 0, 0xFF, 0xFF);