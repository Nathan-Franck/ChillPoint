import { ForeignFunction } from "./Util.FFI";

export const { types: sdl, values: SDL } = ForeignFunction.load_library({
    file_name: "SDL2",
    header: {
        /**
         * Get the number of milliseconds since the SDL library initialization.
         *
         * @remarks This value wraps if the program runs for more than ~49 days.
         */
        SDL_GetTicks: {
            "output": "uint",
            "params": []
        },
        /**
         * Get the current value of the high resolution counter
         */
        SDL_GetPerformanceCounter: {
            "output": "uint64_t",
            "params": []
        },
        /**
         * Get the count per second of the high resolution counter
         */
        SDL_GetPerformanceFrequency: {
            "output": "uint64_t",
            "params": []
        },
        /**
         * Wait a specified number of milliseconds before returning.
         */
        SDL_Delay: {
            "output": "void",
            "params": [
                {
                    "type": "uint",
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
            "output": "uint",
            "params": [
                {
                    "type": "uint",
                    "name": "interval"
                },
                {
                    "type": "void*",
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
            "output": "bool",
            "params": [
                {
                    "type": "uint",
                    "name": "id"
                }
            ]
        },
        /**
        *  This function initializes  the subsystems specified by \c flags
        */
        SDL_Init: {
            "output": "int",
            "params": [
                {
                    "type": "uint",
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
                    "type": "uint",
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
                    "type": "uint",
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
            "output": "uint",
            "params": [
                {
                    "type": "uint",
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
            "output": "uint",
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
            "output": "uint",
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
                    "type": "const char*",
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
                    "type": "uint",
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
            "output": "uint",
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
                    "type": "uint",
                    "name": "id"
                }
            ]
        },
        /**
         *  Get the window flags.
         */
        SDL_GetWindowFlags: {
            "output": "uint",
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
                    "type": "bool",
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
                    "type": "bool",
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
                    "type": "uint",
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
                    "type": "bool",
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
            "output": "bool",
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
                    "type": "uint",
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
            "output": "bool",
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
            "output": "bool",
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
                    "type": "uint",
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
                    "type": "uint",
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
            "output": "void*",
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
                    "type": "void*",
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
            "output": "void*",
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
                    "type": "void*",
                    "name": "context"
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
    } as const
});