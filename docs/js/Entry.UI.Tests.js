define("Type.CSS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Util.HtmlBuilder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HtmlBuilder = void 0;
    var HtmlBuilder;
    (function (HtmlBuilder) {
        /**
         * 📝Generates a string that describes the provided style in a way that
         * can be used in a style attribute OR a style sheet.
         */
        function generate_style_string(style) {
            return Object.keys(style).reduce((output, declarationKey) => {
                const formattedKey = declarationKey.replace(new RegExp(`([A-Z])`), match => `-${match.toLowerCase()}`);
                const value = style[declarationKey];
                return (`${output} ${formattedKey}: ${value};`);
            }, "");
        }
        HtmlBuilder.generate_style_string = generate_style_string;
        /**
         * 📝Generates a string that describes the provided series of ClassStyles in a
         * style sheet format that can be inserted into a style tag's innerHtml
         */
        function generate_style_html(styles) {
            return styles.reduce((output, style) => `${output} ${style.name} {${Object.keys(style.declaration).reduce((output, declarationKey) => {
                const formattedKey = declarationKey.replace(new RegExp(`([A-Z])`), match => `-${match.toLowerCase()}`);
                const value = style.declaration[declarationKey];
                return (`${output} ${formattedKey}: ${value};`);
            }, "")} }`, "");
        }
        HtmlBuilder.generate_style_html = generate_style_html;
        /**
         * 🎨 Assign custom attributes and style to an existing element.
         */
        function assign_to_element(element, tag) {
            if (tag.style != null) {
                Object.assign(element.style, tag.style);
            }
            if (tag.attributes != null) {
                Object.assign(element, tag.attributes);
            }
            return element;
        }
        HtmlBuilder.assign_to_element = assign_to_element;
        /**
         * 🎨 Assign custom attributes and style to an existing element.
         */
        function assign_to_element_svg(element, tag) {
            const { literal_attributes: literalAttributes, style, attributes } = tag;
            if (style != null) {
                Object.assign(element.style, style);
            }
            if (attributes != null) {
                Object.assign(element, attributes);
            }
            if (literalAttributes != null) {
                Object.keys(literalAttributes).forEach(attributeKey => element.setAttributeNS(null, attributeKey, literalAttributes[attributeKey]));
            }
            return element;
        }
        HtmlBuilder.assign_to_element_svg = assign_to_element_svg;
        /**
         * ✨Create a HTMLElement and add it to the parent element.
         * Assigns mentioned members to this element after creating.
         */
        function create_child(id, parent, tag) {
            const child = document.createElement(tag.type);
            assign_to_element(child, {
                ...tag,
                attributes: {
                    ...tag.attributes,
                    id,
                },
            });
            parent.appendChild(child);
            return child;
        }
        HtmlBuilder.create_child = create_child;
        /**
         * ✨ Create a list of HTMLElements and add them to the parent element.
         * Assigns mentioned members to each element after creating.
         * Assigns element id as provided by each object key.
         * Returns an object containing each provided key associated with a new HTMLElement.
         */
        function create_children(parent, tags) {
            const result = Object.keys(tags).
                map(key => {
                const tag = tags[key];
                const child = document.createElement(tag.type);
                assign_to_element(child, {
                    ...tag,
                    attributes: {
                        ...tag.attributes,
                        id: key,
                    }
                });
                parent.appendChild(child);
                return { key, child };
            }).
                reduce((childElements, keyChild) => ({
                ...childElements,
                [keyChild.key]: keyChild.child,
            }), {});
            return result;
        }
        HtmlBuilder.create_children = create_children;
        /**
         * ✨Create a SVGElement and add it to the parent element.
         * Assigns mentioned members to this element after creating.
         */
        function create_child_svg(id, parent, tag) {
            const child = document.createElementNS("http://www.w3.org/2000/svg", tag.type);
            assign_to_element_svg(child, {
                ...tag,
                attributes: {
                    ...tag.attributes,
                    id,
                },
            });
            parent.appendChild(child);
            return child;
        }
        HtmlBuilder.create_child_svg = create_child_svg;
        /**
         * ✨ Create a list of HTMLElements and add them to the parent element.
         * Assigns mentioned members to each element after creating.
         * Assigns element id as provided by each object key.
         * Returns an object containing each provided key associated with a new HTMLElement.
         */
        function create_children_svg(parent, tags) {
            const result = Object.keys(tags).
                map(key => {
                const tag = tags[key];
                const child = document.createElementNS("http://www.w3.org/2000/svg", tag.type);
                assign_to_element_svg(child, {
                    ...tag,
                    literal_attributes: {
                        ...tag.literal_attributes,
                        id: key,
                    }
                });
                parent.appendChild(child);
                return { key, child };
            }).
                reduce((childElements, keyChild) => ({
                ...childElements,
                [keyChild.key]: keyChild.child,
            }), {});
            return result;
        }
        HtmlBuilder.create_children_svg = create_children_svg;
        /**
         * ♻ Re-use existing elements from pool, assigning tag attributes.
         * If nothing is left in the pool, make a new child under the parent.
         * Recommended you use `executeRecycleProcess` to manage recycling automatically.
         */
        function recycle_element(parent, pool, tag) {
            const existing_element = pool.pop();
            if (existing_element != null) {
                assign_to_element(existing_element, tag);
                parent.appendChild(existing_element);
                return existing_element;
            }
            else {
                return create_child("recycled-element", parent, tag);
            }
        }
        HtmlBuilder.recycle_element = recycle_element;
        /**
         * ♻ Automated pipeline for reusing elements  and removing elements that weren't reused.
         * Avoids flickering when quickly remove/add-ing elements during a state change.
         */
        function execute_recycle_process(args) {
            const pool = [...args.old_elements];
            const result = "parent_element" in args ?
                args.recycle_process_single_parent(tag => recycle_element(args.parent_element, pool, tag)) :
                args.recycle_process((parent, tag) => recycle_element(parent, pool, tag));
            pool.forEach(child => { var _a; return (_a = child.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(child); });
            return result;
        }
        HtmlBuilder.execute_recycle_process = execute_recycle_process;
    })(HtmlBuilder || (exports.HtmlBuilder = HtmlBuilder = {}));
});
define("Chillpoint.Styles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChillpointStyles = void 0;
    var ChillpointStyles;
    (function (ChillpointStyles) {
        ChillpointStyles.centered = {
            display: "grid",
            justifyItems: "center",
            alignItems: "center",
        };
        ChillpointStyles.text = {
            textAlign: "center",
            fontFamily: "lato",
        };
        ChillpointStyles.blurred = {
            filter: "blur(5px)",
        };
    })(ChillpointStyles || (exports.ChillpointStyles = ChillpointStyles = {}));
});
define("Util.Scripting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Scripting = void 0;
    var Scripting;
    (function (Scripting) {
        function get_keys(obj) {
            return Object.keys(obj);
        }
        Scripting.get_keys = get_keys;
        function key_value_to_object(keys, key_to_value) {
            return keys.
                map(key => [key, key_to_value(key)]).
                reduce((result, key_value) => ({
                ...result,
                [key_value[0]]: key_value[1],
            }), {});
        }
        Scripting.key_value_to_object = key_value_to_object;
    })(Scripting || (exports.Scripting = Scripting = {}));
});
// (c) Copyright 2017, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/nvqm
define("Util.VecMath", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mat4 = exports.Mat3 = exports.Mat3x2 = exports.Mat2 = exports.Quat = exports.Vec4 = exports.Vec3 = exports.Vec2 = exports.Num = exports.TAU = void 0;
    exports.TAU = 6.28318530717958647692528676655900576839433879875021164195;
    //
    // num (scalars)
    //
    var Num;
    (function (Num) {
        function abs(n) {
            return n < 0 ? -n : n;
        }
        Num.abs = abs;
        Num.acos = Math.acos;
        Num.asin = Math.asin;
        Num.atan2 = Math.atan2;
        Num.ceil = Math.ceil;
        function clamp(n, min, max) {
            return n < min ? min : (n > max ? max : n);
        }
        Num.clamp = clamp;
        Num.cos = Math.cos;
        Num.floor = Math.floor;
        function lerp(a, b, t) {
            return a + (b - a) * t;
        }
        Num.lerp = lerp;
        Num.log = Math.log;
        function max(a, b) {
            return a > b ? a : b;
        }
        Num.max = max;
        function min(a, b) {
            return a > b ? b : a;
        }
        Num.min = min;
        function mod(a, b) {
            return a % b;
        }
        Num.mod = mod;
        Num.pow = Math.pow;
        Num.round = Math.round;
        Num.sin = Math.sin;
        Num.sqrt = Math.sqrt;
        Num.tan = Math.tan;
        function flatten_angle(angle, rate) {
            if (rate <= 0)
                return angle;
            while (angle < 0)
                angle += 360;
            while (angle > 360)
                angle -= 360;
            var offset = angle > 90 ? 180 : 0;
            return ((angle - offset) *
                (1 - rate) + offset);
        }
        Num.flatten_angle = flatten_angle;
    })(Num || (exports.Num = Num = {}));
    //
    // vec2
    //
    var Vec2;
    (function (Vec2) {
        function add(a, b) {
            return [a[0] + b[0], a[1] + b[1]];
        }
        Vec2.add = add;
        function applymat2(a, b) {
            let ax = a[0], ay = a[1];
            return [b[0] * ax + b[2] * ay, b[1] * ax + b[3] * ay];
        }
        Vec2.applymat2 = applymat2;
        function applymat3x2(a, b) {
            let ax = a[0], ay = a[1];
            return [b[0] * ax + b[2] * ay + b[4], b[1] * ax + b[3] * ay + b[5]];
        }
        Vec2.applymat3x2 = applymat3x2;
        function applymat3(a, b) {
            let ax = a[0], ay = a[1];
            return [b[0] * ax + b[3] * ay + b[6], b[1] * ax + b[4] * ay + b[7]];
        }
        Vec2.applymat3 = applymat3;
        function applymat4(a, b) {
            let ax = a[0], ay = a[1];
            return [b[0] * ax + b[4] * ay + b[12], b[1] * ax + b[5] * ay + b[13]];
        }
        Vec2.applymat4 = applymat4;
        function clamp(a, min, max) {
            return [Num.clamp(a[0], min[0], max[0]), Num.clamp(a[1], min[1], max[1])];
        }
        Vec2.clamp = clamp;
        function dist(a, b) {
            return Num.sqrt(len2(sub(a, b)));
        }
        Vec2.dist = dist;
        function dist2(a, b) {
            return len2(sub(b, a));
        }
        Vec2.dist2 = dist2;
        function div(a, b) {
            return [a[0] / b[0], a[1] / b[1]];
        }
        Vec2.div = div;
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }
        Vec2.dot = dot;
        function inverse(a) {
            return [1 / a[0], 1 / a[1]];
        }
        Vec2.inverse = inverse;
        function len(a) {
            return Num.sqrt(len2(a));
        }
        Vec2.len = len;
        function len2(a) {
            let ax = a[0], ay = a[1];
            return ax * ax + ay * ay;
        }
        Vec2.len2 = len2;
        function lerp(a, b, t) {
            return [Num.lerp(a[0], b[0], t), Num.lerp(a[1], b[1], t)];
        }
        Vec2.lerp = lerp;
        function max(a, b) {
            return [Num.max(a[0], b[0]), Num.max(a[1], b[1])];
        }
        Vec2.max = max;
        function min(a, b) {
            return [Num.min(a[0], b[0]), Num.min(a[1], b[1])];
        }
        Vec2.min = min;
        function mul(a, b) {
            return [a[0] * b[0], a[1] * b[1]];
        }
        Vec2.mul = mul;
        function neg(a) {
            return [-a[0], -a[1]];
        }
        Vec2.neg = neg;
        function normal(a) {
            let ax = a[0], ay = a[1], len = ax * ax + ay * ay;
            if (len > 0) {
                len = 1 / Num.sqrt(len);
                return [ax * len, ay * len];
            }
            return a;
        }
        Vec2.normal = normal;
        function scale(a, s) {
            return [a[0] * s, a[1] * s];
        }
        Vec2.scale = scale;
        function sub(a, b) {
            return [a[0] - b[0], a[1] - b[1]];
        }
        Vec2.sub = sub;
    })(Vec2 || (exports.Vec2 = Vec2 = {}));
    //
    // vec3
    //
    var Vec3;
    (function (Vec3) {
        function add(a, b) {
            return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
        }
        Vec3.add = add;
        function angle(a, b) {
            return nangle(normal(a), normal(b));
        }
        Vec3.angle = angle;
        function applymat3x2(a, b) {
            let ax = a[0], ay = a[1], az = a[2];
            return [
                ax * b[0] + ay * b[2] + az * b[4],
                ax * b[1] + ay * b[3] + az * b[5],
                az
            ];
        }
        Vec3.applymat3x2 = applymat3x2;
        function applymat3(a, b) {
            let ax = a[0], ay = a[1], az = a[2];
            return [
                ax * b[0] + ay * b[3] + az * b[6],
                ax * b[1] + ay * b[4] + az * b[7],
                ax * b[2] + ay * b[5] + az * b[8]
            ];
        }
        Vec3.applymat3 = applymat3;
        function apply_mat4(a, b) {
            let ax = a[0], ay = a[1], az = a[2];
            let w = b[3] * ax + b[7] * ay + b[11] * az + b[15];
            if (w == 0)
                w = 1;
            return [
                (b[0] * ax + b[4] * ay + b[8] * az + b[12]) / w,
                (b[1] * ax + b[5] * ay + b[9] * az + b[13]) / w,
                (b[2] * ax + b[6] * ay + b[10] * az + b[14]) / w
            ];
        }
        Vec3.apply_mat4 = apply_mat4;
        function apply_quat(a, b) {
            let ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], bw = b[3];
            let ix = bw * ax + by * az - bz * ay, iy = bw * ay + bz * ax - bx * az, iz = bw * az + bx * ay - by * ax, iw = -bx * ax - by * ay - bz * az;
            return [
                ix * bw + iw * -bx + iy * -bz - iz * -by,
                iy * bw + iw * -by + iz * -bx - ix * -bz,
                iz * bw + iw * -bz + ix * -by - iy * -bx
            ];
        }
        Vec3.apply_quat = apply_quat;
        function clamp(a, min, max) {
            return [
                Num.clamp(a[0], min[0], max[0]),
                Num.clamp(a[1], min[1], max[1]),
                Num.clamp(a[2], min[2], max[2])
            ];
        }
        Vec3.clamp = clamp;
        function cross(a, b) {
            let ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
            return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
        }
        Vec3.cross = cross;
        function dist(a, b) {
            return Num.sqrt(len2(sub(a, b)));
        }
        Vec3.dist = dist;
        function dist2(a, b) {
            return len2(sub(b, a));
        }
        Vec3.dist2 = dist2;
        function div(a, b) {
            return [a[0] / b[0], a[1] / b[1], a[2] / b[2]];
        }
        Vec3.div = div;
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        Vec3.dot = dot;
        function inverse(a) {
            return [1 / a[0], 1 / a[1], 1 / a[2]];
        }
        Vec3.inverse = inverse;
        function len(a) {
            return Num.sqrt(len2(a));
        }
        Vec3.len = len;
        function len2(a) {
            let ax = a[0], ay = a[1], az = a[2];
            return ax * ax + ay * ay + az * az;
        }
        Vec3.len2 = len2;
        function lerp(a, b, t) {
            return [
                Num.lerp(a[0], b[0], t),
                Num.lerp(a[1], b[1], t),
                Num.lerp(a[2], b[2], t)
            ];
        }
        Vec3.lerp = lerp;
        function max(a, b) {
            return [Num.max(a[0], b[0]), Num.max(a[1], b[1]), Num.max(a[2], b[2])];
        }
        Vec3.max = max;
        function min(a, b) {
            return [Num.min(a[0], b[0]), Num.min(a[1], b[1]), Num.min(a[2], b[2])];
        }
        Vec3.min = min;
        function mul(a, b) {
            return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
        }
        Vec3.mul = mul;
        function nangle(a, b) {
            let c = dot(a, b);
            if (c < -1 || c > 1)
                return 0;
            return Num.acos(c);
        }
        Vec3.nangle = nangle;
        function neg(a) {
            return [-a[0], -a[1], -a[2]];
        }
        Vec3.neg = neg;
        function normal(a) {
            let ax = a[0], ay = a[1], az = a[2];
            let len = ax * ax + ay * ay + az * az;
            if (len > 0) {
                len = 1 / Num.sqrt(len);
                return [ax * len, ay * len, az * len];
            }
            return a;
        }
        Vec3.normal = normal;
        function orthogonal(a, b) {
            return normal(cross(a, b));
        }
        Vec3.orthogonal = orthogonal;
        function scale(a, s) {
            return [a[0] * s, a[1] * s, a[2] * s];
        }
        Vec3.scale = scale;
        function sub(a, b) {
            return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
        }
        Vec3.sub = sub;
    })(Vec3 || (exports.Vec3 = Vec3 = {}));
    //
    // vec4
    //
    var Vec4;
    (function (Vec4) {
        function add(a, b) {
            return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
        }
        Vec4.add = add;
        function applymat4(a, b) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            return [
                b[0] * ax + b[4] * ay + b[8] * az + b[12] * aw,
                b[1] * ax + b[5] * ay + b[9] * az + b[13] * aw,
                b[2] * ax + b[6] * ay + b[10] * az + b[14] * aw,
                b[3] * ax + b[7] * ay + b[11] * az + b[15] * aw
            ];
        }
        Vec4.applymat4 = applymat4;
        function applyquat(a, b) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
            let ix = bw * ax + by * az - bz * ay, iy = bw * ay + bz * ax - bx * az, iz = bw * az + bx * ay - by * ax, iw = -bx * ax - by * ay - bz * az;
            return [
                ix * bw + iw * -bx + iy * -bz - iz * -by,
                iy * bw + iw * -by + iz * -bx - ix * -bz,
                iz * bw + iw * -bz + ix * -by - iy * -bx,
                aw
            ];
        }
        Vec4.applyquat = applyquat;
        function clamp(a, min, max) {
            return [
                Num.clamp(a[0], min[0], max[0]),
                Num.clamp(a[1], min[1], max[1]),
                Num.clamp(a[2], min[2], max[2]),
                Num.clamp(a[3], min[3], max[3])
            ];
        }
        Vec4.clamp = clamp;
        function dist(a, b) {
            return Num.sqrt(len2(sub(a, b)));
        }
        Vec4.dist = dist;
        function dist2(a, b) {
            return len2(sub(b, a));
        }
        Vec4.dist2 = dist2;
        function div(a, b) {
            return [a[0] / b[0], a[1] / b[1], a[2] / b[2], a[3] / b[3]];
        }
        Vec4.div = div;
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
        Vec4.dot = dot;
        function inverse(a) {
            return [1 / a[0], 1 / a[1], 1 / a[2], 1 / a[3]];
        }
        Vec4.inverse = inverse;
        function len(a) {
            return Num.sqrt(len2(a));
        }
        Vec4.len = len;
        function len2(a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            return ax * ax + ay * ay + az * az + aw * aw;
        }
        Vec4.len2 = len2;
        function lerp(a, b, t) {
            return [
                Num.lerp(a[0], b[0], t),
                Num.lerp(a[1], b[1], t),
                Num.lerp(a[2], b[2], t),
                Num.lerp(a[3], b[3], t)
            ];
        }
        Vec4.lerp = lerp;
        function max(a, b) {
            return [
                Num.max(a[0], b[0]),
                Num.max(a[1], b[1]),
                Num.max(a[2], b[2]),
                Num.max(a[3], b[3])
            ];
        }
        Vec4.max = max;
        function min(a, b) {
            return [
                Num.min(a[0], b[0]),
                Num.min(a[1], b[1]),
                Num.min(a[2], b[2]),
                Num.min(a[3], b[3])
            ];
        }
        Vec4.min = min;
        function mul(a, b) {
            return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3]];
        }
        Vec4.mul = mul;
        function neg(a) {
            return [-a[0], -a[1], -a[2], -a[3]];
        }
        Vec4.neg = neg;
        function normal(a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let len = ax * ax + ay * ay + az * az + aw * aw;
            if (len > 0) {
                len = 1 / Num.sqrt(len);
                return [ax * len, ay * len, az * len, aw * len];
            }
            return a;
        }
        Vec4.normal = normal;
        function scale(a, s) {
            return [a[0] * s, a[1] * s, a[2] * s, a[3] * s];
        }
        Vec4.scale = scale;
        function sub(a, b) {
            return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
        }
        Vec4.sub = sub;
    })(Vec4 || (exports.Vec4 = Vec4 = {}));
    //
    // quat
    //
    var Quat;
    (function (Quat) {
        function axis_angle(axis, ang) {
            return naxisang(Vec3.normal(axis), ang);
        }
        Quat.axis_angle = axis_angle;
        function between(from, to) {
            return nbetween(Vec3.normal(from), Vec3.normal(to));
        }
        Quat.between = between;
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
        Quat.dot = dot;
        function euler_xyz(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz + cx * sy * sz,
                cx * sy * cz - sx * cy * sz,
                cx * cy * sz + sx * sy * cz,
                cx * cy * cz - sx * sy * sz
            ];
        }
        Quat.euler_xyz = euler_xyz;
        function euler_xzy(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz - cx * sy * sz,
                cx * sy * cz - sx * cy * sz,
                cx * cy * sz + sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            ];
        }
        Quat.euler_xzy = euler_xzy;
        function euler_yxz(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz + cx * sy * sz,
                cx * sy * cz - sx * cy * sz,
                cx * cy * sz - sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            ];
        }
        Quat.euler_yxz = euler_yxz;
        function euler_yzx(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz + cx * sy * sz,
                cx * sy * cz + sx * cy * sz,
                cx * cy * sz - sx * sy * cz,
                cx * cy * cz - sx * sy * sz
            ];
        }
        Quat.euler_yzx = euler_yzx;
        function euler_zxy(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz - cx * sy * sz,
                cx * sy * cz + sx * cy * sz,
                cx * cy * sz + sx * sy * cz,
                cx * cy * cz - sx * sy * sz
            ];
        }
        Quat.euler_zxy = euler_zxy;
        function euler_zyx(rot) {
            let a0 = rot[0] * 0.5;
            let a1 = rot[1] * 0.5;
            let a2 = rot[2] * 0.5;
            let cx = Num.cos(a0);
            let cy = Num.cos(a1);
            let cz = Num.cos(a2);
            let sx = Num.sin(a0);
            let sy = Num.sin(a1);
            let sz = Num.sin(a2);
            return [
                sx * cy * cz - cx * sy * sz,
                cx * sy * cz + sx * cy * sz,
                cx * cy * sz - sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            ];
        }
        Quat.euler_zyx = euler_zyx;
        function identity() {
            return [0, 0, 0, 1];
        }
        Quat.identity = identity;
        function invert(a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let dot = ax * ax + ay * ay + az * az + aw * aw;
            let invDot = 0;
            if (dot != 0)
                invDot = 1 / dot;
            return [
                -ax * invDot,
                -ay * invDot,
                -az * invDot,
                aw * invDot
            ];
        }
        Quat.invert = invert;
        function lerp(a, b, t) {
            return [
                Num.lerp(a[0], b[0], t),
                Num.lerp(a[1], b[1], t),
                Num.lerp(a[2], b[2], t),
                Num.lerp(a[3], b[3], t)
            ];
        }
        Quat.lerp = lerp;
        function mul(a, b) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
            return [
                ax * bw + aw * bx + ay * bz - az * by,
                ay * bw + aw * by + az * bx - ax * bz,
                az * bw + aw * bz + ax * by - ay * bx,
                aw * bw - ax * bx - ay * by - az * bz
            ];
        }
        Quat.mul = mul;
        function naxisang(axis, ang) {
            ang *= 0.5;
            let s = Num.sin(ang);
            return [axis[0] * s, axis[1] * s, axis[2] * s, Num.cos(ang)];
        }
        Quat.naxisang = naxisang;
        function nbetween(from, to) {
            let r = Vec3.dot(from, to) + 1;
            let cross;
            if (r < 0.000001) {
                if (Num.abs(from[0]) > Num.abs(from[2]))
                    cross = [-from[1], from[0], 0];
                else
                    cross = [0, -from[2], from[1]];
            }
            else
                cross = Vec3.cross(from, to);
            return normal([cross[0], cross[1], cross[2], r]);
        }
        Quat.nbetween = nbetween;
        function neg(a) {
            return [-a[0], -a[1], -a[2], -a[3]];
        }
        Quat.neg = neg;
        function nlerp(a, b, t) {
            return normal(lerp(a, b, t));
        }
        Quat.nlerp = nlerp;
        function normal(a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let len = ax * ax + ay * ay + az * az + aw * aw;
            if (len > 0) {
                len = 1 / Num.sqrt(len);
                return [ax * len, ay * len, az * len, aw * len];
            }
            return a;
        }
        Quat.normal = normal;
        function slerp(a, b, t) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bx = b[0], by = b[1], bz = b[2], bw = b[3];
            let omega, cosom, sinom, scale0, scale1;
            cosom = ax * bx + ay * by + az * bz + aw * bw;
            if (cosom < 0) {
                cosom = -cosom;
                bx = -bx;
                by = -by;
                bz = -bz;
                bw = -bw;
            }
            if ((1 - cosom) > 0.000001) {
                omega = Num.acos(cosom);
                sinom = Num.sin(omega);
                scale0 = Num.sin((1 - t) * omega) / sinom;
                scale1 = Num.sin(t * omega) / sinom;
            }
            else {
                scale0 = 1 - t;
                scale1 = t;
            }
            return [
                scale0 * ax + scale1 * bx,
                scale0 * ay + scale1 * by,
                scale0 * az + scale1 * bz,
                scale0 * aw + scale1 * bw
            ];
        }
        Quat.slerp = slerp;
    })(Quat || (exports.Quat = Quat = {}));
    //
    // mat2
    //
    var Mat2;
    (function (Mat2) {
        function add(a, b) {
            return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
        }
        Mat2.add = add;
        function adjoint(a) {
            return [a[3], -a[1], -a[2], a[0]];
        }
        Mat2.adjoint = adjoint;
        function compmul(a, b) {
            return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3]];
        }
        Mat2.compmul = compmul;
        function det(a) {
            return a[0] * a[3] - a[2] * a[1];
        }
        Mat2.det = det;
        function identity() {
            return [1, 0, 0, 1];
        }
        Mat2.identity = identity;
        function invert(a) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let det = a0 * a3 - a2 * a1;
            if (det == 0)
                return [0, 0, 0, 0];
            det = 1 / det;
            return [a3 * det, -a1 * det, -a2 * det, a0 * det];
        }
        Mat2.invert = invert;
        function mul(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            return [a0 * b0 + a2 * b1, a1 * b0 + a3 * b1, a0 * b2 + a2 * b3, a1 * b2 + a3 * b3];
        }
        Mat2.mul = mul;
        function rotate(a, ang) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Num.sin(ang), c = Num.cos(ang);
            return [a0 * c + a2 * s, a1 * c + a3 * s, a0 * -s + a2 * c, a1 * -s + a3 * c];
        }
        Mat2.rotate = rotate;
        function rotation(ang) {
            let s = Num.sin(ang), c = Num.cos(ang);
            return [c, s, -s, c];
        }
        Mat2.rotation = rotation;
        function scale(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], b0 = b[0], b1 = b[1];
            return [a0 * b0, a1 * b0, a2 * b1, a3 * b1];
        }
        Mat2.scale = scale;
        function scaling(a) {
            return [a[0], 0, 0, a[1]];
        }
        Mat2.scaling = scaling;
        function sub(a, b) {
            return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
        }
        Mat2.sub = sub;
        function transpose(a) {
            return [a[0], a[2], a[1], a[3]];
        }
        Mat2.transpose = transpose;
    })(Mat2 || (exports.Mat2 = Mat2 = {}));
    //
    // mat3x2
    //
    var Mat3x2;
    (function (Mat3x2) {
        function add(a, b) {
            return [
                a[0] + b[0], a[1] + b[1],
                a[2] + b[2], a[3] + b[3],
                a[4] + b[4], a[5] + b[5]
            ];
        }
        Mat3x2.add = add;
        function compmul(a, b) {
            return [
                a[0] * b[0], a[1] * b[1],
                a[2] * b[2], a[3] * b[3],
                a[4] * b[4], a[5] * b[5]
            ];
        }
        Mat3x2.compmul = compmul;
        function det(a) {
            return a[0] * a[3] - a[2] * a[1];
        }
        Mat3x2.det = det;
        function identity() {
            return [1, 0, 0, 1, 0, 0];
        }
        Mat3x2.identity = identity;
        function invert(a) {
            let a00 = a[0], a01 = a[1], a10 = a[2], a11 = a[3], a20 = a[4], a21 = a[5];
            let det = a00 * a11 - a01 * a10;
            if (det == 0)
                return [0, 0, 0, 0, 0, 0];
            det = 1 / det;
            return [
                a11 * det, -a01 * det,
                -a10 * det, a00 * det,
                (a21 * a10 - a11 * a20) * det,
                (-a21 * a00 + a01 * a20) * det
            ];
        }
        Mat3x2.invert = invert;
        function mul(a, b) {
            let a00 = a[0], a01 = a[1], a10 = a[2], a11 = a[3], a20 = a[4], a21 = a[5], b00 = b[0], b01 = b[1], b10 = b[2], b11 = b[3], b20 = b[4], b21 = b[5];
            return [
                b00 * a00 + b01 * a10, b00 * a01 + b01 * a11,
                b10 * a00 + b11 * a10, b10 * a01 + b11 * a11,
                b20 * a00 + b21 * a10 + a20, b20 * a01 + b21 * a11 + a21
            ];
        }
        Mat3x2.mul = mul;
        function rotate(a, ang) {
            let a00 = a[0], a01 = a[1], a10 = a[2], a11 = a[3], s = Num.sin(ang), c = Num.cos(ang);
            return [
                c * a00 + s * a10, c * a01 + s * a11,
                c * a10 - s * a00, c * a11 - s * a01,
                a[4], a[5]
            ];
        }
        Mat3x2.rotate = rotate;
        function rotation(ang) {
            let s = Num.sin(ang), c = Num.cos(ang);
            return [c, s, -s, c, 0, 0];
        }
        Mat3x2.rotation = rotation;
        function scale(a, b) {
            let bx, by;
            if (typeof b === 'number')
                bx = by = b;
            else {
                bx = b[0];
                by = b[1];
            }
            return [
                bx * a[0], bx * a[1],
                by * a[2], by * a[3],
                a[4], a[5],
            ];
        }
        Mat3x2.scale = scale;
        function scaling(a) {
            if (typeof a === 'number')
                return [a, 0, 0, a, 0, 0];
            return [a[0], 0, 0, a[1], 0, 0];
        }
        Mat3x2.scaling = scaling;
        function sub(a, b) {
            return [
                a[0] - b[0], a[1] - b[1],
                a[2] - b[2], a[3] - b[3],
                a[4] - b[4], a[5] - b[5]
            ];
        }
        Mat3x2.sub = sub;
        function translate(a, b) {
            let a00 = a[0], a01 = a[1], a10 = a[2], a11 = a[3], bx = b[0], by = b[1];
            return [
                a00, a01,
                a10, a11,
                bx * a00 + by * a10 + a[4],
                bx * a01 + by * a11 + a[5]
            ];
        }
        Mat3x2.translate = translate;
        function translation(a) {
            return [1, 0, 0, 1, a[0], a[1]];
        }
        Mat3x2.translation = translation;
    })(Mat3x2 || (exports.Mat3x2 = Mat3x2 = {}));
    //
    // mat3
    //
    var Mat3;
    (function (Mat3) {
        function add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            return out;
        }
        Mat3.add = add;
        function adjoint(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            out[0] = a11 * a22 - a12 * a21;
            out[1] = a02 * a21 - a01 * a22;
            out[2] = a01 * a12 - a02 * a11;
            out[3] = a12 * a20 - a10 * a22;
            out[4] = a00 * a22 - a02 * a20;
            out[5] = a02 * a10 - a00 * a12;
            out[6] = a10 * a21 - a11 * a20;
            out[7] = a01 * a20 - a00 * a21;
            out[8] = a00 * a11 - a01 * a10;
            return out;
        }
        Mat3.adjoint = adjoint;
        function compmul(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            out[3] = a[3] * b[3];
            out[4] = a[4] * b[4];
            out[5] = a[5] * b[5];
            out[6] = a[6] * b[6];
            out[7] = a[7] * b[7];
            out[8] = a[8] * b[8];
            return out;
        }
        Mat3.compmul = compmul;
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        Mat3.copy = copy;
        function det(a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            return a00 * (a22 * a11 - a12 * a21) +
                a01 * (-a22 * a10 + a12 * a20) +
                a02 * (a21 * a10 - a11 * a20);
        }
        Mat3.det = det;
        function identity(out) {
            if (typeof out === 'undefined')
                return [1, 0, 0, 0, 1, 0, 0, 0, 1];
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        Mat3.identity = identity;
        function invert(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
            let det = a00 * b01 + a01 * b11 + a02 * b21;
            if (det == 0)
                throw new Error('Cannot invert mat3');
            det = 1 / det;
            out[0] = b01 * det;
            out[1] = (-a22 * a01 + a02 * a21) * det;
            out[2] = (a12 * a01 - a02 * a11) * det;
            out[3] = b11 * det;
            out[4] = (a22 * a00 - a02 * a20) * det;
            out[5] = (-a12 * a00 + a02 * a10) * det;
            out[6] = b21 * det;
            out[7] = (-a21 * a00 + a01 * a20) * det;
            out[8] = (a11 * a00 - a01 * a10) * det;
            return out;
        }
        Mat3.invert = invert;
        function mul(out, a, b) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return out;
        }
        Mat3.mul = mul;
        function quat(out, a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], ax2 = ax + ax, ay2 = ay + ay, az2 = az + az, axx = ax * ax2, ayx = ay * ax2, ayy = ay * ay2, azx = az * ax2, azy = az * ay2, azz = az * az2, awx = aw * ax2, awy = aw * ay2, awz = aw * az2;
            out[0] = 1 - ayy - azz;
            out[1] = ayx + awz;
            out[2] = azx - awy;
            out[3] = ayx - awz;
            out[4] = 1 - axx - azz;
            out[5] = azy + awx;
            out[6] = azx + awy;
            out[7] = azy - awx;
            out[8] = 1 - axx - ayy;
            return out;
        }
        Mat3.quat = quat;
        function rotate(out, a, ang) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Num.sin(ang), c = Num.cos(ang);
            out[0] = c * a00 + s * a10;
            out[1] = c * a01 + s * a11;
            out[2] = c * a02 + s * a12;
            out[3] = c * a10 - s * a00;
            out[4] = c * a11 - s * a01;
            out[5] = c * a12 - s * a02;
            out[6] = a20;
            out[7] = a21;
            out[8] = a22;
            return out;
        }
        Mat3.rotate = rotate;
        function rotation(out, ang) {
            let s = Num.sin(ang), c = Num.cos(ang);
            out[0] = c;
            out[1] = s;
            out[2] = 0;
            out[3] = -s;
            out[4] = c;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        Mat3.rotation = rotation;
        function scale(out, a, b) {
            let bx = b[0], by = b[1];
            out[0] = bx * a[0];
            out[1] = bx * a[1];
            out[2] = bx * a[2];
            out[3] = by * a[3];
            out[4] = by * a[4];
            out[5] = by * a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        Mat3.scale = scale;
        function scaling(out, a) {
            out[0] = a[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = a[1];
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        Mat3.scaling = scaling;
        function sub(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            out[6] = a[6] - b[6];
            out[7] = a[7] - b[7];
            out[8] = a[8] - b[8];
            return out;
        }
        Mat3.sub = sub;
        function translate(out, a, b) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], bx = b[0], by = b[1];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a10;
            out[4] = a11;
            out[5] = a12;
            out[6] = bx * a00 + by * a10 + a20;
            out[7] = bx * a01 + by * a11 + a21;
            out[8] = bx * a02 + by * a12 + a22;
            return out;
        }
        Mat3.translate = translate;
        function translation(out, a) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = a[0];
            out[7] = a[1];
            out[8] = 1;
            return out;
        }
        Mat3.translation = translation;
        function transpose(out, a) {
            if (out === a) {
                let a01 = a[1], a02 = a[2], a12 = a[5];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a01;
                out[5] = a[7];
                out[6] = a02;
                out[7] = a12;
            }
            else {
                out[0] = a[0];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a[1];
                out[4] = a[4];
                out[5] = a[7];
                out[6] = a[2];
                out[7] = a[5];
                out[8] = a[8];
            }
            return out;
        }
        Mat3.transpose = transpose;
    })(Mat3 || (exports.Mat3 = Mat3 = {}));
    //
    // mat4
    //
    var Mat4;
    (function (Mat4) {
        function add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            out[9] = a[9] + b[9];
            out[10] = a[10] + b[10];
            out[11] = a[11] + b[11];
            out[12] = a[12] + b[12];
            out[13] = a[13] + b[13];
            out[14] = a[14] + b[14];
            out[15] = a[15] + b[15];
            return out;
        }
        Mat4.add = add;
        function adjoint(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            out[0] = (a11 * (a22 * a33 - a23 * a32) -
                a21 * (a12 * a33 - a13 * a32) +
                a31 * (a12 * a23 - a13 * a22));
            out[1] = -(a01 * (a22 * a33 - a23 * a32) -
                a21 * (a02 * a33 - a03 * a32) +
                a31 * (a02 * a23 - a03 * a22));
            out[2] = (a01 * (a12 * a33 - a13 * a32) -
                a11 * (a02 * a33 - a03 * a32) +
                a31 * (a02 * a13 - a03 * a12));
            out[3] = -(a01 * (a12 * a23 - a13 * a22) -
                a11 * (a02 * a23 - a03 * a22) +
                a21 * (a02 * a13 - a03 * a12));
            out[4] = -(a10 * (a22 * a33 - a23 * a32) -
                a20 * (a12 * a33 - a13 * a32) +
                a30 * (a12 * a23 - a13 * a22));
            out[5] = (a00 * (a22 * a33 - a23 * a32) -
                a20 * (a02 * a33 - a03 * a32) +
                a30 * (a02 * a23 - a03 * a22));
            out[6] = -(a00 * (a12 * a33 - a13 * a32) -
                a10 * (a02 * a33 - a03 * a32) +
                a30 * (a02 * a13 - a03 * a12));
            out[7] = (a00 * (a12 * a23 - a13 * a22) -
                a10 * (a02 * a23 - a03 * a22) +
                a20 * (a02 * a13 - a03 * a12));
            out[8] = (a10 * (a21 * a33 - a23 * a31) -
                a20 * (a11 * a33 - a13 * a31) +
                a30 * (a11 * a23 - a13 * a21));
            out[9] = -(a00 * (a21 * a33 - a23 * a31) -
                a20 * (a01 * a33 - a03 * a31) +
                a30 * (a01 * a23 - a03 * a21));
            out[10] = (a00 * (a11 * a33 - a13 * a31) -
                a10 * (a01 * a33 - a03 * a31) +
                a30 * (a01 * a13 - a03 * a11));
            out[11] = -(a00 * (a11 * a23 - a13 * a21) -
                a10 * (a01 * a23 - a03 * a21) +
                a20 * (a01 * a13 - a03 * a11));
            out[12] = -(a10 * (a21 * a32 - a22 * a31) -
                a20 * (a11 * a32 - a12 * a31) +
                a30 * (a11 * a22 - a12 * a21));
            out[13] = (a00 * (a21 * a32 - a22 * a31) -
                a20 * (a01 * a32 - a02 * a31) +
                a30 * (a01 * a22 - a02 * a21));
            out[14] = -(a00 * (a11 * a32 - a12 * a31) -
                a10 * (a01 * a32 - a02 * a31) +
                a30 * (a01 * a12 - a02 * a11));
            out[15] = (a00 * (a11 * a22 - a12 * a21) -
                a10 * (a01 * a22 - a02 * a21) +
                a20 * (a01 * a12 - a02 * a11));
            return out;
        }
        Mat4.adjoint = adjoint;
        function compmul(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            out[3] = a[3] * b[3];
            out[4] = a[4] * b[4];
            out[5] = a[5] * b[5];
            out[6] = a[6] * b[6];
            out[7] = a[7] * b[7];
            out[8] = a[8] * b[8];
            out[9] = a[9] * b[9];
            out[10] = a[10] * b[10];
            out[11] = a[11] * b[11];
            out[12] = a[12] * b[12];
            out[13] = a[13] * b[13];
            out[14] = a[14] * b[14];
            out[15] = a[15] * b[15];
            return out;
        }
        Mat4.compmul = compmul;
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        Mat4.copy = copy;
        function det(a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        }
        Mat4.det = det;
        function frustum(out, L, R, B, T, N, F) {
            let rl = 1 / (R - L), tb = 1 / (T - B), nf = 1 / (N - F);
            out[0] = (2 * N) * rl;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = (2 * N) * tb;
            out[6] = 0;
            out[7] = 0;
            out[8] = (R + L) * rl;
            out[9] = (T + B) * tb;
            out[10] = (F + N) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * N * F) * nf;
            out[15] = 0;
            return out;
        }
        Mat4.frustum = frustum;
        function identity(out) {
            if (typeof out === 'undefined')
                return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        Mat4.identity = identity;
        function invert(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
            let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (det == 0)
                throw new Error('Cannot invert mat4');
            det = 1 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            return out;
        }
        Mat4.invert = invert;
        function lookat(out, eye, position, up) {
            let ex = eye[0], ey = eye[1], ez = eye[2], ux = up[0], uy = up[1], uz = up[2], px = position[0], py = position[1], pz = position[2];
            let z0 = ex - px, z1 = ey - py, z2 = ez - pz;
            if (z0 == 0 && z1 == 0 && z2 == 0)
                return identity(out);
            let len = 1 / Num.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;
            let x0 = uy * z2 - uz * z1;
            let x1 = uz * z0 - ux * z2;
            let x2 = ux * z1 - uy * z0;
            len = Num.sqrt(x0 * x0 +
                x1 * x1 +
                x2 * x2);
            if (len == 0) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            }
            else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }
            let y0 = z1 * x2 - z2 * x1;
            let y1 = z2 * x0 - z0 * x2;
            let y2 = z0 * x1 - z1 * x0;
            len = Num.sqrt(y0 * y0 +
                y1 * y1 +
                y2 * y2);
            if (len == 0) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            }
            else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }
            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * ex + x1 * ey + x2 * ez);
            out[13] = -(y0 * ex + y1 * ey + y2 * ez);
            out[14] = -(z0 * ex + z1 * ey + z2 * ez);
            out[15] = 1;
            return out;
        }
        Mat4.lookat = lookat;
        function mul(out, a, b) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b0, b1, b2, b3;
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[4];
            b1 = b[5];
            b2 = b[6];
            b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[8];
            b1 = b[9];
            b2 = b[10];
            b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[12];
            b1 = b[13];
            b2 = b[14];
            b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        }
        Mat4.mul = mul;
        function orthogonal(out, W, H, N, F) {
            let nf = 1 / (N - F);
            out[0] = 2 / W;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 2 / H;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = (N + F) * nf;
            out[15] = 1;
            return out;
        }
        Mat4.orthogonal = orthogonal;
        function perspective(out, fov, W, H, N, F) {
            let f = 1 / Num.tan(fov * 0.5), nf = 1 / (N - F);
            out[0] = f;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f * W / H;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (F + N) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * F * N) * nf;
            out[15] = 0;
            return out;
        }
        Mat4.perspective = perspective;
        function quat(out, a) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], ax2 = ax + ax, ay2 = ay + ay, az2 = az + az, axx = ax * ax2, ayx = ay * ax2, ayy = ay * ay2, azx = az * ax2, azy = az * ay2, azz = az * az2, awx = aw * ax2, awy = aw * ay2, awz = aw * az2;
            out[0] = 1 - ayy - azz;
            out[1] = ayx + awz;
            out[2] = azx - awy;
            out[3] = 0;
            out[4] = ayx - awz;
            out[5] = 1 - axx - azz;
            out[6] = azy + awx;
            out[7] = 0;
            out[8] = azx + awy;
            out[9] = azy - awx;
            out[10] = 1 - axx - ayy;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        Mat4.quat = quat;
        function rotate(out, a, axis, ang) {
            let x = axis[0], y = axis[1], z = axis[2], a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], s = Num.sin(ang), c = Num.cos(ang), t = 1 - c, b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;
            if (out !== a) {
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            return out;
        }
        Mat4.rotate = rotate;
        function rotation(out, axis, ang) {
            let x = axis[0], y = axis[1], z = axis[2], s = Num.sin(ang), c = Num.cos(ang), t = 1 - c;
            out[0] = x * x * t + c;
            out[1] = y * x * t + z * s;
            out[2] = z * x * t - y * s;
            out[3] = 0;
            out[4] = x * y * t - z * s;
            out[5] = y * y * t + c;
            out[6] = z * y * t + x * s;
            out[7] = 0;
            out[8] = x * z * t + y * s;
            out[9] = y * z * t - x * s;
            out[10] = z * z * t + c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        Mat4.rotation = rotation;
        function rot_trans(a, b) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], ax2 = ax + ax, ay2 = ay + ay, az2 = az + az, axx = ax * ax2, axy = ax * ay2, axz = ax * az2, ayy = ay * ay2, ayz = ay * az2, azz = az * az2, awx = aw * ax2, awy = aw * ay2, awz = aw * az2;
            return [
                1 - ayy - azz,
                axy + awz,
                axz - awy,
                0,
                axy - awz,
                1 - axx - azz,
                ayz + awx,
                0,
                axz + awy,
                ayz - awx,
                1 - axx - ayy,
                0,
                b[0],
                b[1],
                b[2],
                1,
            ];
        }
        Mat4.rot_trans = rot_trans;
        function rottransorigin(out, a, b, origin) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3], ax2 = ax + ax, ay2 = ay + ay, az2 = az + az, axx = ax * ax2, axy = ax * ay2, axz = ax * az2, ayy = ay * ay2, ayz = ay * az2, azz = az * az2, awx = aw * ax2, awy = aw * ay2, awz = aw * az2, ox = origin[0], oy = origin[1], oz = origin[2];
            out[0] = 1 - ayy - azz;
            out[1] = axy + awz;
            out[2] = axz - awy;
            out[3] = 0;
            out[4] = axy - awz;
            out[5] = 1 - axx - azz;
            out[6] = ayz + awx;
            out[7] = 0;
            out[8] = axz + awy;
            out[9] = ayz - awx;
            out[10] = 1 - axx - ayy;
            out[11] = 0;
            out[12] = b[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
            out[13] = b[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
            out[14] = b[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
            out[15] = 1;
            return out;
        }
        Mat4.rottransorigin = rottransorigin;
        function scale(out, a, b) {
            let bx = b[0], by = b[1], bz = b[2];
            out[0] = a[0] * bx;
            out[1] = a[1] * bx;
            out[2] = a[2] * bx;
            out[3] = a[3] * bx;
            out[4] = a[4] * by;
            out[5] = a[5] * by;
            out[6] = a[6] * by;
            out[7] = a[7] * by;
            out[8] = a[8] * bz;
            out[9] = a[9] * bz;
            out[10] = a[10] * bz;
            out[11] = a[11] * bz;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        Mat4.scale = scale;
        function scaling(out, a) {
            out[0] = a[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = a[1];
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = a[2];
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        Mat4.scaling = scaling;
        function sub(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            out[6] = a[6] - b[6];
            out[7] = a[7] - b[7];
            out[8] = a[8] - b[8];
            out[9] = a[9] - b[9];
            out[10] = a[10] - b[10];
            out[11] = a[11] - b[11];
            out[12] = a[12] - b[12];
            out[13] = a[13] - b[13];
            out[14] = a[14] - b[14];
            out[15] = a[15] - b[15];
            return out;
        }
        Mat4.sub = sub;
        function translate(out, a, b) {
            let bx = b[0], by = b[1], bz = b[2];
            if (out === a) {
                out[12] = a[0] * bx + a[4] * by + a[8] * bz + a[12];
                out[13] = a[1] * bx + a[5] * by + a[9] * bz + a[13];
                out[14] = a[2] * bx + a[6] * by + a[10] * bz + a[14];
                out[15] = a[3] * bx + a[7] * by + a[11] * bz + a[15];
            }
            else {
                let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a20;
                out[9] = a21;
                out[10] = a22;
                out[11] = a23;
                out[12] = a00 * bx + a10 * by + a20 * bz + a[12];
                out[13] = a01 * bx + a11 * by + a21 * bz + a[13];
                out[14] = a02 * bx + a12 * by + a22 * bz + a[14];
                out[15] = a03 * bx + a13 * by + a23 * bz + a[15];
            }
            return out;
        }
        Mat4.translate = translate;
        function translation(out, a) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = a[0];
            out[13] = a[1];
            out[14] = a[2];
            out[15] = 1;
            return out;
        }
        Mat4.translation = translation;
        function transpose(out, a) {
            if (out === a) {
                let a01 = a[1], a02 = a[2], a03 = a[3], 
                /*       */ a12 = a[6], a13 = a[7], 
                /*                   */ a23 = a[11];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            }
            else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }
            return out;
        }
        Mat4.transpose = transpose;
    })(Mat4 || (exports.Mat4 = Mat4 = {}));
});
define("Util.ShaderBuilder", ["require", "exports", "Util.Scripting"], function (require, exports, Util_Scripting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShaderBuilder = exports.unit_to_stride = void 0;
    exports.unit_to_stride = {
        float: 1,
        vec2: 2,
        vec3: 3,
        vec4: 4,
    };
    var ShaderBuilder;
    (function (ShaderBuilder) {
        function varying_text(key, element) {
            return `${element.type} highp ${element.unit} ${key};`;
        }
        ShaderBuilder.varying_text = varying_text;
        function attribute_text(key, element) {
            return `${element.type} ${element.unit} ${key}; `;
        }
        ShaderBuilder.attribute_text = attribute_text;
        function uniform_text(key, element) {
            return `${element.type} ${element.unit == "sampler2D" ? `` : `highp`} ${element.unit} ${key}${element.count > 1 ? `[${element.count}]` : ``};`;
        }
        ShaderBuilder.uniform_text = uniform_text;
        function to_vert_text(props) {
            return Util_Scripting_1.Scripting.get_keys(props).reduce((text, key) => {
                const element = props[key];
                return `${text}\n ${element.type == "varying" ?
                    varying_text(key, element) :
                    element.type == "attribute" ?
                        attribute_text(key, element) :
                        element.type == "uniform" ?
                            uniform_text(key, element) :
                            ""}`;
            }, "");
        }
        ShaderBuilder.to_vert_text = to_vert_text;
        function to_frag_text(props) {
            return Util_Scripting_1.Scripting.get_keys(props).reduce((text, key) => {
                const element = props[key];
                return `${text}${element.type == "varying" ?
                    varying_text(key, element) :
                    element.type == "uniform" ?
                        uniform_text(key, element) :
                        ""}\n`;
            }, "");
        }
        ShaderBuilder.to_frag_text = to_frag_text;
        function generate_material(gl, environment) {
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
                var _a;
                const shader = gl.createShader(index == 0 ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
                if (shader == null) {
                    throw new Error("Vertex/Fragment shader not properly initialized");
                }
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                gl.attachShader(program, shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    const split_info = (_a = gl.getShaderInfoLog(shader)) === null || _a === void 0 ? void 0 : _a.split("ERROR:");
                    if (split_info != null) {
                        const errors = split_info.slice(1, split_info === null || split_info === void 0 ? void 0 : split_info.length);
                        for (let error of errors) {
                            const location = error.split(":")[1];
                            console.log(source.split("\n")[parseInt(location) - 1]);
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
            };
        }
        ShaderBuilder.generate_material = generate_material;
        async function load_texture(gl, url) {
            return await new Promise((resolve) => {
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
                    gl.texImage2D(gl.TEXTURE_2D, textureSettings.level, textureSettings.internalFormat, textureSettings.srcFormat, textureSettings.srcType, image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    resolve({
                        texture,
                        width: image.width,
                        height: image.height,
                    });
                };
                image.src = url;
            });
        }
        ShaderBuilder.load_texture = load_texture;
        function create_element_buffer(gl, data) {
            const buffer = gl.createBuffer();
            if (buffer == null) {
                throw new Error("Buffer is null, this is not expected!");
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return { type: "element", buffer, length: data.length };
        }
        ShaderBuilder.create_element_buffer = create_element_buffer;
        function create_buffer(gl, data) {
            const buffer = gl.createBuffer();
            if (buffer == null) {
                throw new Error("Buffer is null, this is not expected!");
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return { type: "attribute", buffer, length: data.length };
        }
        ShaderBuilder.create_buffer = create_buffer;
        function render_material(gl, material, binds) {
            gl.useProgram(material.program);
            { // 🦗 Setting uniform variables including textures
                Object.entries(material.globals)
                    .filter((entry) => entry[1].type == "uniform")
                    .reduce((texture_index, entry) => {
                    const [key, global] = entry;
                    const uniformLocation = gl.getUniformLocation(material.program, key);
                    const data = binds[key];
                    switch (global.unit) {
                        case "sampler2D":
                            const textures = global.count > 1 ? data : [data];
                            const indices = textures.map((data, sub_index) => {
                                const active_texture_index = texture_index + sub_index;
                                gl.activeTexture(gl.TEXTURE0 + active_texture_index);
                                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                                return active_texture_index;
                            });
                            gl.uniform1iv(uniformLocation, indices);
                            return texture_index + indices.length;
                        case "float":
                            gl.uniform1fv(uniformLocation, global.count > 1 ? data : [data]);
                            break;
                        case "vec2":
                            gl.uniform2fv(uniformLocation, global.count > 1 ? data.flat() : [...data]);
                            break;
                        case "vec3":
                            gl.uniform3fv(uniformLocation, global.count > 1 ? data.flat() : [...data]);
                            break;
                        case "vec4":
                            gl.uniform4fv(uniformLocation, global.count > 1 ? data.flat() : [...data]);
                            break;
                    }
                    return texture_index;
                }, 0);
            }
            { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
                Object.entries(material.globals)
                    .filter((entry) => entry[1].type == "attribute")
                    .forEach(entry => {
                    const [key, global] = entry;
                    const data = binds[key];
                    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
                    const attributeLocation = gl.getAttribLocation(material.program, key);
                    const dataType = global.unit;
                    gl.vertexAttribPointer(attributeLocation, exports.unit_to_stride[dataType], gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(attributeLocation);
                    if (global.instanced) {
                        gl.vertexAttribDivisor(attributeLocation, 1);
                    }
                });
            }
            // 🖌 Draw the arrays/elements using size determined from aggregating buffers
            {
                const buffer_counts = Object.entries(material.globals)
                    .filter((entry) => entry[1].type == "attribute")
                    .reduce((buffer_counts, entry) => {
                    const [key, global] = entry;
                    const data = binds[key];
                    const stride = exports.unit_to_stride[global.unit];
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
                    .find((entry) => entry[1].type == "element");
                if (element_entry != null) {
                    const [element_key, element] = element_entry;
                    const data = binds[element_key];
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.buffer);
                    gl.drawElementsInstanced(gl[material.mode], data.length, gl.UNSIGNED_SHORT, 0, buffer_counts.instance);
                }
                else {
                    gl.drawArraysInstanced(gl[material.mode], 0, buffer_counts.element, buffer_counts.instance);
                }
            }
        }
        ShaderBuilder.render_material = render_material;
    })(ShaderBuilder || (exports.ShaderBuilder = ShaderBuilder = {}));
});
define("Util.Camera", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Camera = void 0;
    var Camera;
    (function (Camera) {
        Camera.environment = {
            includes: `
				vec2 camera_transform(vec3 world_position) {
					vec2 ortho_position =
						world_position.x * vec2(1.0, 0.5) +
						world_position.y * vec2(-1.0, 0.5) +
						world_position.z * vec2(0.0, 1.0);
					return vec2((
						ortho_position -
						camera_position
					) / camera_size);
				}
			`,
            globals: {
                "camera_size": { type: "uniform", unit: "vec2", count: 1 },
                "camera_position": { type: "uniform", unit: "vec2", count: 1 },
            },
        };
    })(Camera || (exports.Camera = Camera = {}));
});
define("Util.Indexing", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Indexing = void 0;
    var Indexing;
    (function (Indexing) {
        function to_index(vec, width) {
            return vec[0] + vec[1] * width;
        }
        Indexing.to_index = to_index;
        function to_index_bounded(vec, width) {
            if (vec[0] < 0 || vec[0] >= width || vec[1] < 0 || vec[1] >= width) {
                return null;
            }
            const index = to_index(vec, width);
            if (index < 0 || index >= width * width) {
                console.log("What");
            }
            return index;
        }
        Indexing.to_index_bounded = to_index_bounded;
    })(Indexing || (exports.Indexing = Indexing = {}));
});
define("Util.Terrain", ["require", "exports", "Util.ShaderBuilder", "Util.HtmlBuilder", "Util.Camera", "Util.VecMath", "Util.Indexing"], function (require, exports, Util_ShaderBuilder_1, Util_HtmlBuilder_1, Util_Camera_1, Util_VecMath_1, Util_Indexing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Terrain = void 0;
    var Terrain;
    (function (Terrain) {
        async function render(parent, camera, chunk_width, canvas_style) {
            const { canvas } = Util_HtmlBuilder_1.HtmlBuilder.create_children(parent, {
                canvas: {
                    type: "canvas",
                    style: {
                        ...canvas_style,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 0,
                    },
                    attributes: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                },
            });
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }
            //const chunk_width = 32;
            const heights_width = chunk_width + 1;
            const chunk_size = chunk_width * chunk_width;
            const heights_size = heights_width * heights_width;
            let heights = new Array(heights_size);
            for (let i = 0; i < heights_size; i++) {
                heights[i] = Math.floor(Math.pow(Math.random(), 4) * 5);
                //heights[i] = i % 43 == 0 ? 2 : 0;
            }
            // 🌊 Erosion
            const erosion_samples = [
                [-1, -1],
                [0, -1],
                [1, -1],
                [-1, 0],
                [1, 0],
                [-1, 1],
                [0, 1],
                [1, 1],
            ];
            for (let i = 0; i < 4; i++) {
                heights = heights.map((height, height_index) => ({
                    height,
                    coord: [
                        height_index % heights_width,
                        Math.floor(height_index / heights_width),
                    ],
                })).map(height_info => {
                    const other_height = erosion_samples.reduce((height, sample) => {
                        const height_index = Util_Indexing_1.Indexing.to_index_bounded(Util_VecMath_1.Vec2.add(sample, height_info.coord), heights_width);
                        if (height_index == null) {
                            return height;
                        }
                        return Math.max(height, heights[height_index]);
                    }, 0);
                    return height_info.height + Math.min(Math.max(other_height - height_info.height - 1, 0), 1);
                });
            }
            heights = heights.map(height => Math.min(height, 3));
            const coords_offset_per_square = [
                [0, 0],
                [1, 0],
                [0, 1],
                [1, 1],
            ];
            const sun_direction = Util_VecMath_1.Vec3.normal([1, -1, -2]);
            const vertices = new Float32Array(chunk_size * 6 * 3);
            const color = new Float32Array(chunk_size * 6 * 3);
            for (let height_index = 0; height_index < chunk_size; height_index++) {
                const height_coord = [
                    height_index % heights_width,
                    Math.floor(height_index / heights_width),
                ];
                const raw_vertices = coords_offset_per_square.map(vec => Util_VecMath_1.Vec2.add(vec, height_coord)).map(coord => [
                    coord[0],
                    coord[1],
                    heights[Util_Indexing_1.Indexing.to_index(coord, heights_width)] * 0.5,
                ]);
                const new_vertices = (raw_vertices[0][2] != raw_vertices[3][2] ?
                    [0, 1, 2, 2, 1, 3] :
                    [1, 3, 0, 0, 3, 2]).map(raw_index => raw_vertices[raw_index]);
                const shades = [
                    [new_vertices[0], new_vertices[1], new_vertices[2]],
                    [new_vertices[3], new_vertices[4], new_vertices[5]],
                ].map(verts => {
                    const diff_a = Util_VecMath_1.Vec3.sub(verts[1], verts[0]);
                    const diff_b = Util_VecMath_1.Vec3.sub(verts[2], verts[0]);
                    const normal = Util_VecMath_1.Vec3.normal(Util_VecMath_1.Vec3.cross(diff_a, diff_b));
                    return Math.max(-Util_VecMath_1.Vec3.dot(normal, sun_direction), 0) + 0.1;
                });
                vertices.set(new_vertices.flat(1), height_index * 6 * 3);
                color.set([
                    shades[0], shades[0], shades[0],
                    shades[0], shades[0], shades[0],
                    shades[0], shades[0], shades[0],
                    shades[1], shades[1], shades[1],
                    shades[1], shades[1], shades[1],
                    shades[1], shades[1], shades[1],
                ], height_index * 6 * 3);
            }
            // 🐢 Ground
            const ground_material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: {
                    ...Util_Camera_1.Camera.environment.globals,
                    "grass": { type: "uniform", unit: "sampler2D", count: 1 },
                    "world_position": { type: "attribute", unit: "vec3" },
                    "vertex_color": { type: "attribute", unit: "vec3" },
                    "uv": { type: "varying", unit: "vec2" },
                    "color": { type: "varying", unit: "vec3" },
                },
                vert_source: `            
				${Util_Camera_1.Camera.environment.includes}

				void main(void) {
					gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
					uv = world_position.xy;
					color = vertex_color;
				}
			`,
                frag_source: `
				void main(void) {
					gl_FragColor = vec4(texture2D(grass, uv).rgb * color, 1.0);
				}    
			`,
            });
            // 🌊 Water
            const water_material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: {
                    ...Util_Camera_1.Camera.environment.globals,
                    "water": { type: "uniform", unit: "sampler2D", count: 1 },
                    "water_height": { type: "uniform", unit: "float", count: 1 },
                    "foam": { type: "uniform", unit: "sampler2D", count: 1 },
                    "terrain_position": { type: "attribute", unit: "vec3" },
                    "uv": { type: "varying", unit: "vec2" },
                    "blend": { type: "varying", unit: "float" },
                },
                vert_source: `    
				${Util_Camera_1.Camera.environment.includes}

				void main(void) {
					gl_Position = vec4(
						camera_transform(vec3(
							terrain_position.x,
							terrain_position.y,
							max(terrain_position.z, water_height))
					), water_height * -0.25, 1.0);
					uv = terrain_position.xy;
					blend = clamp((water_height - terrain_position.z) * 4.0, 0.0, 1.0);
				}    
			`,
                frag_source: `
				void main(void) {
					gl_FragColor = vec4(mix(
						texture2D(foam, uv).y * vec3(2.0,2.0, 2.0),
						texture2D(water, uv).y * vec3(0.5, 0.7, 0.9),
						blend), 1.0);
				}       
			`
            });
            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            // 🎨 Draw materials
            Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, ground_material, {
                ...camera,
                "grass": await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/grass.jpg"),
                "world_position": Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, vertices),
                "vertex_color": Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, color),
            });
            Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, water_material, {
                ...camera,
                "water": await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/water.jpg"),
                "foam": await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/foam.jpg"),
                "terrain_position": Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, vertices),
                "water_height": 0.75,
            });
        }
        Terrain.render = render;
    })(Terrain || (exports.Terrain = Terrain = {}));
});
define("Util.Meeples", ["require", "exports", "Util.HtmlBuilder", "Util.Camera", "Util.VecMath", "Util.ShaderBuilder"], function (require, exports, Util_HtmlBuilder_2, Util_Camera_2, Util_VecMath_2, Util_ShaderBuilder_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Meeples = void 0;
    var Meeples;
    (function (Meeples) {
        async function render(parent, camera) {
            const { canvas } = Util_HtmlBuilder_2.HtmlBuilder.create_children(parent, {
                canvas: {
                    type: "canvas",
                    style: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 0,
                    },
                    attributes: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                }
            });
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }
            const skeleton = {
                chest: { parent: null, relative_position: [0, 0, 0], debug_color: [1, 1, 1], },
                head: { parent: "chest", relative_position: [0, 0, 0.5], debug_color: [1, 0, 0], },
                shoulder: { parent: "chest", relative_position: [.5, 0, 0], debug_color: [0, 0, 1], mirrored: true, },
                hip: { parent: "chest", relative_position: [0.25, 0, -1], debug_color: [0, 0, 1], mirrored: true, },
                elbow: { parent: "shoulder", relative_position: [.5, 0, 0], debug_color: [0, 1, 0], mirrored: true, },
                wrist: { parent: "elbow", relative_position: [.5, 0, 0], debug_color: [0, 1, 0], mirrored: true, },
                finger: { parent: "wrist", relative_position: [.5, 0, 0], debug_color: [0, 1, 0], mirrored: true, },
                knee: { parent: "hip", relative_position: [0, 0, -1], debug_color: [1, 0, 1], mirrored: true, },
                ankle: { parent: "knee", relative_position: [0, 0, -1], debug_color: [1, 0, 1], mirrored: true, },
                toe: { parent: "ankle", relative_position: [0, 0.25, 0], debug_color: [1, 0, 1], mirrored: true, },
            };
            // 🏭 Convert base-definition of skeleton into renderable bones
            const processed_bones = Object.entries(skeleton).
                map(([joint, bone]) => {
                if (bone.parent == null) {
                    return {
                        joint,
                        mirrored: bone.mirrored,
                        absolute_position: bone.relative_position
                    };
                }
                let parent_joint = skeleton[bone.parent];
                let absolute_position = Util_VecMath_2.Vec3.add(bone.relative_position, parent_joint.relative_position);
                while (parent_joint.parent != null) {
                    parent_joint = skeleton[parent_joint.parent];
                    absolute_position = Util_VecMath_2.Vec3.add(absolute_position, parent_joint.relative_position);
                }
                return {
                    joint,
                    absolute_position,
                    mirrored: bone.mirrored,
                };
            }).reduce((processed_bones, bone) => {
                if (bone.mirrored) {
                    return [
                        ...processed_bones, [
                            bone.joint,
                            bone.absolute_position,
                        ], [
                            bone.joint, [
                                -bone.absolute_position[0],
                                bone.absolute_position[1],
                                bone.absolute_position[2],
                            ]
                        ]
                    ];
                }
                return [...processed_bones, [
                        bone.joint,
                        bone.absolute_position,
                    ]];
            }, []);
            //🏀 Quick mockup for where skeleton joints should display
            const quad_to_triangles = [0, 1, 2, 2, 1, 3];
            const box_quads = {
                left: [
                    [1, -1, -1],
                    [1, 1, -1],
                    [1, -1, 1],
                    [1, 1, 1],
                ],
                right: [
                    [-1, -1, -1],
                    [-1, 1, -1],
                    [-1, -1, 1],
                    [-1, 1, 1],
                ],
                top: [
                    [-1, 1, -1],
                    [1, 1, -1],
                    [-1, 1, 1],
                    [1, 1, 1],
                ],
                bottom: [
                    [-1, -1, -1],
                    [1, -1, -1],
                    [-1, -1, 1],
                    [1, -1, 1],
                ],
                front: [
                    [-1, -1, 1],
                    [1, -1, 1],
                    [-1, 1, 1],
                    [1, 1, 1],
                ],
                back: [
                    [-1, -1, -1],
                    [1, -1, -1],
                    [-1, 1, -1],
                    [1, 1, -1],
                ],
            };
            const world_positions = new Float32Array(processed_bones.length * 6 * 6 * 3);
            const vertex_colors = new Float32Array(processed_bones.length * 6 * 6 * 3);
            const triangles = new Uint16Array(processed_bones.length * 6 * 6 * 3);
            processed_bones.forEach(([key, position], index) => {
                const offset = index * 6 * 6 * 3;
                const new_vertices = Object.values(box_quads).
                    map(quad => quad_to_triangles.
                    map(quad_index => Util_VecMath_2.Vec3.add(Util_VecMath_2.Vec3.scale(quad[quad_index], .1), position)).
                    flat(1)).
                    flat(1);
                world_positions.set(new_vertices, offset);
                const color = Object.values(skeleton[key].debug_color);
                const new_colors = new Array(6 * 6).fill(color);
                vertex_colors.set(new_colors.flat(1), offset);
            });
            // 🙋‍♂️ Meeples
            const meeple_material = Util_ShaderBuilder_2.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: {
                    ...Util_Camera_2.Camera.environment.globals,
                    "world_position": {
                        type: "attribute",
                        unit: "vec3",
                    },
                    "vertex_color": {
                        type: "attribute",
                        unit: "vec3",
                    },
                    "color": { type: "varying", unit: "vec3" },
                },
                vert_source: `            
				${Util_Camera_2.Camera.environment.includes}

				void main(void) {
					gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
					color = vertex_color;
				}
			`,
                frag_source: `
				void main(void) {
					gl_FragColor = vec4(color, 1.0);
				}    
			`
            });
            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            // 🎨 Draw materials
            Util_ShaderBuilder_2.ShaderBuilder.render_material(gl, meeple_material, {
                ...camera,
                "world_position": Util_ShaderBuilder_2.ShaderBuilder.create_buffer(gl, world_positions),
                "vertex_color": Util_ShaderBuilder_2.ShaderBuilder.create_buffer(gl, vertex_colors),
            });
        }
        Meeples.render = render;
    })(Meeples || (exports.Meeples = Meeples = {}));
});
define("Util.SmoothCurve", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmoothCurve = void 0;
    var SmoothCurve;
    (function (SmoothCurve) {
        function sample(curve, time) {
            const smooth_index = (time - curve.x_range[0]) /
                (curve.x_range[1] - curve.x_range[0]) *
                curve.y_values.length;
            const index = Math.floor(smooth_index);
            const current = Math.min(Math.max(index, 0), curve.y_values.length - 1);
            const next = Math.min(Math.max(index + 1, 0), curve.y_values.length - 1);
            const lerp = smooth_index - index;
            return curve.y_values[current] * (1 - lerp) + curve.y_values[next] * lerp;
        }
        SmoothCurve.sample = sample;
    })(SmoothCurve || (exports.SmoothCurve = SmoothCurve = {}));
});
define("Util.Forest", ["require", "exports", "Util.ShaderBuilder", "Util.HtmlBuilder", "Util.VecMath", "Util.Camera", "Util.SmoothCurve"], function (require, exports, Util_ShaderBuilder_3, Util_HtmlBuilder_3, Util_VecMath_3, Util_Camera_3, Util_SmoothCurve_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Forest = void 0;
    var Forest;
    (function (Forest) {
        function generate_structure(settings) {
            const start_node = {
                size: settings.start_size,
                position: [0, 0, 0],
                rotation: [0, 0, 0, 1],
                split_height: 0,
                growth: settings.start_growth,
                split_depth: 0,
            };
            const generation_queue = [];
            const nodes = [];
            const node_to_primary_child_index = [];
            generation_queue.push(start_node);
            let gen_item;
            while ((gen_item = generation_queue.pop()) != null) {
                const node_index = nodes.length;
                nodes.push(gen_item);
                node_to_primary_child_index.push(undefined);
                if (gen_item.parent_index != null) {
                    node_to_primary_child_index[gen_item.parent_index] = node_index;
                }
                // 🐣 Branch spawning
                const depth_definitions = Object.values(settings.depth_definitions);
                if (gen_item.split_depth < depth_definitions.length) {
                    const depth_definition = depth_definitions[gen_item.split_depth];
                    const split_amount = depth_definition.split_amount * gen_item.growth;
                    const split_depth = gen_item.split_depth + 1;
                    // 🌴 Main branch extension
                    {
                        const growth = Util_VecMath_3.Num.clamp(Util_SmoothCurve_1.SmoothCurve.sample(depth_definition.height_to_growth, 0), 0, 1);
                        const up = Util_VecMath_3.Vec3.apply_quat([0, 0, gen_item.size * gen_item.growth], gen_item.rotation);
                        generation_queue.unshift({
                            parent_index: node_index,
                            position: Util_VecMath_3.Vec3.add(gen_item.position, up),
                            rotation: Util_VecMath_3.Quat.mul(gen_item.rotation, Util_VecMath_3.Quat.axis_angle([0, 0, 1], depth_definition.branch_roll)),
                            size: gen_item.size *
                                depth_definition.size,
                            split_height: split_depth == 1 ? 0 : gen_item.split_height,
                            growth: growth,
                            split_depth,
                        });
                    }
                    // 🌿 Tangental branches
                    for (let splitIndex = 0; splitIndex < split_amount; splitIndex++) {
                        const split_height = splitIndex / split_amount;
                        const growth = Util_VecMath_3.Num.clamp(Util_SmoothCurve_1.SmoothCurve.sample(depth_definition.height_to_growth, split_height * gen_item.growth), 0, 1);
                        generation_queue.unshift({
                            position: Util_VecMath_3.Vec3.add(gen_item.position, Util_VecMath_3.Vec3.apply_quat([0, 0, gen_item.size * gen_item.growth * (1 - split_height * depth_definition.height_spread)], gen_item.rotation)),
                            rotation: Util_VecMath_3.Quat.mul(gen_item.rotation, Util_VecMath_3.Quat.mul(Util_VecMath_3.Quat.axis_angle([0, 0, 1], depth_definition.branch_roll +
                                Util_VecMath_3.Num.flatten_angle(splitIndex * 6.283 * 0.618, depth_definition.flatness)), Util_VecMath_3.Quat.axis_angle([0, 1, 0], depth_definition.branch_pitch))),
                            size: gen_item.size *
                                depth_definition.size,
                            growth,
                            split_height: split_depth == 1 ? split_height : gen_item.split_height,
                            split_depth
                        });
                    }
                }
            }
            return {
                nodes,
                node_to_primary_child_index,
            };
        }
        const bark_normals = [
            [0.5, 0.5, 0],
            [-0.5, 0.5, 0],
            [-0.5, -0.5, 0],
            [0.5, -0.5, 0],
            [0.5, 0.5, 0],
            [-0.5, 0.5, 0],
            [-0.5, -0.5, 0],
            [0.5, -0.5, 0],
        ];
        const bark_triangles = [
            0, 1, 2, 2, 3, 0, // Bottom
            6, 5, 4, 4, 7, 6, // Top
            2, 1, 5, 5, 6, 2, // Left
            0, 3, 4, 4, 3, 7, // Right
            3, 2, 6, 6, 7, 3, // Back
            1, 0, 4, 4, 5, 1, // Forward
        ];
        const leaf_triangles = [
            0, 1, 2, 2, 3, 0
        ];
        const leaf_normals = [
            [0, 1, 0],
            [-0.2, 0.8, 0],
            [0, 1, 0],
            [0.2, 0.8, 0],
        ];
        function generate_tapered_wood(skeleton, settings) {
            const mesh = {
                vertices: new Float32Array(skeleton.nodes.length * 8 * 3),
                normals: new Float32Array(skeleton.nodes.length * 8 * 3),
                split_height: new Float32Array(skeleton.nodes.length * 8),
                triangles: new Uint16Array(skeleton.nodes.length * 6 * 6),
            };
            skeleton.nodes.
                filter(node => node.split_depth != settings.leaves.split_depth).
                forEach((parent, node_index) => {
                const child_index = skeleton.node_to_primary_child_index[node_index];
                const child = child_index == null ? parent :
                    skeleton.nodes[child_index];
                const grandchild_index = child_index == null ? null :
                    skeleton.node_to_primary_child_index[child_index];
                const grandchild = grandchild_index == null ? child :
                    skeleton.nodes[grandchild_index];
                const height = parent.size * parent.growth;
                const parent_size = Util_VecMath_3.Num.lerp(child.size, parent.size, parent.growth) * settings.thickness;
                const child_size = Util_VecMath_3.Num.lerp(grandchild.size, child.size, child.growth) * settings.thickness;
                const vertices = [
                    [0.5 * parent_size, 0.5 * parent_size, 0], // 0
                    [-0.5 * parent_size, 0.5 * parent_size, 0], // 1
                    [-0.5 * parent_size, -0.5 * parent_size, 0], // 2
                    [0.5 * parent_size, -0.5 * parent_size, 0], // 3
                    [0.5 * child_size, 0.5 * child_size, height], // 4
                    [-0.5 * child_size, 0.5 * child_size, height], // 5
                    [-0.5 * child_size, -0.5 * child_size, height], // 6
                    [0.5 * child_size, -0.5 * child_size, height], // 7
                ];
                const vertex_offset = node_index * vertices.length * 3;
                mesh.vertices.set(vertices.flatMap(vertex => Util_VecMath_3.Vec3.apply_mat4(vertex, Util_VecMath_3.Mat4.rot_trans(parent.rotation, parent.position))), vertex_offset);
                mesh.normals.set(bark_normals.flatMap(normal => Util_VecMath_3.Vec3.normal(Util_VecMath_3.Vec3.apply_quat(normal, parent.rotation))), vertex_offset);
                mesh.split_height.set(vertices.map(() => parent.split_height), node_index * vertices.length);
                mesh.triangles.set(bark_triangles.map(i => i + node_index * vertices.length), node_index * bark_triangles.length);
            });
            return mesh;
        }
        Forest.generate_tapered_wood = generate_tapered_wood;
        function generate_leaves(skeleton, settings) {
            const mesh = {
                vertices: new Float32Array(skeleton.nodes.length * 4 * 3),
                normals: new Float32Array(skeleton.nodes.length * 4 * 3),
                split_height: new Float32Array(skeleton.nodes.length * 4),
                triangles: new Uint16Array(skeleton.nodes.length * 6),
            };
            skeleton.nodes.
                filter(node => node.split_depth == settings.leaves.split_depth).
                forEach((node, node_index) => {
                const length = node.size * settings.leaves.length;
                const breadth = node.size * settings.leaves.breadth;
                const vertices = [
                    [0, 0, 0], // 0
                    [breadth * 0.4, breadth * 0.1, length * 0.5], // 1
                    [0, 0, length], // 2
                    [breadth * -0.4, breadth * 0.1, length * 0.5], // 3
                ];
                const vertex_offset = node_index * vertices.length * 3;
                mesh.vertices.set(vertices.flatMap(vertex => Util_VecMath_3.Vec3.apply_mat4(vertex, Util_VecMath_3.Mat4.rot_trans(node.rotation, node.position))), vertex_offset);
                mesh.normals.set(leaf_normals.flatMap(normal => Util_VecMath_3.Vec3.normal(Util_VecMath_3.Vec3.apply_quat(normal, node.rotation))), vertex_offset);
                mesh.split_height.set(vertices.map(() => node.split_height), node_index * vertices.length);
                mesh.triangles.set(leaf_triangles.map(i => i + node_index * vertices.length), node_index * leaf_triangles.length);
            });
            return mesh;
        }
        Forest.generate_leaves = generate_leaves;
        async function render(parent, camera) {
            const { canvas } = Util_HtmlBuilder_3.HtmlBuilder.create_children(parent, {
                canvas: {
                    type: "canvas",
                    style: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 0,
                    },
                    attributes: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                }
            });
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }
            // 🌳 Beautiful trees ---
            const diciduous = {
                start_size: 1,
                start_growth: 1,
                thickness: 0.05,
                leaves: {
                    split_depth: 4,
                    length: 1,
                    breadth: .3,
                },
                growth_to_thickness: {
                    y_values: [0.0025, 0.035],
                    x_range: [0, 1]
                },
                depth_definitions: {
                    "Branch-A": {
                        split_amount: 10,
                        flatness: 0,
                        size: 0.3,
                        height_spread: 0.8,
                        branch_pitch: 50,
                        branch_roll: 90,
                        height_to_growth: {
                            y_values: [0, 1],
                            x_range: [0, 0.25]
                        },
                    },
                    "Branch-B": {
                        split_amount: 6,
                        flatness: 0.6,
                        size: 0.4,
                        height_spread: 0.8,
                        branch_pitch: 60 / 180 * Math.PI,
                        branch_roll: 90 / 180 * Math.PI,
                        height_to_growth: {
                            y_values: [0.5, 0.9, 1],
                            x_range: [0, 0.5]
                        },
                    },
                    "Branch-C": {
                        split_amount: 10,
                        flatness: 0,
                        size: 0.4,
                        height_spread: 0.8,
                        branch_pitch: 40 / 180 * Math.PI,
                        branch_roll: 90 / 180 * Math.PI,
                        height_to_growth: {
                            y_values: [0.5, 0.8, 1, 0.8, .5],
                            x_range: [0, 0.5]
                        },
                    },
                    "Leaf": {
                        split_amount: 10,
                        flatness: 0,
                        size: 0.7,
                        height_spread: 0.8,
                        branch_pitch: 40 / 180 * Math.PI,
                        branch_roll: 90 / 180 * Math.PI,
                        height_to_growth: {
                            y_values: [0.5, 0.8, 1, 0.8, .5],
                            x_range: [0, 0.5]
                        },
                    }
                }
            };
            const skeleton = generate_structure(diciduous);
            const bark_mesh = generate_tapered_wood(skeleton, diciduous);
            const leaf_mesh = generate_leaves(skeleton, diciduous);
            const model_position = new Float32Array([
                [0, 0, 0],
                [4, 0, 0],
                [0, 4, 0],
                [4, 4, 0],
            ].flatMap(vec => Util_VecMath_3.Vec3.add(vec, [16, 16, 0])));
            const model_growth = new Float32Array([
                1, 0.2, 0.6, 0.4,
            ]);
            const tree_material = {
                mode: "TRIANGLES",
                globals: {
                    ...Util_Camera_3.Camera.environment.globals,
                    "triangles": { type: "element" },
                    "child_size": { type: "uniform", unit: "float", count: 1 },
                    "scale": { type: "uniform", unit: "float", count: 1 },
                    "model_position": {
                        type: "attribute",
                        unit: "vec3",
                        instanced: true,
                    },
                    "model_growth": {
                        type: "attribute",
                        unit: "float",
                        instanced: true,
                    },
                    "vertex_position": {
                        type: "attribute",
                        unit: "vec3",
                    },
                    "vertex_normal": {
                        type: "attribute",
                        unit: "vec3",
                    },
                    "vertex_split_height": {
                        type: "attribute",
                        unit: "float",
                    },
                    "shade": { type: "varying", unit: "float" },
                },
                vert_source: `
			${Util_Camera_3.Camera.environment.includes}

			void main(void) {
				float z_position = vertex_position.z - (1.0 - model_growth);
				float shrink_rate = -min(z_position, 0.0);
				vec3 shrunk_position = vec3(vertex_position.xy * mix(1.0, child_size, shrink_rate), z_position + shrink_rate);
				vec3 world_position = shrunk_position * scale + model_position;
				gl_Position = vertex_split_height > model_growth ?
					vec4(0) :
					vec4(camera_transform(world_position), world_position.z * -0.125, 1.0);
				shade = max(dot(vertex_normal, -vec3(1.0, -1.0, -2.0)), 0.0);
			}
		`,
            };
            const bark_material = Util_ShaderBuilder_3.ShaderBuilder.generate_material(gl, {
                ...tree_material,
                frag_source: `
				void main(void) {
					gl_FragData[0] = vec4(vec3(0.7, 0.6, 0.5) * (0.25 + shade * 0.75), 1.0);
				}    
			`,
            });
            const leaf_material = Util_ShaderBuilder_3.ShaderBuilder.generate_material(gl, {
                ...tree_material,
                frag_source: `
				void main(void) {
					gl_FragData[0] = vec4(vec3(0.55, 0.8, 0.35) * (0.5 + shade * 0.5), 1.0);
				}    
			`,
            });
            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            const global_binds = {
                ...camera,
                "model_position": Util_ShaderBuilder_3.ShaderBuilder.create_buffer(gl, model_position),
                "model_growth": Util_ShaderBuilder_3.ShaderBuilder.create_buffer(gl, model_growth),
                "child_size": diciduous.depth_definitions["Branch-A"].size,
                "scale": 7,
            };
            // 🎨 Draw materials
            [
                { material: leaf_material, mesh: leaf_mesh },
                { material: bark_material, mesh: bark_mesh },
            ].forEach(pass => Util_ShaderBuilder_3.ShaderBuilder.render_material(gl, pass.material, {
                ...global_binds,
                "triangles": Util_ShaderBuilder_3.ShaderBuilder.create_element_buffer(gl, pass.mesh.triangles),
                "vertex_position": Util_ShaderBuilder_3.ShaderBuilder.create_buffer(gl, pass.mesh.vertices),
                "vertex_normal": Util_ShaderBuilder_3.ShaderBuilder.create_buffer(gl, pass.mesh.normals),
                "vertex_split_height": Util_ShaderBuilder_3.ShaderBuilder.create_buffer(gl, pass.mesh.split_height),
            }));
        }
        Forest.render = render;
    })(Forest || (exports.Forest = Forest = {}));
});
define("Util.Weebles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Weebles = void 0;
    var Weebles;
    (function (Weebles) {
        function run() {
            let state = {
                simulants: new Array(10).map(() => ({
                    position: [
                        Math.random(),
                        Math.random(),
                    ],
                })),
            };
            requestAnimationFrame(() => {
                state = {
                    ...state,
                    simulants: state.simulants.map(simulant => {
                        return {
                            ...simulant,
                            position: [
                                simulant.position[0],
                                simulant.position[1],
                            ],
                        };
                    }),
                };
            });
        }
        Weebles.run = run;
    })(Weebles || (exports.Weebles = Weebles = {}));
});
define("Util.Editor", ["require", "exports", "Util.HtmlBuilder"], function (require, exports, Util_HtmlBuilder_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = void 0;
    var Editor;
    (function (Editor) {
        function insert_text(state) {
            return {
                editor_contents: `${state.editor_contents.substring(0, state.selection_start)}${state.new_text}${state.editor_contents.substring(state.selection_end, state.editor_contents.length)}`,
                selection_start: state.selection_start + state.new_text.length,
                selection_end: state.selection_start + state.new_text.length,
            };
        }
        Editor.insert_text = insert_text;
        function render(parent) {
            const apply_text_state = (state) => {
                text_editor.value = state.editor_contents;
                text_editor.selectionStart = state.selection_start;
                text_editor.selectionEnd = state.selection_end;
            };
            const handle_tab_input = (e) => {
                if (e.key != "Tab")
                    return;
                apply_text_state(insert_text({
                    new_text: "\t",
                    selection_start: text_editor.selectionStart,
                    selection_end: text_editor.selectionEnd,
                    editor_contents: text_editor.value,
                }));
                e.preventDefault();
                return true;
            };
            const handle_enter_input = (e) => {
                if (e.key != "Enter")
                    return;
                const state = {
                    selection_start: text_editor.selectionStart,
                    selection_end: text_editor.selectionEnd,
                    editor_contents: text_editor.value,
                };
                const pre_text = state.editor_contents.substring(0, state.selection_start);
                const line_start = pre_text.lastIndexOf("\n");
                const pre_line = pre_text.substring(line_start + 1);
                const text_start = pre_line.trimStart();
                const white_space = pre_line.substring(0, pre_line.length - text_start.length);
                apply_text_state(insert_text({
                    ...state,
                    new_text: `\n${white_space}`,
                }));
                e.preventDefault();
                return true;
            };
            const { text_editor } = Util_HtmlBuilder_4.HtmlBuilder.create_children(parent, {
                text_editor: {
                    type: "textarea",
                    style: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 3,
                        color: "white",
                        backgroundColor: "transparent",
                        fontFamily: "Trebuchet MS",
                        fontSize: "16",
                        // wordWrap: "break-word",
                        // whiteSpace: "pre",
                        // overflow: "scroll",
                    },
                    attributes: {
                        innerHTML: sample_text,
                        contentEditable: "true",
                        spellcheck: false,
                        onkeydown: (e) => {
                            return (handle_tab_input(e) ||
                                handle_enter_input(e));
                        },
                    },
                },
            });
        }
        Editor.render = render;
        ;
    })(Editor || (exports.Editor = Editor = {}));
    const sample_text = `
import { Shaders } from "./Util.Shaders";
import { Texture } from "./Util.Texture";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Vec3, Quat, Num, Mat4 } from "./Util.VecMath";
import { Camera } from "./Util.Camera";

export type SmoothCurve = {
	y_values: number[],
	x_range: [number, number],
}

export namespace SmoothCurve {
	export function sample(curve: SmoothCurve, time: number) {
		const smooth_index =
			(time - curve.x_range[0]) /
			(curve.x_range[1] - curve.x_range[0]) *
			curve.y_values.length;
		const index = Math.floor(smooth_index);
		const current = Math.min(Math.max(index, 0), curve.y_values.length - 1);
		const next = Math.min(Math.max(index + 1, 0), curve.y_values.length - 1);
		const lerp = smooth_index - index;
		return curve.y_values[current] * (1 - lerp) + curve.y_values[next] * lerp;
	}
}

export namespace Forest {

	export type DepthDefinition = {
		readonly name: string,
		readonly split_amount: number,
		readonly flatness: number,
		readonly size: number,
		readonly height_spread: number,
		readonly branch_pitch: number,
		readonly branch_roll: number,
		readonly height_to_growth: SmoothCurve,
	}

	export type Settings = {
		readonly start_size: number,
		readonly start_growth: number,
		readonly depth_definitions: DepthDefinition[],
	}

	export type MeshSettings = {
		readonly thickness: number,
		readonly leaves: {
			split_depth: number,
			length: number,
			breadth: number,
		},
		readonly growth_to_thickness: SmoothCurve,
	}

	export type GenQueueItem = Node & {
		readonly parent_index?: number,
	}

	export type Node = {
		readonly size: number,
		readonly position: Vec3,
		readonly rotation: Quat,
		readonly split_height: number,
		readonly growth: number,
		readonly split_depth: number,
	}

	function generate_structure(settings: Settings) {

		const start_node = {
			size: settings.start_size,
			position: [0, 0, 0],
			rotation: [0, 0, 0, 1],
			split_height: 0,
			growth: settings.start_growth,
			split_depth: 0,
		} as const;

		const generation_queue: GenQueueItem[] = [];
		const nodes = [];
		const node_to_primary_child_index = [];

		generation_queue.push(start_node);
		let gen_item;
		while ((gen_item = generation_queue.pop()) != null) {
			const node_index = nodes.length;
			nodes.push(gen_item);
			node_to_primary_child_index.push(undefined);
			if (gen_item.parent_index != null) {
				node_to_primary_child_index[gen_item.parent_index] = node_index;
			}

			// 🐣 Branch spawning
			if (gen_item.split_depth < settings.depth_definitions.length) {
				const depth_definition = settings.depth_definitions[gen_item.split_depth];
				const split_amount = depth_definition.split_amount * gen_item.growth;
				const split_depth = gen_item.split_depth + 1;

				// 🌴 Main branch extension
				{
					const growth = Num.clamp(
						SmoothCurve.sample(
							depth_definition.height_to_growth, 0),
						0, 1);
					const up = Vec3.apply_quat(
						[0, 0, gen_item.size * gen_item.growth],
						gen_item.rotation);
					generation_queue.unshift({
						parent_index: node_index,
						position: Vec3.add(gen_item.position, up),
						rotation: Quat.mul(gen_item.rotation,
							Quat.axis_angle(
								[0, 0, 1],
								depth_definition.branch_roll)),
						size: gen_item.size *
							depth_definition.size,
						split_height: split_depth == 1 ? 0 : gen_item.split_height,
						growth: growth,
						split_depth,
					});
				}

				// 🌿 Tangental branches
				for (
					let splitIndex = 0;
					splitIndex < split_amount;
					splitIndex++
				) {
					const split_height = splitIndex / split_amount;
					const growth = Num.clamp(
						SmoothCurve.sample(
							depth_definition.height_to_growth,
							split_height * gen_item.growth),
						0, 1);
					generation_queue.unshift({
						position: Vec3.add(gen_item.position,
							Vec3.apply_quat(
								[0, 0, gen_item.size * gen_item.growth * (1 - split_height * depth_definition.height_spread)],
								gen_item.rotation)),
						rotation: Quat.mul(
							gen_item.rotation,
							Quat.mul(
								Quat.axis_angle(
									[0, 0, 1],
									depth_definition.branch_roll +
									Num.flatten_angle(
										splitIndex * 6.283 * 0.618, depth_definition.flatness),
								),
								Quat.axis_angle(
									[0, 1, 0],
									depth_definition.branch_pitch))),
						size: gen_item.size *
							depth_definition.size,
						growth,
						split_height: split_depth == 1 ? split_height : gen_item.split_height,
						split_depth
					});
				}
			}
		}
		return {
			nodes,
			node_to_primary_child_index,
		} as const;
	}

	type Skeleton = ReturnType<typeof generate_structure>;

	const bark_normals = [
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
	] as const;

	const bark_triangles = [
		0, 1, 2, 2, 3, 0, // Bottom
		6, 5, 4, 4, 7, 6, // Top
		2, 1, 5, 5, 6, 2, // Left
		0, 3, 4, 4, 3, 7, // Right
		3, 2, 6, 6, 7, 3, // Back
		1, 0, 4, 4, 5, 1, // Forward
	] as const;

	const leaf_triangles = [
		0, 1, 2, 2, 3, 0
	] as const;

	const leaf_normals = [
		[0, 1, 0],
		[-0.2, 0.8, 0],
		[0, 1, 0],
		[0.2, 0.8, 0],
	] as const;

	export function generate_tapered_wood(
		skeleton: Skeleton,
		settings: MeshSettings,
	) {
		const mesh = {
			vertices: new Float32Array(skeleton.nodes.length * 8 * 3),
			normals: new Float32Array(skeleton.nodes.length * 8 * 3),
			split_height: new Float32Array(skeleton.nodes.length * 8),
			triangles: new Uint16Array(skeleton.nodes.length * 6 * 6),
		} as const;
		skeleton.nodes.
			filter(node => node.split_depth != settings.leaves.split_depth).
			forEach((parent, node_index) => {
				const child_index = skeleton.node_to_primary_child_index[node_index];
				const child = child_index == null ? parent :
					skeleton.nodes[child_index];
				const grandchild_index = child_index == null ? null :
					skeleton.node_to_primary_child_index[child_index];
				const grandchild = grandchild_index == null ? child :
					skeleton.nodes[grandchild_index];
				const height = parent.size * parent.growth;
				const parent_size = Num.lerp(child.size, parent.size, parent.growth) * settings.thickness;
				const child_size = Num.lerp(grandchild.size, child.size, child.growth) * settings.thickness;
				const vertices = [
					[0.5 * parent_size, 0.5 * parent_size, 0], // 0
					[-0.5 * parent_size, 0.5 * parent_size, 0], // 1
					[-0.5 * parent_size, -0.5 * parent_size, 0], // 2
					[0.5 * parent_size, -0.5 * parent_size, 0], // 3
					[0.5 * child_size, 0.5 * child_size, height], // 4
					[-0.5 * child_size, 0.5 * child_size, height], // 5
					[-0.5 * child_size, -0.5 * child_size, height], // 6
					[0.5 * child_size, -0.5 * child_size, height], // 7
				] as const;
				const vertex_offset = node_index * vertices.length * 3;
				mesh.vertices.set(
					vertices.flatMap(vertex =>
						Vec3.apply_mat4(
							vertex,
							Mat4.rot_trans(
								parent.rotation,
								parent.position,
							))),
					vertex_offset);
				mesh.normals.set(
					bark_normals.flatMap(normal =>
						Vec3.normal(
							Vec3.apply_quat(
								normal,
								parent.rotation,
							))),
					vertex_offset);
				mesh.split_height.set(
					vertices.map(() => parent.split_height), node_index * vertices.length);
				mesh.triangles.set(
					bark_triangles.map(i => i + node_index * vertices.length),
					node_index * bark_triangles.length);
			});
		return mesh;
	}

	export function generate_leaves(
		skeleton: Skeleton,
		settings: MeshSettings,
	) {
		const mesh = {
			vertices: new Float32Array(skeleton.nodes.length * 4 * 3),
			normals: new Float32Array(skeleton.nodes.length * 4 * 3),
			split_height: new Float32Array(skeleton.nodes.length * 4),
			triangles: new Uint16Array(skeleton.nodes.length * 6),
		} as const;
		skeleton.nodes.
			filter(node => node.split_depth == settings.leaves.split_depth).
			forEach((node, node_index) => {
				const length = node.size * settings.leaves.length;
				const breadth = node.size * settings.leaves.breadth;
				const vertices = [
					[0, 0, 0], // 0
					[breadth * 0.4, breadth * 0.1, length * 0.5], // 1
					[0, 0, length], // 2
					[breadth * -0.4, breadth * 0.1, length * 0.5], // 3
				] as const;
				const vertex_offset = node_index * vertices.length * 3;
				mesh.vertices.set(
					vertices.flatMap(vertex =>
						Vec3.apply_mat4(
							vertex,
							Mat4.rot_trans(
								node.rotation,
								node.position,
							))),
					vertex_offset);
				mesh.normals.set(
					leaf_normals.flatMap(normal =>
						Vec3.normal(
							Vec3.apply_quat(
								normal,
								node.rotation,
							))),
					vertex_offset);
				mesh.split_height.set(
					vertices.map(() => node.split_height), node_index * vertices.length);
				mesh.triangles.set(
					leaf_triangles.map(i => i + node_index * vertices.length),
					node_index * leaf_triangles.length);
			});
		return mesh;
	}

	export async function render(
		parent: HTMLElement,
		camera: typeof Camera.default_camera,
	) {
		const canvas = HtmlBuilder.create_child(parent, {
			type: "canvas",
			style: {
				// ...ChillpointStyles.blurred,
				width: "100%",
				height: "100%",
				position: "absolute",
				left: 0,
				top: 0,
				zIndex: 0,
			},
			attributes: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		});
		const gl = canvas.getContext('webgl2');
		if (gl == null) {
			return new Error("Canvas rendering context is invalid");
		}

		// 🌳 Beautiful trees ---
		const diciduous: Settings & MeshSettings = {
			start_size: 1,
			start_growth: 1,
			thickness: 0.05,
			leaves: {
				split_depth: 4,
				length: 1,
				breadth: .3,
			},
			growth_to_thickness: {
				y_values: [0.0025, 0.035],
				x_range: [0, 1]
			},
			depth_definitions: [{
				name: "Branch-A",
				split_amount: 10,
				flatness: 0,
				size: 0.3,
				height_spread: 0.8,
				branch_pitch: 50,
				branch_roll: 90,
				height_to_growth: {
					y_values: [0, 1],
					x_range: [0, 0.25]
				},
			}, {
				name: "Branch-B",
				split_amount: 6,
				flatness: 0.6,
				size: 0.4,
				height_spread: 0.8,
				branch_pitch: 60 / 180 * Math.PI,	
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.9, 1],
					x_range: [0, 0.5]
				},
			}, {
				name: "Branch-C",
				split_amount: 10,
				flatness: 0,
				size: 0.4,
				height_spread: 0.8,
				branch_pitch: 40 / 180 * Math.PI,
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.8, 1, 0.8, .5],
					x_range: [0, 0.5]
				},
			}, {
				name: "Leaf",
				split_amount: 10,
				flatness: 0,
				size: 0.7,
				height_spread: 0.8,
				branch_pitch: 40 / 180 * Math.PI,
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.8, 1, 0.8, .5],
					x_range: [0, 0.5]
				},
			}]
		};

		{ // 🙏 Set up gl context for rendering
			gl.clearColor(0, 0, 0, 0);
			gl.enable(gl.DEPTH_TEST);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

		// 🎨 Draw materials
		Shaders.render_material(gl, bark_material, bark_mesh.triangles.length, model_position.length / 3.0);
		Shaders.render_material(gl, leaf_material, leaf_mesh.triangles.length, model_position.length / 3.0);
	}
}
`;
});
define("Util.PeerAdvertising", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PeerAdvertising = void 0;
    /**
     * 🌍 Single location to advertise peer nodes and have nodes learn about each other.
     * Requires some authentication to ensure that bad actors can't know about peers.
     * This server should be publically available at an easily memorable URL for access from peer nodes.
     * Hopefully, this SHOULD be the only server cost to maintain,
     * since all other nodes can be run from offices, homes and cellphones.
     */
    var PeerAdvertising;
    (function (PeerAdvertising) {
        PeerAdvertising.public_address = "35.202.26.213";
        PeerAdvertising.public_port = 80;
        PeerAdvertising.private_key = "coast.rip.scope.decay.peach"; // 👷 Change this for actual distribution
        PeerAdvertising.hearbeat_rate_ms = 3000;
        async function available_peers() {
            const response = await command_server({
                private_key: PeerAdvertising.private_key,
                type: "available_peers",
            });
            if ("error" in response ||
                "success" in response) {
                return null;
            }
            return response;
        }
        PeerAdvertising.available_peers = available_peers;
        function advertise_peer(peer) {
            return setInterval(async () => {
                const response = await command_server({
                    private_key: PeerAdvertising.private_key,
                    type: "register_heartbeat",
                    ...peer,
                });
                if (typeof response == "string") {
                    console.log(response);
                }
            }, PeerAdvertising.hearbeat_rate_ms);
        }
        PeerAdvertising.advertise_peer = advertise_peer;
        async function command_server(command) {
            const fetchResult = await fetch(`http://${PeerAdvertising.public_address}:${PeerAdvertising.public_port}`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(command),
            });
            const text = await fetchResult.text();
            const response = text ? JSON.parse(text) : {};
            return response;
        }
    })(PeerAdvertising || (exports.PeerAdvertising = PeerAdvertising = {}));
});
define("Util.PeerConnection", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PeerConnection = void 0;
    var PeerConnection;
    (function (PeerConnection) {
        function errorHandler(context) {
            return function (error) {
                console.log('Failure in ' + context + ': ' + error.toString);
            };
        }
        // eslint-disable-next-line no-unused-vars
        function successHandler(context) {
            return function () {
                console.log('Success in ' + context);
            };
        }
        function noAction() {
        }
        async function example() {
            console.log("🏃 Gonna do it");
            let servers = null;
            let pc1 = new RTCPeerConnection();
            let pc2 = new RTCPeerConnection();
            pc1.onicecandidate = function (event) {
                if (event.candidate) {
                    pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
                    console.log("pc1");
                }
            };
            pc2.onicecandidate = function (event) {
                if (event.candidate) {
                    pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
                    console.log("pc2");
                }
            };
            const desc = await pc1.createOffer();
            pc1.setLocalDescription(desc);
            pc2.setRemoteDescription(desc);
            const desc2 = await pc2.createAnswer();
            pc2.setLocalDescription(desc2);
            pc1.setRemoteDescription(desc2);
            console.log("Did all that 👍");
        }
        PeerConnection.example = example;
    })(PeerConnection || (exports.PeerConnection = PeerConnection = {}));
});
define("Entry.UI.Tests", ["require", "exports", "Util.HtmlBuilder", "Chillpoint.Styles", "Util.Terrain", "Util.Meeples", "Util.Forest", "Util.Editor", "Util.PeerAdvertising", "Util.PeerConnection"], function (require, exports, Util_HtmlBuilder_5, Chillpoint_Styles_1, Util_Terrain_1, Util_Meeples_1, Util_Forest_1, Util_Editor_1, Util_PeerAdvertising_1, Util_PeerConnection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UITests = void 0;
    // import { modelTests } from "./Model.Tests";
    /**
     *	👨‍🔬 Test front-end UI features using different named environments
     */
    var UITests;
    (function (UITests) {
        function initialize_client() {
            // modelTests();
            const body = Util_HtmlBuilder_5.HtmlBuilder.assign_to_element(document.body, {
                style: {
                    margin: 0,
                    fontSize: 20,
                    position: "relative",
                    overflowX: "hidden",
                    overflowY: "hidden",
                },
            });
            const camera = {
                "camera_position": [0, 17],
                "camera_size": [7 * window.innerWidth / window.innerHeight, 7],
            };
            const tests = {
                terrain: () => {
                    Util_Terrain_1.Terrain.render(body, camera, 32, {});
                },
                forest_small: () => {
                    Util_Terrain_1.Terrain.render(body, camera, 32, Chillpoint_Styles_1.ChillpointStyles.blurred);
                    Util_Forest_1.Forest.render(body, camera);
                },
                forest_big: () => {
                    Util_Terrain_1.Terrain.render(body, camera, 32, {});
                    Util_Forest_1.Forest.render(body, camera);
                },
                meeples: () => {
                    Util_Terrain_1.Terrain.render(body, camera, 32, {});
                    Util_Meeples_1.Meeples.render(body, camera);
                },
                editor: () => {
                    Util_Terrain_1.Terrain.render(body, camera, 32, Chillpoint_Styles_1.ChillpointStyles.blurred);
                    Util_Editor_1.Editor.render(body);
                },
                register_peer: async () => {
                    Util_PeerAdvertising_1.PeerAdvertising.advertise_peer({
                        identifier: `${Math.random()}`.slice(2, 8),
                        role: "web",
                    });
                    const info = Util_HtmlBuilder_5.HtmlBuilder.create_child("info", body, {
                        type: "div",
                        attributes: { innerHTML: "Registering peer!" },
                        style: { color: "white" },
                    });
                    setInterval(async () => {
                        Util_HtmlBuilder_5.HtmlBuilder.assign_to_element(info, {
                            attributes: { innerHTML: `${JSON.stringify(await Util_PeerAdvertising_1.PeerAdvertising.available_peers())}` },
                        });
                    }, 1000);
                },
                peer_example: Util_PeerConnection_1.PeerConnection.example,
            };
            const url = new URL(window.location.href);
            const test_name = (url.searchParams.get("test") || "forest_big");
            tests[test_name]();
            const ui_outline = Util_HtmlBuilder_5.HtmlBuilder.create_child("ui_outline", body, {
                type: "div",
                style: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    gridTemplateAreas: `
					"t t t"
					". a ."
					"f f f"
				`,
                    zIndex: 1,
                },
            });
            // const header = HtmlBuilder.create_child(uiOutline, {
            // 	type: "div",
            // 	style: {
            // 		gridArea: "h",
            // 		gridTemplateAreas: `
            // 			"t ."
            // 		`,
            // 		...Styles.centered,
            // 		backgroundColor: "green",
            // 		borderRadius: "5px",
            // 		padding: "0.5em",
            // 	},
            // });
            // HtmlBuilder.create_child(header, {
            // 	type: "div",
            // 	style: {
            // 		...Styles.text,
            // 		gridArea: "t",
            // 	},
            // 	attributes: {
            // 		innerHTML: "chill_point",
            // 	},
            // },
            const footer = Util_HtmlBuilder_5.HtmlBuilder.create_children(ui_outline, {
                footer: {
                    type: "div",
                    style: {
                        gridArea: "f",
                        gridTemplateAreas: `
					"w c s"
				`
                    },
                },
                warning: {
                    type: "div",
                    style: {
                        gridArea: "w",
                    },
                },
                app: {
                    type: "div",
                    style: {
                        gridArea: "a",
                    },
                },
                socials: {
                    type: "div",
                    style: {
                        gridArea: "s",
                    },
                }
            });
        }
        UITests.initialize_client = initialize_client;
    })(UITests || (exports.UITests = UITests = {}));
    // 👇 Client entry point
    UITests.initialize_client();
});
//# sourceMappingURL=Entry.UI.Tests.js.map