import { FFI } from "./Util.FFI";

export const { types: sdl_img, values: SDL_IMG }= FFI.load_library({
    values: {
        IMG_INIT_JPG: 0x00000001,
        IMG_INIT_PNG: 0x00000002,
        IMG_INIT_TIF: 0x00000004,
        IMG_INIT_WEBP: 0x00000008
    } as const,
    file_name: "SDL2_image",
    header: {
        /* This function gets the version of the dynamically linked SDL_image library.
           it should NOT be used to fill a version structure, instead you should
           use the SDL_IMAGE_VERSION() macro.
         */
        IMG_Linked_Version: {
            "output": "SDL_version*",
            "params": []
        },
        /* Loads dynamic libraries and prepares them for use.  Flags should be
           one or more flags from IMG_InitFlags OR'd together.
           It returns the flags successfully initialized, or 0 on failure.
         */
        IMG_Init: {
            "output": "int",
            "params": [
                {
                    "type": "int",
                    "name": "flags"
                }
            ]
        },
        /* Unloads libraries loaded with IMG_Init */
        IMG_Quit: {
            "output": "void",
            "params": []
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
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                },
                {
                    "type": "int",
                    "name": "freesrc"
                },
                {
                    "type": "char*",
                    "name": "type"
                }
            ]
        },
        /* Convenience functions */
        IMG_Load: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "char*",
                    "name": "file"
                }
            ]
        },
        IMG_Load_RW: {
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
        /* Load an image directly into a render texture.
         */
        IMG_LoadTexture: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "char*",
                    "name": "file"
                }
            ]
        },
        IMG_LoadTexture_RW: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
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
        IMG_LoadTextureTyped_RW: {
            "output": "SDL_Texture*",
            "params": [
                {
                    "type": "SDL_Renderer*",
                    "name": "renderer"
                },
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                },
                {
                    "type": "int",
                    "name": "freesrc"
                },
                {
                    "type": "char*",
                    "name": "type"
                }
            ]
        },
        /* Functions to detect a file type, given a seekable source */
        IMG_isICO: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isCUR: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isBMP: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isGIF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isJPG: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isLBM: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isPCX: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isPNG: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isPNM: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isSVG: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isTIF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isXCF: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isXPM: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isXV: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_isWEBP: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        /* Individual loading functions */
        IMG_LoadICO_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadCUR_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadBMP_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadGIF_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadJPG_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadLBM_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadPCX_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadPNG_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadPNM_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadSVG_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadTGA_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadTIF_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadXCF_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadXPM_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadXV_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_LoadWEBP_RW: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "SDL_RWops*",
                    "name": "src"
                }
            ]
        },
        IMG_ReadXPMFromArray: {
            "output": "SDL_Surface*",
            "params": [
                {
                    "type": "char**",
                    "name": "xpm"
                }
            ]
        },
        /* Individual saving functions */
        IMG_SavePNG: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "char*",
                    "name": "file"
                }
            ]
        },
        IMG_SavePNG_RW: {
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
        IMG_SaveJPG: {
            "output": "int",
            "params": [
                {
                    "type": "SDL_Surface*",
                    "name": "surface"
                },
                {
                    "type": "char*",
                    "name": "file"
                },
                {
                    "type": "int",
                    "name": "quality"
                }
            ]
        },
        IMG_SaveJPG_RW: {
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
                },
                {
                    "type": "int",
                    "name": "quality"
                }
            ]
        }
    } as const,
});