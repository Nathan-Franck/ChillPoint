import { Scripting, AllowedKeys } from "./Util.Scripting";
import { Vec2, Vec3, Vec4 } from "./Util.VecMath";
import { POINT_CONVERSION_UNCOMPRESSED } from "constants";

export type GLSLUnit = "float" | "vec2" | "vec3" | "vec4";
export type GLSLUniformUnit = "float" | "vec2" | "vec3" | "vec4" | "sampler2D";
export type Varying = {
	readonly type: "varying",
	readonly unit: GLSLUnit,
};
export type Attribute = {
	readonly type: "attribute",
	readonly unit: GLSLUnit,
	readonly instanced?: true,
};
export type Element = {
	readonly type: "element",
};
export type Uniform = {
	readonly type: "uniform",
	readonly unit: GLSLUniformUnit,
	readonly count: number,
};
export const unit_to_stride = {
	float: 1,
	vec2: 2,
	vec3: 3,
	vec4: 4,
} as const;
export type SizedBuffer = {
	type: "attribute",
	buffer: WebGLBuffer,
	length: number,
};
export type ElementBuffer = {
	type: "element",
	buffer: WebGLBuffer,
	length: number,
};
export type Binds<T> =
	& { readonly [key in AllowedKeys<T, { type: "uniform", unit: "float" }>]: readonly number[] }
	& { readonly [key in AllowedKeys<T, { type: "uniform", unit: "vec2" }>]: readonly Vec2[] }
	& { readonly [key in AllowedKeys<T, { type: "uniform", unit: "vec3" }>]: readonly Vec3[] }
	& { readonly [key in AllowedKeys<T, { type: "uniform", unit: "vec4" }>]: readonly Vec4[] }
	& { readonly [key in AllowedKeys<T, { type: "uniform", unit: "sampler2D" }>]: readonly WebGLTexture[] }
	& { readonly [key in AllowedKeys<T, Attribute>]: SizedBuffer }
	& { readonly [key in AllowedKeys<T, Element>]: ElementBuffer }

export type ShaderGlobals = {
	readonly [key: string]:
	| Varying
	| Attribute
	| Uniform
	| Element
};

export namespace ShaderBuilder {

	export function varying_text(key: string, element: Varying) {
		return `${element.type} highp ${element.unit} ${key};`;
	}

	export function attribute_text(key: string, element: Attribute) {
		return `${element.type} ${element.unit} ${key}; `
	}

	export function uniform_text(key: string, element: Uniform) {
		return `${element.type} ${
			element.unit == "sampler2D" ? `` : `highp`} ${element.unit} ${key}${
			element.count > 1 ? `[${element.count}]` : ``};`
	}

	export function to_vert_text(props: ShaderGlobals) {
		return Scripting.getKeys(props).reduce((text, key) => {
			const element = props[key];
			return `${text}\n ${
				element.type == "varying" ?
					varying_text(key as string, element) :
					element.type == "attribute" ?
						attribute_text(key as string, element) :
						element.type == "uniform" ?
							uniform_text(key as string, element) :
							""
				}`;
		}, "");
	}

	export function to_frag_text(props: ShaderGlobals) {
		return Scripting.getKeys(props).reduce((text, key) => {
			const element = props[key];
			return `${text}${
				element.type == "varying" ?
					varying_text(key as string, element) :
					element.type == "uniform" ?
						uniform_text(key as string, element) :
						""
				}\n`;
		}, "");
	}

	export type Environment<T extends ShaderGlobals> = {
		readonly globals: T,
		readonly vert_source: string,
		readonly frag_source: string,
	};

	export type Material<T extends ShaderGlobals> = {
		readonly program: WebGLProgram,
	} & Environment<T>;

