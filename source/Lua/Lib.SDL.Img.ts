import { FFI } from "./Util.FFI";

export const { types: sdl_img, values: SDL_IMG } = FFI.load_library({
    values: {
        IMG_INIT_JPG: 0x00000001,
        IMG_INIT_PNG: 0x00000002,
        IMG_INIT_TIF: 0x00000004,
        IMG_INIT_WEBP: 0x00000008
    } as const,
    file_name: "SDL2_image",
    structs: {},
    functions: {
        /* This function gets the version of the dynamically linked SDL_image library.
           it should NOT be used to fill a version structure, instead you should
           use the SDL_IMAGE_VERSION() macro.
         */
        IMG_Linked_Version: {
            "output": "SDL_version*",
            "params": {}
        },
        /* Loads dynamic libraries and prepares them for use.  Flags should be
           one or more flags from IMG_InitFlags OR'd together.
           It returns the flags successfully initialized, or 0 on failure.
         */
        IMG_Init: {
            "output": "int",
            "params": {
                "flags": {
                    "type": "int",
                    "index": 0
                }
            }
        },
        /* Unloads libraries loaded with IMG_Init */
        IMG_Quit: {
            "output": "void",
            "params": {}
        },
        /* Load an image from an SDL data source.
           The 'type' may be one of: "BMP", "GIF", "PNG", etc.
        
           If the image format supports a transparent pixel, SDL will set the
           colorkey for the surface.  You can enable RLE acceleration on the
           surface afterwards by calling:
            SDL_SetColorKey(image, SDL_RLEACCEL, image->format->colorkey);
         */
        IMG_LoadTyped_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                },
                "freesrc": {
                    "type": "int",
                    "index": 1
                },
                "type": {
                    "type": "char*",
                    "index": 2
                }
            }
        },
        /* Convenience functions */
        IMG_Load: {
            "output": "SDL_Surface*",
            "params": {
                "file": {
                    "type": "char*",
                    "index": 0
                }
            }
        },
        IMG_Load_RW: {
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
        /* Load an image directly into a render texture.
         */
        IMG_LoadTexture: {
            "output": "SDL_Texture*",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "file": {
                    "type": "char*",
                    "index": 1
                }
            }
        },
        IMG_LoadTexture_RW: {
            "output": "SDL_Texture*",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "src": {
                    "type": "SDL_RWops*",
                    "index": 1
                },
                "freesrc": {
                    "type": "int",
                    "index": 2
                }
            }
        },
        IMG_LoadTextureTyped_RW: {
            "output": "SDL_Texture*",
            "params": {
                "renderer": {
                    "type": "SDL_Renderer*",
                    "index": 0
                },
                "src": {
                    "type": "SDL_RWops*",
                    "index": 1
                },
                "freesrc": {
                    "type": "int",
                    "index": 2
                },
                "type": {
                    "type": "char*",
                    "index": 3
                }
            }
        },
        /* Functions to detect a file type, given a seekable source */
        IMG_isICO: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isCUR: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isBMP: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isGIF: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isJPG: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isLBM: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isPCX: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isPNG: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isPNM: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isSVG: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isTIF: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isXCF: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isXPM: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isXV: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_isWEBP: {
            "output": "int",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        /* Individual loading functions */
        IMG_LoadICO_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadCUR_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadBMP_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadGIF_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadJPG_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadLBM_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadPCX_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadPNG_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadPNM_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadSVG_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadTGA_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadTIF_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadXCF_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadXPM_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadXV_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_LoadWEBP_RW: {
            "output": "SDL_Surface*",
            "params": {
                "src": {
                    "type": "SDL_RWops*",
                    "index": 0
                }
            }
        },
        IMG_ReadXPMFromArray: {
            "output": "SDL_Surface*",
            "params": {
                "xpm": {
                    "type": "char**",
                    "index": 0
                }
            }
        },
        /* Individual saving functions */
        IMG_SavePNG: {
            "output": "int",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "file": {
                    "type": "char*",
                    "index": 1
                }
            }
        },
        IMG_SavePNG_RW: {
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
        IMG_SaveJPG: {
            "output": "int",
            "params": {
                "surface": {
                    "type": "SDL_Surface*",
                    "index": 0
                },
                "file": {
                    "type": "char*",
                    "index": 1
                },
                "quality": {
                    "type": "int",
                    "index": 2
                }
            }
        },
        IMG_SaveJPG_RW: {
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
                },
                "quality": {
                    "type": "int",
                    "index": 3
                }
            }
        }
    } as const,
});