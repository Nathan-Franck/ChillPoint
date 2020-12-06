import { FFI } from "./Util.FFI";

export const { types: sdl, values: SDL } = FFI.load_library({
    file_name: "SDL2",
    header: {
        /**
         *  This function initializes  the subsystems specified by \c flags
         */
        SDL_Init: {
            "output": "int",
            "params": {
                "flags": {
                "type": "Uint32",
                    "index": 0
                }
            }
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
            "params": {
                "flags": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        /**
         *  This function cleans up specific SDL subsystems
         */
        SDL_QuitSubSystem: {
            "output": "void",
            "params": {
                "flags": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        /**
         *  This function returns a mask of the specified subsystems which have
         *  previously been initialized.
         *
         *  If \c flags is 0, it returns a mask of all initialized subsystems.
         */
        SDL_WasInit: {
            "output": "Uint32",
            "params": {
                "flags": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        /**
         *  This function cleans up all initialized subsystems. You should
         *  call it upon all exit conditions.
         */
        SDL_Quit: {
            "output": "void",
            "params": {}
        },
        /**
         * Get the number of milliseconds since the SDL library initialization.
         *
         * @remarks This value wraps if the program runs for more than ~49 days.
         */
        SDL_GetTicks: {
            "output": "Uint32",
            "params": {}
        },
        /**
         * Get the current value of the high resolution counter
         */
        SDL_GetPerformanceCounter: {
            "output": "Uint64",
            "params": {}
        },
        /**
         * Get the count per second of the high resolution counter
         */
        SDL_GetPerformanceFrequency: {
            "output": "Uint64",
            "params": {}
        },
        /**
         * Wait a specified number of milliseconds before returning.
         */
        SDL_Delay: {
            "output": "void",
            "params": {
                "ms": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        /**
         * Add a new timer to the pool of timers already running.
         *
         * @returns A timer ID, or 0 when an error occurs.
         */
        SDL_AddTimer: {
            "output": "SDL_TimerID",
            "params": {
                "interval": {
                    "type": "Uint32",
                    "index": 0
                },
                "callback": {
                    "type": "SDL_TimerCallback",
                    "index": 1
                },
                "param": {
                    "type": "void*",
                    "index": 2
                }
            }
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
            "params": {
                "id": {
                    "type": "SDL_TimerID",
                    "index": 0
                }
            }
        },
        /**
         *  Get the number of video drivers compiled into SDL
         *
         *  @see SDL_GetVideoDriver()
         */
        SDL_GetNumVideoDrivers: {
            "output": "int",
            "params": {}
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
            "params": {
                "index": {
                    "type": "int",
                    "index": 0
                }
            }
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
            "params": {
                "driver_name": {
                    "type": "char*",
                    "index": 0
                }
            }
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
            "params": {}
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
            "params": {}
        },
        /**
         *  Returns the number of available video displays.
         *
         *  @see SDL_GetDisplayBounds()
         */
        SDL_GetNumVideoDisplays: {
            "output": "int",
            "params": {}
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "ddpi": {
                    "type": "float*",
                    "index": 1
                },
                "hdpi": {
                    "type": "float*",
                    "index": 2
                },
                "vdpi": {
                    "type": "float*",
                    "index": 3
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                }
            }
        },
        /**
         *  Returns the number of available display modes.
         *
         *  @see SDL_GetDisplayMode()
         */
        SDL_GetNumDisplayModes: {
            "output": "int",
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "modeIndex": {
                    "type": "int",
                    "index": 1
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 2
                }
            }
        },
        /**
         *  Fill in information about the desktop display mode.
         */
        SDL_GetDesktopDisplayMode: {
            "output": "int",
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 1
                }
            }
        },
        /**
         *  Fill in information about the current display mode.
         */
        SDL_GetCurrentDisplayMode: {
            "output": "int",
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 1
                }
            }
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
            "params": {
                "displayIndex": {
                    "type": "int",
                    "index": 0
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 1
                },
                "closest": {
                    "type": "SDL_DisplayMode*",
                    "index": 2
                }
            }
        },
        /**
         *  Get the display index associated with a window.
         *
         *  @returns the display index of the display containing the center of the
         *          window, or -1 on error.
         */
        SDL_GetWindowDisplayIndex: {
            "output": "int",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "mode": {
                    "type": "SDL_DisplayMode*",
                    "index": 1
                }
            }
        },
        /**
         *  Get the pixel format associated with the window.
         */
        SDL_GetWindowPixelFormat: {
            "output": "Uint32",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "title": {
                    "type": "char*",
                    "index": 0
                },
                "x": {
                    "type": "int",
                    "index": 1
                },
                "y": {
                    "type": "int",
                    "index": 2
                },
                "w": {
                    "type": "int",
                    "index": 3
                },
                "h": {
                    "type": "int",
                    "index": 4
                },
                "flags": {
                    "type": "Uint32",
                    "index": 5
                }
            }
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
            "params": {
                "data": {
                    "type": "void*",
                    "index": 0
                }
            }
        },
        /**
         *  Get the numeric ID of a window, for logging purposes.
         */
        SDL_GetWindowID: {
            "output": "Uint32",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Get a window from a stored ID, or NULL if it doesn't exist.
         */
        SDL_GetWindowFromID: {
            "output": "SDL_Window*",
            "params": {
                "id": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        /**
         *  Get the window flags.
         */
        SDL_GetWindowFlags: {
            "output": "Uint32",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Set the title of a window, in UTF-8 format.
         *
         *  @see SDL_GetWindowTitle()
         */
        SDL_SetWindowTitle: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "title": {
                    "type": "char*",
                    "index": 1
                }
            }
        },
        /**
         *  Get the title of a window, in UTF-8 format.
         *
         *  @see SDL_SetWindowTitle()
         */
        SDL_GetWindowTitle: {
            "output": "char*",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Set the icon for a window.
         *
         *  @param window The window for which the icon should be set.
         *  @param icon The icon for the window.
         */
        SDL_SetWindowIcon: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "icon": {
                    "type": "SDL_Surface*",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "name": {
                    "type": "char*",
                    "index": 1
                },
                "userdata": {
                    "type": "void*",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "name": {
                    "type": "char*",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "x": {
                    "type": "int",
                    "index": 1
                },
                "y": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "x": {
                    "type": "int*",
                    "index": 1
                },
                "y": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "w": {
                    "type": "int",
                    "index": 1
                },
                "h": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "top": {
                    "type": "int*",
                    "index": 1
                },
                "left": {
                    "type": "int*",
                    "index": 2
                },
                "bottom": {
                    "type": "int*",
                    "index": 3
                },
                "right": {
                    "type": "int*",
                    "index": 4
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "min_w": {
                    "type": "int",
                    "index": 1
                },
                "min_h": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "max_w": {
                    "type": "int",
                    "index": 1
                },
                "max_h": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "bordered": {
                    "type": "SDL_bool",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "resizable": {
                    "type": "SDL_bool",
                    "index": 1
                }
            }
        },
        /**
         *  Show a window.
         *
         *  @see SDL_HideWindow()
         */
        SDL_ShowWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Hide a window.
         *
         *  @see SDL_ShowWindow()
         */
        SDL_HideWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Raise a window above other windows and set the input focus.
         */
        SDL_RaiseWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Make a window as large as possible.
         *
         *  @see SDL_RestoreWindow()
         */
        SDL_MaximizeWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Minimize a window to an iconic representation.
         *
         *  @see SDL_RestoreWindow()
         */
        SDL_MinimizeWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Restore the size and position of a minimized or maximized window.
         *
         *  @see SDL_MaximizeWindow()
         *  @see SDL_MinimizeWindow()
         */
        SDL_RestoreWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "flags": {
                    "type": "Uint32",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "numrects": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "grabbed": {
                    "type": "SDL_bool",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {}
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "brightness": {
                    "type": "float",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "opacity": {
                    "type": "float",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "out_opacity": {
                    "type": "float*",
                    "index": 1
                }
            }
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
            "params": {
                "modal_window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "parent_window": {
                    "type": "SDL_Window*",
                    "index": 1
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "red": {
                    "type": "Uint16*",
                    "index": 1
                },
                "green": {
                    "type": "Uint16*",
                    "index": 2
                },
                "blue": {
                    "type": "Uint16*",
                    "index": 3
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "red": {
                    "type": "Uint16*",
                    "index": 1
                },
                "green": {
                    "type": "Uint16*",
                    "index": 2
                },
                "blue": {
                    "type": "Uint16*",
                    "index": 3
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "callback": {
                    "type": "SDL_HitTest",
                    "index": 1
                },
                "callback_data": {
                    "type": "void*",
                    "index": 2
                }
            }
        },
        /**
         *  Destroy a window.
         */
        SDL_DestroyWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Returns whether the screensaver is currently enabled (default off).
         *
         *  @see SDL_EnableScreenSaver()
         *  @see SDL_DisableScreenSaver()
         */
        SDL_IsScreenSaverEnabled: {
            "output": "SDL_bool",
            "params": {}
        },
        /**
         *  Allow the screen to be blanked by a screensaver
         *
         *  @see SDL_IsScreenSaverEnabled()
         *  @see SDL_DisableScreenSaver()
         */
        SDL_EnableScreenSaver: {
            "output": "void",
            "params": {}
        },
        /**
         *  Prevent the screen from being blanked by a screensaver
         *
         *  @see SDL_IsScreenSaverEnabled()
         *  @see SDL_EnableScreenSaver()
         */
        SDL_DisableScreenSaver: {
            "output": "void",
            "params": {}
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
            "params": {
                "path": {
                    "type": "char*",
                    "index": 0
                }
            }
        },
        /**
         *  Get the address of an OpenGL function.
         */
        SDL_GL_GetProcAddress: {
            "output": "void*",
            "params": {
                "proc": {
                    "type": "char*",
                    "index": 0
                }
            }
        },
        /**
         *  Unload the OpenGL library previously loaded by SDL_GL_LoadLibrary().
         *
         *  @see SDL_GL_LoadLibrary()
         */
        SDL_GL_UnloadLibrary: {
            "output": "void",
            "params": {}
        },
        /**
         *  Return true if an OpenGL extension is supported for the current
         *         context.
         */
        SDL_GL_ExtensionSupported: {
            "output": "SDL_bool",
            "params": {
                "extension": {
                    "type": "char*",
                    "index": 0
                }
            }
        },
        /**
         *  Reset all previously set OpenGL context attributes to their default values
         */
        SDL_GL_ResetAttributes: {
            "output": "void",
            "params": {}
        },
        /**
         *  Set an OpenGL window attribute before window creation.
         *
         *  @returns 0 on success, or -1 if the attribute could not be set.
         */
        SDL_GL_SetAttribute: {
            "output": "int",
            "params": {
                "attr": {
                    "type": "SDL_GLattr",
                    "index": 0
                },
                "value": {
                    "type": "int",
                    "index": 1
                }
            }
        },
        /**
         *  Get the actual value for an attribute from the current context.
         *
         *  @returns 0 on success, or -1 if the attribute could not be retrieved.
         *          The integer at \c value will be modified in either case.
         */
        SDL_GL_GetAttribute: {
            "output": "int",
            "params": {
                "attr": {
                    "type": "SDL_GLattr",
                    "index": 0
                },
                "value": {
                    "type": "int*",
                    "index": 1
                }
            }
        },
        /**
         *  Create an OpenGL context for use with an OpenGL window, and make it
         *         current.
         *
         *  @see SDL_GL_DeleteContext()
         */
        SDL_GL_CreateContext: {
            "output": "SDL_GLContext",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Set up an OpenGL context for rendering into an OpenGL window.
         *
         *  @remarks The context must have been created with a compatible window.
         */
        SDL_GL_MakeCurrent: {
            "output": "int",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "context": {
                    "type": "SDL_GLContext",
                    "index": 1
                }
            }
        },
        /**
         *  Get the currently active OpenGL window.
         */
        SDL_GL_GetCurrentWindow: {
            "output": "SDL_Window*",
            "params": {}
        },
        /**
         *  Get the currently active OpenGL context.
         */
        SDL_GL_GetCurrentContext: {
            "output": "SDL_GLContext",
            "params": {}
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "interval": {
                    "type": "int",
                    "index": 0
                }
            }
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
            "params": {}
        },
        /**
         * Swap the OpenGL buffers for a window, if double-buffering is
         *        supported.
         */
        SDL_GL_SwapWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Delete an OpenGL context.
         *
         *  @see SDL_GL_CreateContext()
         */
        SDL_GL_DeleteContext: {
            "output": "void",
            "params": {
                "context": {
                    "type": "SDL_GLContext",
                    "index": 0
                }
            }
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
            "params": {}
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
            "params": {
                "index": {
                    "type": "int",
                    "index": 0
                },
                "info": {
                    "type": "SDL_RendererInfo*",
                    "index": 1
                }
            }
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
            "params": {
                "width": {
                    "type": "int",
                    "index": 0
                },
                "height": {
                    "type": "int",
                    "index": 1
                },
                "window_flags": {
                    "type": "Uint32",
                    "index": 2
                },
                "window": {
                    "type": "SDL_Window**",
                    "index": 3
                },
                "renderer": {
                    "type": "SDL_Renderer**",
                    "index": 4
                }
            }
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
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "index": {
                    "type": "int",
                    "index": 1
                },
                "flags": {
                    "type": "Uint32",
                    "index": 2
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
        },
        /**
         *  Get the renderer associated with a window.
         */
        SDL_GetRenderer: {
            "output": "SDL_Renderer*",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                }
            }
        },
        /**
         *  Get information about a rendering context.
         */
        SDL_GetRendererInfo: {
            "output": "int",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "info": {
                    "type": "SDL_RendererInfo*",
                    "index": 1
                }
            }
        },
        /**
         *  Get the output size in pixels of a rendering context.
         */
        SDL_GetRendererOutputSize: {
            "output": "int",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "format": {
                    "type": "Uint32",
                    "index": 1
                },
                "access": {
                    "type": "int",
                    "index": 2
                },
                "w": {
                    "type": "int",
                    "index": 3
                },
                "h": {
                    "type": "int",
                    "index": 4
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "format": {
                    "type": "Uint32*",
                    "index": 1
                },
                "access": {
                    "type": "int*",
                    "index": 2
                },
                "w": {
                    "type": "int*",
                    "index": 3
                },
                "h": {
                    "type": "int*",
                    "index": 4
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8",
                    "index": 1
                },
                "g": {
                    "type": "Uint8",
                    "index": 2
                },
                "b": {
                    "type": "Uint8",
                    "index": 3
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8*",
                    "index": 1
                },
                "g": {
                    "type": "Uint8*",
                    "index": 2
                },
                "b": {
                    "type": "Uint8*",
                    "index": 3
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "alpha": {
                    "type": "Uint8",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "alpha": {
                    "type": "Uint8*",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode*",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "scaleMode": {
                    "type": "SDL_ScaleMode",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "scaleMode": {
                    "type": "SDL_ScaleMode*",
                    "index": 1
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "pixels": {
                    "type": "void*",
                    "index": 2
                },
                "pitch": {
                    "type": "int",
                    "index": 3
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "Yplane": {
                    "type": "Uint8*",
                    "index": 2
                },
                "Ypitch": {
                    "type": "int",
                    "index": 3
                },
                "Uplane": {
                    "type": "Uint8*",
                    "index": 4
                },
                "Upitch": {
                    "type": "int",
                    "index": 5
                },
                "Vplane": {
                    "type": "Uint8*",
                    "index": 6
                },
                "Vpitch": {
                    "type": "int",
                    "index": 7
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "pixels": {
                    "type": "void**",
                    "index": 2
                },
                "pitch": {
                    "type": "int*",
                    "index": 3
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "surface": {
                    "type": "SDL_Surface**",
                    "index": 2
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "w": {
                    "type": "int",
                    "index": 1
                },
                "h": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "w": {
                    "type": "int*",
                    "index": 1
                },
                "h": {
                    "type": "int*",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "enable": {
                    "type": "SDL_bool",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
        },
        /**
         *  Get the drawing area for the current target.
         *
         *  @see SDL_RenderSetViewport()
         */
        SDL_RenderGetViewport: {
            "output": "void",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "scaleX": {
                    "type": "float",
                    "index": 1
                },
                "scaleY": {
                    "type": "float",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "scaleX": {
                    "type": "float*",
                    "index": 1
                },
                "scaleY": {
                    "type": "float*",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8",
                    "index": 1
                },
                "g": {
                    "type": "Uint8",
                    "index": 2
                },
                "b": {
                    "type": "Uint8",
                    "index": 3
                },
                "a": {
                    "type": "Uint8",
                    "index": 4
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8*",
                    "index": 1
                },
                "g": {
                    "type": "Uint8*",
                    "index": 2
                },
                "b": {
                    "type": "Uint8*",
                    "index": 3
                },
                "a": {
                    "type": "Uint8*",
                    "index": 4
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "x": {
                    "type": "int",
                    "index": 1
                },
                "y": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "points": {
                    "type": "SDL_Point*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "x1": {
                    "type": "int",
                    "index": 1
                },
                "y1": {
                    "type": "int",
                    "index": 2
                },
                "x2": {
                    "type": "int",
                    "index": 3
                },
                "y2": {
                    "type": "int",
                    "index": 4
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "points": {
                    "type": "SDL_Point*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 1
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 1
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                },
                "angle": {
                    "type": "double",
                    "index": 4
                },
                "center": {
                    "type": "SDL_Point*",
                    "index": 5
                },
                "flip": {
                    "type": "SDL_RendererFlip",
                    "index": 6
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "x": {
                    "type": "float",
                    "index": 1
                },
                "y": {
                    "type": "float",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "points": {
                    "type": "SDL_FPoint*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "x1": {
                    "type": "float",
                    "index": 1
                },
                "y1": {
                    "type": "float",
                    "index": 2
                },
                "x2": {
                    "type": "float",
                    "index": 3
                },
                "y2": {
                    "type": "float",
                    "index": 4
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "points": {
                    "type": "SDL_FPoint*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_FRect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_FRect*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_FRect*",
                    "index": 1
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_FRect*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 1
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_FRect*",
                    "index": 3
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 1
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_FRect*",
                    "index": 3
                },
                "angle": {
                    "type": "double",
                    "index": 4
                },
                "center": {
                    "type": "SDL_FPoint*",
                    "index": 5
                },
                "flip": {
                    "type": "SDL_RendererFlip",
                    "index": 6
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "format": {
                    "type": "Uint32",
                    "index": 2
                },
                "pixels": {
                    "type": "void*",
                    "index": 3
                },
                "pitch": {
                    "type": "int",
                    "index": 4
                }
            }
        },
        /**
         *  Update the screen with rendering performed.
         */
        SDL_RenderPresent: {
            "output": "void",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
        },
        /**
         *  Destroy the specified texture.
         *
         *  @see SDL_CreateTexture()
         *  @see SDL_CreateTextureFromSurface()
         */
        SDL_DestroyTexture: {
            "output": "void",
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                }
            }
        },
        /**
         *  Destroy the rendering context for a window and free associated
         *         textures.
         *
         *  @see SDL_CreateRenderer()
         */
        SDL_DestroyRenderer: {
            "output": "void",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                },
                "texw": {
                    "type": "float*",
                    "index": 1
                },
                "texh": {
                    "type": "float*",
                    "index": 2
                }
            }
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
            "params": {
                "texture": {
                    "type": "SDL_Texture*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                }
            }
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
            "params": {}
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
            "params": {
                "org": {
                    "type": "char*",
                    "index": 0
                },
                "app": {
                    "type": "char*",
                    "index": 1
                }
            }
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
            "params": {
                "flags": {
                    "type": "Uint32",
                    "index": 0
                },
                "width": {
                    "type": "int",
                    "index": 1
                },
                "height": {
                    "type": "int",
                    "index": 2
                },
                "depth": {
                    "type": "int",
                    "index": 3
                },
                "Rmask": {
                    "type": "Uint32",
                    "index": 4
                },
                "Gmask": {
                    "type": "Uint32",
                    "index": 5
                },
                "Bmask": {
                    "type": "Uint32",
                    "index": 6
                },
                "Amask": {
                    "type": "Uint32",
                    "index": 7
                }
            }
        },
        /* !!! FIXME for 2.1: why does this ask for depth? Format provides that. */
        SDL_CreateRGBSurfaceWithFormat: {
            "output": "SDL_Surface*",
            "params": {
                "flags": {
                    "type": "Uint32",
                    "index": 0
                },
                "width": {
                    "type": "int",
                    "index": 1
                },
                "height": {
                    "type": "int",
                    "index": 2
                },
                "depth": {
                    "type": "int",
                    "index": 3
                },
                "format": {
                    "type": "Uint32",
                    "index": 4
                }
            }
        },
        SDL_CreateRGBSurfaceFrom: {
            "output": "SDL_Surface*",
            "params": {
                "pixels": {
                    "type": "void*",
                    "index": 0
                },
                "width": {
                    "type": "int",
                    "index": 1
                },
                "height": {
                    "type": "int",
                    "index": 2
                },
                "depth": {
                    "type": "int",
                    "index": 3
                },
                "pitch": {
                    "type": "int",
                    "index": 4
                },
                "Rmask": {
                    "type": "Uint32",
                    "index": 5
                },
                "Gmask": {
                    "type": "Uint32",
                    "index": 6
                },
                "Bmask": {
                    "type": "Uint32",
                    "index": 7
                },
                "Amask": {
                    "type": "Uint32",
                    "index": 8
                }
            }
        },
        SDL_CreateRGBSurfaceWithFormatFrom: {
            "output": "SDL_Surface*",
            "params": {
                "pixels": {
                    "type": "void*",
                    "index": 0
                },
                "width": {
                    "type": "int",
                    "index": 1
                },
                "height": {
                    "type": "int",
                    "index": 2
                },
                "depth": {
                    "type": "int",
                    "index": 3
                },
                "pitch": {
                    "type": "int",
                    "index": 4
                },
                "format": {
                    "type": "Uint32",
                    "index": 5
                }
            }
        },
        SDL_FreeSurface: {
            "output": "void",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "palette": {
                    "type": "SDL_Palette*",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
        },
        /** @see SDL_LockSurface() */
        SDL_UnlockSurface: {
            "output": "void",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
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
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                },
                "freesrc": {
                    "type": "int",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "dst": {
                    "type": "SDL_RWops*",
                    "index": 1
                },
                "freedst": {
                    "type": "int",
                    "index": 2
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "flag": {
                    "type": "int",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "flag": {
                    "type": "int",
                    "index": 1
                },
                "key": {
                    "type": "Uint32",
                    "index": 2
                }
            }
        },
        /**
         *  Returns whether the surface has a color key
         *
         *  @returns SDL_TRUE if the surface has a color key, or SDL_FALSE if the surface is NULL or has no color key
         */
        SDL_HasColorKey: {
            "output": "SDL_bool",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "key": {
                    "type": "Uint32*",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8",
                    "index": 1
                },
                "g": {
                    "type": "Uint8",
                    "index": 2
                },
                "b": {
                    "type": "Uint8",
                    "index": 3
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "r": {
                    "type": "Uint8*",
                    "index": 1
                },
                "g": {
                    "type": "Uint8*",
                    "index": 2
                },
                "b": {
                    "type": "Uint8*",
                    "index": 3
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "alpha": {
                    "type": "Uint8",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "alpha": {
                    "type": "Uint8*",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "blendMode": {
                    "type": "SDL_BlendMode*",
                    "index": 1
                }
            }
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
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
        },
        /**
         *  Gets the clipping rectangle for the destination surface in a blit.
         *
         *  \c rect must be a pointer to a valid rectangle which will be filled
         *  with the correct values.
         */
        SDL_GetClipRect: {
            "output": "void",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                }
            }
        },
        /*
         * Creates a new surface identical to the existing surface
         */
        SDL_DuplicateSurface: {
            "output": "SDL_Surface*",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                }
            }
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
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "fmt": {
                    "type": "SDL_PixelFormat*",
                    "index": 1
                },
                "flags": {
                    "type": "Uint32",
                    "index": 2
                }
            }
        },
        SDL_ConvertSurfaceFormat: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "pixel_format": {
                    "type": "Uint32",
                    "index": 1
                },
                "flags": {
                    "type": "Uint32",
                    "index": 2
                }
            }
        },
        /**
         * Copy a block of pixels of one format to another format
         *
         *  @returns 0 on success, or -1 if there was an error
         */
        SDL_ConvertPixels: {
            "output": "int",
            "params": {
                "width": {
                    "type": "int",
                    "index": 0
                },
                "height": {
                    "type": "int",
                    "index": 1
                },
                "src_format": {
                    "type": "Uint32",
                    "index": 2
                },
                "src": {
                    "type": "void*",
                    "index": 3
                },
                "src_pitch": {
                    "type": "int",
                    "index": 4
                },
                "dst_format": {
                    "type": "Uint32",
                    "index": 5
                },
                "dst": {
                    "type": "void*",
                    "index": 6
                },
                "dst_pitch": {
                    "type": "int",
                    "index": 7
                }
            }
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
            "params": {
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "rect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "color": {
                    "type": "Uint32",
                    "index": 2
                }
            }
        },
        SDL_FillRects: {
            "output": "int",
            "params": {
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "rects": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "count": {
                    "type": "int",
                    "index": 2
                },
                "color": {
                    "type": "Uint32",
                    "index": 3
                }
            }
        },
        /**
         *  This is the public blit function, SDL_BlitSurface(), and it performs
         *  rectangle validation and clipping before passing it to SDL_LowerBlit()
         */
        SDL_UpperBlit: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
        },
        /**
         *  This is a semi-private blit function and it performs low-level surface
         *  blitting only.
         */
        SDL_LowerBlit: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
        },
        /**
         *  Perform a fast, low quality, stretch blit between two surfaces of the
         *         same pixel format.
         *
         *  @remarks This function uses a static buffer, and is not thread-safe.
         */
        SDL_SoftStretch: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
        },
        /**
         *  This is the public scaled blit function, SDL_BlitScaled(), and it performs
         *  rectangle validation and clipping before passing it to SDL_LowerBlitScaled()
         */
        SDL_UpperBlitScaled: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
        },
        /**
         *  This is a semi-private blit function and it performs low-level surface
         *  scaled blitting only.
         */
        SDL_LowerBlitScaled: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "srcrect": {
                    "type": "SDL_Rect*",
                    "index": 1
                },
                "dst": {
                    "type": "SDL_Surface*",
                    "index": 2
                },
                "dstrect": {
                    "type": "SDL_Rect*",
                    "index": 3
                }
            }
        },
        /**
         *  Set the YUV conversion mode
         */
        SDL_SetYUVConversionMode: {
            "output": "void",
            "params": {
                "mode": {
                    "type": "SDL_YUV_CONVERSION_MODE",
                    "index": 0
                }
            }
        },
        /**
         *  Get the YUV conversion mode
         */
        SDL_GetYUVConversionMode: {
            "output": "SDL_YUV_CONVERSION_MODE",
            "params": {}
        },
        /**
         *  Get the YUV conversion mode, returning the correct mode for the resolution when the current conversion mode is SDL_YUV_CONVERSION_AUTOMATIC
         */
        SDL_GetYUVConversionModeForResolution: {
            "output": "SDL_YUV_CONVERSION_MODE",
            "params": {
                "width": {
                    "type": "int",
                    "index": 0
                },
                "height": {
                    "type": "int",
                    "index": 1
                }
            }
        },
        /**
         *  Pumps the event loop, gathering events from the input devices.
         *
         *  This function updates the event queue and internal input device state.
         *
         *  This should only be run in the thread that sets the video mode.
         */
        SDL_PumpEvents: {
            "output": "void",
            "params": {}
        },
        /**
         *  Checks the event queue for messages and optionally returns them.
         *
         *  If \c action is ::SDL_ADDEVENT, up to \c numevents events will be added to
         *  the back of the event queue.
         *
         *  If \c action is ::SDL_PEEKEVENT, up to \c numevents events at the front
         *  of the event queue, within the specified minimum and maximum type,
         *  will be returned and will not be removed from the queue.
         *
         *  If \c action is ::SDL_GETEVENT, up to \c numevents events at the front
         *  of the event queue, within the specified minimum and maximum type,
         *  will be returned and will be removed from the queue.
         *
         *  @returns The number of events actually stored, or -1 if there was an error.
         *
         *  This function is thread-safe.
         */
        SDL_PeepEvents: {
            "output": "int",
            "params": {
                "events": {
                    "type": "SDL_Event*",
                    "index": 0
                },
                "numevents": {
                    "type": "int",
                    "index": 1
                },
                "action": {
                    "type": "SDL_eventaction",
                    "index": 2
                },
                "minType": {
                    "type": "Uint32",
                    "index": 3
                },
                "maxType": {
                    "type": "Uint32",
                    "index": 4
                }
            }
        },
        /**
         *  Checks to see if certain event types are in the event queue.
         */
        SDL_HasEvent: {
            "output": "SDL_bool",
            "params": {
                "type": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        SDL_HasEvents: {
            "output": "SDL_bool",
            "params": {
                "minType": {
                    "type": "Uint32",
                    "index": 0
                },
                "maxType": {
                    "type": "Uint32",
                    "index": 1
                }
            }
        },
        /**
         *  This function clears events from the event queue
         *  This function only affects currently queued events. If you want to make
         *  sure that all pending OS events are flushed, you can call SDL_PumpEvents()
         *  on the main thread immediately before the flush call.
         */
        SDL_FlushEvent: {
            "output": "void",
            "params": {
                "type": {
                    "type": "Uint32",
                    "index": 0
                }
            }
        },
        SDL_FlushEvents: {
            "output": "void",
            "params": {
                "minType": {
                    "type": "Uint32",
                    "index": 0
                },
                "maxType": {
                    "type": "Uint32",
                    "index": 1
                }
            }
        },
        /**
         *  Polls for currently pending events.
         *
         *  @returns 1 if there are any pending events, or 0 if there are none available.
         *
         *  @param event If not NULL, the next event is removed from the queue and
         *               stored in that area.
         */
        SDL_PollEvent: {
            "output": "int",
            "params": {
                "event": {
                    "type": "SDL_Event*",
                    "index": 0
                }
            }
        },
        /**
         *  Waits indefinitely for the next available event.
         *
         *  @returns 1, or 0 if there was an error while waiting for events.
         *
         *  @param event If not NULL, the next event is removed from the queue and
         *               stored in that area.
         */
        SDL_WaitEvent: {
            "output": "int",
            "params": {
                "event": {
                    "type": "SDL_Event*",
                    "index": 0
                }
            }
        },
        /**
         *  Waits until the specified timeout (in milliseconds) for the next
         *         available event.
         *
         *  @returns 1, or 0 if there was an error while waiting for events.
         *
         *  @param event If not NULL, the next event is removed from the queue and
         *               stored in that area.
         *  @param timeout The timeout (in milliseconds) to wait for next event.
         */
        SDL_WaitEventTimeout: {
            "output": "int",
            "params": {
                "event": {
                    "type": "SDL_Event*",
                    "index": 0
                },
                "timeout": {
                    "type": "int",
                    "index": 1
                }
            }
        },
        /**
         *  Add an event to the event queue.
         *
         *  @returns 1 on success, 0 if the event was filtered, or -1 if the event queue
         *          was full or there was some other error.
         */
        SDL_PushEvent: {
            "output": "int",
            "params": {
                "event": {
                    "type": "SDL_Event*",
                    "index": 0
                }
            }
        },
        /**
         *  Sets up a filter to process all events before they change internal state and
         *  are posted to the internal event queue.
         *
         *  The filter is prototyped as:
         *  \code
         *      int SDL_EventFilter(void *userdata, SDL_Event * event);
         *  \endcode
         *
         *  If the filter returns 1, then the event will be added to the internal queue.
         *  If it returns 0, then the event will be dropped from the queue, but the
         *  internal state will still be updated.  This allows selective filtering of
         *  dynamically arriving events.
         *
         *  \warning  Be very careful of what you do in the event filter function, as
         *            it may run in a different thread!
         *
         *  There is one caveat when dealing with the ::SDL_QuitEvent event type.  The
         *  event filter is only called when the window manager desires to close the
         *  application window.  If the event filter returns 1, then the window will
         *  be closed, otherwise the window will remain open if possible.
         *
         *  If the quit event is generated by an interrupt signal, it will bypass the
         *  internal queue and be delivered to the application at the next event poll.
         */
        SDL_SetEventFilter: {
            "output": "void",
            "params": {
                "filter": {
                    "type": "SDL_EventFilter",
                    "index": 0
                },
                "userdata": {
                    "type": "void*",
                    "index": 1
                }
            }
        },
        /**
         *  Return the current event filter - can be used to "chain" filters.
         *  If there is no event filter set, this function returns SDL_FALSE.
         */
        SDL_GetEventFilter: {
            "output": "SDL_bool",
            "params": {
                "filter": {
                    "type": "SDL_EventFilter*",
                    "index": 0
                },
                "userdata": {
                    "type": "void**",
                    "index": 1
                }
            }
        },
        /**
         *  Add a function which is called when an event is added to the queue.
         */
        SDL_AddEventWatch: {
            "output": "void",
            "params": {
                "filter": {
                    "type": "SDL_EventFilter",
                    "index": 0
                },
                "userdata": {
                    "type": "void*",
                    "index": 1
                }
            }
        },
        /**
         *  Remove an event watch function added with SDL_AddEventWatch()
         */
        SDL_DelEventWatch: {
            "output": "void",
            "params": {
                "filter": {
                    "type": "SDL_EventFilter",
                    "index": 0
                },
                "userdata": {
                    "type": "void*",
                    "index": 1
                }
            }
        },
        /**
         *  Run the filter function on the current event queue, removing any
         *  events for which the filter returns 0.
         */
        SDL_FilterEvents: {
            "output": "void",
            "params": {
                "filter": {
                    "type": "SDL_EventFilter",
                    "index": 0
                },
                "userdata": {
                    "type": "void*",
                    "index": 1
                }
            }
        },
        /**
         *  This function allows you to set the state of processing certain events.
         *   - If \c state is set to ::SDL_IGNORE, that event will be automatically
         *     dropped from the event queue and will not be filtered.
         *   - If \c state is set to ::SDL_ENABLE, that event will be processed
         *     normally.
         *   - If \c state is set to ::SDL_QUERY, SDL_EventState() will return the
         *     current processing state of the specified event.
         */
        SDL_EventState: {
            "output": "Uint8",
            "params": {
                "type": {
                    "type": "Uint32",
                    "index": 0
                },
                "state": {
                    "type": "int",
                    "index": 1
                }
            }
        },
        /**
         *  This function allocates a set of user-defined events, and returns
         *  the beginning event number for that set of events.
         *
         *  If there aren't enough user-defined events left, this function
         *  returns (Uint32)-1
         */
        SDL_RegisterEvents: {
            "output": "Uint32",
            "params": {
                "numevents": {
                    "type": "int",
                    "index": 0
                }
            }
        },
        /**
         *  Get the window which currently has mouse focus.
         */
        SDL_GetMouseFocus: {
            "output": "SDL_Window*",
            "params": {}
        },
        /**
         *  Retrieve the current state of the mouse.
         *
         *  The current button state is returned as a button bitmask, which can
         *  be tested using the SDL_BUTTON(X) macros, and x and y are set to the
         *  mouse cursor position relative to the focus window for the currently
         *  selected mouse.  You can pass NULL for either x or y.
         */
        SDL_GetMouseState: {
            "output": "Uint32",
            "params": {
                "x": {
                    "type": "int*",
                    "index": 0
                },
                "y": {
                    "type": "int*",
                    "index": 1
                }
            }
        },
        /**
         *  Get the current state of the mouse, in relation to the desktop
         *
         *  This works just like SDL_GetMouseState(), but the coordinates will be
         *  reported relative to the top-left of the desktop. This can be useful if
         *  you need to track the mouse outside of a specific window and
         *  SDL_CaptureMouse() doesn't fit your needs. For example, it could be
         *  useful if you need to track the mouse while dragging a window, where
         *  coordinates relative to a window might not be in sync at all times.
         *
         *  @remarks SDL_GetMouseState() returns the mouse position as SDL understands
         *        it from the last pump of the event queue. This function, however,
         *        queries the OS for the current mouse position, and as such, might
         *        be a slightly less efficient function. Unless you know what you're
         *        doing and have a good reason to use this function, you probably want
         *        SDL_GetMouseState() instead.
         *
         *  @param x Returns the current X coord, relative to the desktop. Can be NULL.
         *  @param y Returns the current Y coord, relative to the desktop. Can be NULL.
         *  @returns The current button state as a bitmask, which can be tested using the SDL_BUTTON(X) macros.
         *
         *  @see SDL_GetMouseState
         */
        SDL_GetGlobalMouseState: {
            "output": "Uint32",
            "params": {
                "x": {
                    "type": "int*",
                    "index": 0
                },
                "y": {
                    "type": "int*",
                    "index": 1
                }
            }
        },
        /**
         *  Retrieve the relative state of the mouse.
         *
         *  The current button state is returned as a button bitmask, which can
         *  be tested using the SDL_BUTTON(X) macros, and x and y are set to the
         *  mouse deltas since the last call to SDL_GetRelativeMouseState().
         */
        SDL_GetRelativeMouseState: {
            "output": "Uint32",
            "params": {
                "x": {
                    "type": "int*",
                    "index": 0
                },
                "y": {
                    "type": "int*",
                    "index": 1
                }
            }
        },
        /**
         *  Moves the mouse to the given position within the window.
         *
         *  @param window The window to move the mouse into, or NULL for the current mouse focus
         *  @param x The x coordinate within the window
         *  @param y The y coordinate within the window
         *
         *  @remarks This function generates a mouse motion event
         */
        SDL_WarpMouseInWindow: {
            "output": "void",
            "params": {
                "window": {
                    "type": "SDL_Window*",
                    "index": 0
                },
                "x": {
                    "type": "int",
                    "index": 1
                },
                "y": {
                    "type": "int",
                    "index": 2
                }
            }
        },
        /**
         *  Moves the mouse to the given position in global screen space.
         *
         *  @param x The x coordinate
         *  @param y The y coordinate
         *  @returns 0 on success, -1 on error (usually: unsupported by a platform).
         *
         *  @remarks This function generates a mouse motion event
         */
        SDL_WarpMouseGlobal: {
            "output": "int",
            "params": {
                "x": {
                    "type": "int",
                    "index": 0
                },
                "y": {
                    "type": "int",
                    "index": 1
                }
            }
        },
        /**
         *  Set relative mouse mode.
         *
         *  @param enabled Whether or not to enable relative mode
         *
         *  @returns 0 on success, or -1 if relative mode is not supported.
         *
         *  While the mouse is in relative mode, the cursor is hidden, and the
         *  driver will try to report continuous motion in the current window.
         *  Only relative motion events will be delivered, the mouse position
         *  will not change.
         *
         *  @remarks This function will flush any pending mouse motion.
         *
         *  @see SDL_GetRelativeMouseMode()
         */
        SDL_SetRelativeMouseMode: {
            "output": "int",
            "params": {
                "enabled": {
                    "type": "SDL_bool",
                    "index": 0
                }
            }
        },
        /**
         *  Capture the mouse, to track input outside an SDL window.
         *
         *  @param enabled Whether or not to enable capturing
         *
         *  Capturing enables your app to obtain mouse events globally, instead of
         *  just within your window. Not all video targets support this function.
         *  When capturing is enabled, the current window will get all mouse events,
         *  but unlike relative mode, no change is made to the cursor and it is
         *  not restrained to your window.
         *
         *  This function may also deny mouse input to other windows--both those in
         *  your application and others on the system--so you should use this
         *  function sparingly, and in small bursts. For example, you might want to
         *  track the mouse while the user is dragging something, until the user
         *  releases a mouse button. It is not recommended that you capture the mouse
         *  for long periods of time, such as the entire time your app is running.
         *
         *  While captured, mouse events still report coordinates relative to the
         *  current (foreground) window, but those coordinates may be outside the
         *  bounds of the window (including negative values). Capturing is only
         *  allowed for the foreground window. If the window loses focus while
         *  capturing, the capture will be disabled automatically.
         *
         *  While capturing is enabled, the current window will have the
         *  SDL_WINDOW_MOUSE_CAPTURE flag set.
         *
         *  @returns 0 on success, or -1 if not supported.
         */
        SDL_CaptureMouse: {
            "output": "int",
            "params": {
                "enabled": {
                    "type": "SDL_bool",
                    "index": 0
                }
            }
        },
        /**
         *  Query whether relative mouse mode is enabled.
         *
         *  @see SDL_SetRelativeMouseMode()
         */
        SDL_GetRelativeMouseMode: {
            "output": "SDL_bool",
            "params": {}
        },
        /**
         *  Create a cursor, using the specified bitmap data and
         *         mask (in MSB format).
         *
         *  The cursor width must be a multiple of 8 bits.
         *
         *  The cursor is created in black and white according to the following:
         *  <table>
         *  <tr><td> data </td><td> mask </td><td> resulting pixel on screen </td></tr>
         *  <tr><td>  0   </td><td>  1   </td><td> White </td></tr>
         *  <tr><td>  1   </td><td>  1   </td><td> Black </td></tr>
         *  <tr><td>  0   </td><td>  0   </td><td> Transparent </td></tr>
         *  <tr><td>  1   </td><td>  0   </td><td> Inverted color if possible, black
         *                                         if not. </td></tr>
         *  </table>
         *
         *  @see SDL_FreeCursor()
         */
        SDL_CreateCursor: {
            "output": "SDL_Cursor*",
            "params": {
                "data": {
                    "type": "Uint8*",
                    "index": 0
                },
                "mask": {
                    "type": "Uint8*",
                    "index": 1
                },
                "w": {
                    "type": "int",
                    "index": 2
                },
                "h": {
                    "type": "int",
                    "index": 3
                },
                "hot_x": {
                    "type": "int",
                    "index": 4
                },
                "hot_y": {
                    "type": "int",
                    "index": 5
                }
            }
        },
        /**
         *  Create a color cursor.
         *
         *  @see SDL_FreeCursor()
         */
        SDL_CreateColorCursor: {
            "output": "SDL_Cursor*",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "hot_x": {
                    "type": "int",
                    "index": 1
                },
                "hot_y": {
                    "type": "int",
                    "index": 2
                }
            }
        },
        /**
         *  Create a system cursor.
         *
         *  @see SDL_FreeCursor()
         */
        SDL_CreateSystemCursor: {
            "output": "SDL_Cursor*",
            "params": {
                "id": {
                    "type": "SDL_SystemCursor",
                    "index": 0
                }
            }
        },
        /**
         *  Set the active cursor.
         */
        SDL_SetCursor: {
            "output": "void",
            "params": {
                "cursor": {
                    "type": "SDL_Cursor*",
                    "index": 0
                }
            }
        },
        /**
         *  Return the active cursor.
         */
        SDL_GetCursor: {
            "output": "SDL_Cursor*",
            "params": {}
        },
        /**
         *  Return the default cursor.
         */
        SDL_GetDefaultCursor: {
            "output": "SDL_Cursor*",
            "params": {}
        },
        /**
         *  Frees a cursor created with SDL_CreateCursor() or similar functions.
         *
         *  @see SDL_CreateCursor()
         *  @see SDL_CreateColorCursor()
         *  @see SDL_CreateSystemCursor()
         */
        SDL_FreeCursor: {
            "output": "void",
            "params": {
                "cursor": {
                    "type": "SDL_Cursor*",
                    "index": 0
                }
            }
        },
        /**
         *  Toggle whether or not the cursor is shown.
         *
         *  @param toggle 1 to show the cursor, 0 to hide it, -1 to query the current
         *                state.
         *
         *  @returns 1 if the cursor is shown, or 0 if the cursor is hidden.
         */
        SDL_ShowCursor: {
            "output": "int",
            "params": {
                "toggle": {
                    "type": "int",
                    "index": 0
                }
            }
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
        SDL_RENDERER_TARGETTEXTURE: 0x00000008,

        /**< Key pressed */
        SDL_KEYDOWN: 0x300,
        /**< Key released */
        SDL_KEYUP: 0x301,
        /**< Keyboard text editing (composition) */
        SDL_TEXTEDITING: 0x302,
        /**< Keyboard text input */
        SDL_TEXTINPUT: 0x303,
        /**< Mouse moved */
        SDL_MOUSEMOTION: 0x400,
        /**< Mouse button pressed */
        SDL_MOUSEBUTTONDOWN: 0x401,
        /**< Mouse button released */
        SDL_MOUSEBUTTONUP: 0x402,
        /**< Mouse wheel motion */
        SDL_MOUSEWHEEL: 0x403,
    } as const
});