	export function generate_material<T extends ShaderGlobals>(
		gl: WebGL2RenderingContext,
		environment: Environment<T>,
	) {
		// ✨🎨 Create fragment shader object
		const program = gl.createProgram();
		if (program == null) {
			throw new Error("Vertex/Fragment shader not properly initialized");
		}
		const vert_source = `
				${to_vert_text(environment.globals)}
				${environment.vert_source}
			`;
		const frag_source = `
				${to_frag_text(environment.globals)}
				${environment.frag_source}
			`;
		[vert_source, frag_source].forEach((source, index) => {
			const shader = gl.createShader(index == 0 ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
			if (shader == null) {
				throw new Error("Vertex/Fragment shader not properly initialized");
			}
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			gl.attachShader(program, shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				const split_info = gl.getShaderInfoLog(shader)?.split("ERROR:");
				if (split_info != null) {
					const errors = split_info.slice(1, split_info?.length);
					for (let error of errors) {
						const location = error.split(":")[1];
						console.log(source.split("\n")[parseInt(location) - 1])
						console.error(error);
					}
				}
			}
		});

		gl.linkProgram(program);

		return {
			...environment,
			program,
			frag_source,
			vert_source,
		} as const;
	}

	export async function load_texture(gl: WebGL2RenderingContext, url: string) {
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

	export function create_element_buffer(gl: WebGL2RenderingContext, data: Uint16Array | Uint32Array): ElementBuffer {
		const buffer = gl.createBuffer();
		if (buffer == null) {
			throw new Error("Buffer is null, this is not expected!");
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return { type: "element", buffer, length: data.length };
	}

	export function create_buffer(gl: WebGL2RenderingContext, data: Float32Array): SizedBuffer {
		const buffer = gl.createBuffer();
		if (buffer == null) {
			throw new Error("Buffer is null, this is not expected!");
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		return { type: "attribute", buffer, length: data.length };
	}

	export function render_material<T extends ShaderGlobals>(
		gl: WebGL2RenderingContext,
		material: Material<T>,
		binds: Binds<T>,
	) {
		gl.useProgram(material.program);

		{ // 🦗 Setting uniform variables including textures
			Object.entries(material.globals)
				.filter((entry): entry is [string, Uniform] =>
					entry[1].type == "uniform")
				.reduce((texture_index, entry) => {
					const [key, global] = entry;
					const uniformLocation = gl.getUniformLocation(material.program, key as string);

					switch (global.unit) {
						case "sampler2D":
							const textures = (binds as any)[key] as WebGLTexture[];
							const indices = textures.map((data, sub_index) => {
								const active_texture_index = texture_index + sub_index;
								gl.activeTexture(gl.TEXTURE0 + active_texture_index);
								gl.bindTexture(gl.TEXTURE_2D, data);
								return active_texture_index;
							})
							gl.uniform1iv(uniformLocation, indices);
							return texture_index + indices.length;
						case "float":
							const floats = (binds as any)[key] as number[];
							gl.uniform1fv(uniformLocation, floats);
							break;
						case "vec2":
							const vec2s = (binds as any)[key] as Vec2[];
							gl.uniform2fv(uniformLocation, vec2s.flat());
							break;
						case "vec3":
							const vec3s = (binds as any)[key] as Vec3[];
							gl.uniform3fv(uniformLocation, vec3s.flat());
							break;
						case "vec4":
							const vec4s = (binds as any)[key] as Vec4[];
							gl.uniform4fv(uniformLocation, vec4s.flat());
							break;
					}
					return texture_index;
				}, 0);
		}

		{ // 👇 Set the points of the triangle to a buffer, assign to shader attribute
			Object.entries(material.globals)
				.filter((entry): entry is [typeof entry[0], Attribute] =>
					entry[1].type == "attribute")
				.forEach(entry => {
					const [key, global] = entry;
					const data = (binds as any)[key] as SizedBuffer;
					gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
					const attributeLocation = gl.getAttribLocation(material.program, key as string);
					const dataType = global.unit;
					gl.vertexAttribPointer(attributeLocation, unit_to_stride[dataType], gl.FLOAT, false, 0, 0);
					gl.enableVertexAttribArray(attributeLocation);
					if (global.instanced) {
						gl.vertexAttribDivisor(attributeLocation, 1);
					}
				});
		}

		// 🖌 Draw the arrays/elements using size determined from aggregating buffers
		{
			const buffer_counts = Object.entries(material.globals)
				.filter((entry): entry is [typeof entry[0], Attribute] =>
					entry[1].type == "attribute")
				.reduce((buffer_counts, entry) => {
					const [key, global] = entry;
					const data = (binds as any)[key] as SizedBuffer;
					const stride = unit_to_stride[global.unit];
					return global.instanced ?
						{
							...buffer_counts,
							instance: Math.max(buffer_counts.instance, data.length / stride),
						} :
						{
							...buffer_counts,
							element: Math.max(buffer_counts.element, data.length / stride),
						};
				}, { element: 0, instance: 1 });
			const element_entry = Object.entries(material.globals)
				.find((entry): entry is [typeof entry[0], Element] =>
					entry[1].type == "element");
			if (element_entry != null) {
				const [element_key, element] = element_entry;
				const data = (binds as any)[element_key] as SizedBuffer;
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.buffer);

				gl.drawElementsInstanced(gl.TRIANGLES, data.length, gl.UNSIGNED_SHORT, 0, buffer_counts.instance);
			} else {
				gl.drawArraysInstanced(gl.TRIANGLES, 0, buffer_counts.element, buffer_counts.instance);
			}
		}
	}
}