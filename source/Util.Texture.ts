export namespace Texture {
	export async function load(gl: WebGL2RenderingContext, url: string) {
		return await new Promise<WebGLTexture>((resolve) => {
			const texture = gl.createTexture();
			if (texture == null) {
				throw new Error("Texture is null, this is not expected!");
			}
			gl.bindTexture(gl.TEXTURE_2D, texture);
	
			const textureSettings = {
				level: 0,
				internalFormat: gl.RGBA,
				srcFormat: gl.RGBA,
				srcType: gl.UNSIGNED_BYTE,
			};

			const image = new Image();
			image.onload = () => {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, textureSettings.level, textureSettings.internalFormat,
					textureSettings.srcFormat, textureSettings.srcType, image);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
				resolve(texture);
			};
			image.src = url;
		});
	}

	export function create_buffer(gl: WebGLRenderingContext, data: Float32Array) {
		const buffer = gl.createBuffer();
		if (buffer == null) {
			throw new Error("Buffer is null, this is not expected!");
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return buffer;
	}
}