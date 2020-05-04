export namespace GLTexture {
	export async function load(gl: WebGL2RenderingContext, url: string) {
		return await new Promise<WebGLTexture | null>((resolve) => {
			const texture = gl.createTexture();
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
}