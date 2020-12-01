import { ForeignFunction } from "./Util.FFI";

export const { types: sdl, values: SDL } = ForeignFunction.load_library({
    file_name: "SDL2",
    header: {
        /**
         *  This function initializes  the subsystems specified by \c flags
         */
        SDL_Init: {
            "output": "int",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  This function initializes specific SDL subsystems
         *
         *  Subsystem initialization is ref-counted, you must call
         *  SDL_QuitSubSystem() for each SDL_InitSubSystem() to correctly
         *  shutdown a subsystem manually (or call SDL_Quit() to force shutdown).
         *  If a subsystem is already loaded then this call will
         *  increase the ref-count and return.
         */
        SDL_InitSubSystem: {
            "output": "int",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  This function cleans up specific SDL subsystems
         */
        SDL_QuitSubSystem: {
            "output": "void",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  This function returns a mask of the specified subsystems which have
         *  previously been initialized.
         *
         *  If \c flags is 0, it returns a mask of all initialized subsystems.
         */
        SDL_WasInit: {
            "output": "Uint32",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  This function cleans up all initialized subsystems. You should
         *  call it upon all exit conditions.
         */
        SDL_Quit: {
            "output": "void",
            "params": []
        },
        /**
         * Get the number of milliseconds since the SDL library initialization.
         *
         * @remarks This value wraps if the program runs for more than ~49 days.
         */
        SDL_GetTicks: {
            "output": "Uint32",
            "params": []
        },
        /**
         * Get the current value of the high resolution counter
         */
        SDL_GetPerformanceCounter: {
            "output": "Uint64",
            "params": []
        },
        /**
         * Get the count per second of the high resolution counter
         */
        SDL_GetPerformanceFrequency: {
            "output": "Uint64",
            "params": []
        },
        /**
         * Wait a specified number of milliseconds before returning.
         */
        SDL_Delay: {
            "output": "void",
            "params": [
                {
                    "type": "Uint32",
                    "name": "ms"
                }
            ]
        },
        /**
         * Add a new timer to the pool of timers already running.
         *
         * @returns A timer ID, or 0 when an error occurs.
         */
        SDL_AddTimer: {
            "output": "SDL_TimerID",
            "params": [
                {
                    "type": "Uint32",
                    "name": "interval"
                },
                {
                    "type": "SDL_TimerCallback",
                    "name": "callback"
                },
                {
                    "type": "void*",
                    "name": "param"
                }
            ]
        },
        /**
         * Remove a timer knowing its ID.
         *
         * @returns A boolean value indicating success or failure.
         *
         * \warning It is not safe to remove a timer multiple times.
         */
        SDL_RemoveTimer: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_TimerID",
                    "name": "id"
                }
            ]
        },
        /**
         *  Get the number of video drivers compiled into SDL
         *
         *  @see SDL_GetVideoDriver()
         */
        SDL_GetNumVideoDrivers: {
            "output": "int",
            "params": []
        },
        /**
         *  Get the name of a built in video driver.
         *
         *  @remarks The video drivers are presented in the order in which they are
         *        normally checked during initialization.
         *
         *  @see SDL_GetNumVideoDrivers()
         */
        SDL_GetVideoDriver: {
            "output": "char*",
            "params": [
                {
                    "type": "int",
                    "name": "index"
                }
            ]
        },
        /**
         *  Initialize the video subsystem, optionally specifying a video driver.
         *
         *  @param driver_name Initialize a specific driver by name, or NULL for the
         *                     default video driver.
         *
         *  @returns 0 on success, -1 on error
         *
         *  This function initializes the video subsystem; setting up a connection
         *  to the window manager, etc, and determines the available display modes
         *  and pixel formats, but does not initialize a window or graphics mode.
         *
         *  @see SDL_VideoQuit()
         */
        SDL_VideoInit: {
            "output": "int",
            "params": [
                {
                    "type": "char*",
                    "name": "driver_name"
                }
            ]
        },
        /**
         *  Shuts down the video subsystem.
         *
         *  This function closes all windows, and restores the original video mode.
         *
         *  @see SDL_VideoInit()
         */
        SDL_VideoQuit: {
            "output": "void",
            "params": []
        },
        /**
         *  Returns the name of the currently initialized video driver.
         *
         *  @returns The name of the current video driver or NULL if no driver
         *          has been initialized
         *
         *  @see SDL_GetNumVideoDrivers()
         *  @see SDL_GetVideoDriver()
         */
        SDL_GetCurrentVideoDriver: {
            "output": "char*",
            "params": []
        },
        /**
         *  Returns the number of available video displays.
         *
         *  @see SDL_GetDisplayBounds()
         */
        SDL_GetNumVideoDisplays: {
            "output": "int",
            "params": []
        },
        /**
         *  Get the name of a display in UTF-8 encoding
         *
         *  @returns The name of a display, or NULL for an invalid display index.
         *
         *  @see SDL_GetNumVideoDisplays()
         */
        SDL_GetDisplayName: {
            "output": "char*",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                }
            ]
        },
        /**
         *  Get the desktop area represented by a display, with the primary
         *         display located at 0,0
         *
         *  @returns 0 on success, or -1 if the index is out of range.
         *
         *  @see SDL_GetNumVideoDisplays()
         */
        SDL_GetDisplayBounds: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Get the usable desktop area represented by a display, with the
         *         primary display located at 0,0
         *
         *  This is the same area as SDL_GetDisplayBounds() reports, but with portions
         *  reserved by the system removed. For example, on Mac OS X, this subtracts
         *  the area occupied by the menu bar and dock.
         *
         *  Setting a window to be fullscreen generally bypasses these unusable areas,
         *  so these are good guidelines for the maximum space available to a
         *  non-fullscreen window.
         *
         *  @returns 0 on success, or -1 if the index is out of range.
         *
         *  @see SDL_GetDisplayBounds()
         *  @see SDL_GetNumVideoDisplays()
         */
        SDL_GetDisplayUsableBounds: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Get the dots/pixels-per-inch for a display
         *
         *  @remarks Diagonal, horizontal and vertical DPI can all be optionally
         *        returned if the parameter is non-NULL.
         *
         *  @returns 0 on success, or -1 if no DPI information is available or the index is out of range.
         *
         *  @see SDL_GetNumVideoDisplays()
         */
        SDL_GetDisplayDPI: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "float*",
                    "name": "ddpi"
                },
                {
                    "type": "float*",
                    "name": "hdpi"
                },
                {
                    "type": "float*",
                    "name": "vdpi"
                }
            ]
        },
        /**
         *  Get the orientation of a display
         *
         *  @returns The orientation of the display, or SDL_ORIENTATION_UNKNOWN if it isn't available.
         *
         *  @see SDL_GetNumVideoDisplays()
         */
        SDL_GetDisplayOrientation: {
            "output": "SDL_DisplayOrientation",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                }
            ]
        },
        /**
         *  Returns the number of available display modes.
         *
         *  @see SDL_GetDisplayMode()
         */
        SDL_GetNumDisplayModes: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                }
            ]
        },
        /**
         *  Fill in information about a specific display mode.
         *
         *  @remarks The display modes are sorted in this priority:
         *        * bits per pixel -> more colors to fewer colors
         *        * width -> largest to smallest
         *        * height -> largest to smallest
         *        * refresh rate -> highest to lowest
         *
         *  @see SDL_GetNumDisplayModes()
         */
        SDL_GetDisplayMode: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "int",
                    "name": "modeIndex"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Fill in information about the desktop display mode.
         */
        SDL_GetDesktopDisplayMode: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Fill in information about the current display mode.
         */
        SDL_GetCurrentDisplayMode: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Get the closest match to the requested display mode.
         *
         *  @param displayIndex The index of display from which mode should be queried.
         *  @param mode The desired display mode
         *  @param closest A pointer to a display mode to be filled in with the closest
         *                 match of the available display modes.
         *
         *  @returns The passed in value \c closest, or NULL if no matching video mode
         *          was available.
         *
         *  The available display modes are scanned, and \c closest is filled in with the
         *  closest mode matching the requested mode and returned.  The mode format and
         *  refresh_rate default to the desktop mode if they are 0.  The modes are
         *  scanned with size being first priority, format being second priority, and
         *  finally checking the refresh_rate.  If all the available modes are too
         *  small, then NULL is returned.
         *
         *  @see SDL_GetNumDisplayModes()
         *  @see SDL_GetDisplayMode()
         */
        SDL_GetClosestDisplayMode: {
            "output": "SDL_DisplayMode*",
            "params": [
                {
                    "type": "int",
                    "name": "displayIndex"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "closest"
                }
            ]
        },
        /**
         *  Get the display index associated with a window.
         *
         *  @returns the display index of the display containing the center of the
         *          window, or -1 on error.
         */
        SDL_GetWindowDisplayIndex: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set the display mode used when a fullscreen window is visible.
         *
         *  By default the window's dimensions and the desktop format and refresh rate
         *  are used.
         *
         *  @param window The window for which the display mode should be set.
         *  @param mode The mode to use, or NULL for the default mode.
         *
         *  @returns 0 on success, or -1 if setting the display mode failed.
         *
         *  @see SDL_GetWindowDisplayMode()
         *  @see SDL_SetWindowFullscreen()
         */
        SDL_SetWindowDisplayMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Fill in information about the display mode used when a fullscreen
         *         window is visible.
         *
         *  @see SDL_SetWindowDisplayMode()
         *  @see SDL_SetWindowFullscreen()
         */
        SDL_GetWindowDisplayMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_DisplayMode*",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Get the pixel format associated with the window.
         */
        SDL_GetWindowPixelFormat: {
            "output": "Uint32",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Create a window with the specified position, dimensions, and flags.
         *
         *  @param title The title of the window, in UTF-8 encoding.
         *  @param x     The x position of the window, ::SDL_WINDOWPOS_CENTERED, or
         *               ::SDL_WINDOWPOS_UNDEFINED.
         *  @param y     The y position of the window, ::SDL_WINDOWPOS_CENTERED, or
         *               ::SDL_WINDOWPOS_UNDEFINED.
         *  @param w     The width of the window, in screen coordinates.
         *  @param h     The height of the window, in screen coordinates.
         *  @param flags The flags for the window, a mask of any of the following:
         *               ::SDL_WINDOW_FULLSCREEN,    ::SDL_WINDOW_OPENGL,
         *               ::SDL_WINDOW_HIDDEN,        ::SDL_WINDOW_BORDERLESS,
         *               ::SDL_WINDOW_RESIZABLE,     ::SDL_WINDOW_MAXIMIZED,
         *               ::SDL_WINDOW_MINIMIZED,     ::SDL_WINDOW_INPUT_GRABBED,
         *               ::SDL_WINDOW_ALLOW_HIGHDPI, ::SDL_WINDOW_VULKAN.
         *
         *  @returns The created window, or NULL if window creation failed.
         *
         *  If the window is created with the SDL_WINDOW_ALLOW_HIGHDPI flag, its size
         *  in pixels may differ from its size in screen coordinates on platforms with
         *  high-DPI support (e.g. iOS and Mac OS X). Use SDL_GetWindowSize() to query
         *  the client area's size in screen coordinates, and SDL_GL_GetDrawableSize(),
         *  SDL_Vulkan_GetDrawableSize(), or SDL_GetRendererOutputSize() to query the
         *  drawable size in pixels.
         *
         *  If the window is created with any of the SDL_WINDOW_OPENGL or
         *  SDL_WINDOW_VULKAN flags, then the corresponding LoadLibrary function
         *  (SDL_GL_LoadLibrary or SDL_Vulkan_LoadLibrary) is called and the
         *  corresponding UnloadLibrary function is called by SDL_DestroyWindow().
         *
         *  If SDL_WINDOW_VULKAN is specified and there isn't a working Vulkan driver,
         *  SDL_CreateWindow() will fail because SDL_Vulkan_LoadLibrary() will fail.
         *
         *  @remarks On non-Apple devices, SDL requires you to either not link to the
         *        Vulkan loader or link to a dynamic library version. This limitation
         *        may be removed in a future version of SDL.
         *
         *  @see SDL_DestroyWindow()
         *  @see SDL_GL_LoadLibrary()
         *  @see SDL_Vulkan_LoadLibrary()
         */
        SDL_CreateWindow: {
            "output": "SDL_Window*",
            "params": [
                {
                    "type": "char*",
                    "name": "title"
                },
                {
                    "type": "int",
                    "name": "x"
                },
                {
                    "type": "int",
                    "name": "y"
                },
                {
                    "type": "int",
                    "name": "w"
                },
                {
                    "type": "int",
                    "name": "h"
                },
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  Create an SDL window from an existing native window.
         *
         *  @param data A pointer to driver-dependent window creation data
         *
         *  @returns The created window, or NULL if window creation failed.
         *
         *  @see SDL_DestroyWindow()
         */
        SDL_CreateWindowFrom: {
            "output": "SDL_Window*",
            "params": [
                {
                    "type": "void*",
                    "name": "data"
                }
            ]
        },
        /**
         *  Get the numeric ID of a window, for logging purposes.
         */
        SDL_GetWindowID: {
            "output": "Uint32",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Get a window from a stored ID, or NULL if it doesn't exist.
         */
        SDL_GetWindowFromID: {
            "output": "SDL_Window*",
            "params": [
                {
                    "type": "Uint32",
                    "name": "id"
                }
            ]
        },
        /**
         *  Get the window flags.
         */
        SDL_GetWindowFlags: {
            "output": "Uint32",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set the title of a window, in UTF-8 format.
         *
         *  @see SDL_GetWindowTitle()
         */
        SDL_SetWindowTitle: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "char*",
                    "name": "title"
                }
            ]
        },
        /**
         *  Get the title of a window, in UTF-8 format.
         *
         *  @see SDL_SetWindowTitle()
         */
        SDL_GetWindowTitle: {
            "output": "char*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set the icon for a window.
         *
         *  @param window The window for which the icon should be set.
         *  @param icon The icon for the window.
         */
        SDL_SetWindowIcon: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "icon"
                }
            ]
        },
        /**
         *  Associate an arbitrary named pointer with a window.
         *
         *  @param window   The window to associate with the pointer.
         *  @param name     The name of the pointer.
         *  @param userdata The associated pointer.
         *
         *  @returns The previous value associated with 'name'
         *
         *  @remarks The name is case-sensitive.
         *
         *  @see SDL_GetWindowData()
         */
        SDL_SetWindowData: {
            "output": "void*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "char*",
                    "name": "name"
                },
                {
                    "type": "void*",
                    "name": "userdata"
                }
            ]
        },
        /**
         *  Retrieve the data pointer associated with a window.
         *
         *  @param window   The window to query.
         *  @param name     The name of the pointer.
         *
         *  @returns The value associated with 'name'
         *
         *  @see SDL_SetWindowData()
         */
        SDL_GetWindowData: {
            "output": "void*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "char*",
                    "name": "name"
                }
            ]
        },
        /**
         *  Set the position of a window.
         *
         *  @param window   The window to reposition.
         *  @param x        The x coordinate of the window in screen coordinates, or
         *                  ::SDL_WINDOWPOS_CENTERED or ::SDL_WINDOWPOS_UNDEFINED.
         *  @param y        The y coordinate of the window in screen coordinates, or
         *                  ::SDL_WINDOWPOS_CENTERED or ::SDL_WINDOWPOS_UNDEFINED.
         *
         *  @remarks The window coordinate origin is the upper left of the display.
         *
         *  @see SDL_GetWindowPosition()
         */
        SDL_SetWindowPosition: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int",
                    "name": "x"
                },
                {
                    "type": "int",
                    "name": "y"
                }
            ]
        },
        /**
         *  Get the position of a window.
         *
         *  @param window   The window to query.
         *  @param x        Pointer to variable for storing the x position, in screen
         *                  coordinates. May be NULL.
         *  @param y        Pointer to variable for storing the y position, in screen
         *                  coordinates. May be NULL.
         *
         *  @see SDL_SetWindowPosition()
         */
        SDL_GetWindowPosition: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "x"
                },
                {
                    "type": "int*",
                    "name": "y"
                }
            ]
        },
        /**
         *  Set the size of a window's client area.
         *
         *  @param window   The window to resize.
         *  @param w        The width of the window, in screen coordinates. Must be >0.
         *  @param h        The height of the window, in screen coordinates. Must be >0.
         *
         *  @remarks Fullscreen windows automatically match the size of the display mode,
         *        and you should use SDL_SetWindowDisplayMode() to change their size.
         *
         *  The window size in screen coordinates may differ from the size in pixels, if
         *  the window was created with SDL_WINDOW_ALLOW_HIGHDPI on a platform with
         *  high-dpi support (e.g. iOS or OS X). Use SDL_GL_GetDrawableSize() or
         *  SDL_GetRendererOutputSize() to get the real client area size in pixels.
         *
         *  @see SDL_GetWindowSize()
         *  @see SDL_SetWindowDisplayMode()
         */
        SDL_SetWindowSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int",
                    "name": "w"
                },
                {
                    "type": "int",
                    "name": "h"
                }
            ]
        },
        /**
         *  Get the size of a window's client area.
         *
         *  @param window   The window to query.
         *  @param w        Pointer to variable for storing the width, in screen
         *                  coordinates. May be NULL.
         *  @param h        Pointer to variable for storing the height, in screen
         *                  coordinates. May be NULL.
         *
         *  The window size in screen coordinates may differ from the size in pixels, if
         *  the window was created with SDL_WINDOW_ALLOW_HIGHDPI on a platform with
         *  high-dpi support (e.g. iOS or OS X). Use SDL_GL_GetDrawableSize() or
         *  SDL_GetRendererOutputSize() to get the real client area size in pixels.
         *
         *  @see SDL_SetWindowSize()
         */
        SDL_GetWindowSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Get the size of a window's borders (decorations) around the client area.
         *
         *  @param window The window to query.
         *  @param top Pointer to variable for storing the size of the top border. NULL is permitted.
         *  @param left Pointer to variable for storing the size of the left border. NULL is permitted.
         *  @param bottom Pointer to variable for storing the size of the bottom border. NULL is permitted.
         *  @param right Pointer to variable for storing the size of the right border. NULL is permitted.
         *
         *  @returns 0 on success, or -1 if getting this information is not supported.
         *
         *  @remarks if this function fails (returns -1), the size values will be
         *        initialized to 0, 0, 0, 0 (if a non-NULL pointer is provided), as
         *        if the window in question was borderless.
         */
        SDL_GetWindowBordersSize: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "top"
                },
                {
                    "type": "int*",
                    "name": "left"
                },
                {
                    "type": "int*",
                    "name": "bottom"
                },
                {
                    "type": "int*",
                    "name": "right"
                }
            ]
        },
        /**
         *  Set the minimum size of a window's client area.
         *
         *  @param window    The window to set a new minimum size.
         *  @param min_w     The minimum width of the window, must be >0
         *  @param min_h     The minimum height of the window, must be >0
         *
         *  @remarks You can't change the minimum size of a fullscreen window, it
         *        automatically matches the size of the display mode.
         *
         *  @see SDL_GetWindowMinimumSize()
         *  @see SDL_SetWindowMaximumSize()
         */
        SDL_SetWindowMinimumSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int",
                    "name": "min_w"
                },
                {
                    "type": "int",
                    "name": "min_h"
                }
            ]
        },
        /**
         *  Get the minimum size of a window's client area.
         *
         *  @param window   The window to query.
         *  @param w        Pointer to variable for storing the minimum width, may be NULL
         *  @param h        Pointer to variable for storing the minimum height, may be NULL
         *
         *  @see SDL_GetWindowMaximumSize()
         *  @see SDL_SetWindowMinimumSize()
         */
        SDL_GetWindowMinimumSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Set the maximum size of a window's client area.
         *
         *  @param window    The window to set a new maximum size.
         *  @param max_w     The maximum width of the window, must be >0
         *  @param max_h     The maximum height of the window, must be >0
         *
         *  @remarks You can't change the maximum size of a fullscreen window, it
         *        automatically matches the size of the display mode.
         *
         *  @see SDL_GetWindowMaximumSize()
         *  @see SDL_SetWindowMinimumSize()
         */
        SDL_SetWindowMaximumSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int",
                    "name": "max_w"
                },
                {
                    "type": "int",
                    "name": "max_h"
                }
            ]
        },
        /**
         *  Get the maximum size of a window's client area.
         *
         *  @param window   The window to query.
         *  @param w        Pointer to variable for storing the maximum width, may be NULL
         *  @param h        Pointer to variable for storing the maximum height, may be NULL
         *
         *  @see SDL_GetWindowMinimumSize()
         *  @see SDL_SetWindowMaximumSize()
         */
        SDL_GetWindowMaximumSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Set the border state of a window.
         *
         *  This will add or remove the window's SDL_WINDOW_BORDERLESS flag and
         *  add or remove the border from the actual window. This is a no-op if the
         *  window's border already matches the requested state.
         *
         *  @param window The window of which to change the border state.
         *  @param bordered SDL_FALSE to remove border, SDL_TRUE to add border.
         *
         *  @remarks You can't change the border state of a fullscreen window.
         *
         *  @see SDL_GetWindowFlags()
         */
        SDL_SetWindowBordered: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_bool",
                    "name": "bordered"
                }
            ]
        },
        /**
         *  Set the user-resizable state of a window.
         *
         *  This will add or remove the window's SDL_WINDOW_RESIZABLE flag and
         *  allow/disallow user resizing of the window. This is a no-op if the
         *  window's resizable state already matches the requested state.
         *
         *  @param window The window of which to change the resizable state.
         *  @param resizable SDL_TRUE to allow resizing, SDL_FALSE to disallow.
         *
         *  @remarks You can't change the resizable state of a fullscreen window.
         *
         *  @see SDL_GetWindowFlags()
         */
        SDL_SetWindowResizable: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_bool",
                    "name": "resizable"
                }
            ]
        },
        /**
         *  Show a window.
         *
         *  @see SDL_HideWindow()
         */
        SDL_ShowWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Hide a window.
         *
         *  @see SDL_ShowWindow()
         */
        SDL_HideWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Raise a window above other windows and set the input focus.
         */
        SDL_RaiseWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Make a window as large as possible.
         *
         *  @see SDL_RestoreWindow()
         */
        SDL_MaximizeWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Minimize a window to an iconic representation.
         *
         *  @see SDL_RestoreWindow()
         */
        SDL_MinimizeWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Restore the size and position of a minimized or maximized window.
         *
         *  @see SDL_MaximizeWindow()
         *  @see SDL_MinimizeWindow()
         */
        SDL_RestoreWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set a window's fullscreen state.
         *
         *  @returns 0 on success, or -1 if setting the display mode failed.
         *
         *  @see SDL_SetWindowDisplayMode()
         *  @see SDL_GetWindowDisplayMode()
         */
        SDL_SetWindowFullscreen: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  Get the SDL surface associated with the window.
         *
         *  @returns The window's framebuffer surface, or NULL on error.
         *
         *  A new surface will be created with the optimal format for the window,
         *  if necessary. This surface will be freed when the window is destroyed.
         *
         *  @remarks You may not combine this with 3D or the rendering API on this window.
         *
         *  @see SDL_UpdateWindowSurface()
         *  @see SDL_UpdateWindowSurfaceRects()
         */
        SDL_GetWindowSurface: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Copy the window surface to the screen.
         *
         *  @returns 0 on success, or -1 on error.
         *
         *  @see SDL_GetWindowSurface()
         *  @see SDL_UpdateWindowSurfaceRects()
         */
        SDL_UpdateWindowSurface: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Copy a number of rectangles on the window surface to the screen.
         *
         *  @returns 0 on success, or -1 on error.
         *
         *  @see SDL_GetWindowSurface()
         *  @see SDL_UpdateWindowSurface()
         */
        SDL_UpdateWindowSurfaceRects: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "numrects"
                }
            ]
        },
        /**
         *  Set a window's input grab mode.
         *
         *  @param window The window for which the input grab mode should be set.
         *  @param grabbed This is SDL_TRUE to grab input, and SDL_FALSE to release input.
         *
         *  If the caller enables a grab while another window is currently grabbed,
         *  the other window loses its grab in favor of the caller's window.
         *
         *  @see SDL_GetWindowGrab()
         */
        SDL_SetWindowGrab: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_bool",
                    "name": "grabbed"
                }
            ]
        },
        /**
         *  Get a window's input grab mode.
         *
         *  @returns This returns SDL_TRUE if input is grabbed, and SDL_FALSE otherwise.
         *
         *  @see SDL_SetWindowGrab()
         */
        SDL_GetWindowGrab: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Get the window that currently has an input grab enabled.
         *
         *  @returns This returns the window if input is grabbed, and NULL otherwise.
         *
         *  @see SDL_SetWindowGrab()
         */
        SDL_GetGrabbedWindow: {
            "output": "SDL_Window*",
            "params": []
        },
        /**
         *  Set the brightness (gamma correction) for a window.
         *
         *  @returns 0 on success, or -1 if setting the brightness isn't supported.
         *
         *  @see SDL_GetWindowBrightness()
         *  @see SDL_SetWindowGammaRamp()
         */
        SDL_SetWindowBrightness: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "float",
                    "name": "brightness"
                }
            ]
        },
        /**
         *  Get the brightness (gamma correction) for a window.
         *
         *  @returns The last brightness value passed to SDL_SetWindowBrightness()
         *
         *  @see SDL_SetWindowBrightness()
         */
        SDL_GetWindowBrightness: {
            "output": "float",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set the opacity for a window
         *
         *  @param window The window which will be made transparent or opaque
         *  @param opacity Opacity (0.0f - transparent, 1.0f - opaque) This will be
         *                 clamped internally between 0.0f and 1.0f.
         *
         *  @returns 0 on success, or -1 if setting the opacity isn't supported.
         *
         *  @see SDL_GetWindowOpacity()
         */
        SDL_SetWindowOpacity: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "float",
                    "name": "opacity"
                }
            ]
        },
        /**
         *  Get the opacity of a window.
         *
         *  If transparency isn't supported on this platform, opacity will be reported
         *  as 1.0f without error.
         *
         *  @param window The window in question.
         *  @param out_opacity Opacity (0.0f - transparent, 1.0f - opaque)
         *
         *  @returns 0 on success, or -1 on error (invalid window, etc).
         *
         *  @see SDL_SetWindowOpacity()
         */
        SDL_GetWindowOpacity: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "float*",
                    "name": "out_opacity"
                }
            ]
        },
        /**
         *  Sets the window as a modal for another window (TODO: reconsider this function and/or its name)
         *
         *  @param modal_window The window that should be modal
         *  @param parent_window The parent window
         *
         *  @returns 0 on success, or -1 otherwise.
         */
        SDL_SetWindowModalFor: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "modal_window"
                },
                {
                    "type": "SDL_Window*",
                    "name": "parent_window"
                }
            ]
        },
        /**
         *  Explicitly sets input focus to the window.
         *
         *  You almost certainly want SDL_RaiseWindow() instead of this function. Use
         *  this with caution, as you might give focus to a window that's completely
         *  obscured by other windows.
         *
         *  @param window The window that should get the input focus
         *
         *  @returns 0 on success, or -1 otherwise.
         *  @see SDL_RaiseWindow()
         */
        SDL_SetWindowInputFocus: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set the gamma ramp for a window.
         *
         *  @param window The window for which the gamma ramp should be set.
         *  @param red The translation table for the red channel, or NULL.
         *  @param green The translation table for the green channel, or NULL.
         *  @param blue The translation table for the blue channel, or NULL.
         *
         *  @returns 0 on success, or -1 if gamma ramps are unsupported.
         *
         *  Set the gamma translation table for the red, green, and blue channels
         *  of the video hardware.  Each table is an array of 256 16-bit quantities,
         *  representing a mapping between the input and output for that channel.
         *  The input is the index into the array, and the output is the 16-bit
         *  gamma value at that index, scaled to the output color precision.
         *
         *  @see SDL_GetWindowGammaRamp()
         */
        SDL_SetWindowGammaRamp: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "Uint16*",
                    "name": "red"
                },
                {
                    "type": "Uint16*",
                    "name": "green"
                },
                {
                    "type": "Uint16*",
                    "name": "blue"
                }
            ]
        },
        /**
         *  Get the gamma ramp for a window.
         *
         *  @param window The window from which the gamma ramp should be queried.
         *  @param red   A pointer to a 256 element array of 16-bit quantities to hold
         *               the translation table for the red channel, or NULL.
         *  @param green A pointer to a 256 element array of 16-bit quantities to hold
         *               the translation table for the green channel, or NULL.
         *  @param blue  A pointer to a 256 element array of 16-bit quantities to hold
         *               the translation table for the blue channel, or NULL.
         *
         *  @returns 0 on success, or -1 if gamma ramps are unsupported.
         *
         *  @see SDL_SetWindowGammaRamp()
         */
        SDL_GetWindowGammaRamp: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "Uint16*",
                    "name": "red"
                },
                {
                    "type": "Uint16*",
                    "name": "green"
                },
                {
                    "type": "Uint16*",
                    "name": "blue"
                }
            ]
        },
        /**
         *  Provide a callback that decides if a window region has special properties.
         *
         *  Normally windows are dragged and resized by decorations provided by the
         *  system window manager (a title bar, borders, etc), but for some apps, it
         *  makes sense to drag them from somewhere else inside the window itself; for
         *  example, one might have a borderless window that wants to be draggable
         *  from any part, or simulate its own title bar, etc.
         *
         *  This function lets the app provide a callback that designates pieces of
         *  a given window as special. This callback is run during event processing
         *  if we need to tell the OS to treat a region of the window specially; the
         *  use of this callback is known as "hit testing."
         *
         *  Mouse input may not be delivered to your application if it is within
         *  a special area; the OS will often apply that input to moving the window or
         *  resizing the window and not deliver it to the application.
         *
         *  Specifying NULL for a callback disables hit-testing. Hit-testing is
         *  disabled by default.
         *
         *  Platforms that don't support this functionality will return -1
         *  unconditionally, even if you're attempting to disable hit-testing.
         *
         *  Your callback may fire at any time, and its firing does not indicate any
         *  specific behavior (for example, on Windows, this certainly might fire
         *  when the OS is deciding whether to drag your window, but it fires for lots
         *  of other reasons, too, some unrelated to anything you probably care about
         *  _and when the mouse isn't actually at the location it is testing_).
         *  Since this can fire at any time, you should try to keep your callback
         *  efficient, devoid of allocations, etc.
         *
         *  @param window The window to set hit-testing on.
         *  @param callback The callback to call when doing a hit-test.
         *  @param callback_data An app-defined void pointer passed to the callback.
         *  @returns 0 on success, -1 on error (including unsupported).
         */
        SDL_SetWindowHitTest: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_HitTest",
                    "name": "callback"
                },
                {
                    "type": "void*",
                    "name": "callback_data"
                }
            ]
        },
        /**
         *  Destroy a window.
         */
        SDL_DestroyWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Returns whether the screensaver is currently enabled (default off).
         *
         *  @see SDL_EnableScreenSaver()
         *  @see SDL_DisableScreenSaver()
         */
        SDL_IsScreenSaverEnabled: {
            "output": "SDL_bool",
            "params": []
        },
        /**
         *  Allow the screen to be blanked by a screensaver
         *
         *  @see SDL_IsScreenSaverEnabled()
         *  @see SDL_DisableScreenSaver()
         */
        SDL_EnableScreenSaver: {
            "output": "void",
            "params": []
        },
        /**
         *  Prevent the screen from being blanked by a screensaver
         *
         *  @see SDL_IsScreenSaverEnabled()
         *  @see SDL_EnableScreenSaver()
         */
        SDL_DisableScreenSaver: {
            "output": "void",
            "params": []
        },
        /**
         *  Dynamically load an OpenGL library.
         *
         *  @param path The platform dependent OpenGL library name, or NULL to open the
         *              default OpenGL library.
         *
         *  @returns 0 on success, or -1 if the library couldn't be loaded.
         *
         *  This should be done after initializing the video driver, but before
         *  creating any OpenGL windows.  If no OpenGL library is loaded, the default
         *  library will be loaded upon creation of the first OpenGL window.
         *
         *  @remarks If you do this, you need to retrieve all of the GL functions used in
         *        your program from the dynamic library using SDL_GL_GetProcAddress().
         *
         *  @see SDL_GL_GetProcAddress()
         *  @see SDL_GL_UnloadLibrary()
         */
        SDL_GL_LoadLibrary: {
            "output": "int",
            "params": [
                {
                    "type": "char*",
                    "name": "path"
                }
            ]
        },
        /**
         *  Get the address of an OpenGL function.
         */
        SDL_GL_GetProcAddress: {
            "output": "void*",
            "params": [
                {
                    "type": "char*",
                    "name": "proc"
                }
            ]
        },
        /**
         *  Unload the OpenGL library previously loaded by SDL_GL_LoadLibrary().
         *
         *  @see SDL_GL_LoadLibrary()
         */
        SDL_GL_UnloadLibrary: {
            "output": "void",
            "params": []
        },
        /**
         *  Return true if an OpenGL extension is supported for the current
         *         context.
         */
        SDL_GL_ExtensionSupported: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "char*",
                    "name": "extension"
                }
            ]
        },
        /**
         *  Reset all previously set OpenGL context attributes to their default values
         */
        SDL_GL_ResetAttributes: {
            "output": "void",
            "params": []
        },
        /**
         *  Set an OpenGL window attribute before window creation.
         *
         *  @returns 0 on success, or -1 if the attribute could not be set.
         */
        SDL_GL_SetAttribute: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_GLattr",
                    "name": "attr"
                },
                {
                    "type": "int",
                    "name": "value"
                }
            ]
        },
        /**
         *  Get the actual value for an attribute from the current context.
         *
         *  @returns 0 on success, or -1 if the attribute could not be retrieved.
         *          The integer at \c value will be modified in either case.
         */
        SDL_GL_GetAttribute: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_GLattr",
                    "name": "attr"
                },
                {
                    "type": "int*",
                    "name": "value"
                }
            ]
        },
        /**
         *  Create an OpenGL context for use with an OpenGL window, and make it
         *         current.
         *
         *  @see SDL_GL_DeleteContext()
         */
        SDL_GL_CreateContext: {
            "output": "SDL_GLContext",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Set up an OpenGL context for rendering into an OpenGL window.
         *
         *  @remarks The context must have been created with a compatible window.
         */
        SDL_GL_MakeCurrent: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "SDL_GLContext",
                    "name": "context"
                }
            ]
        },
        /**
         *  Get the currently active OpenGL window.
         */
        SDL_GL_GetCurrentWindow: {
            "output": "SDL_Window*",
            "params": []
        },
        /**
         *  Get the currently active OpenGL context.
         */
        SDL_GL_GetCurrentContext: {
            "output": "SDL_GLContext",
            "params": []
        },
        /**
         *  Get the size of a window's underlying drawable in pixels (for use
         *         with glViewport).
         *
         *  @param window   Window from which the drawable size should be queried
         *  @param w        Pointer to variable for storing the width in pixels, may be NULL
         *  @param h        Pointer to variable for storing the height in pixels, may be NULL
         *
         * This may differ from SDL_GetWindowSize() if we're rendering to a high-DPI
         * drawable, i.e. the window was created with SDL_WINDOW_ALLOW_HIGHDPI on a
         * platform with high-DPI support (Apple calls this "Retina"), and not disabled
         * by the SDL_HINT_VIDEO_HIGHDPI_DISABLED hint.
         *
         *  @see SDL_GetWindowSize()
         *  @see SDL_CreateWindow()
         */
        SDL_GL_GetDrawableSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Set the swap interval for the current OpenGL context.
         *
         *  @param interval 0 for immediate updates, 1 for updates synchronized with the
         *                  vertical retrace. If the system supports it, you may
         *                  specify -1 to allow late swaps to happen immediately
         *                  instead of waiting for the next retrace.
         *
         *  @returns 0 on success, or -1 if setting the swap interval is not supported.
         *
         *  @see SDL_GL_GetSwapInterval()
         */
        SDL_GL_SetSwapInterval: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "interval"
                }
            ]
        },
        /**
         *  Get the swap interval for the current OpenGL context.
         *
         *  @returns 0 if there is no vertical retrace synchronization, 1 if the buffer
         *          swap is synchronized with the vertical retrace, and -1 if late
         *          swaps happen immediately instead of waiting for the next retrace.
         *          If the system can't determine the swap interval, or there isn't a
         *          valid current context, this will return 0 as a safe default.
         *
         *  @see SDL_GL_SetSwapInterval()
         */
        SDL_GL_GetSwapInterval: {
            "output": "int",
            "params": []
        },
        /**
         * Swap the OpenGL buffers for a window, if double-buffering is
         *        supported.
         */
        SDL_GL_SwapWindow: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Delete an OpenGL context.
         *
         *  @see SDL_GL_CreateContext()
         */
        SDL_GL_DeleteContext: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_GLContext",
                    "name": "context"
                }
            ]
        },
        /**
         *  Get the number of 2D rendering drivers available for the current
         *         display.
         *
         *  A render driver is a set of code that handles rendering and texture
         *  management on a particular display.  Normally there is only one, but
         *  some drivers may have several available with different capabilities.
         *
         *  @see SDL_GetRenderDriverInfo()
         *  @see SDL_CreateRenderer()
         */
        SDL_GetNumRenderDrivers: {
            "output": "int",
            "params": []
        },
        /**
         *  Get information about a specific 2D rendering driver for the current
         *         display.
         *
         *  @param index The index of the driver to query information about.
         *  @param info  A pointer to an SDL_RendererInfo struct to be filled with
         *               information on the rendering driver.
         *
         *  @returns 0 on success, -1 if the index was out of range.
         *
         *  @see SDL_CreateRenderer()
         */
        SDL_GetRenderDriverInfo: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "index"
                },
                {
                    "type": "SDL_RendererInfo*",
                    "name": "info"
                }
            ]
        },
        /**
         *  Create a window and default renderer
         *
         *  @param width    The width of the window
         *  @param height   The height of the window
         *  @param window_flags The flags used to create the window
         *  @param window   A pointer filled with the window, or NULL on error
         *  @param renderer A pointer filled with the renderer, or NULL on error
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_CreateWindowAndRenderer: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "Uint32",
                    "name": "window_flags"
                },
                {
                    "type": "SDL_Window**",
                    "name": "window"
                },
                {
                    "type": "SDL_Renderer**",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Create a 2D rendering context for a window.
         *
         *  @param window The window where rendering is displayed.
         *  @param index    The index of the rendering driver to initialize, or -1 to
         *                  initialize the first one supporting the requested flags.
         *  @param flags    ::SDL_RendererFlags.
         *
         *  @returns A valid rendering context or NULL if there was an error.
         *
         *  @see SDL_CreateSoftwareRenderer()
         *  @see SDL_GetRendererInfo()
         *  @see SDL_DestroyRenderer()
         */
        SDL_CreateRenderer: {
            "output": "SDL_Renderer*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                },
                {
                    "type": "int",
                    "name": "index"
                },
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         *  Create a 2D software rendering context for a surface.
         *
         *  @param surface The surface where rendering is done.
         *
         *  @returns A valid rendering context or NULL if there was an error.
         *
         *  @see SDL_CreateRenderer()
         *  @see SDL_DestroyRenderer()
         */
        SDL_CreateSoftwareRenderer: {
            "output": "SDL_Renderer*",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Get the renderer associated with a window.
         */
        SDL_GetRenderer: {
            "output": "SDL_Renderer*",
            "params": [
                {
                    "type": "SDL_Window*",
                    "name": "window"
                }
            ]
        },
        /**
         *  Get information about a rendering context.
         */
        SDL_GetRendererInfo: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_RendererInfo*",
                    "name": "info"
                }
            ]
        },
        /**
         *  Get the output size in pixels of a rendering context.
         */
        SDL_GetRendererOutputSize: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Create a texture for a rendering context.
         *
         *  @param renderer The renderer.
         *  @param format The format of the texture.
         *  @param access One of the enumerated values in ::SDL_TextureAccess.
         *  @param w      The width of the texture in pixels.
         *  @param h      The height of the texture in pixels.
         *
         *  @returns The created texture is returned, or NULL if no rendering context was
         *          active,  the format was unsupported, or the width or height were out
         *          of range.
         *
         *  @remarks The contents of the texture are not defined at creation.
         *
         *  @see SDL_QueryTexture()
         *  @see SDL_UpdateTexture()
         *  @see SDL_DestroyTexture()
         */
        SDL_CreateTexture: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "Uint32",
                    "name": "format"
                },
                {
                    "type": "int",
                    "name": "access"
                },
                {
                    "type": "int",
                    "name": "w"
                },
                {
                    "type": "int",
                    "name": "h"
                }
            ]
        },
        /**
         *  Create a texture from an existing surface.
         *
         *  @param renderer The renderer.
         *  @param surface The surface containing pixel data used to fill the texture.
         *
         *  @returns The created texture is returned, or NULL on error.
         *
         *  @remarks The surface is not modified or freed by this function.
         *
         *  @see SDL_QueryTexture()
         *  @see SDL_DestroyTexture()
         */
        SDL_CreateTextureFromSurface: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Query the attributes of a texture
         *
         *  @param texture A texture to be queried.
         *  @param format  A pointer filled in with the raw format of the texture.  The
         *                 actual format may differ, but pixel transfers will use this
         *                 format.
         *  @param access  A pointer filled in with the actual access to the texture.
         *  @param w       A pointer filled in with the width of the texture in pixels.
         *  @param h       A pointer filled in with the height of the texture in pixels.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         */
        SDL_QueryTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "Uint32*",
                    "name": "format"
                },
                {
                    "type": "int*",
                    "name": "access"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Set an additional color value used in render copy operations.
         *
         *  @param texture The texture to update.
         *  @param r       The red color value multiplied into copy operations.
         *  @param g       The green color value multiplied into copy operations.
         *  @param b       The blue color value multiplied into copy operations.
         *
         *  @returns 0 on success, or -1 if the texture is not valid or color modulation
         *          is not supported.
         *
         *  @see SDL_GetTextureColorMod()
         */
        SDL_SetTextureColorMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "Uint8",
                    "name": "r"
                },
                {
                    "type": "Uint8",
                    "name": "g"
                },
                {
                    "type": "Uint8",
                    "name": "b"
                }
            ]
        },
        /**
         *  Get the additional color value used in render copy operations.
         *
         *  @param texture The texture to query.
         *  @param r         A pointer filled in with the current red color value.
         *  @param g         A pointer filled in with the current green color value.
         *  @param b         A pointer filled in with the current blue color value.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @see SDL_SetTextureColorMod()
         */
        SDL_GetTextureColorMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "Uint8*",
                    "name": "r"
                },
                {
                    "type": "Uint8*",
                    "name": "g"
                },
                {
                    "type": "Uint8*",
                    "name": "b"
                }
            ]
        },
        /**
         *  Set an additional alpha value used in render copy operations.
         *
         *  @param texture The texture to update.
         *  @param alpha     The alpha value multiplied into copy operations.
         *
         *  @returns 0 on success, or -1 if the texture is not valid or alpha modulation
         *          is not supported.
         *
         *  @see SDL_GetTextureAlphaMod()
         */
        SDL_SetTextureAlphaMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "Uint8",
                    "name": "alpha"
                }
            ]
        },
        /**
         *  Get the additional alpha value used in render copy operations.
         *
         *  @param texture The texture to query.
         *  @param alpha     A pointer filled in with the current alpha value.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @see SDL_SetTextureAlphaMod()
         */
        SDL_GetTextureAlphaMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "Uint8*",
                    "name": "alpha"
                }
            ]
        },
        /**
         *  Set the blend mode used for texture copy operations.
         *
         *  @param texture The texture to update.
         *  @param blendMode ::SDL_BlendMode to use for texture blending.
         *
         *  @returns 0 on success, or -1 if the texture is not valid or the blend mode is
         *          not supported.
         *
         *  @remarks If the blend mode is not supported, the closest supported mode is
         *        chosen.
         *
         *  @see SDL_GetTextureBlendMode()
         */
        SDL_SetTextureBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_BlendMode",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Get the blend mode used for texture copy operations.
         *
         *  @param texture   The texture to query.
         *  @param blendMode A pointer filled in with the current blend mode.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @see SDL_SetTextureBlendMode()
         */
        SDL_GetTextureBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_BlendMode*",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Set the scale mode used for texture scale operations.
         *
         *  @param texture The texture to update.
         *  @param scaleMode ::SDL_ScaleMode to use for texture scaling.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @remarks If the scale mode is not supported, the closest supported mode is
         *        chosen.
         *
         *  @see SDL_GetTextureScaleMode()
         */
        SDL_SetTextureScaleMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_ScaleMode",
                    "name": "scaleMode"
                }
            ]
        },
        /**
         *  Get the scale mode used for texture scale operations.
         *
         *  @param texture   The texture to query.
         *  @param scaleMode A pointer filled in with the current scale mode.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @see SDL_SetTextureScaleMode()
         */
        SDL_GetTextureScaleMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_ScaleMode*",
                    "name": "scaleMode"
                }
            ]
        },
        /**
         *  Update the given texture rectangle with new pixel data.
         *
         *  @param texture   The texture to update
         *  @param rect      A pointer to the rectangle of pixels to update, or NULL to
         *                   update the entire texture.
         *  @param pixels    The raw pixel data in the format of the texture.
         *  @param pitch     The number of bytes in a row of pixel data, including padding between lines.
         *
         *  The pixel data must be in the format of the texture. The pixel format can be
         *  queried with SDL_QueryTexture.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @remarks This is a fairly slow function.
         */
        SDL_UpdateTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "void*",
                    "name": "pixels"
                },
                {
                    "type": "int",
                    "name": "pitch"
                }
            ]
        },
        /**
         *  Update a rectangle within a planar YV12 or IYUV texture with new pixel data.
         *
         *  @param texture   The texture to update
         *  @param rect      A pointer to the rectangle of pixels to update, or NULL to
         *                   update the entire texture.
         *  @param Yplane    The raw pixel data for the Y plane.
         *  @param Ypitch    The number of bytes between rows of pixel data for the Y plane.
         *  @param Uplane    The raw pixel data for the U plane.
         *  @param Upitch    The number of bytes between rows of pixel data for the U plane.
         *  @param Vplane    The raw pixel data for the V plane.
         *  @param Vpitch    The number of bytes between rows of pixel data for the V plane.
         *
         *  @returns 0 on success, or -1 if the texture is not valid.
         *
         *  @remarks You can use SDL_UpdateTexture() as long as your pixel data is
         *        a contiguous block of Y and U/V planes in the proper order, but
         *        this function is available if your pixel data is not contiguous.
         */
        SDL_UpdateYUVTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "Uint8*",
                    "name": "Yplane"
                },
                {
                    "type": "int",
                    "name": "Ypitch"
                },
                {
                    "type": "Uint8*",
                    "name": "Uplane"
                },
                {
                    "type": "int",
                    "name": "Upitch"
                },
                {
                    "type": "Uint8*",
                    "name": "Vplane"
                },
                {
                    "type": "int",
                    "name": "Vpitch"
                }
            ]
        },
        /**
         *  Lock a portion of the texture for write-only pixel access.
         *
         *  @param texture   The texture to lock for access, which was created with
         *                   ::SDL_TEXTUREACCESS_STREAMING.
         *  @param rect      A pointer to the rectangle to lock for access. If the rect
         *                   is NULL, the entire texture will be locked.
         *  @param pixels    This is filled in with a pointer to the locked pixels,
         *                   appropriately offset by the locked area.
         *  @param pitch     This is filled in with the pitch of the locked pixels.
         *
         *  @returns 0 on success, or -1 if the texture is not valid or was not created with ::SDL_TEXTUREACCESS_STREAMING.
         *
         *  @see SDL_UnlockTexture()
         */
        SDL_LockTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "void**",
                    "name": "pixels"
                },
                {
                    "type": "int*",
                    "name": "pitch"
                }
            ]
        },
        /**
         *  Lock a portion of the texture for write-only pixel access.
         *         Expose it as a SDL surface.
         *
         *  @param texture   The texture to lock for access, which was created with
         *                   ::SDL_TEXTUREACCESS_STREAMING.
         *  @param rect      A pointer to the rectangle to lock for access. If the rect
         *                   is NULL, the entire texture will be locked.
         *  @param surface   This is filled in with a SDL surface representing the locked area
         *                   Surface is freed internally after calling SDL_UnlockTexture or SDL_DestroyTexture.
         *
         *  @returns 0 on success, or -1 if the texture is not valid or was not created with ::SDL_TEXTUREACCESS_STREAMING.
         *
         *  @see SDL_UnlockTexture()
         */
        SDL_LockTextureToSurface: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "SDL_Surface**",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Unlock a texture, uploading the changes to video memory, if needed.
         *         If SDL_LockTextureToSurface() was called for locking, the SDL surface is freed.
         *
         *  @see SDL_LockTexture()
         *  @see SDL_LockTextureToSurface()
         */
        SDL_UnlockTexture: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                }
            ]
        },
        /**
         * Determines whether a window supports the use of render targets
         *
         * @param renderer The renderer that will be checked
         *
         * @returns SDL_TRUE if supported, SDL_FALSE if not.
         */
        SDL_RenderTargetSupported: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         * Set a texture as the current rendering target.
         *
         * @param renderer The renderer.
         * @param texture The targeted texture, which must be created with the SDL_TEXTUREACCESS_TARGET flag, or NULL for the default render target
         *
         * @returns 0 on success, or -1 on error
         *
         *  @see SDL_GetRenderTarget()
         */
        SDL_SetRenderTarget: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                }
            ]
        },
        /**
         * Get the current render target or NULL for the default render target.
         *
         * @returns The current render target
         *
         *  @see SDL_SetRenderTarget()
         */
        SDL_GetRenderTarget: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Set device independent resolution for rendering
         *
         *  @param renderer The renderer for which resolution should be set.
         *  @param w      The width of the logical resolution
         *  @param h      The height of the logical resolution
         *
         *  This function uses the viewport and scaling functionality to allow a fixed logical
         *  resolution for rendering, regardless of the actual output resolution.  If the actual
         *  output resolution doesn't have the same aspect ratio the output rendering will be
         *  centered within the output display.
         *
         *  If the output display is a window, mouse events in the window will be filtered
         *  and scaled so they seem to arrive within the logical resolution.
         *
         *  @remarks If this function results in scaling or subpixel drawing by the
         *        rendering backend, it will be handled using the appropriate
         *        quality hints.
         *
         *  @see SDL_RenderGetLogicalSize()
         *  @see SDL_RenderSetScale()
         *  @see SDL_RenderSetViewport()
         */
        SDL_RenderSetLogicalSize: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "int",
                    "name": "w"
                },
                {
                    "type": "int",
                    "name": "h"
                }
            ]
        },
        /**
         *  Get device independent resolution for rendering
         *
         *  @param renderer The renderer from which resolution should be queried.
         *  @param w      A pointer filled with the width of the logical resolution
         *  @param h      A pointer filled with the height of the logical resolution
         *
         *  @see SDL_RenderSetLogicalSize()
         */
        SDL_RenderGetLogicalSize: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "int*",
                    "name": "w"
                },
                {
                    "type": "int*",
                    "name": "h"
                }
            ]
        },
        /**
         *  Set whether to force integer scales for resolution-independent rendering
         *
         *  @param renderer The renderer for which integer scaling should be set.
         *  @param enable   Enable or disable integer scaling
         *
         *  This function restricts the logical viewport to integer values - that is, when
         *  a resolution is between two multiples of a logical size, the viewport size is
         *  rounded down to the lower multiple.
         *
         *  @see SDL_RenderSetLogicalSize()
         */
        SDL_RenderSetIntegerScale: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_bool",
                    "name": "enable"
                }
            ]
        },
        /**
         *  Get whether integer scales are forced for resolution-independent rendering
         *
         *  @param renderer The renderer from which integer scaling should be queried.
         *
         *  @see SDL_RenderSetIntegerScale()
         */
        SDL_RenderGetIntegerScale: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Set the drawing area for rendering on the current target.
         *
         *  @param renderer The renderer for which the drawing area should be set.
         *  @param rect The rectangle representing the drawing area, or NULL to set the viewport to the entire target.
         *
         *  The x,y of the viewport rect represents the origin for rendering.
         *
         *  @returns 0 on success, or -1 on error
         *
         *  @remarks If the window associated with the renderer is resized, the viewport is automatically reset.
         *
         *  @see SDL_RenderGetViewport()
         *  @see SDL_RenderSetLogicalSize()
         */
        SDL_RenderSetViewport: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Get the drawing area for the current target.
         *
         *  @see SDL_RenderSetViewport()
         */
        SDL_RenderGetViewport: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Set the clip rectangle for the current target.
         *
         *  @param renderer The renderer for which clip rectangle should be set.
         *  @param rect   A pointer to the rectangle to set as the clip rectangle,
         *                relative to the viewport, or NULL to disable clipping.
         *
         *  @returns 0 on success, or -1 on error
         *
         *  @see SDL_RenderGetClipRect()
         */
        SDL_RenderSetClipRect: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Get the clip rectangle for the current target.
         *
         *  @param renderer The renderer from which clip rectangle should be queried.
         *  @param rect   A pointer filled in with the current clip rectangle, or
         *                an empty rectangle if clipping is disabled.
         *
         *  @see SDL_RenderSetClipRect()
         */
        SDL_RenderGetClipRect: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Get whether clipping is enabled on the given renderer.
         *
         *  @param renderer The renderer from which clip state should be queried.
         *
         *  @see SDL_RenderGetClipRect()
         */
        SDL_RenderIsClipEnabled: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Set the drawing scale for rendering on the current target.
         *
         *  @param renderer The renderer for which the drawing scale should be set.
         *  @param scaleX The horizontal scaling factor
         *  @param scaleY The vertical scaling factor
         *
         *  The drawing coordinates are scaled by the x/y scaling factors
         *  before they are used by the renderer.  This allows resolution
         *  independent drawing with a single coordinate system.
         *
         *  @remarks If this results in scaling or subpixel drawing by the
         *        rendering backend, it will be handled using the appropriate
         *        quality hints.  For best results use integer scaling factors.
         *
         *  @see SDL_RenderGetScale()
         *  @see SDL_RenderSetLogicalSize()
         */
        SDL_RenderSetScale: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "float",
                    "name": "scaleX"
                },
                {
                    "type": "float",
                    "name": "scaleY"
                }
            ]
        },
        /**
         *  Get the drawing scale for the current target.
         *
         *  @param renderer The renderer from which drawing scale should be queried.
         *  @param scaleX A pointer filled in with the horizontal scaling factor
         *  @param scaleY A pointer filled in with the vertical scaling factor
         *
         *  @see SDL_RenderSetScale()
         */
        SDL_RenderGetScale: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "float*",
                    "name": "scaleX"
                },
                {
                    "type": "float*",
                    "name": "scaleY"
                }
            ]
        },
        /**
         *  Set the color used for drawing operations (Rect, Line and Clear).
         *
         *  @param renderer The renderer for which drawing color should be set.
         *  @param r The red value used to draw on the rendering target.
         *  @param g The green value used to draw on the rendering target.
         *  @param b The blue value used to draw on the rendering target.
         *  @param a The alpha value used to draw on the rendering target, usually
         *           ::SDL_ALPHA_OPAQUE (255).
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_SetRenderDrawColor: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "Uint8",
                    "name": "r"
                },
                {
                    "type": "Uint8",
                    "name": "g"
                },
                {
                    "type": "Uint8",
                    "name": "b"
                },
                {
                    "type": "Uint8",
                    "name": "a"
                }
            ]
        },
        /**
         *  Get the color used for drawing operations (Rect, Line and Clear).
         *
         *  @param renderer The renderer from which drawing color should be queried.
         *  @param r A pointer to the red value used to draw on the rendering target.
         *  @param g A pointer to the green value used to draw on the rendering target.
         *  @param b A pointer to the blue value used to draw on the rendering target.
         *  @param a A pointer to the alpha value used to draw on the rendering target,
         *           usually ::SDL_ALPHA_OPAQUE (255).
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_GetRenderDrawColor: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "Uint8*",
                    "name": "r"
                },
                {
                    "type": "Uint8*",
                    "name": "g"
                },
                {
                    "type": "Uint8*",
                    "name": "b"
                },
                {
                    "type": "Uint8*",
                    "name": "a"
                }
            ]
        },
        /**
         *  Set the blend mode used for drawing operations (Fill and Line).
         *
         *  @param renderer The renderer for which blend mode should be set.
         *  @param blendMode ::SDL_BlendMode to use for blending.
         *
         *  @returns 0 on success, or -1 on error
         *
         *  @remarks If the blend mode is not supported, the closest supported mode is
         *        chosen.
         *
         *  @see SDL_GetRenderDrawBlendMode()
         */
        SDL_SetRenderDrawBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_BlendMode",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Get the blend mode used for drawing operations.
         *
         *  @param renderer The renderer from which blend mode should be queried.
         *  @param blendMode A pointer filled in with the current blend mode.
         *
         *  @returns 0 on success, or -1 on error
         *
         *  @see SDL_SetRenderDrawBlendMode()
         */
        SDL_GetRenderDrawBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_BlendMode*",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Clear the current rendering target with the drawing color
         *
         *  This function clears the entire rendering target, ignoring the viewport and
         *  the clip rectangle.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderClear: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Draw a point on the current rendering target.
         *
         *  @param renderer The renderer which should draw a point.
         *  @param x The x coordinate of the point.
         *  @param y The y coordinate of the point.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawPoint: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "int",
                    "name": "x"
                },
                {
                    "type": "int",
                    "name": "y"
                }
            ]
        },
        /**
         *  Draw multiple points on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple points.
         *  @param points The points to draw
         *  @param count The number of points to draw
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawPoints: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Point*",
                    "name": "points"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Draw a line on the current rendering target.
         *
         *  @param renderer The renderer which should draw a line.
         *  @param x1 The x coordinate of the start point.
         *  @param y1 The y coordinate of the start point.
         *  @param x2 The x coordinate of the end point.
         *  @param y2 The y coordinate of the end point.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawLine: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "int",
                    "name": "x1"
                },
                {
                    "type": "int",
                    "name": "y1"
                },
                {
                    "type": "int",
                    "name": "x2"
                },
                {
                    "type": "int",
                    "name": "y2"
                }
            ]
        },
        /**
         *  Draw a series of connected lines on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple lines.
         *  @param points The points along the lines
         *  @param count The number of points, drawing count-1 lines
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawLines: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Point*",
                    "name": "points"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Draw a rectangle on the current rendering target.
         *
         *  @param renderer The renderer which should draw a rectangle.
         *  @param rect A pointer to the destination rectangle, or NULL to outline the entire rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawRect: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Draw some number of rectangles on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple rectangles.
         *  @param rects A pointer to an array of destination rectangles.
         *  @param count The number of rectangles.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawRects: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Fill a rectangle on the current rendering target with the drawing color.
         *
         *  @param renderer The renderer which should fill a rectangle.
         *  @param rect A pointer to the destination rectangle, or NULL for the entire
         *              rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderFillRect: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Fill some number of rectangles on the current rendering target with the drawing color.
         *
         *  @param renderer The renderer which should fill multiple rectangles.
         *  @param rects A pointer to an array of destination rectangles.
         *  @param count The number of rectangles.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderFillRects: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Copy a portion of the texture to the current rendering target.
         *
         *  @param renderer The renderer which should copy parts of a texture.
         *  @param texture The source texture.
         *  @param srcrect   A pointer to the source rectangle, or NULL for the entire
         *                   texture.
         *  @param dstrect   A pointer to the destination rectangle, or NULL for the
         *                   entire rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderCopy: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  Copy a portion of the source texture to the current rendering target, rotating it by angle around the given center
         *
         *  @param renderer The renderer which should copy parts of a texture.
         *  @param texture The source texture.
         *  @param srcrect   A pointer to the source rectangle, or NULL for the entire
         *                   texture.
         *  @param dstrect   A pointer to the destination rectangle, or NULL for the
         *                   entire rendering target.
         *  @param angle    An angle in degrees that indicates the rotation that will be applied to dstrect, rotating it in a clockwise direction
         *  @param center   A pointer to a point indicating the point around which dstrect will be rotated (if NULL, rotation will be done around dstrect.w/2, dstrect.h/2).
         *  @param flip     An SDL_RendererFlip value stating which flipping actions should be performed on the texture
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderCopyEx: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                },
                {
                    "type": "double",
                    "name": "angle"
                },
                {
                    "type": "SDL_Point*",
                    "name": "center"
                },
                {
                    "type": "SDL_RendererFlip",
                    "name": "flip"
                }
            ]
        },
        /**
         *  Draw a point on the current rendering target.
         *
         *  @param renderer The renderer which should draw a point.
         *  @param x The x coordinate of the point.
         *  @param y The y coordinate of the point.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawPointF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "float",
                    "name": "x"
                },
                {
                    "type": "float",
                    "name": "y"
                }
            ]
        },
        /**
         *  Draw multiple points on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple points.
         *  @param points The points to draw
         *  @param count The number of points to draw
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawPointsF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FPoint*",
                    "name": "points"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Draw a line on the current rendering target.
         *
         *  @param renderer The renderer which should draw a line.
         *  @param x1 The x coordinate of the start point.
         *  @param y1 The y coordinate of the start point.
         *  @param x2 The x coordinate of the end point.
         *  @param y2 The y coordinate of the end point.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawLineF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "float",
                    "name": "x1"
                },
                {
                    "type": "float",
                    "name": "y1"
                },
                {
                    "type": "float",
                    "name": "x2"
                },
                {
                    "type": "float",
                    "name": "y2"
                }
            ]
        },
        /**
         *  Draw a series of connected lines on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple lines.
         *  @param points The points along the lines
         *  @param count The number of points, drawing count-1 lines
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawLinesF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FPoint*",
                    "name": "points"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Draw a rectangle on the current rendering target.
         *
         *  @param renderer The renderer which should draw a rectangle.
         *  @param rect A pointer to the destination rectangle, or NULL to outline the entire rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawRectF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Draw some number of rectangles on the current rendering target.
         *
         *  @param renderer The renderer which should draw multiple rectangles.
         *  @param rects A pointer to an array of destination rectangles.
         *  @param count The number of rectangles.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderDrawRectsF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Fill a rectangle on the current rendering target with the drawing color.
         *
         *  @param renderer The renderer which should fill a rectangle.
         *  @param rect A pointer to the destination rectangle, or NULL for the entire
         *              rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderFillRectF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Fill some number of rectangles on the current rendering target with the drawing color.
         *
         *  @param renderer The renderer which should fill multiple rectangles.
         *  @param rects A pointer to an array of destination rectangles.
         *  @param count The number of rectangles.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderFillRectsF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "count"
                }
            ]
        },
        /**
         *  Copy a portion of the texture to the current rendering target.
         *
         *  @param renderer The renderer which should copy parts of a texture.
         *  @param texture The source texture.
         *  @param srcrect   A pointer to the source rectangle, or NULL for the entire
         *                   texture.
         *  @param dstrect   A pointer to the destination rectangle, or NULL for the
         *                   entire rendering target.
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderCopyF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  Copy a portion of the source texture to the current rendering target, rotating it by angle around the given center
         *
         *  @param renderer The renderer which should copy parts of a texture.
         *  @param texture The source texture.
         *  @param srcrect   A pointer to the source rectangle, or NULL for the entire
         *                   texture.
         *  @param dstrect   A pointer to the destination rectangle, or NULL for the
         *                   entire rendering target.
         *  @param angle    An angle in degrees that indicates the rotation that will be applied to dstrect, rotating it in a clockwise direction
         *  @param center   A pointer to a point indicating the point around which dstrect will be rotated (if NULL, rotation will be done around dstrect.w/2, dstrect.h/2).
         *  @param flip     An SDL_RendererFlip value stating which flipping actions should be performed on the texture
         *
         *  @returns 0 on success, or -1 on error
         */
        SDL_RenderCopyExF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_FRect*",
                    "name": "dstrect"
                },
                {
                    "type": "double",
                    "name": "angle"
                },
                {
                    "type": "SDL_FPoint*",
                    "name": "center"
                },
                {
                    "type": "SDL_RendererFlip",
                    "name": "flip"
                }
            ]
        },
        /**
         *  Read pixels from the current rendering target.
         *
         *  @param renderer The renderer from which pixels should be read.
         *  @param rect   A pointer to the rectangle to read, or NULL for the entire
         *                render target.
         *  @param format The desired format of the pixel data, or 0 to use the format
         *                of the rendering target
         *  @param pixels A pointer to be filled in with the pixel data
         *  @param pitch  The pitch of the pixels parameter.
         *
         *  @returns 0 on success, or -1 if pixel reading is not supported.
         *
         *  \warning This is a very slow operation, and should not be used frequently.
         */
        SDL_RenderReadPixels: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "Uint32",
                    "name": "format"
                },
                {
                    "type": "void*",
                    "name": "pixels"
                },
                {
                    "type": "int",
                    "name": "pitch"
                }
            ]
        },
        /**
         *  Update the screen with rendering performed.
         */
        SDL_RenderPresent: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Destroy the specified texture.
         *
         *  @see SDL_CreateTexture()
         *  @see SDL_CreateTextureFromSurface()
         */
        SDL_DestroyTexture: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                }
            ]
        },
        /**
         *  Destroy the rendering context for a window and free associated
         *         textures.
         *
         *  @see SDL_CreateRenderer()
         */
        SDL_DestroyRenderer: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Force the rendering context to flush any pending commands to the
         *         underlying rendering API.
         *
         *  You do not need to (and in fact, shouldn't) call this function unless
         *  you are planning to call into OpenGL/Direct3D/Metal/whatever directly
         *  in addition to using an SDL_Renderer.
         *
         *  This is for a very-specific case: if you are using SDL's render API,
         *  you asked for a specific renderer backend (OpenGL, Direct3D, etc),
         *  you set SDL_HINT_RENDER_BATCHING to "1", and you plan to make
         *  OpenGL/D3D/whatever calls in addition to SDL render API calls. If all of
         *  this applies, you should call SDL_RenderFlush() between calls to SDL's
         *  render API and the low-level API you're using in cooperation.
         *
         *  In all other cases, you can ignore this function. This is only here to
         *  get maximum performance out of a specific situation. In all other cases,
         *  SDL will do the right thing, perhaps at a performance loss.
         *
         *  This function is first available in SDL 2.0.10, and is not needed in
         *  2.0.9 and earlier, as earlier versions did not queue rendering commands
         *  at all, instead flushing them to the OS immediately.
         */
        SDL_RenderFlush: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Bind the texture to the current OpenGL/ES/ES2 context for use with
         *         OpenGL instructions.
         *
         *  @param texture  The SDL texture to bind
         *  @param texw     A pointer to a float that will be filled with the texture width
         *  @param texh     A pointer to a float that will be filled with the texture height
         *
         *  @returns 0 on success, or -1 if the operation is not supported
         */
        SDL_GL_BindTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                },
                {
                    "type": "float*",
                    "name": "texw"
                },
                {
                    "type": "float*",
                    "name": "texh"
                }
            ]
        },
        /**
         *  Unbind a texture from the current OpenGL/ES/ES2 context.
         *
         *  @param texture  The SDL texture to unbind
         *
         *  @returns 0 on success, or -1 if the operation is not supported
         */
        SDL_GL_UnbindTexture: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Texture*",
                    "name": "texture"
                }
            ]
        },
        /**
         *  Get the CAMetalLayer associated with the given Metal renderer
         *
         *  @param renderer The renderer to query
         *
         *  @returns CAMetalLayer* on success, or NULL if the renderer isn't a Metal renderer
         *
         *  @see SDL_RenderGetMetalCommandEncoder()
         */
        SDL_RenderGetMetalLayer: {
            "output": "void*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         *  Get the Metal command encoder for the current frame
         *
         *  @param renderer The renderer to query
         *
         *  @returns id<MTLRenderCommandEncoder> on success, or NULL if the renderer isn't a Metal renderer
         *
         *  @see SDL_RenderGetMetalLayer()
         */
        SDL_RenderGetMetalCommandEncoder: {
            "output": "void*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                }
            ]
        },
        /**
         * Get the path where the application resides.
         *
         * Get the "base path". This is the directory where the application was run
         *  from, which is probably the installation directory, and may or may not
         *  be the process's current working directory.
         *
         * This returns an absolute path in UTF-8 encoding, and is guaranteed to
         *  end with a path separator ('\\' on Windows, '/' most other places).
         *
         * The pointer returned by this function is owned by you. Please call
         *  SDL_free() on the pointer when you are done with it, or it will be a
         *  memory leak. This is not necessarily a fast call, though, so you should
         *  call this once near startup and save the string if you need it.
         *
         * Some platforms can't determine the application's path, and on other
         *  platforms, this might be meaningless. In such cases, this function will
         *  return NULL.
         *
         *  @returns String of base dir in UTF-8 encoding, or NULL on error.
         *
         * @see SDL_GetPrefPath
         */
        SDL_GetBasePath: {
            "output": "char*",
            "params": []
        },
        /**
         * Get the user-and-app-specific path where files can be written.
         *
         * Get the "pref dir". This is meant to be where users can write personal
         *  files (preferences and save games, etc) that are specific to your
         *  application. This directory is unique per user, per application.
         *
         * This function will decide the appropriate location in the native filesystem,
         *  create the directory if necessary, and return a string of the absolute
         *  path to the directory in UTF-8 encoding.
         *
         * On Windows, the string might look like:
         *  "C:\\Users\\bob\\AppData\\Roaming\\My Company\\My Program Name\\"
         *
         * On Linux, the string might look like:
         *  "/home/bob/.local/share/My Program Name/"
         *
         * On Mac OS X, the string might look like:
         *  "/Users/bob/Library/Application Support/My Program Name/"
         *
         * (etc.)
         *
         * You specify the name of your organization (if it's not a real organization,
         *  your name or an Internet domain you own might do) and the name of your
         *  application. These should be untranslated proper names.
         *
         * Both the org and app strings may become part of a directory name, so
         *  please follow these rules:
         *
         *    - Try to use the same org string (including case-sensitivity) for
         *      all your applications that use this function.
         *    - Always use a unique app string for each one, and make sure it never
         *      changes for an app once you've decided on it.
         *    - Unicode characters are legal, as long as it's UTF-8 encoded, but...
         *    - ...only use letters, numbers, and spaces. Avoid punctuation like
         *      "Game Name 2: Bad Guy's Revenge!" ... "Game Name 2" is sufficient.
         *
         * This returns an absolute path in UTF-8 encoding, and is guaranteed to
         *  end with a path separator ('\\' on Windows, '/' most other places).
         *
         * The pointer returned by this function is owned by you. Please call
         *  SDL_free() on the pointer when you are done with it, or it will be a
         *  memory leak. This is not necessarily a fast call, though, so you should
         *  call this once near startup and save the string if you need it.
         *
         * You should assume the path returned by this function is the only safe
         *  place to write files (and that SDL_GetBasePath(), while it might be
         *  writable, or even the parent of the returned path, aren't where you
         *  should be writing things).
         *
         * Some platforms can't determine the pref path, and on other
         *  platforms, this might be meaningless. In such cases, this function will
         *  return NULL.
         *
         *   @param org The name of your organization.
         *   @param app The name of your application.
         *  @returns UTF-8 string of user dir in platform-dependent notation. NULL
         *          if there's a problem (creating directory failed, etc).
         *
         * @see SDL_GetBasePath
         */
        SDL_GetPrefPath: {
            "output": "char*",
            "params": [
                {
                    "type": "char*",
                    "name": "org"
                },
                {
                    "type": "char*",
                    "name": "app"
                }
            ]
        },
        /**
         *  Allocate and free an RGB surface.
         *
         *  If the depth is 4 or 8 bits, an empty palette is allocated for the surface.
         *  If the depth is greater than 8 bits, the pixel format is set using the
         *  flags '[RGB]mask'.
         *
         *  If the function runs out of memory, it will return NULL.
         *
         *  @param flags The \c flags are obsolete and should be set to 0.
         *  @param width The width in pixels of the surface to create.
         *  @param height The height in pixels of the surface to create.
         *  @param depth The depth in bits of the surface to create.
         *  @param Rmask The red mask of the surface to create.
         *  @param Gmask The green mask of the surface to create.
         *  @param Bmask The blue mask of the surface to create.
         *  @param Amask The alpha mask of the surface to create.
         */
        SDL_CreateRGBSurface: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                },
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "int",
                    "name": "depth"
                },
                {
                    "type": "Uint32",
                    "name": "Rmask"
                },
                {
                    "type": "Uint32",
                    "name": "Gmask"
                },
                {
                    "type": "Uint32",
                    "name": "Bmask"
                },
                {
                    "type": "Uint32",
                    "name": "Amask"
                }
            ]
        },
        /* !!! FIXME for 2.1: why does this ask for depth? Format provides that. */
        SDL_CreateRGBSurfaceWithFormat: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "Uint32",
                    "name": "flags"
                },
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "int",
                    "name": "depth"
                },
                {
                    "type": "Uint32",
                    "name": "format"
                }
            ]
        },
        SDL_CreateRGBSurfaceFrom: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "void*",
                    "name": "pixels"
                },
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "int",
                    "name": "depth"
                },
                {
                    "type": "int",
                    "name": "pitch"
                },
                {
                    "type": "Uint32",
                    "name": "Rmask"
                },
                {
                    "type": "Uint32",
                    "name": "Gmask"
                },
                {
                    "type": "Uint32",
                    "name": "Bmask"
                },
                {
                    "type": "Uint32",
                    "name": "Amask"
                }
            ]
        },
        SDL_CreateRGBSurfaceWithFormatFrom: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "void*",
                    "name": "pixels"
                },
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "int",
                    "name": "depth"
                },
                {
                    "type": "int",
                    "name": "pitch"
                },
                {
                    "type": "Uint32",
                    "name": "format"
                }
            ]
        },
        SDL_FreeSurface: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Set the palette used by a surface.
         *
         *  @returns 0, or -1 if the surface format doesn't use a palette.
         *
         *  @remarks A single palette can be shared with many surfaces.
         */
        SDL_SetSurfacePalette: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_Palette*",
                    "name": "palette"
                }
            ]
        },
        /**
         *  Sets up a surface for directly accessing the pixels.
         *
         *  Between calls to SDL_LockSurface() / SDL_UnlockSurface(), you can write
         *  to and read from \c surface->pixels, using the pixel format stored in
         *  \c surface->format.  Once you are done accessing the surface, you should
         *  use SDL_UnlockSurface() to release it.
         *
         *  Not all surfaces require locking.  If SDL_MUSTLOCK(surface) evaluates
         *  to 0, then you can read and write to the surface at any time, and the
         *  pixel format of the surface will not change.
         *
         *  No operating system or library calls should be made between lock/unlock
         *  pairs, as critical system locks may be held during this time.
         *
         *  SDL_LockSurface() returns 0, or -1 if the surface couldn't be locked.
         *
         *  @see SDL_UnlockSurface()
         */
        SDL_LockSurface: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /** @see SDL_LockSurface() */
        SDL_UnlockSurface: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Load a surface from a seekable SDL data stream (memory or file).
         *
         *  If \c freesrc is non-zero, the stream will be closed after being read.
         *
         *  The new surface should be freed with SDL_FreeSurface().
         *
         *  @returns the new surface, or NULL if there was an error.
         */
        SDL_LoadBMP_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                },
                {
                    "type": "int",
                    "name": "freesrc"
                }
            ]
        },
        /**
         *  Save a surface to a seekable SDL data stream (memory or file).
         *
         *  Surfaces with a 24-bit, 32-bit and paletted 8-bit format get saved in the
         *  BMP directly. Other RGB formats with 8-bit or higher get converted to a
         *  24-bit surface or, if they have an alpha mask or a colorkey, to a 32-bit
         *  surface before they are saved. YUV and paletted 1-bit and 4-bit formats are
         *  not supported.
         *
         *  If \c freedst is non-zero, the stream will be closed after being written.
         *
         *  @returns 0 if successful or -1 if there was an error.
         */
        SDL_SaveBMP_RW: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_RWops*",
                    "name": "dst"
                },
                {
                    "type": "int",
                    "name": "freedst"
                }
            ]
        },
        /**
         *  Sets the RLE acceleration hint for a surface.
         *
         *  @returns 0 on success, or -1 if the surface is not valid
         *
         *  @remarks If RLE is enabled, colorkey and alpha blending blits are much faster,
         *        but the surface must be locked before directly accessing the pixels.
         */
        SDL_SetSurfaceRLE: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "int",
                    "name": "flag"
                }
            ]
        },
        /**
         *  Sets the color key (transparent pixel) in a blittable surface.
         *
         *  @param surface The surface to update
         *  @param flag Non-zero to enable colorkey and 0 to disable colorkey
         *  @param key The transparent pixel in the native surface format
         *
         *  @returns 0 on success, or -1 if the surface is not valid
         *
         *  You can pass SDL_RLEACCEL to enable RLE accelerated blits.
         */
        SDL_SetColorKey: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "int",
                    "name": "flag"
                },
                {
                    "type": "Uint32",
                    "name": "key"
                }
            ]
        },
        /**
         *  Returns whether the surface has a color key
         *
         *  @returns SDL_TRUE if the surface has a color key, or SDL_FALSE if the surface is NULL or has no color key
         */
        SDL_HasColorKey: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Gets the color key (transparent pixel) in a blittable surface.
         *
         *  @param surface The surface to update
         *  @param key A pointer filled in with the transparent pixel in the native
         *             surface format
         *
         *  @returns 0 on success, or -1 if the surface is not valid or colorkey is not
         *          enabled.
         */
        SDL_GetColorKey: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "Uint32*",
                    "name": "key"
                }
            ]
        },
        /**
         *  Set an additional color value used in blit operations.
         *
         *  @param surface The surface to update.
         *  @param r The red color value multiplied into blit operations.
         *  @param g The green color value multiplied into blit operations.
         *  @param b The blue color value multiplied into blit operations.
         *
         *  @returns 0 on success, or -1 if the surface is not valid.
         *
         *  @see SDL_GetSurfaceColorMod()
         */
        SDL_SetSurfaceColorMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "Uint8",
                    "name": "r"
                },
                {
                    "type": "Uint8",
                    "name": "g"
                },
                {
                    "type": "Uint8",
                    "name": "b"
                }
            ]
        },
        /**
         *  Get the additional color value used in blit operations.
         *
         *  @param surface The surface to query.
         *  @param r A pointer filled in with the current red color value.
         *  @param g A pointer filled in with the current green color value.
         *  @param b A pointer filled in with the current blue color value.
         *
         *  @returns 0 on success, or -1 if the surface is not valid.
         *
         *  @see SDL_SetSurfaceColorMod()
         */
        SDL_GetSurfaceColorMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "Uint8*",
                    "name": "r"
                },
                {
                    "type": "Uint8*",
                    "name": "g"
                },
                {
                    "type": "Uint8*",
                    "name": "b"
                }
            ]
        },
        /**
         *  Set an additional alpha value used in blit operations.
         *
         *  @param surface The surface to update.
         *  @param alpha The alpha value multiplied into blit operations.
         *
         *  @returns 0 on success, or -1 if the surface is not valid.
         *
         *  @see SDL_GetSurfaceAlphaMod()
         */
        SDL_SetSurfaceAlphaMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "Uint8",
                    "name": "alpha"
                }
            ]
        },
        /**
         *  Get the additional alpha value used in blit operations.
         *
         *  @param surface The surface to query.
         *  @param alpha A pointer filled in with the current alpha value.
         *
         *  @returns 0 on success, or -1 if the surface is not valid.
         *
         *  @see SDL_SetSurfaceAlphaMod()
         */
        SDL_GetSurfaceAlphaMod: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "Uint8*",
                    "name": "alpha"
                }
            ]
        },
        /**
         *  Set the blend mode used for blit operations.
         *
         *  @param surface The surface to update.
         *  @param blendMode ::SDL_BlendMode to use for blit blending.
         *
         *  @returns 0 on success, or -1 if the parameters are not valid.
         *
         *  @see SDL_GetSurfaceBlendMode()
         */
        SDL_SetSurfaceBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_BlendMode",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Get the blend mode used for blit operations.
         *
         *  @param surface   The surface to query.
         *  @param blendMode A pointer filled in with the current blend mode.
         *
         *  @returns 0 on success, or -1 if the surface is not valid.
         *
         *  @see SDL_SetSurfaceBlendMode()
         */
        SDL_GetSurfaceBlendMode: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_BlendMode*",
                    "name": "blendMode"
                }
            ]
        },
        /**
         *  Sets the clipping rectangle for the destination surface in a blit.
         *
         *  If the clip rectangle is NULL, clipping will be disabled.
         *
         *  If the clip rectangle doesn't intersect the surface, the function will
         *  return SDL_FALSE and blits will be completely clipped.  Otherwise the
         *  function returns SDL_TRUE and blits to the surface will be clipped to
         *  the intersection of the surface area and the clipping rectangle.
         *
         *  Note that blits are automatically clipped to the edges of the source
         *  and destination surfaces.
         */
        SDL_SetClipRect: {
            "output": "SDL_bool",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /**
         *  Gets the clipping rectangle for the destination surface in a blit.
         *
         *  \c rect must be a pointer to a valid rectangle which will be filled
         *  with the correct values.
         */
        SDL_GetClipRect: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                }
            ]
        },
        /*
         * Creates a new surface identical to the existing surface
         */
        SDL_DuplicateSurface: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                }
            ]
        },
        /**
         *  Creates a new surface of the specified format, and then copies and maps
         *  the given surface to it so the blit of the converted surface will be as
         *  fast as possible.  If this function fails, it returns NULL.
         *
         *  The \c flags parameter is passed to SDL_CreateRGBSurface() and has those
         *  semantics.  You can also pass ::SDL_RLEACCEL in the flags parameter and
         *  SDL will try to RLE accelerate colorkey and alpha blits in the resulting
         *  surface.
         */
        SDL_ConvertSurface: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_PixelFormat*",
                    "name": "fmt"
                },
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        SDL_ConvertSurfaceFormat: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "Uint32",
                    "name": "pixel_format"
                },
                {
                    "type": "Uint32",
                    "name": "flags"
                }
            ]
        },
        /**
         * Copy a block of pixels of one format to another format
         *
         *  @returns 0 on success, or -1 if there was an error
         */
        SDL_ConvertPixels: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                },
                {
                    "type": "Uint32",
                    "name": "src_format"
                },
                {
                    "type": "void*",
                    "name": "src"
                },
                {
                    "type": "int",
                    "name": "src_pitch"
                },
                {
                    "type": "Uint32",
                    "name": "dst_format"
                },
                {
                    "type": "void*",
                    "name": "dst"
                },
                {
                    "type": "int",
                    "name": "dst_pitch"
                }
            ]
        },
        /**
         *  Performs a fast fill of the given rectangle with \c color.
         *
         *  If \c rect is NULL, the whole surface will be filled with \c color.
         *
         *  The color should be a pixel of the format used by the surface, and
         *  can be generated by the SDL_MapRGB() function.
         *
         *  @returns 0 on success, or -1 on error.
         */
        SDL_FillRect: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rect"
                },
                {
                    "type": "Uint32",
                    "name": "color"
                }
            ]
        },
        SDL_FillRects: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "rects"
                },
                {
                    "type": "int",
                    "name": "count"
                },
                {
                    "type": "Uint32",
                    "name": "color"
                }
            ]
        },
        /**
         *  This is the public blit function, SDL_BlitSurface(), and it performs
         *  rectangle validation and clipping before passing it to SDL_LowerBlit()
         */
        SDL_UpperBlit: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  This is a semi-private blit function and it performs low-level surface
         *  blitting only.
         */
        SDL_LowerBlit: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  Perform a fast, low quality, stretch blit between two surfaces of the
         *         same pixel format.
         *
         *  @remarks This function uses a static buffer, and is not thread-safe.
         */
        SDL_SoftStretch: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  This is the public scaled blit function, SDL_BlitScaled(), and it performs
         *  rectangle validation and clipping before passing it to SDL_LowerBlitScaled()
         */
        SDL_UpperBlitScaled: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  This is a semi-private blit function and it performs low-level surface
         *  scaled blitting only.
         */
        SDL_LowerBlitScaled: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "src"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "srcrect"
                },
                {
                    "type": "SDL_Surface*",
                    "name": "dst"
                },
                {
                    "type": "SDL_Rect*",
                    "name": "dstrect"
                }
            ]
        },
        /**
         *  Set the YUV conversion mode
         */
        SDL_SetYUVConversionMode: {
            "output": "void",
            "params": [
                {
                    "type": "SDL_YUV_CONVERSION_MODE",
                    "name": "mode"
                }
            ]
        },
        /**
         *  Get the YUV conversion mode
         */
        SDL_GetYUVConversionMode: {
            "output": "SDL_YUV_CONVERSION_MODE",
            "params": []
        },
        /**
         *  Get the YUV conversion mode, returning the correct mode for the resolution when the current conversion mode is SDL_YUV_CONVERSION_AUTOMATIC
         */
        SDL_GetYUVConversionModeForResolution: {
            "output": "SDL_YUV_CONVERSION_MODE",
            "params": [
                {
                    "type": "int",
                    "name": "width"
                },
                {
                    "type": "int",
                    "name": "height"
                }
            ]
        }
    } as const,
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
        SDL_WINDOW_FULLSCREEN_DESKTOP: (0x00000001 | 0x00001000),
        /**< window not created by SDL */
        SDL_WINDOW_FOREIGN: 0x00000800,
        /**< window should be created in high-DPI mode if supported.**/
        SDL_WINDOW_MOUSE_CAPTURE: 0x00004000,
        /**< window should always be above others */
        SDL_WINDOW_ALWAYS_ON_TOP: 0x00008000,
        /**< window should not be added to the taskbar */
        SDL_WINDOW_SKIP_TASKBAR: 0x00010000,
        /**< window should be treated as a utility window */
        SDL_WINDOW_UTILITY: 0x00020000,
        /**< window should be treated as a tooltip */
        SDL_WINDOW_TOOLTIP: 0x00040000,
        /**< window should be treated as a popup menu */
        SDL_WINDOW_POPUP_MENU: 0x00080000,
        /**< window usable for Vulkan surface */
        SDL_WINDOW_VULKAN: 0x10000000,
        SDL_INIT_VIDEO: 0x00000020,
        SDL_WINDOWPOS_UNDEFINED: 0x1FFF0000,

        /**< The renderer is a software fallback */
        SDL_RENDERER_SOFTWARE: 0x00000001,
        /**< The renderer uses hardware  acceleration */
        SDL_RENDERER_ACCELERATED: 0x00000002,
        /**< Present is synchronized with the refresh rate */
        SDL_RENDERER_PRESENTVSYNC: 0x00000004,
        /**< The renderer supports */
        SDL_RENDERER_TARGETTEXTURE: 0x00000008
    } as const
});