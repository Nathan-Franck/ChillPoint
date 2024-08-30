define("Model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    var Model;
    (function (Model) {
        function create(_state) {
            const _listeners = [];
            const _responders = [];
            let _last_state = undefined;
            let _change_microtask = undefined;
            const trigger_microtask = () => {
                // 👀 Trigger all relevant responders/listeners
                if (_change_microtask == null) {
                    _change_microtask = async () => {
                        while (_state != _last_state) {
                            const last_state = _last_state;
                            _last_state = _state;
                            // 🚥 Filter functions to determine which listeners should run
                            const member_changed = (member) => last_state == null || _state[member] != last_state[member];
                            const any_member_changed = (listener) => listener.members == "all-members" ? true :
                                typeof listener.members != "object" ?
                                    member_changed(listener.members) :
                                    listener.members.some(member => member_changed(member));
                            // 👂 Listeners that don't directly affect the state [most of the time]
                            await Promise.all(_listeners.
                                map(async (listener) => {
                                if (!any_member_changed(listener))
                                    return;
                                try {
                                    listener.callback(_state);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }));
                            // 🏃 Responders that directly write back to the state
                            await Promise.all(_responders.
                                map(async (responder) => {
                                if (!any_member_changed(responder))
                                    return;
                                try {
                                    const result = await responder.response(_state);
                                    _state = {
                                        ..._state,
                                        ...result,
                                    };
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }, _state));
                        }
                        _change_microtask = undefined;
                    };
                }
                ;
                queueMicrotask(_change_microtask);
            };
            return {
                listen: (members, callback) => {
                    _listeners.push({ members, callback });
                },
                respond: (members, response) => {
                    _responders.push({ members, response });
                },
                get state() {
                    return _state;
                },
                set state(value) {
                    _state = value;
                    trigger_microtask();
                },
                merge: (partial_state) => {
                    _state = {
                        ..._state,
                        ...partial_state,
                    };
                    trigger_microtask();
                },
                refresh_all: () => {
                    _last_state = undefined;
                    trigger_microtask();
                }
            };
        }
        Model.create = create;
    })(Model || (exports.Model = Model = {}));
});
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
define("Entry.MouseAccuracy", ["require", "exports", "Model", "Util.HtmlBuilder", "Util.Scripting", "Util.ShaderBuilder", "Util.SmoothCurve", "Util.VecMath"], function (require, exports, Model_1, Util_HtmlBuilder_1, Util_Scripting_2, Util_ShaderBuilder_1, Util_SmoothCurve_1, Util_VecMath_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseAccuracy = void 0;
    var MouseAccuracy;
    (function (MouseAccuracy) {
        function generate_platform() {
            const platform = Util_HtmlBuilder_1.HtmlBuilder.create_children(document.body, {
                canvas: {
                    type: "canvas",
                    attributes: {
                        width: 1920,
                        height: 1080,
                    },
                    style: {
                        position: "absolute",
                        imageRendering: "pixelated",
                    },
                }
            });
            const width = 16;
            const height = 9;
            const resize_canvas = () => {
                const { canvas } = platform;
                const t = [window.innerWidth / width, window.innerHeight / height];
                const min_t = Math.min(...t);
                Util_HtmlBuilder_1.HtmlBuilder.assign_to_element(canvas, {
                    style: {
                        width: width * min_t,
                        height: height * min_t,
                        left: (window.innerWidth - width * min_t) * .5,
                        top: (window.innerHeight - height * min_t) * .5,
                        // cursor: "none",
                    },
                    attributes: {
                        width: width * min_t,
                        height: height * min_t,
                    }
                });
            };
            window.onresize = resize_canvas;
            resize_canvas();
            return platform;
        }
        MouseAccuracy.generate_platform = generate_platform;
        async function play_game() {
            const { canvas } = generate_platform();
            const gl = canvas.getContext("webgl2", {
                desynchronized: false,
                preserveDrawingBuffer: true,
                antialias: true,
            });
            const settings = {
                quantum_size: 64,
                target_click_rate: 1.73333,
                target_persistence: 6,
            };
            const constant_binds = {
                vertices: Util_ShaderBuilder_1.ShaderBuilder.create_element_buffer(gl, Uint16Array.from([0, 1, 2, 2, 1, 3])),
                texture_coords: Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, Float32Array.from([
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1,
                ])),
                pattern: await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/fire pattern 2.png"),
                texture: await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/elemental ball 2.png"),
            };
            const cursor_binds = {
                texture: await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/cursor.png"),
            };
            const background_binds = {
                pattern: await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/grid pattern.png"),
            };
            const image_vert_source = `void main(void) {
            gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
            uv = texture_coords;
        }`;
            const constant_globals = {
                vertices: { type: "element" },
                texture_coords: { type: "attribute", unit: "vec2" },
                texture: { type: "uniform", unit: "sampler2D", count: 1 },
                uv: { type: "varying", unit: "vec2" },
                canvas_dimensions: { type: "uniform", unit: "vec2", count: 1 },
            };
            const material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: {
                    ...constant_globals,
                    blend_color: { type: "uniform", unit: "vec4", count: 1 },
                    scroll: { type: "uniform", unit: "float", count: 1 },
                    pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                },
                vert_source: image_vert_source,
                frag_source: `lowp float hue_to_uv() {
                lowp vec3 color = texture2D(texture, uv).rgb;
                lowp float min = min(min(color.r, color.g), color.b);
                lowp float max = max(max(color.r, color.g), color.b);
                lowp float diff = max - min;
                if (diff == 0.0) {
                    return 0.0;
                }
                lowp float hue = 0.0;
                if (max == color.r) {
                    hue = (color.g - color.b) / diff;
                } else if (max == color.g) {
                    hue = 2.0 + (color.b - color.r) / diff;
                } else {
                    hue = 4.0 + (color.r - color.g) / diff;
                }
                hue = hue / 6.0;
                return hue - floor(hue);
            }

            void main(void) {
                lowp float tex_uv = hue_to_uv() + scroll * 4.0;
                lowp float cool = tex_uv - floor(tex_uv);
                lowp vec4 pattern_color = texture2D(pattern, vec2(tex_uv * 1.0, 0.5));
                lowp float alpha = float(pattern_color.a * texture2D(texture, uv).a > .5);
                gl_FragColor = vec4(pattern_color.rgb * blend_color.rgb, alpha * blend_color.a);
            }`,
            });
            const cursor_material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: constant_globals,
                vert_source: image_vert_source,
                frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
            });
            const tail_material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLE_STRIP",
                globals: {
                    canvas_dimensions: { type: "uniform", unit: "vec2", count: 1 },
                    pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                    position: { type: "attribute", unit: "vec2" },
                    distance: { type: "attribute", unit: "float" },
                    uv: { type: "varying", unit: "float" },
                },
                vert_source: `void main(void) {
                    gl_Position = vec4((position / canvas_dimensions * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
                    uv = distance / ${settings.quantum_size / 2}.0;
                }`,
                frag_source: `void main(void) {
                gl_FragColor = texture2D(pattern, vec2(uv, 0.5)) * vec4(0.8, 0.8, 0.8, 1.0);
            }`,
            });
            const tail_binds = {
                canvas_dimensions: [canvas.width, canvas.height],
                pattern: await Util_ShaderBuilder_1.ShaderBuilder.load_texture(gl, "./images/dotted line pattern.png"),
            };
            const background_material = Util_ShaderBuilder_1.ShaderBuilder.generate_material(gl, {
                mode: "TRIANGLES",
                globals: {
                    ...constant_globals,
                    grid_size: { type: "uniform", unit: "float", count: 1 },
                    pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                    color: { type: "uniform", unit: "vec4", count: 1 },
                },
                vert_source: image_vert_source,
                frag_source: `void main(void) {
                lowp vec2 tex_uv = uv * canvas_dimensions / grid_size;
                lowp vec4 pattern_color = texture2D(pattern, tex_uv);
                gl_FragColor = pattern_color * color;
            }`,
            });
            const model = Model_1.Model.create({
                simulation_time: 0,
                mouse_position: [0, 0],
                canvas_dimensions: [canvas.width, canvas.height],
                targets: [],
                tail: [],
                clicks: [],
                hits: 0,
            });
            canvas.addEventListener("resize", () => {
                model.merge({
                    canvas_dimensions: [canvas.width, canvas.height],
                });
            });
            canvas.addEventListener("mousemove", (e) => {
                model.merge({
                    mouse_position: Util_VecMath_1.Vec2.mul([canvas.width, canvas.height], Util_VecMath_1.Vec2.div([e.offsetX, e.offsetY], [canvas.clientWidth, canvas.clientHeight])),
                });
            });
            canvas.addEventListener("mousedown", (e) => {
                const { state } = model;
                const canvas_position = Util_VecMath_1.Vec2.mul(Util_VecMath_1.Vec2.div([e.offsetX, e.offsetY], [canvas.clientWidth, canvas.clientHeight]), [canvas.width, canvas.height]);
                const hit_target = state.targets.find(target => target.despawn == null &&
                    Util_VecMath_1.Vec2.dist(target.position, canvas_position) < target_diameter(state.simulation_time - target.spawn_time, target) * 0.5);
                const clicks = [...state.clicks, {
                        position: canvas_position,
                        time: state.simulation_time,
                    }];
                if (hit_target != null) {
                    // ✅ Clear target clicked
                    model.state = {
                        ...state,
                        clicks,
                        hits: state.hits + 1,
                        targets: state.targets.map(target => target != hit_target ? target :
                            {
                                ...target,
                                despawn: {
                                    time: state.simulation_time,
                                    cause: "hit",
                                }
                            }),
                    };
                }
                else {
                    // 🛑 Punish player for mis-click
                    const punished = state.targets.reduce((closest, target) => {
                        if (target.despawn != null)
                            return closest;
                        const distance = Util_VecMath_1.Vec2.dist(target.position, canvas_position);
                        if (closest == null ||
                            closest.distance > distance)
                            return {
                                target,
                                distance,
                            };
                        return closest;
                    }, undefined);
                    model.state = {
                        ...state,
                        clicks,
                        targets: state.targets.map(target => target != (punished === null || punished === void 0 ? void 0 : punished.target) ? target :
                            {
                                ...target,
                                despawn: {
                                    time: state.simulation_time,
                                    cause: "punish",
                                },
                            }),
                    };
                }
            });
            const readout_style = {
                position: "absolute",
                left: "10px",
                top: "1em",
                zIndex: 10,
                color: "white",
                fontFamily: "monospace",
            };
            const elements = Util_HtmlBuilder_1.HtmlBuilder.create_children(document.body, {
                fps: {
                    type: "div",
                    style: readout_style,
                },
                hits: {
                    type: "div",
                    style: {
                        ...readout_style,
                        top: "2em",
                    },
                },
                clicks: {
                    type: "div",
                    style: {
                        ...readout_style,
                        top: "3em",
                    },
                },
            });
            const get_time = () => Date.now() / 1000;
            setInterval(() => {
                model.merge({
                    simulation_time: get_time(),
                });
            }, 1000 / 30);
            setInterval(() => {
                const { canvas_dimensions, targets } = model.state;
                const quantize = (value, index) => (Math.floor(value * canvas_dimensions[index] / settings.quantum_size) + 0.5) * settings.quantum_size;
                model.merge({
                    targets: [
                        ...targets,
                        {
                            position: [quantize(Math.random(), 0), quantize(Math.random(), 1)],
                            spawn_time: get_time(),
                        },
                    ],
                });
            }, 1000 / settings.target_click_rate);
            const diameter_curve = {
                x_range: [0, settings.target_persistence],
                y_values: [0, 1, 1, 1, .5, .5, 0],
            };
            const despawn_fade_curve = {
                x_range: [0, 2],
                y_values: [1, .2, .1, 0],
            };
            const target_diameter = (time, target) => {
                return settings.quantum_size * Util_SmoothCurve_1.SmoothCurve.sample(diameter_curve, time);
            };
            let frame_times = [];
            const append_mouse_to_tail = (state, min_offset_for_grow) => {
                const last_first = state.tail[0];
                const { mouse_position } = state;
                const distance_offset = last_first == null ? 10000 : Util_VecMath_1.Vec2.dist(mouse_position, last_first.position);
                const max_length = 1000;
                if (distance_offset < min_offset_for_grow) {
                    return { tail: state.tail };
                }
                return {
                    tail: [
                        {
                            position: mouse_position,
                            distance: 0,
                        },
                        ...state.tail.map(particle => ({
                            ...particle,
                            distance: particle.distance + distance_offset,
                        })).filter(particle => particle.distance <= max_length),
                    ],
                };
            };
            model.respond("mouse_position", state => append_mouse_to_tail(state, 16));
            model.listen("all-members", state => {
                const { canvas_dimensions } = state;
                gl.clearColor(.2, .2, .2, 1);
                gl.disable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                // 😁 Grid background
                gl.viewport(0, 0, ...canvas_dimensions);
                Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, background_material, {
                    ...constant_binds,
                    ...background_binds,
                    canvas_dimensions,
                    grid_size: settings.quantum_size,
                    color: [1, 1, 1, .2],
                });
                // 🎯 Targets
                state.targets.map(target => {
                    if (target.despawn != null)
                        return;
                    const scale = target_diameter(state.simulation_time - target.spawn_time, target);
                    gl.viewport(scale * -0.5 + target.position[0], scale * -0.5 + canvas_dimensions[1] - 1 - target.position[1], scale, scale);
                    Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, material, {
                        ...constant_binds,
                        canvas_dimensions,
                        blend_color: [1, 1, 1, 1],
                        scroll: -(state.simulation_time - target.spawn_time) * 1.619 * .2,
                    });
                });
                // ☁ Despawned targets
                state.targets.map(target => {
                    if (target.despawn == null)
                        return;
                    const scale = target_diameter(target.despawn.time - target.spawn_time, target);
                    const time = state.simulation_time - target.despawn.time;
                    gl.viewport(scale * -0.5 + target.position[0], scale * -0.5 + canvas_dimensions[1] - 1 - target.position[1], scale, scale);
                    const color = target.despawn.cause == "punish" ?
                        [1, 0, 0] :
                        [0, 1, 0];
                    Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, material, {
                        ...constant_binds,
                        canvas_dimensions,
                        blend_color: [...color, Util_SmoothCurve_1.SmoothCurve.sample(despawn_fade_curve, time)],
                        scroll: -(state.simulation_time - target.spawn_time) * 1.619 * .2,
                    });
                });
                // 🐒 Tail
                gl.viewport(0, 0, ...canvas_dimensions);
                const { tail } = append_mouse_to_tail(state, 0);
                const pixel_thickness = 0.5;
                const positions = new Float32Array(tail.length * 4);
                positions.set(tail.
                    flatMap(({ position }, index) => {
                    const next_position = index < tail.length - 1 ?
                        tail[index + 1].position :
                        Util_VecMath_1.Vec2.add(position, Util_VecMath_1.Vec2.sub(position, tail[index - 1].position));
                    const diff = Util_VecMath_1.Vec2.sub(next_position, position);
                    const perp = Util_VecMath_1.Vec2.scale(Util_VecMath_1.Vec2.normal([diff[1], -diff[0]]), pixel_thickness);
                    return [
                        ...Util_VecMath_1.Vec2.add(position, perp),
                        ...Util_VecMath_1.Vec2.sub(position, perp)
                    ];
                }));
                const distances = new Float32Array(tail.length * 2);
                distances.set(tail.flatMap(({ distance }) => [distance, distance]));
                Util_ShaderBuilder_1.ShaderBuilder.render_material(gl, tail_material, {
                    ...tail_binds,
                    distance: Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, distances),
                    position: Util_ShaderBuilder_1.ShaderBuilder.create_buffer(gl, positions),
                });
                // // 👆 Rendered pointer - Good For Latency Debug
                // const width = cursor_binds.texture.width;
                // const height = cursor_binds.texture.height;
                // gl.viewport(
                //     state.mouse_position[0],
                //     -height + canvas_dimensions[1] - 1 - state.mouse_position[1],
                //     width,
                //     height);
                // ShaderBuilder.render_material(gl, cursor_material, {
                //     ...constant_binds,
                //     ...cursor_binds,
                //     canvas_dimensions,
                // });
                gl.flush();
                const current_time = get_time();
                frame_times = [
                    ...frame_times.filter(frame_time => frame_time + 1 >= current_time),
                    current_time,
                ];
                const display_state = {
                    ...state,
                    clicks: state.clicks.length,
                    fps: frame_times.length,
                };
                Util_Scripting_2.Scripting.get_keys(elements).forEach(tag => {
                    Util_HtmlBuilder_1.HtmlBuilder.assign_to_element(elements[tag], {
                        attributes: {
                            innerHTML: `${tag}: ${display_state[tag]}`,
                        },
                    });
                });
            });
        }
        MouseAccuracy.play_game = play_game;
    })(MouseAccuracy || (exports.MouseAccuracy = MouseAccuracy = {}));
    MouseAccuracy.play_game();
});
//# sourceMappingURL=Entry.MouseAccuracy.js.map