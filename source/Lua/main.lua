
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file)
    if ____moduleCache[file] then
        return ____moduleCache[file]
    end
    if ____modules[file] then
        ____moduleCache[file] = ____modules[file]()
        return ____moduleCache[file]
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function() function __TS__ArrayConcat(arr1, ...)
    local args = {...}
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if pcall(
            function() return #arg end
        ) and (type(arg) ~= "string") then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayEvery(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if not callbackfn(_G, arr[i + 1], i, arr) then
                return false
            end
            i = i + 1
        end
    end
    return true
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ArrayFind(arr, predicate)
    local len = #arr
    local k = 0
    while k < len do
        local elem = arr[k + 1]
        if predicate(_G, elem, k, arr) then
            return elem
        end
        k = k + 1
    end
    return nil
end

function __TS__ArrayFindIndex(arr, callbackFn)
    do
        local i = 0
        local len = #arr
        while i < len do
            if callbackFn(_G, arr[i + 1], i, arr) then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k, len do
        if self[i + 1] == searchElement then
            return true
        end
    end
    return false
end

function __TS__ArrayIndexOf(arr, searchElement, fromIndex)
    local len = #arr
    if len == 0 then
        return -1
    end
    local n = 0
    if fromIndex then
        n = fromIndex
    end
    if n >= len then
        return -1
    end
    local k
    if n >= 0 then
        k = n
    else
        k = len + n
        if k < 0 then
            k = 0
        end
    end
    do
        local i = k
        while i < len do
            if arr[i + 1] == searchElement then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local result = ""
    for index, value in ipairs(self) do
        if index > 1 then
            result = tostring(result) .. tostring(separator)
        end
        result = tostring(result) .. tostring(
            tostring(value)
        )
    end
    return result
end

function __TS__ArrayMap(arr, callbackfn)
    local newArray = {}
    do
        local i = 0
        while i < #arr do
            newArray[i + 1] = callbackfn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
    return newArray
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayReduce(arr, callbackFn, ...)
    local len = #arr
    local k = 0
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, len - 1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReduceRight(arr, callbackFn, ...)
    local len = #arr
    local k = len - 1
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, 0, -1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReverse(arr)
    local i = 0
    local j = #arr - 1
    while i < j do
        local temp = arr[j + 1]
        arr[j + 1] = arr[i + 1]
        arr[i + 1] = temp
        i = i + 1
        j = j - 1
    end
    return arr
end

function __TS__ArrayShift(arr)
    return table.remove(arr, 1)
end

function __TS__ArrayUnshift(arr, ...)
    local items = {...}
    do
        local i = #items - 1
        while i >= 0 do
            table.insert(arr, 1, items[i + 1])
            i = i - 1
        end
    end
    return #arr
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

function __TS__ArraySlice(list, first, last)
    local len = #list
    local relativeStart = first or 0
    local k
    if relativeStart < 0 then
        k = math.max(len + relativeStart, 0)
    else
        k = math.min(relativeStart, len)
    end
    local relativeEnd = last
    if last == nil then
        relativeEnd = len
    end
    local final
    if relativeEnd < 0 then
        final = math.max(len + relativeEnd, 0)
    else
        final = math.min(relativeEnd, len)
    end
    local out = {}
    local n = 0
    while k < final do
        out[n + 1] = list[k + 1]
        k = k + 1
        n = n + 1
    end
    return out
end

function __TS__ArraySome(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                return true
            end
            i = i + 1
        end
    end
    return false
end

function __TS__ArraySplice(list, ...)
    local len = #list
    local actualArgumentCount = select("#", ...)
    local start = select(1, ...)
    local deleteCount = select(2, ...)
    local actualStart
    if start < 0 then
        actualStart = math.max(len + start, 0)
    else
        actualStart = math.min(start, len)
    end
    local itemCount = math.max(actualArgumentCount - 2, 0)
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - actualStart
    else
        actualDeleteCount = math.min(
            math.max(deleteCount or 0, 0),
            len - actualStart
        )
    end
    local out = {}
    do
        local k = 0
        while k < actualDeleteCount do
            local from = actualStart + k
            if list[from + 1] then
                out[k + 1] = list[from + 1]
            end
            k = k + 1
        end
    end
    if itemCount < actualDeleteCount then
        do
            local k = actualStart
            while k < (len - actualDeleteCount) do
                local from = k + actualDeleteCount
                local to = k + itemCount
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k + 1
            end
        end
        do
            local k = len
            while k > ((len - actualDeleteCount) + itemCount) do
                list[k] = nil
                k = k - 1
            end
        end
    elseif itemCount > actualDeleteCount then
        do
            local k = len - actualDeleteCount
            while k > actualStart do
                local from = (k + actualDeleteCount) - 1
                local to = (k + itemCount) - 1
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k - 1
            end
        end
    end
    local j = actualStart
    for i = 3, actualArgumentCount do
        list[j + 1] = select(i, ...)
        j = j + 1
    end
    do
        local k = #list - 1
        while k >= ((len - actualDeleteCount) + itemCount) do
            list[k + 1] = nil
            k = k - 1
        end
    end
    return out
end

function __TS__ArrayToObject(array)
    local object = {}
    do
        local i = 0
        while i < #array do
            object[i] = array[i + 1]
            i = i + 1
        end
    end
    return object
end

function __TS__ArrayFlat(array, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    for ____, value in ipairs(array) do
        if ((depth > 0) and (type(value) == "table")) and ((value[1] ~= nil) or (next(value, nil) == nil)) then
            result = __TS__ArrayConcat(
                result,
                __TS__ArrayFlat(value, depth - 1)
            )
        else
            result[#result + 1] = value
        end
    end
    return result
end

function __TS__ArrayFlatMap(array, callback)
    local result = {}
    do
        local i = 0
        while i < #array do
            local value = callback(_G, array[i + 1], i, array)
            if (type(value) == "table") and ((value[1] ~= nil) or (next(value, nil) == nil)) then
                result = __TS__ArrayConcat(result, value)
            else
                result[#result + 1] = value
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArraySetLength(arr, length)
    if (((length < 0) or (length ~= length)) or (length == math.huge)) or (math.floor(length) ~= length) then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    do
        local i = #arr - 1
        while i >= length do
            arr[i + 1] = nil
            i = i - 1
        end
    end
    return length
end

function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

function __TS__CloneDescriptor(____bindingPattern0)
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    local configurable
    configurable = ____bindingPattern0.configurable
    local get
    get = ____bindingPattern0.get
    local set
    set = ____bindingPattern0.set
    local writable
    writable = ____bindingPattern0.writable
    local value
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = (get ~= nil) or (set ~= nil)
    local hasValueOrWritableAttribute = (writable ~= nil) or (value ~= nil)
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(_G, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(_G, target, key, descriptor) or descriptor
                    local isSimpleValue = (((desc.configurable == true) and (desc.writable == true)) and (not desc.get)) and (not desc.set)
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(_G, target, key, desc)
                else
                    result = decorator(_G, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(_G, target, key, paramIndex) end
end

function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors")
end

function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. ".",
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    if target[key] ~= nil then
        target[key] = nil
        return true
    end
    return false
end

function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(
                __TS__StringAccess(iterable, index)
            )
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__GetErrorStack(self, constructor)
    local level = 1
    while true do
        local info = debug.getinfo(level, "f")
        level = level + 1
        if not info then
            level = 1
            break
        elseif info.func == constructor then
            break
        end
    end
    return debug.traceback(nil, level)
end
function __TS__WrapErrorToString(self, getDescription)
    return function(self)
        local description = getDescription(self)
        local caller = debug.getinfo(3, "f")
        if (_VERSION == "Lua 5.1") or (caller and (caller.func ~= error)) then
            return description
        else
            return (tostring(description) .. "\n") .. tostring(self.stack)
        end
    end
end
function __TS__InitErrorClass(self, Type, name)
    Type.name = name
    return setmetatable(
        Type,
        {
            __call = function(____, _self, message) return __TS__New(Type, message) end
        }
    )
end
Error = __TS__InitErrorClass(
    _G,
    (function()
        local ____ = __TS__Class()
        ____.name = ""
        function ____.prototype.____constructor(self, message)
            if message == nil then
                message = ""
            end
            self.message = message
            self.name = "Error"
            self.stack = __TS__GetErrorStack(_G, self.constructor.new)
            local metatable = getmetatable(self)
            if not metatable.__errorToStringPatched then
                metatable.__errorToStringPatched = true
                metatable.__tostring = __TS__WrapErrorToString(_G, metatable.__tostring)
            end
        end
        function ____.prototype.__tostring(self)
            return (((self.message ~= "") and (function() return (tostring(self.name) .. ": ") .. tostring(self.message) end)) or (function() return self.name end))()
        end
        return ____
    end)(),
    "Error"
)
for ____, errorName in ipairs({"RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"}) do
    _G[errorName] = __TS__InitErrorClass(
        _G,
        (function()
            local ____ = __TS__Class()
            ____.name = ____.name
            __TS__ClassExtends(____, Error)
            function ____.prototype.____constructor(self, ...)
                Error.prototype.____constructor(self, ...)
                self.name = errorName
            end
            return ____
        end)(),
        errorName
    )
end

__TS__Unpack = table.unpack or unpack

function __TS__FunctionBind(fn, thisArg, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        do
            local i = 0
            while i < #boundArgs do
                table.insert(args, i + 1, boundArgs[i + 1])
                i = i + 1
            end
        end
        return fn(
            thisArg,
            __TS__Unpack(args)
        )
    end
end

____symbolMetatable = {
    __tostring = function(self)
        return ("Symbol(" .. tostring(self.description or "")) .. ")"
    end
}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__GeneratorIterator(self)
    return self
end
function __TS__GeneratorNext(self, ...)
    local co = self.____coroutine
    if coroutine.status(co) == "dead" then
        return {done = true}
    end
    local status, value = coroutine.resume(co, ...)
    if not status then
        error(value, 0)
    end
    return {
        value = value,
        done = coroutine.status(co) == "dead"
    }
end
function __TS__Generator(fn)
    return function(...)
        local args = {...}
        local argsLength = select("#", ...)
        return {
            ____coroutine = coroutine.create(
                function() return fn(
                    (unpack or table.unpack)(args, 1, argsLength)
                ) end
            ),
            [Symbol.iterator] = __TS__GeneratorIterator,
            next = __TS__GeneratorNext
        }
    end
end

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not (not classTbl[Symbol.hasInstance](classTbl, obj))
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return (valueType == "table") or (valueType == "function")
end

function __TS__IteratorGeneratorStep(self)
    local co = self.____coroutine
    local status, value = coroutine.resume(co)
    if not status then
        error(value, 0)
    end
    if coroutine.status(co) == "dead" then
        return
    end
    return true, value
end
function __TS__IteratorIteratorStep(self)
    local result = self:next()
    if result.done then
        return
    end
    return true, result.value
end
function __TS__IteratorStringStep(self, index)
    index = index + 1
    if index > #self then
        return
    end
    return index, string.sub(self, index, index)
end
function __TS__Iterator(iterable)
    if type(iterable) == "string" then
        return __TS__IteratorStringStep, iterable, 0
    elseif iterable.____coroutine ~= nil then
        return __TS__IteratorGeneratorStep, iterable
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return __TS__IteratorIteratorStep, iterator
    else
        return ipairs(iterable)
    end
end

Map = (function()
    local Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return (self.nextKey[key] ~= nil) or (self.lastKey == key)
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
    return Map
end)()

__TS__MathAtan2 = math.atan2 or math.atan

function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return (value and 1) or 0
    else
        return 0 / 0
    end
end

function __TS__NumberIsFinite(value)
    return (((type(value) == "number") and (value == value)) and (value ~= math.huge)) and (value ~= -math.huge)
end

function __TS__NumberIsNaN(value)
    return value ~= value
end

____radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
function __TS__NumberToString(self, radix)
    if ((((radix == nil) or (radix == 10)) or (self == math.huge)) or (self == -math.huge)) or (self ~= self) then
        return tostring(self)
    end
    radix = math.floor(radix)
    if (radix < 2) or (radix > 36) then
        error("toString() radix argument must be between 2 and 36", 0)
    end
    local integer, fraction = math.modf(
        math.abs(self)
    )
    local result = ""
    if radix == 8 then
        result = string.format("%o", integer)
    elseif radix == 16 then
        result = string.format("%x", integer)
    else
        repeat
            do
                result = tostring(
                    __TS__StringAccess(____radixChars, integer % radix)
                ) .. tostring(result)
                integer = math.floor(integer / radix)
            end
        until not (integer ~= 0)
    end
    if fraction ~= 0 then
        result = tostring(result) .. "."
        local delta = 1e-16
        repeat
            do
                fraction = fraction * radix
                delta = delta * radix
                local digit = math.floor(fraction)
                result = tostring(result) .. tostring(
                    __TS__StringAccess(____radixChars, digit)
                )
                fraction = fraction - digit
            end
        until not (fraction >= delta)
    end
    if self < 0 then
        result = "-" .. tostring(result)
    end
    return result
end

function __TS__ObjectAssign(to, ...)
    local sources = {...}
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function ____descriptorIndex(self, key)
    local value = rawget(self, key)
    if value ~= nil then
        return value
    end
    local metatable = getmetatable(self)
    while metatable do
        local rawResult = rawget(metatable, key)
        if rawResult ~= nil then
            return rawResult
        end
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.get then
                    return descriptor.get(self)
                end
                return descriptor.value
            end
        end
        metatable = getmetatable(metatable)
    end
end
function ____descriptorNewindex(self, key, value)
    local metatable = getmetatable(self)
    while metatable do
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.set then
                    descriptor.set(self, value)
                else
                    if descriptor.writable == false then
                        error(
                            ((("Cannot assign to read only property '" .. tostring(key)) .. "' of object '") .. tostring(self)) .. "'",
                            0
                        )
                    end
                    descriptor.value = value
                end
                return
            end
        end
        metatable = getmetatable(metatable)
    end
    rawset(self, key, value)
end
function __TS__SetDescriptor(target, key, desc, isPrototype)
    if isPrototype == nil then
        isPrototype = false
    end
    local metatable = ((isPrototype and (function() return target end)) or (function() return getmetatable(target) end))()
    if not metatable then
        metatable = {}
        setmetatable(target, metatable)
    end
    local value = rawget(target, key)
    if value ~= nil then
        rawset(target, key, nil)
    end
    if not rawget(metatable, "_descriptors") then
        metatable._descriptors = {}
    end
    local descriptor = __TS__CloneDescriptor(desc)
    metatable._descriptors[key] = descriptor
    metatable.__index = ____descriptorIndex
    metatable.__newindex = ____descriptorNewindex
end

function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = (((type(key) == "number") and (function() return key + 1 end)) or (function() return key end))()
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = (desc.get ~= nil) or (desc.set ~= nil)
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        descriptor = {
            set = desc.set,
            get = desc.get,
            configurable = (((desc.configurable ~= nil) and (function() return desc.configurable end)) or (function() return valueExists end))(),
            enumerable = (((desc.enumerable ~= nil) and (function() return desc.enumerable end)) or (function() return valueExists end))(),
            writable = (((desc.writable ~= nil) and (function() return desc.writable end)) or (function() return valueExists end))(),
            value = (((desc.value ~= nil) and (function() return desc.value end)) or (function() return value end))()
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

function __TS__ObjectEntries(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = {key, obj[key]}
    end
    return result
end

function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

function __TS__ObjectKeys(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = key
    end
    return result
end

function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

function __TS__ObjectValues(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = obj[key]
    end
    return result
end

function __TS__ParseFloat(numberString)
    local infinityMatch = string.match(numberString, "^%s*(-?Infinity)")
    if infinityMatch then
        return (((__TS__StringAccess(infinityMatch, 0) == "-") and (function() return -math.huge end)) or (function() return math.huge end))()
    end
    local number = tonumber(
        string.match(numberString, "^%s*(-?%d+%.?%d*)")
    )
    return number or (0 / 0)
end

__TS__parseInt_base_pattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
function __TS__ParseInt(numberString, base)
    if base == nil then
        base = 10
        local hexMatch = string.match(numberString, "^%s*-?0[xX]")
        if hexMatch then
            base = 16
            numberString = ((string.match(hexMatch, "-") and (function() return "-" .. tostring(
                __TS__StringSubstr(numberString, #hexMatch)
            ) end)) or (function() return __TS__StringSubstr(numberString, #hexMatch) end))()
        end
    end
    if (base < 2) or (base > 36) then
        return 0 / 0
    end
    local allowedDigits = (((base <= 10) and (function() return __TS__StringSubstring(__TS__parseInt_base_pattern, 0, base) end)) or (function() return __TS__StringSubstr(__TS__parseInt_base_pattern, 0, 10 + (2 * (base - 10))) end))()
    local pattern = ("^%s*(-?[" .. tostring(allowedDigits)) .. "]*)"
    local number = tonumber(
        string.match(numberString, pattern),
        base
    )
    if number == nil then
        return 0 / 0
    end
    if number >= 0 then
        return math.floor(number)
    else
        return math.ceil(number)
    end
end

Set = (function()
    local Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return (self.nextKey[value] ~= nil) or (self.lastKey == value)
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
    return Set
end)()

WeakMap = (function()
    local WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
    return WeakMap
end)()

WeakSet = (function()
    local WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
    return WeakSet
end)()

function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        _G.__TS__originalTraceback = debug.traceback
        debug.traceback = function(thread, message, level)
            local trace
            if ((thread == nil) and (message == nil)) and (level == nil) then
                trace = _G.__TS__originalTraceback()
            else
                trace = _G.__TS__originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local result = string.gsub(
                trace,
                "(%S+).lua:(%d+)",
                function(file, line)
                    local fileSourceMap = _G.__TS__sourcemap[tostring(file) .. ".lua"]
                    if fileSourceMap and fileSourceMap[line] then
                        return (tostring(file) .. ".ts:") .. tostring(fileSourceMap[line])
                    end
                    return (tostring(file) .. ".lua:") .. tostring(line)
                end
            )
            return result
        end
    end
end

function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        do
            local i = 0
            while i < #iterable do
                arr[#arr + 1] = __TS__StringAccess(iterable, i)
                i = i + 1
            end
        end
    else
        for ____, item in __TS__Iterator(iterable) do
            arr[#arr + 1] = item
        end
    end
    return __TS__Unpack(arr)
end

function __TS__StringAccess(self, index)
    if (index >= 0) and (index < #self) then
        return string.sub(self, index + 1, index + 1)
    end
end

function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or (0 / 0)
end

function __TS__StringConcat(str1, ...)
    local args = {...}
    local out = str1
    for ____, arg in ipairs(args) do
        out = tostring(out) .. tostring(arg)
    end
    return out
end

function __TS__StringEndsWith(self, searchString, endPosition)
    if (endPosition == nil) or (endPosition > #self) then
        endPosition = #self
    end
    return string.sub(self, (endPosition - #searchString) + 1, endPosition) == searchString
end

function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(self) .. tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    )
end

function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    ) .. tostring(self)
end

function __TS__StringReplace(source, searchValue, replaceValue)
    searchValue = string.gsub(searchValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
    if type(replaceValue) == "string" then
        replaceValue = string.gsub(replaceValue, "%%", "%%%%")
        local result = string.gsub(source, searchValue, replaceValue, 1)
        return result
    else
        local result = string.gsub(
            source,
            searchValue,
            function(match) return replaceValue(_G, match) end,
            1
        )
        return result
    end
end

function __TS__StringSlice(self, start, ____end)
    if (start == nil) or (start ~= start) then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if (separator == nil) or (separator == "") then
        while (index < (#source - 1)) and (count < limit) do
            out[count + 1] = __TS__StringAccess(source, index)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = (string.find(source, separator, nil, true) or 0) - 1
        while (nextIndex >= 0) and (count < limit) do
            out[count + 1] = __TS__StringSubstring(source, index, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = (string.find(
                source,
                separator,
                math.max(index + 1, 1),
                true
            ) or 0) - 1
        end
    end
    if count < limit then
        out[count + 1] = __TS__StringSubstring(source, index)
    end
    return out
end

function __TS__StringStartsWith(self, searchString, position)
    if (position == nil) or (position < 0) then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if (length ~= length) or (length <= 0) then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if (____end ~= nil) and (start > ____end) then
        start, ____end = __TS__Unpack({____end, start})
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

____symbolRegistry = {}
function __TS__SymbolRegistryFor(key)
    if not ____symbolRegistry[key] then
        ____symbolRegistry[key] = __TS__Symbol(key)
    end
    return ____symbolRegistry[key]
end
function __TS__SymbolRegistryKeyFor(sym)
    for key in pairs(____symbolRegistry) do
        if ____symbolRegistry[key] == sym then
            return key
        end
    end
end

function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

end,
["Util.Scripting"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.Scripting = {}
local Scripting = ____exports.Scripting
do
    function Scripting.get_keys(obj)
        return __TS__ObjectKeys(obj)
    end
    function Scripting.reduce_keys(obj, accum)
        return __TS__ArrayReduce(
            Scripting.get_keys(obj),
            accum,
            {}
        )
    end
    function Scripting.key_value_to_object(keys, key_to_value)
        return __TS__ArrayReduce(
            __TS__ArrayMap(
                keys,
                function(____, key) return {
                    key,
                    key_to_value(key)
                } end
            ),
            function(____, result, key_value) return __TS__ObjectAssign({}, result, {[key_value[1]] = key_value[2]}) end,
            {}
        )
    end
    function Scripting.transform_object(obj, transform)
        return __TS__ArrayReduce(
            Scripting.get_keys(obj),
            function(____, new_obj, key) return __TS__ObjectAssign(
                {},
                new_obj,
                {
                    [key] = transform(obj[key], key)
                }
            ) end,
            {}
        )
    end
end
return ____exports
end,
["Util.Tuple"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local Exclude = {}
return ____exports
end,
["Util.FFI"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____Util_2EScripting = require("Util.Scripting")
local Scripting = ____Util_2EScripting.Scripting
local FFI
____exports.ffi = require("ffi")
____exports.Refs = {}
local Refs = ____exports.Refs
do
    function Refs.create(blueprint)
        return Scripting.reduce_keys(
            blueprint,
            function(____, result, key) return __TS__ObjectAssign(
                {},
                result,
                {
                    [key] = ____exports.FFI.new_array(blueprint[key], 1)
                }
            ) end
        )
    end
    function Refs.result(pointers)
        return Scripting.reduce_keys(
            pointers,
            function(____, result, key) return __TS__ObjectAssign({}, result, {[key] = pointers[key][0]}) end
        )
    end
end
____exports.FFI = {}
FFI = ____exports.FFI
do
    function FFI.new_array(from, count)
        return ____exports.ffi.new(
            ((tostring(from) .. "[") .. tostring(count)) .. "]"
        )
    end
    local FFIHeaderLookup = {uint = "int", ["char*"] = "const char*", ["const char*"] = "const char*", ["SDL_Surface*"] = "SDL_Surface*", SDL_TimerCallback = "void*", SDL_YUV_CONVERSION_MODE = "void*", SDL_bool = "bool", SDL_TimerID = "int", SDL_DisplayOrientation = "int", SDL_GLContext = "void*", SDL_GLattr = "int", Uint8 = "int", Uint32 = "int", Uint64 = "uint64_t", SDL_HitTest = "int", SDL_RendererFlip = "int", SDL_ScaleMode = "int", SDL_BlendMode = "int", SDL_EventFilter = "void*", SDL_eventaction = "void*", SDL_SystemCursor = "void*"}
    local function void_star_fallback(____type)
        local lookup_result = FFIHeaderLookup[____type]
        if lookup_result ~= nil then
            return lookup_result
        end
        return (__TS__StringEndsWith(____type, "*") and "void*") or ____type
    end
    local function multi_return_interface(header, cdef_header)
        return Scripting.reduce_keys(
            header,
            function(____, multi_interface, function_name)
                do
                    local ____try, ____returned, ____returnValue = pcall(
                        function()
                            local cdef_function = cdef_header[function_name]
                            local head_function = header[function_name]
                            local function resulting_func(args)
                                local params_array = __TS__ArrayReduce(
                                    Scripting.get_keys(args),
                                    function(____, param_tuple, key)
                                        if not (head_function.params[key] ~= nil) then
                                            return param_tuple
                                        end
                                        local index = head_function.params[key].index
                                        param_tuple[index + 1] = args[key]
                                        return param_tuple
                                    end,
                                    {}
                                )
                                local result = cdef_function(
                                    unpack(params_array)
                                )
                                return result
                            end
                            return true, __TS__ObjectAssign({}, multi_interface, {[function_name] = resulting_func})
                        end
                    )
                    if not ____try then
                        ____returned, ____returnValue = (function()
                            return true, multi_interface
                        end)()
                    end
                    if ____returned then
                        return ____returnValue
                    end
                end
            end
        )
    end
    local function generate_cdef_header(header)
        local result = table.concat(
            __TS__ArrayMap(
                __TS__ObjectEntries(header),
                function(____, ____bindingPattern0)
                    local function_name
                    function_name = ____bindingPattern0[1]
                    local func
                    func = ____bindingPattern0[2]
                    return ((((tostring(
                        void_star_fallback(func.output)
                    ) .. " ") .. tostring(function_name)) .. "(") .. tostring(
                        table.concat(
                            __TS__ArrayMap(
                                __TS__ArraySort(
                                    __TS__ObjectEntries(func.params),
                                    function(____, ____bindingPattern0, ____bindingPattern1)
                                        local _1 = ____bindingPattern0[1]
                                        local value_1
                                        value_1 = ____bindingPattern0[2]
                                        local _2 = ____bindingPattern1[1]
                                        local value_2
                                        value_2 = ____bindingPattern1[2]
                                        return value_1.index - value_2.index
                                    end
                                ),
                                function(____, ____bindingPattern0)
                                    local key
                                    key = ____bindingPattern0[1]
                                    local value
                                    value = ____bindingPattern0[2]
                                    return (tostring(
                                        void_star_fallback(value.type)
                                    ) .. " ") .. tostring(key)
                                end
                            ),
                            ", " or ","
                        )
                    )) .. ");"
                end
            ),
            "\n" or ","
        )
        return result
    end
    function FFI.load_library(args)
        local cdef_header = generate_cdef_header(args.header)
        ____exports.ffi.cdef(cdef_header)
        local extern_interface = ____exports.ffi.load(args.file_name)
        return {
            types = extern_interface,
            values = __TS__ObjectAssign(
                {},
                args.values,
                multi_return_interface(args.header, extern_interface)
            ),
            header = args.header
        }
    end
end
return ____exports
end,
["Lib.SDL"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Util_2EFFI = require("Util.FFI")
local FFI = ____Util_2EFFI.FFI
local ffi = ____Util_2EFFI.ffi
ffi.cdef("\n    typedef enum\n    {\n        SDLK_UNKNOWN = 0\n        // TODO: Populate rest as needed\n    } SDL_Keycode;\n\n    typedef enum\n    {\n        SDLCODE_UNKNOWN = 0\n        // TODO: Populate rest as needed\n    } SDL_Scancode;\n\n    typedef enum\n    {\n        SDLMOD_UNKNOWN = 0\n    } SDL_Keymod;\n\n    typedef struct SDL_Rect\n    {\n        int x, y;\n        int w, h;\n    } SDL_Rect;\n\n    typedef struct SDL_Keysym\n    {\n        int scancode;      /**< SDL physical key code - see ::SDL_Scancode for details */\n        int sym;            /**< SDL virtual key code - see ::SDL_Keycode for details */\n        int mod;                 /**< current key modifiers */\n        int unused;\n    } SDL_Keysym;\n\n    typedef struct{\n        int scancode;\n        int sym;\n        int mod;\n        int unicode;\n    } SDL_keysym;\n\n    typedef struct{\n        int type;\n        int state;\n        SDL_keysym keysym;\n    } SDL_KeyboardEvent;\n\n    /**\n     *  \brief Mouse motion event structure (event.motion.*)\n     */\n    typedef struct SDL_MouseMotionEvent\n    {\n        int type;        /**< ::SDL_MOUSEMOTION */\n        int timestamp;   /**< In milliseconds, populated using SDL_GetTicks() */\n        int windowID;    /**< The window with mouse focus, if any */\n        int which;       /**< The mouse instance id, or SDL_TOUCH_MOUSEID */\n        int state;       /**< The current button state */\n        int x;           /**< X coordinate, relative to window */\n        int y;           /**< Y coordinate, relative to window */\n        int xrel;        /**< The relative motion in the X direction */\n        int yrel;        /**< The relative motion in the Y direction */\n    } SDL_MouseMotionEvent;\n\n    /**\n     *  \brief Mouse button event structure (event.button.*)\n     */\n    typedef struct SDL_MouseButtonEvent\n    {\n        int type;        /**< ::SDL_MOUSEBUTTONDOWN or ::SDL_MOUSEBUTTONUP */\n        int timestamp;   /**< In milliseconds, populated using SDL_GetTicks() */\n        int windowID;    /**< The window with mouse focus, if any */\n        int which;       /**< The mouse instance id, or SDL_TOUCH_MOUSEID */\n        int button;       /**< The mouse button index */\n        int state;        /**< ::SDL_PRESSED or ::SDL_RELEASED */\n        int clicks;       /**< 1 for single-click, 2 for double-click, etc. */\n        int padding1;\n        int x;           /**< X coordinate, relative to window */\n        int y;           /**< Y coordinate, relative to window */\n    } SDL_MouseButtonEvent;\n\n    typedef struct SDL_Surface\n    {\n        int flags;               /**< Read-only */\n        void *format;    /**< Read-only */\n        int w, h;                   /**< Read-only */\n        int pitch;                  /**< Read-only */\n        void *pixels;               /**< Read-write */\n    \n        // /** Application data associated with the surface */\n        // void *userdata;             /**< Read-write */\n    \n        // /** information needed for surfaces requiring locks */\n        // int locked;                 /**< Read-only */\n        // void *lock_data;            /**< Read-only */\n    \n        // /** clipping information */\n        // SDL_Rect clip_rect;         /**< Read-only */\n    \n        // /** info for fast blit mapping to other surfaces */\n        // struct SDL_BlitMap *map;    /**< Private */\n    \n        // /** Reference count -- used when freeing surface */\n        // int refcount;               /**< Read-mostly */\n    } SDL_Surface;\n\n    typedef union SDL_Event\n    {\n        int type;                    /**< Event type, shared with all events */\n        // SDL_CommonEvent common;         /**< Common event data */\n        // SDL_DisplayEvent display;       /**< Display event data */\n        // SDL_WindowEvent window;         /**< Window event data */\n        SDL_KeyboardEvent key;          /**< Keyboard event data */\n        // SDL_TextEditingEvent edit;      /**< Text editing event data */\n        // SDL_TextInputEvent text;        /**< Text input event data */\n        SDL_MouseMotionEvent motion;    /**< Mouse motion event data */\n        SDL_MouseButtonEvent button;    /**< Mouse button event data */\n        // SDL_MouseWheelEvent wheel;      /**< Mouse wheel event data */\n        // SDL_JoyAxisEvent jaxis;         /**< Joystick axis event data */\n        // SDL_JoyBallEvent jball;         /**< Joystick ball event data */\n        // SDL_JoyHatEvent jhat;           /**< Joystick hat event data */\n        // SDL_JoyButtonEvent jbutton;     /**< Joystick button event data */\n        // SDL_JoyDeviceEvent jdevice;     /**< Joystick device change event data */\n        // SDL_ControllerAxisEvent caxis;      /**< Game Controller axis event data */\n        // SDL_ControllerButtonEvent cbutton;  /**< Game Controller button event data */\n        // SDL_ControllerDeviceEvent cdevice;  /**< Game Controller device event data */\n        // SDL_AudioDeviceEvent adevice;   /**< Audio device event data */\n        // SDL_SensorEvent sensor;         /**< Sensor event data */\n        // SDL_QuitEvent quit;             /**< Quit request event data */\n        // SDL_UserEvent user;             /**< Custom event data */\n        // SDL_SysWMEvent syswm;           /**< System dependent window event data */\n        // SDL_TouchFingerEvent tfinger;   /**< Touch finger event data */\n        // SDL_MultiGestureEvent mgesture; /**< Gesture event data */\n        // SDL_DollarGestureEvent dgesture; /**< Gesture event data */\n        // SDL_DropEvent drop;             /**< Drag and drop event data */\n\n        /* This is necessary for ABI compatibility between Visual C++ and GCC\n        Visual C++ will respect the push pack pragma and use 52 bytes for\n        this structure, and GCC will use the alignment of the largest datatype\n        within the union, which is 8 bytes.\n\n        So... we'll add padding to force the size to be 56 bytes for both.\n        */\n        int padding[56];\n    } SDL_Event;\n")
local ____ = FFI.load_library(
    {
        file_name = "SDL2",
        header = {SDL_Init = {output = "int", params = {flags = {type = "Uint32", index = 0}}}, SDL_InitSubSystem = {output = "int", params = {flags = {type = "Uint32", index = 0}}}, SDL_QuitSubSystem = {output = "void", params = {flags = {type = "Uint32", index = 0}}}, SDL_WasInit = {output = "Uint32", params = {flags = {type = "Uint32", index = 0}}}, SDL_Quit = {output = "void", params = {}}, SDL_GetTicks = {output = "Uint32", params = {}}, SDL_GetPerformanceCounter = {output = "Uint64", params = {}}, SDL_GetPerformanceFrequency = {output = "Uint64", params = {}}, SDL_Delay = {output = "void", params = {ms = {type = "Uint32", index = 0}}}, SDL_AddTimer = {output = "SDL_TimerID", params = {interval = {type = "Uint32", index = 0}, callback = {type = "SDL_TimerCallback", index = 1}, param = {type = "void*", index = 2}}}, SDL_RemoveTimer = {output = "SDL_bool", params = {id = {type = "SDL_TimerID", index = 0}}}, SDL_GetNumVideoDrivers = {output = "int", params = {}}, SDL_GetVideoDriver = {output = "char*", params = {index = {type = "int", index = 0}}}, SDL_VideoInit = {output = "int", params = {driver_name = {type = "char*", index = 0}}}, SDL_VideoQuit = {output = "void", params = {}}, SDL_GetCurrentVideoDriver = {output = "char*", params = {}}, SDL_GetNumVideoDisplays = {output = "int", params = {}}, SDL_GetDisplayName = {output = "char*", params = {displayIndex = {type = "int", index = 0}}}, SDL_GetDisplayBounds = {output = "int", params = {displayIndex = {type = "int", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_GetDisplayUsableBounds = {output = "int", params = {displayIndex = {type = "int", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_GetDisplayDPI = {output = "int", params = {displayIndex = {type = "int", index = 0}, ddpi = {type = "float*", index = 1}, hdpi = {type = "float*", index = 2}, vdpi = {type = "float*", index = 3}}}, SDL_GetDisplayOrientation = {output = "SDL_DisplayOrientation", params = {displayIndex = {type = "int", index = 0}}}, SDL_GetNumDisplayModes = {output = "int", params = {displayIndex = {type = "int", index = 0}}}, SDL_GetDisplayMode = {output = "int", params = {displayIndex = {type = "int", index = 0}, modeIndex = {type = "int", index = 1}, mode = {type = "SDL_DisplayMode*", index = 2}}}, SDL_GetDesktopDisplayMode = {output = "int", params = {displayIndex = {type = "int", index = 0}, mode = {type = "SDL_DisplayMode*", index = 1}}}, SDL_GetCurrentDisplayMode = {output = "int", params = {displayIndex = {type = "int", index = 0}, mode = {type = "SDL_DisplayMode*", index = 1}}}, SDL_GetClosestDisplayMode = {output = "SDL_DisplayMode*", params = {displayIndex = {type = "int", index = 0}, mode = {type = "SDL_DisplayMode*", index = 1}, closest = {type = "SDL_DisplayMode*", index = 2}}}, SDL_GetWindowDisplayIndex = {output = "int", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowDisplayMode = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, mode = {type = "SDL_DisplayMode*", index = 1}}}, SDL_GetWindowDisplayMode = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, mode = {type = "SDL_DisplayMode*", index = 1}}}, SDL_GetWindowPixelFormat = {output = "Uint32", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_CreateWindow = {output = "SDL_Window*", params = {title = {type = "char*", index = 0}, x = {type = "int", index = 1}, y = {type = "int", index = 2}, w = {type = "int", index = 3}, h = {type = "int", index = 4}, flags = {type = "Uint32", index = 5}}}, SDL_CreateWindowFrom = {output = "SDL_Window*", params = {data = {type = "void*", index = 0}}}, SDL_GetWindowID = {output = "Uint32", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_GetWindowFromID = {output = "SDL_Window*", params = {id = {type = "Uint32", index = 0}}}, SDL_GetWindowFlags = {output = "Uint32", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowTitle = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, title = {type = "char*", index = 1}}}, SDL_GetWindowTitle = {output = "char*", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowIcon = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, icon = {type = "SDL_Surface*", index = 1}}}, SDL_SetWindowData = {output = "void*", params = {window = {type = "SDL_Window*", index = 0}, name = {type = "char*", index = 1}, userdata = {type = "void*", index = 2}}}, SDL_GetWindowData = {output = "void*", params = {window = {type = "SDL_Window*", index = 0}, name = {type = "char*", index = 1}}}, SDL_SetWindowPosition = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, x = {type = "int", index = 1}, y = {type = "int", index = 2}}}, SDL_GetWindowPosition = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, x = {type = "int*", index = 1}, y = {type = "int*", index = 2}}}, SDL_SetWindowSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, w = {type = "int", index = 1}, h = {type = "int", index = 2}}}, SDL_GetWindowSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_GetWindowBordersSize = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, top = {type = "int*", index = 1}, left = {type = "int*", index = 2}, bottom = {type = "int*", index = 3}, right = {type = "int*", index = 4}}}, SDL_SetWindowMinimumSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, min_w = {type = "int", index = 1}, min_h = {type = "int", index = 2}}}, SDL_GetWindowMinimumSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_SetWindowMaximumSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, max_w = {type = "int", index = 1}, max_h = {type = "int", index = 2}}}, SDL_GetWindowMaximumSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_SetWindowBordered = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, bordered = {type = "SDL_bool", index = 1}}}, SDL_SetWindowResizable = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, resizable = {type = "SDL_bool", index = 1}}}, SDL_ShowWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_HideWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_RaiseWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_MaximizeWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_MinimizeWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_RestoreWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowFullscreen = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, flags = {type = "Uint32", index = 1}}}, SDL_GetWindowSurface = {output = "SDL_Surface*", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_UpdateWindowSurface = {output = "int", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_UpdateWindowSurfaceRects = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, rects = {type = "SDL_Rect*", index = 1}, numrects = {type = "int", index = 2}}}, SDL_SetWindowGrab = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, grabbed = {type = "SDL_bool", index = 1}}}, SDL_GetWindowGrab = {output = "SDL_bool", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_GetGrabbedWindow = {output = "SDL_Window*", params = {}}, SDL_SetWindowBrightness = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, brightness = {type = "float", index = 1}}}, SDL_GetWindowBrightness = {output = "float", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowOpacity = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, opacity = {type = "float", index = 1}}}, SDL_GetWindowOpacity = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, out_opacity = {type = "float*", index = 1}}}, SDL_SetWindowModalFor = {output = "int", params = {modal_window = {type = "SDL_Window*", index = 0}, parent_window = {type = "SDL_Window*", index = 1}}}, SDL_SetWindowInputFocus = {output = "int", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_SetWindowGammaRamp = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, red = {type = "Uint16*", index = 1}, green = {type = "Uint16*", index = 2}, blue = {type = "Uint16*", index = 3}}}, SDL_GetWindowGammaRamp = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, red = {type = "Uint16*", index = 1}, green = {type = "Uint16*", index = 2}, blue = {type = "Uint16*", index = 3}}}, SDL_SetWindowHitTest = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, callback = {type = "SDL_HitTest", index = 1}, callback_data = {type = "void*", index = 2}}}, SDL_DestroyWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_IsScreenSaverEnabled = {output = "SDL_bool", params = {}}, SDL_EnableScreenSaver = {output = "void", params = {}}, SDL_DisableScreenSaver = {output = "void", params = {}}, SDL_GL_LoadLibrary = {output = "int", params = {path = {type = "char*", index = 0}}}, SDL_GL_GetProcAddress = {output = "void*", params = {proc = {type = "char*", index = 0}}}, SDL_GL_UnloadLibrary = {output = "void", params = {}}, SDL_GL_ExtensionSupported = {output = "SDL_bool", params = {extension = {type = "char*", index = 0}}}, SDL_GL_ResetAttributes = {output = "void", params = {}}, SDL_GL_SetAttribute = {output = "int", params = {attr = {type = "SDL_GLattr", index = 0}, value = {type = "int", index = 1}}}, SDL_GL_GetAttribute = {output = "int", params = {attr = {type = "SDL_GLattr", index = 0}, value = {type = "int*", index = 1}}}, SDL_GL_CreateContext = {output = "SDL_GLContext", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_GL_MakeCurrent = {output = "int", params = {window = {type = "SDL_Window*", index = 0}, context = {type = "SDL_GLContext", index = 1}}}, SDL_GL_GetCurrentWindow = {output = "SDL_Window*", params = {}}, SDL_GL_GetCurrentContext = {output = "SDL_GLContext", params = {}}, SDL_GL_GetDrawableSize = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_GL_SetSwapInterval = {output = "int", params = {interval = {type = "int", index = 0}}}, SDL_GL_GetSwapInterval = {output = "int", params = {}}, SDL_GL_SwapWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_GL_DeleteContext = {output = "void", params = {context = {type = "SDL_GLContext", index = 0}}}, SDL_GetNumRenderDrivers = {output = "int", params = {}}, SDL_GetRenderDriverInfo = {output = "int", params = {index = {type = "int", index = 0}, info = {type = "SDL_RendererInfo*", index = 1}}}, SDL_CreateWindowAndRenderer = {output = "int", params = {width = {type = "int", index = 0}, height = {type = "int", index = 1}, window_flags = {type = "Uint32", index = 2}, window = {type = "SDL_Window**", index = 3}, renderer = {type = "SDL_Renderer**", index = 4}}}, SDL_CreateRenderer = {output = "SDL_Renderer*", params = {window = {type = "SDL_Window*", index = 0}, index = {type = "int", index = 1}, flags = {type = "Uint32", index = 2}}}, SDL_CreateSoftwareRenderer = {output = "SDL_Renderer*", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_GetRenderer = {output = "SDL_Renderer*", params = {window = {type = "SDL_Window*", index = 0}}}, SDL_GetRendererInfo = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, info = {type = "SDL_RendererInfo*", index = 1}}}, SDL_GetRendererOutputSize = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_CreateTexture = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}, format = {type = "Uint32", index = 1}, access = {type = "int", index = 2}, w = {type = "int", index = 3}, h = {type = "int", index = 4}}}, SDL_CreateTextureFromSurface = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}, surface = {type = "SDL_Surface*", index = 1}}}, SDL_QueryTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, format = {type = "Uint32*", index = 1}, access = {type = "int*", index = 2}, w = {type = "int*", index = 3}, h = {type = "int*", index = 4}}}, SDL_SetTextureColorMod = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, r = {type = "Uint8", index = 1}, g = {type = "Uint8", index = 2}, b = {type = "Uint8", index = 3}}}, SDL_GetTextureColorMod = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, r = {type = "Uint8*", index = 1}, g = {type = "Uint8*", index = 2}, b = {type = "Uint8*", index = 3}}}, SDL_SetTextureAlphaMod = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, alpha = {type = "Uint8", index = 1}}}, SDL_GetTextureAlphaMod = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, alpha = {type = "Uint8*", index = 1}}}, SDL_SetTextureBlendMode = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, blendMode = {type = "SDL_BlendMode", index = 1}}}, SDL_GetTextureBlendMode = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, blendMode = {type = "SDL_BlendMode*", index = 1}}}, SDL_SetTextureScaleMode = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, scaleMode = {type = "SDL_ScaleMode", index = 1}}}, SDL_GetTextureScaleMode = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, scaleMode = {type = "SDL_ScaleMode*", index = 1}}}, SDL_UpdateTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, pixels = {type = "void*", index = 2}, pitch = {type = "int", index = 3}}}, SDL_UpdateYUVTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, Yplane = {type = "Uint8*", index = 2}, Ypitch = {type = "int", index = 3}, Uplane = {type = "Uint8*", index = 4}, Upitch = {type = "int", index = 5}, Vplane = {type = "Uint8*", index = 6}, Vpitch = {type = "int", index = 7}}}, SDL_LockTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, pixels = {type = "void**", index = 2}, pitch = {type = "int*", index = 3}}}, SDL_LockTextureToSurface = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, surface = {type = "SDL_Surface**", index = 2}}}, SDL_UnlockTexture = {output = "void", params = {texture = {type = "SDL_Texture*", index = 0}}}, SDL_RenderTargetSupported = {output = "SDL_bool", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_SetRenderTarget = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, texture = {type = "SDL_Texture*", index = 1}}}, SDL_GetRenderTarget = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderSetLogicalSize = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, w = {type = "int", index = 1}, h = {type = "int", index = 2}}}, SDL_RenderGetLogicalSize = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}, w = {type = "int*", index = 1}, h = {type = "int*", index = 2}}}, SDL_RenderSetIntegerScale = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, enable = {type = "SDL_bool", index = 1}}}, SDL_RenderGetIntegerScale = {output = "SDL_bool", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderSetViewport = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderGetViewport = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderSetClipRect = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderGetClipRect = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderIsClipEnabled = {output = "SDL_bool", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderSetScale = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, scaleX = {type = "float", index = 1}, scaleY = {type = "float", index = 2}}}, SDL_RenderGetScale = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}, scaleX = {type = "float*", index = 1}, scaleY = {type = "float*", index = 2}}}, SDL_SetRenderDrawColor = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, r = {type = "Uint8", index = 1}, g = {type = "Uint8", index = 2}, b = {type = "Uint8", index = 3}, a = {type = "Uint8", index = 4}}}, SDL_GetRenderDrawColor = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, r = {type = "Uint8*", index = 1}, g = {type = "Uint8*", index = 2}, b = {type = "Uint8*", index = 3}, a = {type = "Uint8*", index = 4}}}, SDL_SetRenderDrawBlendMode = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, blendMode = {type = "SDL_BlendMode", index = 1}}}, SDL_GetRenderDrawBlendMode = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, blendMode = {type = "SDL_BlendMode*", index = 1}}}, SDL_RenderClear = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderDrawPoint = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, x = {type = "int", index = 1}, y = {type = "int", index = 2}}}, SDL_RenderDrawPoints = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, points = {type = "SDL_Point*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderDrawLine = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, x1 = {type = "int", index = 1}, y1 = {type = "int", index = 2}, x2 = {type = "int", index = 3}, y2 = {type = "int", index = 4}}}, SDL_RenderDrawLines = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, points = {type = "SDL_Point*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderDrawRect = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderDrawRects = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rects = {type = "SDL_Rect*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderFillRect = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_RenderFillRects = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rects = {type = "SDL_Rect*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderCopy = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, texture = {type = "SDL_Texture*", index = 1}, srcrect = {type = "SDL_Rect*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_RenderCopyEx = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, texture = {type = "SDL_Texture*", index = 1}, srcrect = {type = "SDL_Rect*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}, angle = {type = "double", index = 4}, center = {type = "SDL_Point*", index = 5}, flip = {type = "SDL_RendererFlip", index = 6}}}, SDL_RenderDrawPointF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, x = {type = "float", index = 1}, y = {type = "float", index = 2}}}, SDL_RenderDrawPointsF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, points = {type = "SDL_FPoint*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderDrawLineF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, x1 = {type = "float", index = 1}, y1 = {type = "float", index = 2}, x2 = {type = "float", index = 3}, y2 = {type = "float", index = 4}}}, SDL_RenderDrawLinesF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, points = {type = "SDL_FPoint*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderDrawRectF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_FRect*", index = 1}}}, SDL_RenderDrawRectsF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rects = {type = "SDL_FRect*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderFillRectF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_FRect*", index = 1}}}, SDL_RenderFillRectsF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rects = {type = "SDL_FRect*", index = 1}, count = {type = "int", index = 2}}}, SDL_RenderCopyF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, texture = {type = "SDL_Texture*", index = 1}, srcrect = {type = "SDL_Rect*", index = 2}, dstrect = {type = "SDL_FRect*", index = 3}}}, SDL_RenderCopyExF = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, texture = {type = "SDL_Texture*", index = 1}, srcrect = {type = "SDL_Rect*", index = 2}, dstrect = {type = "SDL_FRect*", index = 3}, angle = {type = "double", index = 4}, center = {type = "SDL_FPoint*", index = 5}, flip = {type = "SDL_RendererFlip", index = 6}}}, SDL_RenderReadPixels = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, format = {type = "Uint32", index = 2}, pixels = {type = "void*", index = 3}, pitch = {type = "int", index = 4}}}, SDL_RenderPresent = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_DestroyTexture = {output = "void", params = {texture = {type = "SDL_Texture*", index = 0}}}, SDL_DestroyRenderer = {output = "void", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderFlush = {output = "int", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_GL_BindTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}, texw = {type = "float*", index = 1}, texh = {type = "float*", index = 2}}}, SDL_GL_UnbindTexture = {output = "int", params = {texture = {type = "SDL_Texture*", index = 0}}}, SDL_RenderGetMetalLayer = {output = "void*", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_RenderGetMetalCommandEncoder = {output = "void*", params = {renderer = {type = "SDL_Renderer*", index = 0}}}, SDL_GetBasePath = {output = "char*", params = {}}, SDL_GetPrefPath = {output = "char*", params = {org = {type = "char*", index = 0}, app = {type = "char*", index = 1}}}, SDL_CreateRGBSurface = {output = "SDL_Surface*", params = {flags = {type = "Uint32", index = 0}, width = {type = "int", index = 1}, height = {type = "int", index = 2}, depth = {type = "int", index = 3}, Rmask = {type = "Uint32", index = 4}, Gmask = {type = "Uint32", index = 5}, Bmask = {type = "Uint32", index = 6}, Amask = {type = "Uint32", index = 7}}}, SDL_CreateRGBSurfaceWithFormat = {output = "SDL_Surface*", params = {flags = {type = "Uint32", index = 0}, width = {type = "int", index = 1}, height = {type = "int", index = 2}, depth = {type = "int", index = 3}, format = {type = "Uint32", index = 4}}}, SDL_CreateRGBSurfaceFrom = {output = "SDL_Surface*", params = {pixels = {type = "void*", index = 0}, width = {type = "int", index = 1}, height = {type = "int", index = 2}, depth = {type = "int", index = 3}, pitch = {type = "int", index = 4}, Rmask = {type = "Uint32", index = 5}, Gmask = {type = "Uint32", index = 6}, Bmask = {type = "Uint32", index = 7}, Amask = {type = "Uint32", index = 8}}}, SDL_CreateRGBSurfaceWithFormatFrom = {output = "SDL_Surface*", params = {pixels = {type = "void*", index = 0}, width = {type = "int", index = 1}, height = {type = "int", index = 2}, depth = {type = "int", index = 3}, pitch = {type = "int", index = 4}, format = {type = "Uint32", index = 5}}}, SDL_FreeSurface = {output = "void", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_SetSurfacePalette = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, palette = {type = "SDL_Palette*", index = 1}}}, SDL_LockSurface = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_UnlockSurface = {output = "void", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_LoadBMP_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}, freesrc = {type = "int", index = 1}}}, SDL_SaveBMP_RW = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, dst = {type = "SDL_RWops*", index = 1}, freedst = {type = "int", index = 2}}}, SDL_SetSurfaceRLE = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, flag = {type = "int", index = 1}}}, SDL_SetColorKey = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, flag = {type = "int", index = 1}, key = {type = "Uint32", index = 2}}}, SDL_HasColorKey = {output = "SDL_bool", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_GetColorKey = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, key = {type = "Uint32*", index = 1}}}, SDL_SetSurfaceColorMod = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, r = {type = "Uint8", index = 1}, g = {type = "Uint8", index = 2}, b = {type = "Uint8", index = 3}}}, SDL_GetSurfaceColorMod = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, r = {type = "Uint8*", index = 1}, g = {type = "Uint8*", index = 2}, b = {type = "Uint8*", index = 3}}}, SDL_SetSurfaceAlphaMod = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, alpha = {type = "Uint8", index = 1}}}, SDL_GetSurfaceAlphaMod = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, alpha = {type = "Uint8*", index = 1}}}, SDL_SetSurfaceBlendMode = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, blendMode = {type = "SDL_BlendMode", index = 1}}}, SDL_GetSurfaceBlendMode = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, blendMode = {type = "SDL_BlendMode*", index = 1}}}, SDL_SetClipRect = {output = "SDL_bool", params = {surface = {type = "SDL_Surface*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_GetClipRect = {output = "void", params = {surface = {type = "SDL_Surface*", index = 0}, rect = {type = "SDL_Rect*", index = 1}}}, SDL_DuplicateSurface = {output = "SDL_Surface*", params = {surface = {type = "SDL_Surface*", index = 0}}}, SDL_ConvertSurface = {output = "SDL_Surface*", params = {src = {type = "SDL_Surface*", index = 0}, fmt = {type = "SDL_PixelFormat*", index = 1}, flags = {type = "Uint32", index = 2}}}, SDL_ConvertSurfaceFormat = {output = "SDL_Surface*", params = {src = {type = "SDL_Surface*", index = 0}, pixel_format = {type = "Uint32", index = 1}, flags = {type = "Uint32", index = 2}}}, SDL_ConvertPixels = {output = "int", params = {width = {type = "int", index = 0}, height = {type = "int", index = 1}, src_format = {type = "Uint32", index = 2}, src = {type = "void*", index = 3}, src_pitch = {type = "int", index = 4}, dst_format = {type = "Uint32", index = 5}, dst = {type = "void*", index = 6}, dst_pitch = {type = "int", index = 7}}}, SDL_FillRect = {output = "int", params = {dst = {type = "SDL_Surface*", index = 0}, rect = {type = "SDL_Rect*", index = 1}, color = {type = "Uint32", index = 2}}}, SDL_FillRects = {output = "int", params = {dst = {type = "SDL_Surface*", index = 0}, rects = {type = "SDL_Rect*", index = 1}, count = {type = "int", index = 2}, color = {type = "Uint32", index = 3}}}, SDL_UpperBlit = {output = "int", params = {src = {type = "SDL_Surface*", index = 0}, srcrect = {type = "SDL_Rect*", index = 1}, dst = {type = "SDL_Surface*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_LowerBlit = {output = "int", params = {src = {type = "SDL_Surface*", index = 0}, srcrect = {type = "SDL_Rect*", index = 1}, dst = {type = "SDL_Surface*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_SoftStretch = {output = "int", params = {src = {type = "SDL_Surface*", index = 0}, srcrect = {type = "SDL_Rect*", index = 1}, dst = {type = "SDL_Surface*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_UpperBlitScaled = {output = "int", params = {src = {type = "SDL_Surface*", index = 0}, srcrect = {type = "SDL_Rect*", index = 1}, dst = {type = "SDL_Surface*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_LowerBlitScaled = {output = "int", params = {src = {type = "SDL_Surface*", index = 0}, srcrect = {type = "SDL_Rect*", index = 1}, dst = {type = "SDL_Surface*", index = 2}, dstrect = {type = "SDL_Rect*", index = 3}}}, SDL_SetYUVConversionMode = {output = "void", params = {mode = {type = "SDL_YUV_CONVERSION_MODE", index = 0}}}, SDL_GetYUVConversionMode = {output = "SDL_YUV_CONVERSION_MODE", params = {}}, SDL_GetYUVConversionModeForResolution = {output = "SDL_YUV_CONVERSION_MODE", params = {width = {type = "int", index = 0}, height = {type = "int", index = 1}}}, SDL_PumpEvents = {output = "void", params = {}}, SDL_PeepEvents = {output = "int", params = {events = {type = "SDL_Event*", index = 0}, numevents = {type = "int", index = 1}, action = {type = "SDL_eventaction", index = 2}, minType = {type = "Uint32", index = 3}, maxType = {type = "Uint32", index = 4}}}, SDL_HasEvent = {output = "SDL_bool", params = {type = {type = "Uint32", index = 0}}}, SDL_HasEvents = {output = "SDL_bool", params = {minType = {type = "Uint32", index = 0}, maxType = {type = "Uint32", index = 1}}}, SDL_FlushEvent = {output = "void", params = {type = {type = "Uint32", index = 0}}}, SDL_FlushEvents = {output = "void", params = {minType = {type = "Uint32", index = 0}, maxType = {type = "Uint32", index = 1}}}, SDL_PollEvent = {output = "int", params = {event = {type = "SDL_Event*", index = 0}}}, SDL_WaitEvent = {output = "int", params = {event = {type = "SDL_Event*", index = 0}}}, SDL_WaitEventTimeout = {output = "int", params = {event = {type = "SDL_Event*", index = 0}, timeout = {type = "int", index = 1}}}, SDL_PushEvent = {output = "int", params = {event = {type = "SDL_Event*", index = 0}}}, SDL_SetEventFilter = {output = "void", params = {filter = {type = "SDL_EventFilter", index = 0}, userdata = {type = "void*", index = 1}}}, SDL_GetEventFilter = {output = "SDL_bool", params = {filter = {type = "SDL_EventFilter*", index = 0}, userdata = {type = "void**", index = 1}}}, SDL_AddEventWatch = {output = "void", params = {filter = {type = "SDL_EventFilter", index = 0}, userdata = {type = "void*", index = 1}}}, SDL_DelEventWatch = {output = "void", params = {filter = {type = "SDL_EventFilter", index = 0}, userdata = {type = "void*", index = 1}}}, SDL_FilterEvents = {output = "void", params = {filter = {type = "SDL_EventFilter", index = 0}, userdata = {type = "void*", index = 1}}}, SDL_EventState = {output = "Uint8", params = {type = {type = "Uint32", index = 0}, state = {type = "int", index = 1}}}, SDL_RegisterEvents = {output = "Uint32", params = {numevents = {type = "int", index = 0}}}, SDL_GetMouseFocus = {output = "SDL_Window*", params = {}}, SDL_GetMouseState = {output = "Uint32", params = {x = {type = "int*", index = 0}, y = {type = "int*", index = 1}}}, SDL_GetGlobalMouseState = {output = "Uint32", params = {x = {type = "int*", index = 0}, y = {type = "int*", index = 1}}}, SDL_GetRelativeMouseState = {output = "Uint32", params = {x = {type = "int*", index = 0}, y = {type = "int*", index = 1}}}, SDL_WarpMouseInWindow = {output = "void", params = {window = {type = "SDL_Window*", index = 0}, x = {type = "int", index = 1}, y = {type = "int", index = 2}}}, SDL_WarpMouseGlobal = {output = "int", params = {x = {type = "int", index = 0}, y = {type = "int", index = 1}}}, SDL_SetRelativeMouseMode = {output = "int", params = {enabled = {type = "SDL_bool", index = 0}}}, SDL_CaptureMouse = {output = "int", params = {enabled = {type = "SDL_bool", index = 0}}}, SDL_GetRelativeMouseMode = {output = "SDL_bool", params = {}}, SDL_CreateCursor = {output = "SDL_Cursor*", params = {data = {type = "Uint8*", index = 0}, mask = {type = "Uint8*", index = 1}, w = {type = "int", index = 2}, h = {type = "int", index = 3}, hot_x = {type = "int", index = 4}, hot_y = {type = "int", index = 5}}}, SDL_CreateColorCursor = {output = "SDL_Cursor*", params = {surface = {type = "SDL_Surface*", index = 0}, hot_x = {type = "int", index = 1}, hot_y = {type = "int", index = 2}}}, SDL_CreateSystemCursor = {output = "SDL_Cursor*", params = {id = {type = "SDL_SystemCursor", index = 0}}}, SDL_SetCursor = {output = "void", params = {cursor = {type = "SDL_Cursor*", index = 0}}}, SDL_GetCursor = {output = "SDL_Cursor*", params = {}}, SDL_GetDefaultCursor = {output = "SDL_Cursor*", params = {}}, SDL_FreeCursor = {output = "void", params = {cursor = {type = "SDL_Cursor*", index = 0}}}, SDL_ShowCursor = {output = "int", params = {toggle = {type = "int", index = 0}}}, SDL_GetPixelFormatName = {output = "char*", params = {format = {type = "Uint32", index = 0}}}, SDL_PixelFormatEnumToMasks = {output = "SDL_bool", params = {format = {type = "Uint32", index = 0}, bpp = {type = "int*", index = 1}, Rmask = {type = "Uint32*", index = 2}, Gmask = {type = "Uint32*", index = 3}, Bmask = {type = "Uint32*", index = 4}, Amask = {type = "Uint32*", index = 5}}}, SDL_MasksToPixelFormatEnum = {output = "Uint32", params = {bpp = {type = "int", index = 0}, Rmask = {type = "Uint32", index = 1}, Gmask = {type = "Uint32", index = 2}, Bmask = {type = "Uint32", index = 3}, Amask = {type = "Uint32", index = 4}}}, SDL_AllocFormat = {output = "SDL_PixelFormat*", params = {pixel_format = {type = "Uint32", index = 0}}}, SDL_FreeFormat = {output = "void", params = {format = {type = "SDL_PixelFormat*", index = 0}}}, SDL_AllocPalette = {output = "SDL_Palette*", params = {ncolors = {type = "int", index = 0}}}, SDL_SetPixelFormatPalette = {output = "int", params = {format = {type = "SDL_PixelFormat*", index = 0}, palette = {type = "SDL_Palette*", index = 1}}}, SDL_SetPaletteColors = {output = "int", params = {palette = {type = "SDL_Palette*", index = 0}, colors = {type = "SDL_Color*", index = 1}, firstcolor = {type = "int", index = 2}, ncolors = {type = "int", index = 3}}}, SDL_FreePalette = {output = "void", params = {palette = {type = "SDL_Palette*", index = 0}}}, SDL_MapRGB = {output = "Uint32", params = {format = {type = "SDL_PixelFormat*", index = 0}, r = {type = "Uint8", index = 1}, g = {type = "Uint8", index = 2}, b = {type = "Uint8", index = 3}}}, SDL_MapRGBA = {output = "Uint32", params = {format = {type = "SDL_PixelFormat*", index = 0}, r = {type = "Uint8", index = 1}, g = {type = "Uint8", index = 2}, b = {type = "Uint8", index = 3}, a = {type = "Uint8", index = 4}}}, SDL_GetRGB = {output = "void", params = {pixel = {type = "Uint32", index = 0}, format = {type = "SDL_PixelFormat*", index = 1}, r = {type = "Uint8*", index = 2}, g = {type = "Uint8*", index = 3}, b = {type = "Uint8*", index = 4}}}, SDL_GetRGBA = {output = "void", params = {pixel = {type = "Uint32", index = 0}, format = {type = "SDL_PixelFormat*", index = 1}, r = {type = "Uint8*", index = 2}, g = {type = "Uint8*", index = 3}, b = {type = "Uint8*", index = 4}, a = {type = "Uint8*", index = 5}}}, SDL_CalculateGammaRamp = {output = "void", params = {gamma = {type = "float", index = 0}, ramp = {type = "Uint16*", index = 1}}}, SDL_GetKeyboardFocus = {output = "SDL_Window*", params = {}}, SDL_GetKeyboardState = {output = "Uint8*", params = {numkeys = {type = "int*", index = 0}}}, SDL_GetModState = {output = "SDL_Keymod", params = {}}, SDL_SetModState = {output = "void", params = {modstate = {type = "SDL_Keymod", index = 0}}}, SDL_GetKeyFromScancode = {output = "SDL_Keycode", params = {scancode = {type = "SDL_Scancode", index = 0}}}, SDL_GetScancodeFromKey = {output = "SDL_Scancode", params = {key = {type = "SDL_Keycode", index = 0}}}, SDL_GetScancodeName = {output = "char*", params = {scancode = {type = "SDL_Scancode", index = 0}}}, SDL_GetScancodeFromName = {output = "SDL_Scancode", params = {name = {type = "char*", index = 0}}}, SDL_GetKeyName = {output = "char*", params = {key = {type = "SDL_Keycode", index = 0}}}, SDL_GetKeyFromName = {output = "SDL_Keycode", params = {name = {type = "char*", index = 0}}}, SDL_StartTextInput = {output = "void", params = {}}, SDL_IsTextInputActive = {output = "SDL_bool", params = {}}, SDL_StopTextInput = {output = "void", params = {}}, SDL_SetTextInputRect = {output = "void", params = {rect = {type = "SDL_Rect*", index = 0}}}, SDL_HasScreenKeyboardSupport = {output = "SDL_bool", params = {}}, SDL_IsScreenKeyboardShown = {output = "SDL_bool", params = {window = {type = "SDL_Window*", index = 0}}}},
        values = {
            SDL_WINDOW_FULLSCREEN = 1,
            SDL_WINDOW_OPENGL = 2,
            SDL_WINDOW_SHOWN = 4,
            SDL_WINDOW_HIDDEN = 8,
            SDL_WINDOW_BORDERLESS = 16,
            SDL_WINDOW_RESIZABLE = 32,
            SDL_WINDOW_MINIMIZED = 64,
            SDL_WINDOW_MAXIMIZED = 128,
            SDL_WINDOW_INPUT_GRABBED = 256,
            SDL_WINDOW_INPUT_FOCUS = 512,
            SDL_WINDOW_MOUSE_FOCUS = 1024,
            SDL_WINDOW_FULLSCREEN_DESKTOP = bit.bor(1, 4096),
            SDL_WINDOW_FOREIGN = 2048,
            SDL_WINDOW_MOUSE_CAPTURE = 16384,
            SDL_WINDOW_ALWAYS_ON_TOP = 32768,
            SDL_WINDOW_SKIP_TASKBAR = 65536,
            SDL_WINDOW_UTILITY = 131072,
            SDL_WINDOW_TOOLTIP = 262144,
            SDL_WINDOW_POPUP_MENU = 524288,
            SDL_WINDOW_VULKAN = 268435456,
            SDL_INIT_VIDEO = 32,
            SDL_WINDOWPOS_UNDEFINED = 536805376,
            SDL_RENDERER_SOFTWARE = 1,
            SDL_RENDERER_ACCELERATED = 2,
            SDL_RENDERER_PRESENTVSYNC = 4,
            SDL_RENDERER_TARGETTEXTURE = 8,
            SDL_KEYDOWN = 768,
            SDL_KEYUP = 769,
            SDL_TEXTEDITING = 770,
            SDL_TEXTINPUT = 771,
            SDL_MOUSEMOTION = 1024,
            SDL_MOUSEBUTTONDOWN = 1025,
            SDL_MOUSEBUTTONUP = 1026,
            SDL_MOUSEWHEEL = 1027,
            SDL_SCANCODE_UNKNOWN = 0,
            SDL_SCANCODE_A = 4,
            SDL_SCANCODE_B = 5,
            SDL_SCANCODE_C = 6,
            SDL_SCANCODE_D = 7,
            SDL_SCANCODE_E = 8,
            SDL_SCANCODE_F = 9,
            SDL_SCANCODE_G = 10,
            SDL_SCANCODE_H = 11,
            SDL_SCANCODE_I = 12,
            SDL_SCANCODE_J = 13,
            SDL_SCANCODE_K = 14,
            SDL_SCANCODE_L = 15,
            SDL_SCANCODE_M = 16,
            SDL_SCANCODE_N = 17,
            SDL_SCANCODE_O = 18,
            SDL_SCANCODE_P = 19,
            SDL_SCANCODE_Q = 20,
            SDL_SCANCODE_R = 21,
            SDL_SCANCODE_S = 22,
            SDL_SCANCODE_T = 23,
            SDL_SCANCODE_U = 24,
            SDL_SCANCODE_V = 25,
            SDL_SCANCODE_W = 26,
            SDL_SCANCODE_X = 27,
            SDL_SCANCODE_Y = 28,
            SDL_SCANCODE_Z = 29,
            SDL_SCANCODE_1 = 30,
            SDL_SCANCODE_2 = 31,
            SDL_SCANCODE_3 = 32,
            SDL_SCANCODE_4 = 33,
            SDL_SCANCODE_5 = 34,
            SDL_SCANCODE_6 = 35,
            SDL_SCANCODE_7 = 36,
            SDL_SCANCODE_8 = 37,
            SDL_SCANCODE_9 = 38,
            SDL_SCANCODE_0 = 39,
            SDL_SCANCODE_RETURN = 40,
            SDL_SCANCODE_ESCAPE = 41,
            SDL_SCANCODE_BACKSPACE = 42,
            SDL_SCANCODE_TAB = 43,
            SDL_SCANCODE_SPACE = 44,
            SDL_SCANCODE_MINUS = 45,
            SDL_SCANCODE_EQUALS = 46,
            SDL_SCANCODE_LEFTBRACKET = 47,
            SDL_SCANCODE_RIGHTBRACKET = 48,
            SDL_SCANCODE_BACKSLASH = 49,
            SDL_SCANCODE_NONUSHASH = 50,
            SDL_SCANCODE_SEMICOLON = 51,
            SDL_SCANCODE_APOSTROPHE = 52,
            SDL_SCANCODE_GRAVE = 53,
            SDL_SCANCODE_COMMA = 54,
            SDL_SCANCODE_PERIOD = 55,
            SDL_SCANCODE_SLASH = 56,
            SDL_SCANCODE_CAPSLOCK = 57,
            SDL_SCANCODE_F1 = 58,
            SDL_SCANCODE_F2 = 59,
            SDL_SCANCODE_F3 = 60,
            SDL_SCANCODE_F4 = 61,
            SDL_SCANCODE_F5 = 62,
            SDL_SCANCODE_F6 = 63,
            SDL_SCANCODE_F7 = 64,
            SDL_SCANCODE_F8 = 65,
            SDL_SCANCODE_F9 = 66,
            SDL_SCANCODE_F10 = 67,
            SDL_SCANCODE_F11 = 68,
            SDL_SCANCODE_F12 = 69,
            SDL_SCANCODE_PRINTSCREEN = 70,
            SDL_SCANCODE_SCROLLLOCK = 71,
            SDL_SCANCODE_PAUSE = 72,
            SDL_SCANCODE_INSERT = 73,
            SDL_SCANCODE_HOME = 74,
            SDL_SCANCODE_PAGEUP = 75,
            SDL_SCANCODE_DELETE = 76,
            SDL_SCANCODE_END = 77,
            SDL_SCANCODE_PAGEDOWN = 78,
            SDL_SCANCODE_RIGHT = 79,
            SDL_SCANCODE_LEFT = 80,
            SDL_SCANCODE_DOWN = 81,
            SDL_SCANCODE_UP = 82,
            SDL_SCANCODE_NUMLOCKCLEAR = 83,
            SDL_SCANCODE_KP_DIVIDE = 84,
            SDL_SCANCODE_KP_MULTIPLY = 85,
            SDL_SCANCODE_KP_MINUS = 86,
            SDL_SCANCODE_KP_PLUS = 87,
            SDL_SCANCODE_KP_ENTER = 88,
            SDL_SCANCODE_KP_1 = 89,
            SDL_SCANCODE_KP_2 = 90,
            SDL_SCANCODE_KP_3 = 91,
            SDL_SCANCODE_KP_4 = 92,
            SDL_SCANCODE_KP_5 = 93,
            SDL_SCANCODE_KP_6 = 94,
            SDL_SCANCODE_KP_7 = 95,
            SDL_SCANCODE_KP_8 = 96,
            SDL_SCANCODE_KP_9 = 97,
            SDL_SCANCODE_KP_0 = 98,
            SDL_SCANCODE_KP_PERIOD = 99,
            SDL_SCANCODE_NONUSBACKSLASH = 100,
            SDL_SCANCODE_APPLICATION = 101,
            SDL_SCANCODE_POWER = 102,
            SDL_SCANCODE_F13 = 104,
            SDL_SCANCODE_F14 = 105,
            SDL_SCANCODE_F15 = 106,
            SDL_SCANCODE_F16 = 107,
            SDL_SCANCODE_F17 = 108,
            SDL_SCANCODE_F18 = 109,
            SDL_SCANCODE_F19 = 110,
            SDL_SCANCODE_F20 = 111,
            SDL_SCANCODE_F21 = 112,
            SDL_SCANCODE_F22 = 113,
            SDL_SCANCODE_F23 = 114,
            SDL_SCANCODE_F24 = 115,
            SDL_SCANCODE_EXECUTE = 116,
            SDL_SCANCODE_HELP = 117,
            SDL_SCANCODE_MENU = 118,
            SDL_SCANCODE_SELECT = 119,
            SDL_SCANCODE_STOP = 120,
            SDL_SCANCODE_AGAIN = 121,
            SDL_SCANCODE_UNDO = 122,
            SDL_SCANCODE_CUT = 123,
            SDL_SCANCODE_COPY = 124,
            SDL_SCANCODE_PASTE = 125,
            SDL_SCANCODE_FIND = 126,
            SDL_SCANCODE_MUTE = 127,
            SDL_SCANCODE_VOLUMEUP = 128,
            SDL_SCANCODE_VOLUMEDOWN = 129,
            SDL_SCANCODE_KP_COMMA = 133,
            SDL_SCANCODE_KP_EQUALSAS400 = 134,
            SDL_SCANCODE_INTERNATIONAL1 = 135,
            SDL_SCANCODE_INTERNATIONAL2 = 136,
            SDL_SCANCODE_INTERNATIONAL3 = 137,
            SDL_SCANCODE_INTERNATIONAL4 = 138,
            SDL_SCANCODE_INTERNATIONAL5 = 139,
            SDL_SCANCODE_INTERNATIONAL6 = 140,
            SDL_SCANCODE_INTERNATIONAL7 = 141,
            SDL_SCANCODE_INTERNATIONAL8 = 142,
            SDL_SCANCODE_INTERNATIONAL9 = 143,
            SDL_SCANCODE_LANG1 = 144,
            SDL_SCANCODE_LANG2 = 145,
            SDL_SCANCODE_LANG3 = 146,
            SDL_SCANCODE_LANG4 = 147,
            SDL_SCANCODE_LANG5 = 148,
            SDL_SCANCODE_LANG6 = 149,
            SDL_SCANCODE_LANG7 = 150,
            SDL_SCANCODE_LANG8 = 151,
            SDL_SCANCODE_LANG9 = 152,
            SDL_SCANCODE_ALTERASE = 153,
            SDL_SCANCODE_SYSREQ = 154,
            SDL_SCANCODE_CANCEL = 155,
            SDL_SCANCODE_CLEAR = 156,
            SDL_SCANCODE_PRIOR = 157,
            SDL_SCANCODE_RETURN2 = 158,
            SDL_SCANCODE_SEPARATOR = 159,
            SDL_SCANCODE_OUT = 160,
            SDL_SCANCODE_OPER = 161,
            SDL_SCANCODE_CLEARAGAIN = 162,
            SDL_SCANCODE_CRSEL = 163,
            SDL_SCANCODE_EXSEL = 164,
            SDL_SCANCODE_KP_00 = 176,
            SDL_SCANCODE_KP_000 = 177,
            SDL_SCANCODE_THOUSANDSSEPARATOR = 178,
            SDL_SCANCODE_DECIMALSEPARATOR = 179,
            SDL_SCANCODE_CURRENCYUNIT = 180,
            SDL_SCANCODE_CURRENCYSUBUNIT = 181,
            SDL_SCANCODE_KP_LEFTPAREN = 182,
            SDL_SCANCODE_KP_RIGHTPAREN = 183,
            SDL_SCANCODE_KP_LEFTBRACE = 184,
            SDL_SCANCODE_KP_RIGHTBRACE = 185,
            SDL_SCANCODE_KP_TAB = 186,
            SDL_SCANCODE_KP_BACKSPACE = 187,
            SDL_SCANCODE_KP_A = 188,
            SDL_SCANCODE_KP_B = 189,
            SDL_SCANCODE_KP_C = 190,
            SDL_SCANCODE_KP_D = 191,
            SDL_SCANCODE_KP_E = 192,
            SDL_SCANCODE_KP_F = 193,
            SDL_SCANCODE_KP_XOR = 194,
            SDL_SCANCODE_KP_POWER = 195,
            SDL_SCANCODE_KP_PERCENT = 196,
            SDL_SCANCODE_KP_LESS = 197,
            SDL_SCANCODE_KP_GREATER = 198,
            SDL_SCANCODE_KP_AMPERSAND = 199,
            SDL_SCANCODE_KP_DBLAMPERSAND = 200,
            SDL_SCANCODE_KP_VERTICALBAR = 201,
            SDL_SCANCODE_KP_DBLVERTICALBAR = 202,
            SDL_SCANCODE_KP_COLON = 203,
            SDL_SCANCODE_KP_HASH = 204,
            SDL_SCANCODE_KP_SPACE = 205,
            SDL_SCANCODE_KP_AT = 206,
            SDL_SCANCODE_KP_EXCLAM = 207,
            SDL_SCANCODE_KP_MEMSTORE = 208,
            SDL_SCANCODE_KP_MEMRECALL = 209,
            SDL_SCANCODE_KP_MEMCLEAR = 210,
            SDL_SCANCODE_KP_MEMADD = 211,
            SDL_SCANCODE_KP_MEMSUBTRACT = 212,
            SDL_SCANCODE_KP_MEMMULTIPLY = 213,
            SDL_SCANCODE_KP_MEMDIVIDE = 214,
            SDL_SCANCODE_KP_PLUSMINUS = 215,
            SDL_SCANCODE_KP_CLEAR = 216,
            SDL_SCANCODE_KP_CLEARENTRY = 217,
            SDL_SCANCODE_KP_BINARY = 218,
            SDL_SCANCODE_KP_OCTAL = 219,
            SDL_SCANCODE_KP_DECIMAL = 220,
            SDL_SCANCODE_KP_HEXADECIMAL = 221,
            SDL_SCANCODE_LCTRL = 224,
            SDL_SCANCODE_LSHIFT = 225,
            SDL_SCANCODE_LALT = 226,
            SDL_SCANCODE_LGUI = 227,
            SDL_SCANCODE_RCTRL = 228,
            SDL_SCANCODE_RSHIFT = 229,
            SDL_SCANCODE_RALT = 230,
            SDL_SCANCODE_RGUI = 231,
            SDL_SCANCODE_MODE = 257,
            SDL_SCANCODE_AUDIONEXT = 258,
            SDL_SCANCODE_AUDIOPREV = 259,
            SDL_SCANCODE_AUDIOSTOP = 260,
            SDL_SCANCODE_AUDIOPLAY = 261,
            SDL_SCANCODE_AUDIOMUTE = 262,
            SDL_SCANCODE_MEDIASELECT = 263,
            SDL_SCANCODE_WWW = 264,
            SDL_SCANCODE_MAIL = 265,
            SDL_SCANCODE_CALCULATOR = 266,
            SDL_SCANCODE_COMPUTER = 267,
            SDL_SCANCODE_AC_SEARCH = 268,
            SDL_SCANCODE_AC_HOME = 269,
            SDL_SCANCODE_AC_BACK = 270,
            SDL_SCANCODE_AC_FORWARD = 271,
            SDL_SCANCODE_AC_STOP = 272,
            SDL_SCANCODE_AC_REFRESH = 273,
            SDL_SCANCODE_AC_BOOKMARKS = 274,
            SDL_SCANCODE_BRIGHTNESSDOWN = 275,
            SDL_SCANCODE_BRIGHTNESSUP = 276,
            SDL_SCANCODE_DISPLAYSWITCH = 277,
            SDL_SCANCODE_KBDILLUMTOGGLE = 278,
            SDL_SCANCODE_KBDILLUMDOWN = 279,
            SDL_SCANCODE_KBDILLUMUP = 280,
            SDL_SCANCODE_EJECT = 281,
            SDL_SCANCODE_SLEEP = 282,
            SDL_SCANCODE_APP1 = 283,
            SDL_SCANCODE_APP2 = 284,
            SDL_SCANCODE_AUDIOREWIND = 285,
            SDL_SCANCODE_AUDIOFASTFORWARD = 286,
            SDL_NUM_SCANCODES = 512
        }
    }
)
____exports.sdl = ____.types
____exports.SDL = ____.values
____exports.sdl_header = ____.header
return ____exports
end,
["Game.Init"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Lib_2ESDL = require("Lib.SDL")
local SDL = ____Lib_2ESDL.SDL
local sdl = ____Lib_2ESDL.sdl
sdl.SDL_Init(SDL.SDL_INIT_VIDEO)
____exports.window = sdl.SDL_CreateWindow("SDL Tutorial", SDL.SDL_WINDOWPOS_UNDEFINED, SDL.SDL_WINDOWPOS_UNDEFINED, 800, 600, 0)
____exports.renderer = sdl.SDL_CreateRenderer(
    ____exports.window,
    -1,
    bit.band(SDL.SDL_RENDERER_ACCELERATED, SDL.SDL_RENDERER_PRESENTVSYNC)
)
sdl.SDL_SetRenderDrawColor(____exports.renderer, 255, 0, 255, 255)
return ____exports
end,
["Lib.SDL.Img"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Util_2EFFI = require("Util.FFI")
local FFI = ____Util_2EFFI.FFI
local ____ = FFI.load_library({values = {IMG_INIT_JPG = 1, IMG_INIT_PNG = 2, IMG_INIT_TIF = 4, IMG_INIT_WEBP = 8}, file_name = "SDL2_image", header = {IMG_Linked_Version = {output = "SDL_version*", params = {}}, IMG_Init = {output = "int", params = {flags = {type = "int", index = 0}}}, IMG_Quit = {output = "void", params = {}}, IMG_LoadTyped_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}, freesrc = {type = "int", index = 1}, type = {type = "char*", index = 2}}}, IMG_Load = {output = "SDL_Surface*", params = {file = {type = "char*", index = 0}}}, IMG_Load_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}, freesrc = {type = "int", index = 1}}}, IMG_LoadTexture = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}, file = {type = "char*", index = 1}}}, IMG_LoadTexture_RW = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}, src = {type = "SDL_RWops*", index = 1}, freesrc = {type = "int", index = 2}}}, IMG_LoadTextureTyped_RW = {output = "SDL_Texture*", params = {renderer = {type = "SDL_Renderer*", index = 0}, src = {type = "SDL_RWops*", index = 1}, freesrc = {type = "int", index = 2}, type = {type = "char*", index = 3}}}, IMG_isICO = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isCUR = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isBMP = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isGIF = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isJPG = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isLBM = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isPCX = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isPNG = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isPNM = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isSVG = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isTIF = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isXCF = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isXPM = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isXV = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_isWEBP = {output = "int", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadICO_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadCUR_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadBMP_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadGIF_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadJPG_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadLBM_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadPCX_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadPNG_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadPNM_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadSVG_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadTGA_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadTIF_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadXCF_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadXPM_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadXV_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_LoadWEBP_RW = {output = "SDL_Surface*", params = {src = {type = "SDL_RWops*", index = 0}}}, IMG_ReadXPMFromArray = {output = "SDL_Surface*", params = {xpm = {type = "char**", index = 0}}}, IMG_SavePNG = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, file = {type = "char*", index = 1}}}, IMG_SavePNG_RW = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, dst = {type = "SDL_RWops*", index = 1}, freedst = {type = "int", index = 2}}}, IMG_SaveJPG = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, file = {type = "char*", index = 1}, quality = {type = "int", index = 2}}}, IMG_SaveJPG_RW = {output = "int", params = {surface = {type = "SDL_Surface*", index = 0}, dst = {type = "SDL_RWops*", index = 1}, freedst = {type = "int", index = 2}, quality = {type = "int", index = 3}}}}})
____exports.sdl_img = ____.types
____exports.SDL_IMG = ____.values
return ____exports
end,
["Util.Graphics2D"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____Lib_2ESDL = require("Lib.SDL")
local sdl = ____Lib_2ESDL.sdl
local ____Lib_2ESDL_2EImg = require("Lib.SDL.Img")
local sdl_img = ____Lib_2ESDL_2EImg.sdl_img
local ____Util_2EFFI = require("Util.FFI")
local ffi = ____Util_2EFFI.ffi
local ____Util_2EScripting = require("Util.Scripting")
local Scripting = ____Util_2EScripting.Scripting
____exports.Graphics2D = {}
local Graphics2D = ____exports.Graphics2D
do
    local function load_texture(renderer, path)
        local full_path = tostring(
            ffi.string(
                sdl.SDL_GetBasePath()
            )
        ) .. tostring(path)
        local loaded_surface = sdl_img.IMG_Load(full_path)
        sdl.SDL_SetColorKey(
            loaded_surface,
            1,
            sdl.SDL_MapRGB(loaded_surface.format, 255, 0, 255)
        )
        local new_texture = sdl.SDL_CreateTextureFromSurface(renderer, loaded_surface)
        return new_texture
    end
    function Graphics2D.load_sheets(renderer, sheet_inputs)
        return Scripting.reduce_keys(
            sheet_inputs,
            function(____, sheets, image_path) return __TS__ObjectAssign(
                {},
                sheets,
                {
                    [image_path] = {
                        texture = load_texture(renderer, image_path),
                        sprites = sheet_inputs[image_path].sprites,
                        animations = sheet_inputs[image_path].animations
                    }
                }
            ) end
        )
    end
    function Graphics2D.draw_sprite(renderer, params)
        local sheet = params.sheet
        local sprite = sheet.sprites[params.sprite + 1]
        local ____ = params.position
        local x = ____.x
        local y = ____.y
        local screen_rect = ffi.new("SDL_Rect", {x = x, y = y, w = sprite.w * 2, h = sprite.h * 2})
        local sprite_rect = ffi.new("SDL_Rect", sprite)
        sdl.SDL_RenderCopy(renderer, sheet.texture, sprite_rect, screen_rect)
    end
    function Graphics2D.loop_animation(params)
        local sheet = params.sheet
        local animations = sheet.animations
        local animation = animations[params.animation]
        local animation_index = math.floor(params.time / 100) % #animation
        return __TS__ObjectAssign({}, params, {sprite = animation[animation_index + 1]})
    end
end
return ____exports
end,
["Util.VecMath"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.TAU = 6.283185307179586
____exports.Num = {}
local Num = ____exports.Num
do
    function Num.abs(n)
        return ((n < 0) and -n) or n
    end
    function Num.clamp(n, min, max)
        return ((n < min) and min) or (((n > max) and max) or n)
    end
    function Num.lerp(a, b, t)
        return a + ((b - a) * t)
    end
    function Num.max(a, b)
        return ((a > b) and a) or b
    end
    function Num.min(a, b)
        return ((a > b) and b) or a
    end
    function Num.mod(a, b)
        return a % b
    end
    function Num.flatten_angle(angle, rate)
        if rate <= 0 then
            return angle
        end
        while angle < 0 do
            angle = angle + 360
        end
        while angle > 360 do
            angle = angle - 360
        end
        local offset = ((angle > 90) and 180) or 0
        return ((angle - offset) * (1 - rate)) + offset
    end
end
____exports.Vec2 = {}
local Vec2 = ____exports.Vec2
do
    function Vec2.len2(a)
        local ax = a[1]
        local ay = a[2]
        return (ax * ax) + (ay * ay)
    end
    function Vec2.sub(a, b)
        return {a[1] - b[1], a[2] - b[2]}
    end
    function Vec2.add(a, b)
        return {a[1] + b[1], a[2] + b[2]}
    end
    function Vec2.applymat2(a, b)
        local ax = a[1]
        local ay = a[2]
        return {(b[1] * ax) + (b[3] * ay), (b[2] * ax) + (b[4] * ay)}
    end
    function Vec2.applymat3x2(a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[3] * ay)) + b[5], ((b[2] * ax) + (b[4] * ay)) + b[6]}
    end
    function Vec2.applymat3(a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[4] * ay)) + b[7], ((b[2] * ax) + (b[5] * ay)) + b[8]}
    end
    function Vec2.applymat4(a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[5] * ay)) + b[13], ((b[2] * ax) + (b[6] * ay)) + b[14]}
    end
    function Vec2.clamp(a, min, max)
        return {
            ____exports.Num.clamp(a[1], min[1], max[1]),
            ____exports.Num.clamp(a[2], min[2], max[2])
        }
    end
    function Vec2.dist(a, b)
        return math.sqrt(
            Vec2.len2(
                Vec2.sub(a, b)
            )
        )
    end
    function Vec2.dist2(a, b)
        return Vec2.len2(
            Vec2.sub(b, a)
        )
    end
    function Vec2.div(a, b)
        return {a[1] / b[1], a[2] / b[2]}
    end
    function Vec2.dot(a, b)
        return (a[1] * b[1]) + (a[2] * b[2])
    end
    function Vec2.inverse(a)
        return {1 / a[1], 1 / a[2]}
    end
    function Vec2.len(a)
        return math.sqrt(
            Vec2.len2(a)
        )
    end
    function Vec2.lerp(a, b, t)
        return {
            ____exports.Num.lerp(a[1], b[1], t),
            ____exports.Num.lerp(a[2], b[2], t)
        }
    end
    function Vec2.max(a, b)
        return {
            math.max(a[1], b[1]),
            math.max(a[2], b[2])
        }
    end
    function Vec2.min(a, b)
        return {
            math.min(a[1], b[1]),
            math.min(a[2], b[2])
        }
    end
    function Vec2.mul(a, b)
        return {a[1] * b[1], a[2] * b[2]}
    end
    function Vec2.neg(a)
        return {-a[1], -a[2]}
    end
    function Vec2.normal(a)
        local ax = a[1]
        local ay = a[2]
        local len = (ax * ax) + (ay * ay)
        if len > 0 then
            len = 1 / math.sqrt(len)
            return {ax * len, ay * len}
        end
        return a
    end
    function Vec2.scale(a, s)
        return {a[1] * s, a[2] * s}
    end
end
____exports.Vec3 = {}
local Vec3 = ____exports.Vec3
do
    function Vec3.dot(a, b)
        return ((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])
    end
    function Vec3.len2(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return ((ax * ax) + (ay * ay)) + (az * az)
    end
    function Vec3.nangle(a, b)
        local c = Vec3.dot(a, b)
        if (c < -1) or (c > 1) then
            return 0
        end
        return math.acos(c)
    end
    function Vec3.normal(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local len = ((ax * ax) + (ay * ay)) + (az * az)
        if len > 0 then
            len = 1 / math.sqrt(len)
            return {ax * len, ay * len, az * len}
        end
        return a
    end
    function Vec3.sub(a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3]}
    end
    function Vec3.add(a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3]}
    end
    function Vec3.angle(a, b)
        return Vec3.nangle(
            Vec3.normal(a),
            Vec3.normal(b)
        )
    end
    function Vec3.applymat3x2(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return {((ax * b[1]) + (ay * b[3])) + (az * b[5]), ((ax * b[2]) + (ay * b[4])) + (az * b[6]), az}
    end
    function Vec3.applymat3(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return {((ax * b[1]) + (ay * b[4])) + (az * b[7]), ((ax * b[2]) + (ay * b[5])) + (az * b[8]), ((ax * b[3]) + (ay * b[6])) + (az * b[9])}
    end
    function Vec3.apply_mat4(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local w = (((b[4] * ax) + (b[8] * ay)) + (b[12] * az)) + b[16]
        if w == 0 then
            w = 1
        end
        return {((((b[1] * ax) + (b[5] * ay)) + (b[9] * az)) + b[13]) / w, ((((b[2] * ax) + (b[6] * ay)) + (b[10] * az)) + b[14]) / w, ((((b[3] * ax) + (b[7] * ay)) + (b[11] * az)) + b[15]) / w}
    end
    function Vec3.apply_quat(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        local bw = b[4]
        local ix = ((bw * ax) + (by * az)) - (bz * ay)
        local iy = ((bw * ay) + (bz * ax)) - (bx * az)
        local iz = ((bw * az) + (bx * ay)) - (by * ax)
        local iw = ((-bx * ax) - (by * ay)) - (bz * az)
        return {(((ix * bw) + (iw * -bx)) + (iy * -bz)) - (iz * -by), (((iy * bw) + (iw * -by)) + (iz * -bx)) - (ix * -bz), (((iz * bw) + (iw * -bz)) + (ix * -by)) - (iy * -bx)}
    end
    function Vec3.clamp(a, min, max)
        return {
            ____exports.Num.clamp(a[1], min[1], max[1]),
            ____exports.Num.clamp(a[2], min[2], max[2]),
            ____exports.Num.clamp(a[3], min[3], max[3])
        }
    end
    function Vec3.cross(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        return {(ay * bz) - (az * by), (az * bx) - (ax * bz), (ax * by) - (ay * bx)}
    end
    function Vec3.dist(a, b)
        return math.sqrt(
            Vec3.len2(
                Vec3.sub(a, b)
            )
        )
    end
    function Vec3.dist2(a, b)
        return Vec3.len2(
            Vec3.sub(b, a)
        )
    end
    function Vec3.div(a, b)
        return {a[1] / b[1], a[2] / b[2], a[3] / b[3]}
    end
    function Vec3.inverse(a)
        return {1 / a[1], 1 / a[2], 1 / a[3]}
    end
    function Vec3.len(a)
        return math.sqrt(
            Vec3.len2(a)
        )
    end
    function Vec3.lerp(a, b, t)
        return {
            ____exports.Num.lerp(a[1], b[1], t),
            ____exports.Num.lerp(a[2], b[2], t),
            ____exports.Num.lerp(a[3], b[3], t)
        }
    end
    function Vec3.max(a, b)
        return {
            math.max(a[1], b[1]),
            math.max(a[2], b[2]),
            math.max(a[3], b[3])
        }
    end
    function Vec3.min(a, b)
        return {
            math.min(a[1], b[1]),
            math.min(a[2], b[2]),
            math.min(a[3], b[3])
        }
    end
    function Vec3.mul(a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3]}
    end
    function Vec3.neg(a)
        return {-a[1], -a[2], -a[3]}
    end
    function Vec3.orthogonal(a, b)
        return Vec3.normal(
            Vec3.cross(a, b)
        )
    end
    function Vec3.scale(a, s)
        return {a[1] * s, a[2] * s, a[3] * s}
    end
end
____exports.Vec4 = {}
local Vec4 = ____exports.Vec4
do
    function Vec4.len2(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        return (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
    end
    function Vec4.sub(a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]}
    end
    function Vec4.add(a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4]}
    end
    function Vec4.applymat4(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        return {(((b[1] * ax) + (b[5] * ay)) + (b[9] * az)) + (b[13] * aw), (((b[2] * ax) + (b[6] * ay)) + (b[10] * az)) + (b[14] * aw), (((b[3] * ax) + (b[7] * ay)) + (b[11] * az)) + (b[15] * aw), (((b[4] * ax) + (b[8] * ay)) + (b[12] * az)) + (b[16] * aw)}
    end
    function Vec4.applyquat(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        local bw = b[4]
        local ix = ((bw * ax) + (by * az)) - (bz * ay)
        local iy = ((bw * ay) + (bz * ax)) - (bx * az)
        local iz = ((bw * az) + (bx * ay)) - (by * ax)
        local iw = ((-bx * ax) - (by * ay)) - (bz * az)
        return {(((ix * bw) + (iw * -bx)) + (iy * -bz)) - (iz * -by), (((iy * bw) + (iw * -by)) + (iz * -bx)) - (ix * -bz), (((iz * bw) + (iw * -bz)) + (ix * -by)) - (iy * -bx), aw}
    end
    function Vec4.clamp(a, min, max)
        return {
            ____exports.Num.clamp(a[1], min[1], max[1]),
            ____exports.Num.clamp(a[2], min[2], max[2]),
            ____exports.Num.clamp(a[3], min[3], max[3]),
            ____exports.Num.clamp(a[4], min[4], max[4])
        }
    end
    function Vec4.dist(a, b)
        return math.sqrt(
            Vec4.len2(
                Vec4.sub(a, b)
            )
        )
    end
    function Vec4.dist2(a, b)
        return Vec4.len2(
            Vec4.sub(b, a)
        )
    end
    function Vec4.div(a, b)
        return {a[1] / b[1], a[2] / b[2], a[3] / b[3], a[4] / b[4]}
    end
    function Vec4.dot(a, b)
        return (((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])) + (a[4] * b[4])
    end
    function Vec4.inverse(a)
        return {1 / a[1], 1 / a[2], 1 / a[3], 1 / a[4]}
    end
    function Vec4.len(a)
        return math.sqrt(
            Vec4.len2(a)
        )
    end
    function Vec4.lerp(a, b, t)
        return {
            ____exports.Num.lerp(a[1], b[1], t),
            ____exports.Num.lerp(a[2], b[2], t),
            ____exports.Num.lerp(a[3], b[3], t),
            ____exports.Num.lerp(a[4], b[4], t)
        }
    end
    function Vec4.max(a, b)
        return {
            math.max(a[1], b[1]),
            math.max(a[2], b[2]),
            math.max(a[3], b[3]),
            math.max(a[4], b[4])
        }
    end
    function Vec4.min(a, b)
        return {
            math.min(a[1], b[1]),
            math.min(a[2], b[2]),
            math.min(a[3], b[3]),
            math.min(a[4], b[4])
        }
    end
    function Vec4.mul(a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4]}
    end
    function Vec4.neg(a)
        return {-a[1], -a[2], -a[3], -a[4]}
    end
    function Vec4.normal(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local len = (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
        if len > 0 then
            len = 1 / math.sqrt(len)
            return {ax * len, ay * len, az * len, aw * len}
        end
        return a
    end
    function Vec4.scale(a, s)
        return {a[1] * s, a[2] * s, a[3] * s, a[4] * s}
    end
end
____exports.Quat = {}
local Quat = ____exports.Quat
do
    function Quat.naxisang(axis, ang)
        ang = ang * 0.5
        local s = math.sin(ang)
        return {
            axis[1] * s,
            axis[2] * s,
            axis[3] * s,
            math.cos(ang)
        }
    end
    function Quat.nbetween(from, to)
        local r = ____exports.Vec3.dot(from, to) + 1
        local cross
        if r < 0.000001 then
            if math.abs(from[1]) > math.abs(from[3]) then
                cross = {-from[2], from[1], 0}
            else
                cross = {0, -from[3], from[2]}
            end
        else
            cross = ____exports.Vec3.cross(from, to)
        end
        return Quat.normal({cross[1], cross[2], cross[3], r})
    end
    function Quat.normal(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local len = (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
        if len > 0 then
            len = 1 / math.sqrt(len)
            return {ax * len, ay * len, az * len, aw * len}
        end
        return a
    end
    function Quat.axis_angle(axis, ang)
        return Quat.naxisang(
            ____exports.Vec3.normal(axis),
            ang
        )
    end
    function Quat.between(from, to)
        return Quat.nbetween(
            ____exports.Vec3.normal(from),
            ____exports.Vec3.normal(to)
        )
    end
    function Quat.dot(a, b)
        return (((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])) + (a[4] * b[4])
    end
    function Quat.euler_xyz(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_xzy(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.euler_yxz(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.euler_yzx(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_zxy(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_zyx(rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = math.cos(a0)
        local cy = math.cos(a1)
        local cz = math.cos(a2)
        local sx = math.sin(a0)
        local sy = math.sin(a1)
        local sz = math.sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.identity()
        return {0, 0, 0, 1}
    end
    function Quat.invert(a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local dot = (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
        local invDot = 0
        if dot ~= 0 then
            invDot = 1 / dot
        end
        return {-ax * invDot, -ay * invDot, -az * invDot, aw * invDot}
    end
    function Quat.lerp(a, b, t)
        return {
            ____exports.Num.lerp(a[1], b[1], t),
            ____exports.Num.lerp(a[2], b[2], t),
            ____exports.Num.lerp(a[3], b[3], t),
            ____exports.Num.lerp(a[4], b[4], t)
        }
    end
    function Quat.mul(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        local bw = b[4]
        return {(((ax * bw) + (aw * bx)) + (ay * bz)) - (az * by), (((ay * bw) + (aw * by)) + (az * bx)) - (ax * bz), (((az * bw) + (aw * bz)) + (ax * by)) - (ay * bx), (((aw * bw) - (ax * bx)) - (ay * by)) - (az * bz)}
    end
    function Quat.neg(a)
        return {-a[1], -a[2], -a[3], -a[4]}
    end
    function Quat.nlerp(a, b, t)
        return Quat.normal(
            Quat.lerp(a, b, t)
        )
    end
    function Quat.slerp(a, b, t)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        local bw = b[4]
        local omega
        local cosom
        local sinom
        local scale0
        local scale1
        cosom = (((ax * bx) + (ay * by)) + (az * bz)) + (aw * bw)
        if cosom < 0 then
            cosom = -cosom
            bx = -bx
            by = -by
            bz = -bz
            bw = -bw
        end
        if (1 - cosom) > 0.000001 then
            omega = math.acos(cosom)
            sinom = math.sin(omega)
            scale0 = math.sin((1 - t) * omega) / sinom
            scale1 = math.sin(t * omega) / sinom
        else
            scale0 = 1 - t
            scale1 = t
        end
        return {(scale0 * ax) + (scale1 * bx), (scale0 * ay) + (scale1 * by), (scale0 * az) + (scale1 * bz), (scale0 * aw) + (scale1 * bw)}
    end
end
____exports.Mat2 = {}
local Mat2 = ____exports.Mat2
do
    function Mat2.add(a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4]}
    end
    function Mat2.adjoint(a)
        return {a[4], -a[2], -a[3], a[1]}
    end
    function Mat2.compmul(a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4]}
    end
    function Mat2.det(a)
        return (a[1] * a[4]) - (a[3] * a[2])
    end
    function Mat2.identity()
        return {1, 0, 0, 1}
    end
    function Mat2.invert(a)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local det = (a0 * a3) - (a2 * a1)
        if det == 0 then
            return {0, 0, 0, 0}
        end
        det = 1 / det
        return {a3 * det, -a1 * det, -a2 * det, a0 * det}
    end
    function Mat2.mul(a, b)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local b0 = b[1]
        local b1 = b[2]
        local b2 = b[3]
        local b3 = b[4]
        return {(a0 * b0) + (a2 * b1), (a1 * b0) + (a3 * b1), (a0 * b2) + (a2 * b3), (a1 * b2) + (a3 * b3)}
    end
    function Mat2.rotate(a, ang)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local s = math.sin(ang)
        local c = math.cos(ang)
        return {(a0 * c) + (a2 * s), (a1 * c) + (a3 * s), (a0 * -s) + (a2 * c), (a1 * -s) + (a3 * c)}
    end
    function Mat2.rotation(ang)
        local s = math.sin(ang)
        local c = math.cos(ang)
        return {c, s, -s, c}
    end
    function Mat2.scale(a, b)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local b0 = b[1]
        local b1 = b[2]
        return {a0 * b0, a1 * b0, a2 * b1, a3 * b1}
    end
    function Mat2.scaling(a)
        return {a[1], 0, 0, a[2]}
    end
    function Mat2.sub(a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]}
    end
    function Mat2.transpose(a)
        return {a[1], a[3], a[2], a[4]}
    end
end
____exports.Mat3x2 = {}
local Mat3x2 = ____exports.Mat3x2
do
    function Mat3x2.add(a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5], a[6] + b[6]}
    end
    function Mat3x2.compmul(a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4], a[5] * b[5], a[6] * b[6]}
    end
    function Mat3x2.det(a)
        return (a[1] * a[4]) - (a[3] * a[2])
    end
    function Mat3x2.identity()
        return {1, 0, 0, 1, 0, 0}
    end
    function Mat3x2.invert(a)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local a20 = a[5]
        local a21 = a[6]
        local det = (a00 * a11) - (a01 * a10)
        if det == 0 then
            return {0, 0, 0, 0, 0, 0}
        end
        det = 1 / det
        return {a11 * det, -a01 * det, -a10 * det, a00 * det, ((a21 * a10) - (a11 * a20)) * det, ((-a21 * a00) + (a01 * a20)) * det}
    end
    function Mat3x2.mul(a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local a20 = a[5]
        local a21 = a[6]
        local b00 = b[1]
        local b01 = b[2]
        local b10 = b[3]
        local b11 = b[4]
        local b20 = b[5]
        local b21 = b[6]
        return {(b00 * a00) + (b01 * a10), (b00 * a01) + (b01 * a11), (b10 * a00) + (b11 * a10), (b10 * a01) + (b11 * a11), ((b20 * a00) + (b21 * a10)) + a20, ((b20 * a01) + (b21 * a11)) + a21}
    end
    function Mat3x2.rotate(a, ang)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local s = math.sin(ang)
        local c = math.cos(ang)
        return {(c * a00) + (s * a10), (c * a01) + (s * a11), (c * a10) - (s * a00), (c * a11) - (s * a01), a[5], a[6]}
    end
    function Mat3x2.rotation(ang)
        local s = math.sin(ang)
        local c = math.cos(ang)
        return {c, s, -s, c, 0, 0}
    end
    function Mat3x2.scale(a, b)
        local bx
        local by
        if type(b) == "number" then
            bx = (function()
                by = b
                return by
            end)()
        else
            bx = b[1]
            by = b[2]
        end
        return {bx * a[1], bx * a[2], by * a[3], by * a[4], a[5], a[6]}
    end
    function Mat3x2.scaling(a)
        if type(a) == "number" then
            return {a, 0, 0, a, 0, 0}
        end
        return {a[1], 0, 0, a[2], 0, 0}
    end
    function Mat3x2.sub(a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5], a[6] - b[6]}
    end
    function Mat3x2.translate(a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local bx = b[1]
        local by = b[2]
        return {a00, a01, a10, a11, ((bx * a00) + (by * a10)) + a[5], ((bx * a01) + (by * a11)) + a[6]}
    end
    function Mat3x2.translation(a)
        return {1, 0, 0, 1, a[1], a[2]}
    end
end
____exports.Mat3 = {}
local Mat3 = ____exports.Mat3
do
    function Mat3.add(out, a, b)
        out[1] = a[1] + b[1]
        out[2] = a[2] + b[2]
        out[3] = a[3] + b[3]
        out[4] = a[4] + b[4]
        out[5] = a[5] + b[5]
        out[6] = a[6] + b[6]
        out[7] = a[7] + b[7]
        out[8] = a[8] + b[8]
        out[9] = a[9] + b[9]
        return out
    end
    function Mat3.adjoint(out, a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        out[1] = (a11 * a22) - (a12 * a21)
        out[2] = (a02 * a21) - (a01 * a22)
        out[3] = (a01 * a12) - (a02 * a11)
        out[4] = (a12 * a20) - (a10 * a22)
        out[5] = (a00 * a22) - (a02 * a20)
        out[6] = (a02 * a10) - (a00 * a12)
        out[7] = (a10 * a21) - (a11 * a20)
        out[8] = (a01 * a20) - (a00 * a21)
        out[9] = (a00 * a11) - (a01 * a10)
        return out
    end
    function Mat3.compmul(out, a, b)
        out[1] = a[1] * b[1]
        out[2] = a[2] * b[2]
        out[3] = a[3] * b[3]
        out[4] = a[4] * b[4]
        out[5] = a[5] * b[5]
        out[6] = a[6] * b[6]
        out[7] = a[7] * b[7]
        out[8] = a[8] * b[8]
        out[9] = a[9] * b[9]
        return out
    end
    function Mat3.copy(out, a)
        out[1] = a[1]
        out[2] = a[2]
        out[3] = a[3]
        out[4] = a[4]
        out[5] = a[5]
        out[6] = a[6]
        out[7] = a[7]
        out[8] = a[8]
        out[9] = a[9]
        return out
    end
    function Mat3.det(a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        return ((a00 * ((a22 * a11) - (a12 * a21))) + (a01 * ((-a22 * a10) + (a12 * a20)))) + (a02 * ((a21 * a10) - (a11 * a20)))
    end
    function Mat3.identity(out)
        if type(out) == "nil" then
            return {1, 0, 0, 0, 1, 0, 0, 0, 1}
        end
        out[1] = 1
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 1
        out[6] = 0
        out[7] = 0
        out[8] = 0
        out[9] = 1
        return out
    end
    function Mat3.invert(out, a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        local b01 = (a22 * a11) - (a12 * a21)
        local b11 = (-a22 * a10) + (a12 * a20)
        local b21 = (a21 * a10) - (a11 * a20)
        local det = ((a00 * b01) + (a01 * b11)) + (a02 * b21)
        if det == 0 then
            error(
                __TS__New(Error, "Cannot invert mat3"),
                0
            )
        end
        det = 1 / det
        out[1] = b01 * det
        out[2] = ((-a22 * a01) + (a02 * a21)) * det
        out[3] = ((a12 * a01) - (a02 * a11)) * det
        out[4] = b11 * det
        out[5] = ((a22 * a00) - (a02 * a20)) * det
        out[6] = ((-a12 * a00) + (a02 * a10)) * det
        out[7] = b21 * det
        out[8] = ((-a21 * a00) + (a01 * a20)) * det
        out[9] = ((a11 * a00) - (a01 * a10)) * det
        return out
    end
    function Mat3.mul(out, a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        local b00 = b[1]
        local b01 = b[2]
        local b02 = b[3]
        local b10 = b[4]
        local b11 = b[5]
        local b12 = b[6]
        local b20 = b[7]
        local b21 = b[8]
        local b22 = b[9]
        out[1] = ((b00 * a00) + (b01 * a10)) + (b02 * a20)
        out[2] = ((b00 * a01) + (b01 * a11)) + (b02 * a21)
        out[3] = ((b00 * a02) + (b01 * a12)) + (b02 * a22)
        out[4] = ((b10 * a00) + (b11 * a10)) + (b12 * a20)
        out[5] = ((b10 * a01) + (b11 * a11)) + (b12 * a21)
        out[6] = ((b10 * a02) + (b11 * a12)) + (b12 * a22)
        out[7] = ((b20 * a00) + (b21 * a10)) + (b22 * a20)
        out[8] = ((b20 * a01) + (b21 * a11)) + (b22 * a21)
        out[9] = ((b20 * a02) + (b21 * a12)) + (b22 * a22)
        return out
    end
    function Mat3.quat(out, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local ax2 = ax + ax
        local ay2 = ay + ay
        local az2 = az + az
        local axx = ax * ax2
        local ayx = ay * ax2
        local ayy = ay * ay2
        local azx = az * ax2
        local azy = az * ay2
        local azz = az * az2
        local awx = aw * ax2
        local awy = aw * ay2
        local awz = aw * az2
        out[1] = (1 - ayy) - azz
        out[2] = ayx + awz
        out[3] = azx - awy
        out[4] = ayx - awz
        out[5] = (1 - axx) - azz
        out[6] = azy + awx
        out[7] = azx + awy
        out[8] = azy - awx
        out[9] = (1 - axx) - ayy
        return out
    end
    function Mat3.rotate(out, a, ang)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        local s = math.sin(ang)
        local c = math.cos(ang)
        out[1] = (c * a00) + (s * a10)
        out[2] = (c * a01) + (s * a11)
        out[3] = (c * a02) + (s * a12)
        out[4] = (c * a10) - (s * a00)
        out[5] = (c * a11) - (s * a01)
        out[6] = (c * a12) - (s * a02)
        out[7] = a20
        out[8] = a21
        out[9] = a22
        return out
    end
    function Mat3.rotation(out, ang)
        local s = math.sin(ang)
        local c = math.cos(ang)
        out[1] = c
        out[2] = s
        out[3] = 0
        out[4] = -s
        out[5] = c
        out[6] = 0
        out[7] = 0
        out[8] = 0
        out[9] = 1
        return out
    end
    function Mat3.scale(out, a, b)
        local bx = b[1]
        local by = b[2]
        out[1] = bx * a[1]
        out[2] = bx * a[2]
        out[3] = bx * a[3]
        out[4] = by * a[4]
        out[5] = by * a[5]
        out[6] = by * a[6]
        out[7] = a[7]
        out[8] = a[8]
        out[9] = a[9]
        return out
    end
    function Mat3.scaling(out, a)
        out[1] = a[1]
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = a[2]
        out[6] = 0
        out[7] = 0
        out[8] = 0
        out[9] = 1
        return out
    end
    function Mat3.sub(out, a, b)
        out[1] = a[1] - b[1]
        out[2] = a[2] - b[2]
        out[3] = a[3] - b[3]
        out[4] = a[4] - b[4]
        out[5] = a[5] - b[5]
        out[6] = a[6] - b[6]
        out[7] = a[7] - b[7]
        out[8] = a[8] - b[8]
        out[9] = a[9] - b[9]
        return out
    end
    function Mat3.translate(out, a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        local bx = b[1]
        local by = b[2]
        out[1] = a00
        out[2] = a01
        out[3] = a02
        out[4] = a10
        out[5] = a11
        out[6] = a12
        out[7] = ((bx * a00) + (by * a10)) + a20
        out[8] = ((bx * a01) + (by * a11)) + a21
        out[9] = ((bx * a02) + (by * a12)) + a22
        return out
    end
    function Mat3.translation(out, a)
        out[1] = 1
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 1
        out[6] = 0
        out[7] = a[1]
        out[8] = a[2]
        out[9] = 1
        return out
    end
    function Mat3.transpose(out, a)
        if out == a then
            local a01 = a[2]
            local a02 = a[3]
            local a12 = a[6]
            out[2] = a[4]
            out[3] = a[7]
            out[4] = a01
            out[6] = a[8]
            out[7] = a02
            out[8] = a12
        else
            out[1] = a[1]
            out[2] = a[4]
            out[3] = a[7]
            out[4] = a[2]
            out[5] = a[5]
            out[6] = a[8]
            out[7] = a[3]
            out[8] = a[6]
            out[9] = a[9]
        end
        return out
    end
end
____exports.Mat4 = {}
local Mat4 = ____exports.Mat4
do
    function Mat4.add(out, a, b)
        out[1] = a[1] + b[1]
        out[2] = a[2] + b[2]
        out[3] = a[3] + b[3]
        out[4] = a[4] + b[4]
        out[5] = a[5] + b[5]
        out[6] = a[6] + b[6]
        out[7] = a[7] + b[7]
        out[8] = a[8] + b[8]
        out[9] = a[9] + b[9]
        out[10] = a[10] + b[10]
        out[11] = a[11] + b[11]
        out[12] = a[12] + b[12]
        out[13] = a[13] + b[13]
        out[14] = a[14] + b[14]
        out[15] = a[15] + b[15]
        out[16] = a[16] + b[16]
        return out
    end
    function Mat4.adjoint(out, a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a03 = a[4]
        local a10 = a[5]
        local a11 = a[6]
        local a12 = a[7]
        local a13 = a[8]
        local a20 = a[9]
        local a21 = a[10]
        local a22 = a[11]
        local a23 = a[12]
        local a30 = a[13]
        local a31 = a[14]
        local a32 = a[15]
        local a33 = a[16]
        out[1] = ((a11 * ((a22 * a33) - (a23 * a32))) - (a21 * ((a12 * a33) - (a13 * a32)))) + (a31 * ((a12 * a23) - (a13 * a22)))
        out[2] = -(((a01 * ((a22 * a33) - (a23 * a32))) - (a21 * ((a02 * a33) - (a03 * a32)))) + (a31 * ((a02 * a23) - (a03 * a22))))
        out[3] = ((a01 * ((a12 * a33) - (a13 * a32))) - (a11 * ((a02 * a33) - (a03 * a32)))) + (a31 * ((a02 * a13) - (a03 * a12)))
        out[4] = -(((a01 * ((a12 * a23) - (a13 * a22))) - (a11 * ((a02 * a23) - (a03 * a22)))) + (a21 * ((a02 * a13) - (a03 * a12))))
        out[5] = -(((a10 * ((a22 * a33) - (a23 * a32))) - (a20 * ((a12 * a33) - (a13 * a32)))) + (a30 * ((a12 * a23) - (a13 * a22))))
        out[6] = ((a00 * ((a22 * a33) - (a23 * a32))) - (a20 * ((a02 * a33) - (a03 * a32)))) + (a30 * ((a02 * a23) - (a03 * a22)))
        out[7] = -(((a00 * ((a12 * a33) - (a13 * a32))) - (a10 * ((a02 * a33) - (a03 * a32)))) + (a30 * ((a02 * a13) - (a03 * a12))))
        out[8] = ((a00 * ((a12 * a23) - (a13 * a22))) - (a10 * ((a02 * a23) - (a03 * a22)))) + (a20 * ((a02 * a13) - (a03 * a12)))
        out[9] = ((a10 * ((a21 * a33) - (a23 * a31))) - (a20 * ((a11 * a33) - (a13 * a31)))) + (a30 * ((a11 * a23) - (a13 * a21)))
        out[10] = -(((a00 * ((a21 * a33) - (a23 * a31))) - (a20 * ((a01 * a33) - (a03 * a31)))) + (a30 * ((a01 * a23) - (a03 * a21))))
        out[11] = ((a00 * ((a11 * a33) - (a13 * a31))) - (a10 * ((a01 * a33) - (a03 * a31)))) + (a30 * ((a01 * a13) - (a03 * a11)))
        out[12] = -(((a00 * ((a11 * a23) - (a13 * a21))) - (a10 * ((a01 * a23) - (a03 * a21)))) + (a20 * ((a01 * a13) - (a03 * a11))))
        out[13] = -(((a10 * ((a21 * a32) - (a22 * a31))) - (a20 * ((a11 * a32) - (a12 * a31)))) + (a30 * ((a11 * a22) - (a12 * a21))))
        out[14] = ((a00 * ((a21 * a32) - (a22 * a31))) - (a20 * ((a01 * a32) - (a02 * a31)))) + (a30 * ((a01 * a22) - (a02 * a21)))
        out[15] = -(((a00 * ((a11 * a32) - (a12 * a31))) - (a10 * ((a01 * a32) - (a02 * a31)))) + (a30 * ((a01 * a12) - (a02 * a11))))
        out[16] = ((a00 * ((a11 * a22) - (a12 * a21))) - (a10 * ((a01 * a22) - (a02 * a21)))) + (a20 * ((a01 * a12) - (a02 * a11)))
        return out
    end
    function Mat4.compmul(out, a, b)
        out[1] = a[1] * b[1]
        out[2] = a[2] * b[2]
        out[3] = a[3] * b[3]
        out[4] = a[4] * b[4]
        out[5] = a[5] * b[5]
        out[6] = a[6] * b[6]
        out[7] = a[7] * b[7]
        out[8] = a[8] * b[8]
        out[9] = a[9] * b[9]
        out[10] = a[10] * b[10]
        out[11] = a[11] * b[11]
        out[12] = a[12] * b[12]
        out[13] = a[13] * b[13]
        out[14] = a[14] * b[14]
        out[15] = a[15] * b[15]
        out[16] = a[16] * b[16]
        return out
    end
    function Mat4.copy(out, a)
        out[1] = a[1]
        out[2] = a[2]
        out[3] = a[3]
        out[4] = a[4]
        out[5] = a[5]
        out[6] = a[6]
        out[7] = a[7]
        out[8] = a[8]
        out[9] = a[9]
        out[10] = a[10]
        out[11] = a[11]
        out[12] = a[12]
        out[13] = a[13]
        out[14] = a[14]
        out[15] = a[15]
        out[16] = a[16]
        return out
    end
    function Mat4.det(a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a03 = a[4]
        local a10 = a[5]
        local a11 = a[6]
        local a12 = a[7]
        local a13 = a[8]
        local a20 = a[9]
        local a21 = a[10]
        local a22 = a[11]
        local a23 = a[12]
        local a30 = a[13]
        local a31 = a[14]
        local a32 = a[15]
        local a33 = a[16]
        local b00 = (a00 * a11) - (a01 * a10)
        local b01 = (a00 * a12) - (a02 * a10)
        local b02 = (a00 * a13) - (a03 * a10)
        local b03 = (a01 * a12) - (a02 * a11)
        local b04 = (a01 * a13) - (a03 * a11)
        local b05 = (a02 * a13) - (a03 * a12)
        local b06 = (a20 * a31) - (a21 * a30)
        local b07 = (a20 * a32) - (a22 * a30)
        local b08 = (a20 * a33) - (a23 * a30)
        local b09 = (a21 * a32) - (a22 * a31)
        local b10 = (a21 * a33) - (a23 * a31)
        local b11 = (a22 * a33) - (a23 * a32)
        return (((((b00 * b11) - (b01 * b10)) + (b02 * b09)) + (b03 * b08)) - (b04 * b07)) + (b05 * b06)
    end
    function Mat4.frustum(out, L, R, B, T, N, F)
        local rl = 1 / (R - L)
        local tb = 1 / (T - B)
        local nf = 1 / (N - F)
        out[1] = (2 * N) * rl
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = (2 * N) * tb
        out[7] = 0
        out[8] = 0
        out[9] = (R + L) * rl
        out[10] = (T + B) * tb
        out[11] = (F + N) * nf
        out[12] = -1
        out[13] = 0
        out[14] = 0
        out[15] = ((2 * N) * F) * nf
        out[16] = 0
        return out
    end
    function Mat4.identity(out)
        if type(out) == "nil" then
            return {1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1}
        end
        out[1] = 1
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = 1
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = 0
        out[11] = 1
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = 0
        out[16] = 1
        return out
    end
    function Mat4.invert(out, a)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a03 = a[4]
        local a10 = a[5]
        local a11 = a[6]
        local a12 = a[7]
        local a13 = a[8]
        local a20 = a[9]
        local a21 = a[10]
        local a22 = a[11]
        local a23 = a[12]
        local a30 = a[13]
        local a31 = a[14]
        local a32 = a[15]
        local a33 = a[16]
        local b00 = (a00 * a11) - (a01 * a10)
        local b01 = (a00 * a12) - (a02 * a10)
        local b02 = (a00 * a13) - (a03 * a10)
        local b03 = (a01 * a12) - (a02 * a11)
        local b04 = (a01 * a13) - (a03 * a11)
        local b05 = (a02 * a13) - (a03 * a12)
        local b06 = (a20 * a31) - (a21 * a30)
        local b07 = (a20 * a32) - (a22 * a30)
        local b08 = (a20 * a33) - (a23 * a30)
        local b09 = (a21 * a32) - (a22 * a31)
        local b10 = (a21 * a33) - (a23 * a31)
        local b11 = (a22 * a33) - (a23 * a32)
        local det = (((((b00 * b11) - (b01 * b10)) + (b02 * b09)) + (b03 * b08)) - (b04 * b07)) + (b05 * b06)
        if det == 0 then
            error(
                __TS__New(Error, "Cannot invert mat4"),
                0
            )
        end
        det = 1 / det
        out[1] = (((a11 * b11) - (a12 * b10)) + (a13 * b09)) * det
        out[2] = (((a02 * b10) - (a01 * b11)) - (a03 * b09)) * det
        out[3] = (((a31 * b05) - (a32 * b04)) + (a33 * b03)) * det
        out[4] = (((a22 * b04) - (a21 * b05)) - (a23 * b03)) * det
        out[5] = (((a12 * b08) - (a10 * b11)) - (a13 * b07)) * det
        out[6] = (((a00 * b11) - (a02 * b08)) + (a03 * b07)) * det
        out[7] = (((a32 * b02) - (a30 * b05)) - (a33 * b01)) * det
        out[8] = (((a20 * b05) - (a22 * b02)) + (a23 * b01)) * det
        out[9] = (((a10 * b10) - (a11 * b08)) + (a13 * b06)) * det
        out[10] = (((a01 * b08) - (a00 * b10)) - (a03 * b06)) * det
        out[11] = (((a30 * b04) - (a31 * b02)) + (a33 * b00)) * det
        out[12] = (((a21 * b02) - (a20 * b04)) - (a23 * b00)) * det
        out[13] = (((a11 * b07) - (a10 * b09)) - (a12 * b06)) * det
        out[14] = (((a00 * b09) - (a01 * b07)) + (a02 * b06)) * det
        out[15] = (((a31 * b01) - (a30 * b03)) - (a32 * b00)) * det
        out[16] = (((a20 * b03) - (a21 * b01)) + (a22 * b00)) * det
        return out
    end
    function Mat4.lookat(out, eye, position, up)
        local ex = eye[1]
        local ey = eye[2]
        local ez = eye[3]
        local ux = up[1]
        local uy = up[2]
        local uz = up[3]
        local px = position[1]
        local py = position[2]
        local pz = position[3]
        local z0 = ex - px
        local z1 = ey - py
        local z2 = ez - pz
        if ((z0 == 0) and (z1 == 0)) and (z2 == 0) then
            return Mat4.identity(out)
        end
        local len = 1 / math.sqrt(((z0 * z0) + (z1 * z1)) + (z2 * z2))
        z0 = z0 * len
        z1 = z1 * len
        z2 = z2 * len
        local x0 = (uy * z2) - (uz * z1)
        local x1 = (uz * z0) - (ux * z2)
        local x2 = (ux * z1) - (uy * z0)
        len = math.sqrt(((x0 * x0) + (x1 * x1)) + (x2 * x2))
        if len == 0 then
            x0 = 0
            x1 = 0
            x2 = 0
        else
            len = 1 / len
            x0 = x0 * len
            x1 = x1 * len
            x2 = x2 * len
        end
        local y0 = (z1 * x2) - (z2 * x1)
        local y1 = (z2 * x0) - (z0 * x2)
        local y2 = (z0 * x1) - (z1 * x0)
        len = math.sqrt(((y0 * y0) + (y1 * y1)) + (y2 * y2))
        if len == 0 then
            y0 = 0
            y1 = 0
            y2 = 0
        else
            len = 1 / len
            y0 = y0 * len
            y1 = y1 * len
            y2 = y2 * len
        end
        out[1] = x0
        out[2] = y0
        out[3] = z0
        out[4] = 0
        out[5] = x1
        out[6] = y1
        out[7] = z1
        out[8] = 0
        out[9] = x2
        out[10] = y2
        out[11] = z2
        out[12] = 0
        out[13] = -(((x0 * ex) + (x1 * ey)) + (x2 * ez))
        out[14] = -(((y0 * ex) + (y1 * ey)) + (y2 * ez))
        out[15] = -(((z0 * ex) + (z1 * ey)) + (z2 * ez))
        out[16] = 1
        return out
    end
    function Mat4.mul(out, a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a03 = a[4]
        local a10 = a[5]
        local a11 = a[6]
        local a12 = a[7]
        local a13 = a[8]
        local a20 = a[9]
        local a21 = a[10]
        local a22 = a[11]
        local a23 = a[12]
        local a30 = a[13]
        local a31 = a[14]
        local a32 = a[15]
        local a33 = a[16]
        local b0
        local b1
        local b2
        local b3
        b0 = b[1]
        b1 = b[2]
        b2 = b[3]
        b3 = b[4]
        out[1] = (((b0 * a00) + (b1 * a10)) + (b2 * a20)) + (b3 * a30)
        out[2] = (((b0 * a01) + (b1 * a11)) + (b2 * a21)) + (b3 * a31)
        out[3] = (((b0 * a02) + (b1 * a12)) + (b2 * a22)) + (b3 * a32)
        out[4] = (((b0 * a03) + (b1 * a13)) + (b2 * a23)) + (b3 * a33)
        b0 = b[5]
        b1 = b[6]
        b2 = b[7]
        b3 = b[8]
        out[5] = (((b0 * a00) + (b1 * a10)) + (b2 * a20)) + (b3 * a30)
        out[6] = (((b0 * a01) + (b1 * a11)) + (b2 * a21)) + (b3 * a31)
        out[7] = (((b0 * a02) + (b1 * a12)) + (b2 * a22)) + (b3 * a32)
        out[8] = (((b0 * a03) + (b1 * a13)) + (b2 * a23)) + (b3 * a33)
        b0 = b[9]
        b1 = b[10]
        b2 = b[11]
        b3 = b[12]
        out[9] = (((b0 * a00) + (b1 * a10)) + (b2 * a20)) + (b3 * a30)
        out[10] = (((b0 * a01) + (b1 * a11)) + (b2 * a21)) + (b3 * a31)
        out[11] = (((b0 * a02) + (b1 * a12)) + (b2 * a22)) + (b3 * a32)
        out[12] = (((b0 * a03) + (b1 * a13)) + (b2 * a23)) + (b3 * a33)
        b0 = b[13]
        b1 = b[14]
        b2 = b[15]
        b3 = b[16]
        out[13] = (((b0 * a00) + (b1 * a10)) + (b2 * a20)) + (b3 * a30)
        out[14] = (((b0 * a01) + (b1 * a11)) + (b2 * a21)) + (b3 * a31)
        out[15] = (((b0 * a02) + (b1 * a12)) + (b2 * a22)) + (b3 * a32)
        out[16] = (((b0 * a03) + (b1 * a13)) + (b2 * a23)) + (b3 * a33)
        return out
    end
    function Mat4.orthogonal(out, W, H, N, F)
        local nf = 1 / (N - F)
        out[1] = 2 / W
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = 2 / H
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = 0
        out[11] = 2 * nf
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = (N + F) * nf
        out[16] = 1
        return out
    end
    function Mat4.perspective(out, fov, W, H, N, F)
        local f = 1 / math.tan(fov * 0.5)
        local nf = 1 / (N - F)
        out[1] = f
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = (f * W) / H
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = 0
        out[11] = (F + N) * nf
        out[12] = -1
        out[13] = 0
        out[14] = 0
        out[15] = ((2 * F) * N) * nf
        out[16] = 0
        return out
    end
    function Mat4.quat(out, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local ax2 = ax + ax
        local ay2 = ay + ay
        local az2 = az + az
        local axx = ax * ax2
        local ayx = ay * ax2
        local ayy = ay * ay2
        local azx = az * ax2
        local azy = az * ay2
        local azz = az * az2
        local awx = aw * ax2
        local awy = aw * ay2
        local awz = aw * az2
        out[1] = (1 - ayy) - azz
        out[2] = ayx + awz
        out[3] = azx - awy
        out[4] = 0
        out[5] = ayx - awz
        out[6] = (1 - axx) - azz
        out[7] = azy + awx
        out[8] = 0
        out[9] = azx + awy
        out[10] = azy - awx
        out[11] = (1 - axx) - ayy
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = 0
        out[16] = 1
        return out
    end
    function Mat4.rotate(out, a, axis, ang)
        local x = axis[1]
        local y = axis[2]
        local z = axis[3]
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a03 = a[4]
        local a10 = a[5]
        local a11 = a[6]
        local a12 = a[7]
        local a13 = a[8]
        local a20 = a[9]
        local a21 = a[10]
        local a22 = a[11]
        local a23 = a[12]
        local s = math.sin(ang)
        local c = math.cos(ang)
        local t = 1 - c
        local b00 = ((x * x) * t) + c
        local b01 = ((y * x) * t) + (z * s)
        local b02 = ((z * x) * t) - (y * s)
        local b10 = ((x * y) * t) - (z * s)
        local b11 = ((y * y) * t) + c
        local b12 = ((z * y) * t) + (x * s)
        local b20 = ((x * z) * t) + (y * s)
        local b21 = ((y * z) * t) - (x * s)
        local b22 = ((z * z) * t) + c
        out[1] = ((a00 * b00) + (a10 * b01)) + (a20 * b02)
        out[2] = ((a01 * b00) + (a11 * b01)) + (a21 * b02)
        out[3] = ((a02 * b00) + (a12 * b01)) + (a22 * b02)
        out[4] = ((a03 * b00) + (a13 * b01)) + (a23 * b02)
        out[5] = ((a00 * b10) + (a10 * b11)) + (a20 * b12)
        out[6] = ((a01 * b10) + (a11 * b11)) + (a21 * b12)
        out[7] = ((a02 * b10) + (a12 * b11)) + (a22 * b12)
        out[8] = ((a03 * b10) + (a13 * b11)) + (a23 * b12)
        out[9] = ((a00 * b20) + (a10 * b21)) + (a20 * b22)
        out[10] = ((a01 * b20) + (a11 * b21)) + (a21 * b22)
        out[11] = ((a02 * b20) + (a12 * b21)) + (a22 * b22)
        out[12] = ((a03 * b20) + (a13 * b21)) + (a23 * b22)
        if out ~= a then
            out[13] = a[13]
            out[14] = a[14]
            out[15] = a[15]
            out[16] = a[16]
        end
        return out
    end
    function Mat4.rotation(out, axis, ang)
        local x = axis[1]
        local y = axis[2]
        local z = axis[3]
        local s = math.sin(ang)
        local c = math.cos(ang)
        local t = 1 - c
        out[1] = ((x * x) * t) + c
        out[2] = ((y * x) * t) + (z * s)
        out[3] = ((z * x) * t) - (y * s)
        out[4] = 0
        out[5] = ((x * y) * t) - (z * s)
        out[6] = ((y * y) * t) + c
        out[7] = ((z * y) * t) + (x * s)
        out[8] = 0
        out[9] = ((x * z) * t) + (y * s)
        out[10] = ((y * z) * t) - (x * s)
        out[11] = ((z * z) * t) + c
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = 0
        out[16] = 1
        return out
    end
    function Mat4.rot_trans(a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local ax2 = ax + ax
        local ay2 = ay + ay
        local az2 = az + az
        local axx = ax * ax2
        local axy = ax * ay2
        local axz = ax * az2
        local ayy = ay * ay2
        local ayz = ay * az2
        local azz = az * az2
        local awx = aw * ax2
        local awy = aw * ay2
        local awz = aw * az2
        return {(1 - ayy) - azz, axy + awz, axz - awy, 0, axy - awz, (1 - axx) - azz, ayz + awx, 0, axz + awy, ayz - awx, (1 - axx) - ayy, 0, b[1], b[2], b[3], 1}
    end
    function Mat4.rottransorigin(out, a, b, origin)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local ax2 = ax + ax
        local ay2 = ay + ay
        local az2 = az + az
        local axx = ax * ax2
        local axy = ax * ay2
        local axz = ax * az2
        local ayy = ay * ay2
        local ayz = ay * az2
        local azz = az * az2
        local awx = aw * ax2
        local awy = aw * ay2
        local awz = aw * az2
        local ox = origin[1]
        local oy = origin[2]
        local oz = origin[3]
        out[1] = (1 - ayy) - azz
        out[2] = axy + awz
        out[3] = axz - awy
        out[4] = 0
        out[5] = axy - awz
        out[6] = (1 - axx) - azz
        out[7] = ayz + awx
        out[8] = 0
        out[9] = axz + awy
        out[10] = ayz - awx
        out[11] = (1 - axx) - ayy
        out[12] = 0
        out[13] = (b[1] + ox) - (((out[1] * ox) + (out[5] * oy)) + (out[9] * oz))
        out[14] = (b[2] + oy) - (((out[2] * ox) + (out[6] * oy)) + (out[10] * oz))
        out[15] = (b[3] + oz) - (((out[3] * ox) + (out[7] * oy)) + (out[11] * oz))
        out[16] = 1
        return out
    end
    function Mat4.scale(out, a, b)
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        out[1] = a[1] * bx
        out[2] = a[2] * bx
        out[3] = a[3] * bx
        out[4] = a[4] * bx
        out[5] = a[5] * by
        out[6] = a[6] * by
        out[7] = a[7] * by
        out[8] = a[8] * by
        out[9] = a[9] * bz
        out[10] = a[10] * bz
        out[11] = a[11] * bz
        out[12] = a[12] * bz
        out[13] = a[13]
        out[14] = a[14]
        out[15] = a[15]
        out[16] = a[16]
        return out
    end
    function Mat4.scaling(out, a)
        out[1] = a[1]
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = a[2]
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = 0
        out[11] = a[3]
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = 0
        out[16] = 1
        return out
    end
    function Mat4.sub(out, a, b)
        out[1] = a[1] - b[1]
        out[2] = a[2] - b[2]
        out[3] = a[3] - b[3]
        out[4] = a[4] - b[4]
        out[5] = a[5] - b[5]
        out[6] = a[6] - b[6]
        out[7] = a[7] - b[7]
        out[8] = a[8] - b[8]
        out[9] = a[9] - b[9]
        out[10] = a[10] - b[10]
        out[11] = a[11] - b[11]
        out[12] = a[12] - b[12]
        out[13] = a[13] - b[13]
        out[14] = a[14] - b[14]
        out[15] = a[15] - b[15]
        out[16] = a[16] - b[16]
        return out
    end
    function Mat4.translate(out, a, b)
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        if out == a then
            out[13] = (((a[1] * bx) + (a[5] * by)) + (a[9] * bz)) + a[13]
            out[14] = (((a[2] * bx) + (a[6] * by)) + (a[10] * bz)) + a[14]
            out[15] = (((a[3] * bx) + (a[7] * by)) + (a[11] * bz)) + a[15]
            out[16] = (((a[4] * bx) + (a[8] * by)) + (a[12] * bz)) + a[16]
        else
            local a00 = a[1]
            local a01 = a[2]
            local a02 = a[3]
            local a03 = a[4]
            local a10 = a[5]
            local a11 = a[6]
            local a12 = a[7]
            local a13 = a[8]
            local a20 = a[9]
            local a21 = a[10]
            local a22 = a[11]
            local a23 = a[12]
            out[1] = a00
            out[2] = a01
            out[3] = a02
            out[4] = a03
            out[5] = a10
            out[6] = a11
            out[7] = a12
            out[8] = a13
            out[9] = a20
            out[10] = a21
            out[11] = a22
            out[12] = a23
            out[13] = (((a00 * bx) + (a10 * by)) + (a20 * bz)) + a[13]
            out[14] = (((a01 * bx) + (a11 * by)) + (a21 * bz)) + a[14]
            out[15] = (((a02 * bx) + (a12 * by)) + (a22 * bz)) + a[15]
            out[16] = (((a03 * bx) + (a13 * by)) + (a23 * bz)) + a[16]
        end
        return out
    end
    function Mat4.translation(out, a)
        out[1] = 1
        out[2] = 0
        out[3] = 0
        out[4] = 0
        out[5] = 0
        out[6] = 1
        out[7] = 0
        out[8] = 0
        out[9] = 0
        out[10] = 0
        out[11] = 1
        out[12] = 0
        out[13] = a[1]
        out[14] = a[2]
        out[15] = a[3]
        out[16] = 1
        return out
    end
    function Mat4.transpose(out, a)
        if out == a then
            local a01 = a[2]
            local a02 = a[3]
            local a03 = a[4]
            local a12 = a[7]
            local a13 = a[8]
            local a23 = a[12]
            out[2] = a[5]
            out[3] = a[9]
            out[4] = a[13]
            out[5] = a01
            out[7] = a[10]
            out[8] = a[14]
            out[9] = a02
            out[10] = a12
            out[12] = a[15]
            out[13] = a03
            out[14] = a13
            out[15] = a23
        else
            out[1] = a[1]
            out[2] = a[5]
            out[3] = a[9]
            out[4] = a[13]
            out[5] = a[2]
            out[6] = a[6]
            out[7] = a[10]
            out[8] = a[14]
            out[9] = a[3]
            out[10] = a[7]
            out[11] = a[11]
            out[12] = a[15]
            out[13] = a[4]
            out[14] = a[8]
            out[15] = a[12]
            out[16] = a[16]
        end
        return out
    end
end
return ____exports
end,
["Entry.LuaGame"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____Game_2EInit = require("Game.Init")
local renderer = ____Game_2EInit.renderer
local ____Lib_2ESDL = require("Lib.SDL")
local sdl = ____Lib_2ESDL.sdl
local SDL = ____Lib_2ESDL.SDL
local ____Util_2EFFI = require("Util.FFI")
local ffi = ____Util_2EFFI.ffi
local Refs = ____Util_2EFFI.Refs
local ____Util_2EGraphics2D = require("Util.Graphics2D")
local Graphics2D = ____Util_2EGraphics2D.Graphics2D
local ____Util_2EScripting = require("Util.Scripting")
local Scripting = ____Util_2EScripting.Scripting
local frames = 0
local sheets = Graphics2D.load_sheets(renderer, {["seagull.bmp"] = {sprites = {{x = 0, y = 0, w = 24, h = 24}, {x = 24, y = 0, w = 24, h = 24}, {x = 48, y = 0, w = 24, h = 24}, {x = 72, y = 0, w = 24, h = 24}}, animations = {fly = {0, 2, 1, 2}}}, ["player.bmp"] = {sprites = {{x = 0, y = 0, w = 27, h = 48}}}, ["feather.bmp"] = {sprites = {{x = 0, y = 0, w = 8, h = 4}, {x = 8, y = 0, w = 8, h = 4}, {x = 16, y = 0, w = 8, h = 4}}, animations = {float = {0, 0, 0, 1, 2, 2, 2, 1}}}, ["snowball.bmp"] = {sprites = {{x = 0, y = 0, w = 16, h = 16}}}, ["snow_particle.bmp"] = {sprites = {{x = 0, y = 0, w = 5, h = 5}}}, ["background.bmp"] = {sprites = {{x = 0, y = 0, w = 800, h = 600}}}})
local settings = {controls = {left = SDL.SDL_SCANCODE_LEFT, right = SDL.SDL_SCANCODE_RIGHT, fire = SDL.SDL_SCANCODE_SPACE}}
local player_stats = {speed = 0.25}
local player = {input = {left = 0, right = 0, fire = 0}, position = {x = 400, y = 300}, last_fire_time = 0, jump_velocity = nil}
local count = 5
local positions = {}
do
    local i = 0
    while i < count do
        positions[i + 1] = {
            x = math.random() * 800,
            y = math.random() * 600
        }
        i = i + 1
    end
end
local event = ffi.new("SDL_Event")
local time = sdl.SDL_GetTicks()
local start_time = time
local mouse_position = {x = 0, y = 0}
while true do
    local next_time = sdl.SDL_GetTicks()
    local delta_time = next_time - time
    time = sdl.SDL_GetTicks()
    while sdl.SDL_PollEvent(event) > 0 do
        local ____switch5 = event.type
        if ____switch5 == SDL.SDL_KEYDOWN then
            goto ____switch5_case_0
        elseif ____switch5 == SDL.SDL_KEYUP then
            goto ____switch5_case_1
        elseif ____switch5 == SDL.SDL_MOUSEMOTION then
            goto ____switch5_case_2
        end
        goto ____switch5_case_default
        ::____switch5_case_0::
        do
            do
                __TS__ArrayForEach(
                    Scripting.get_keys(settings.controls),
                    function(____, key)
                        if event.key.keysym.mod ~= settings.controls[key] then
                            return
                        end
                        player.input[key] = time
                    end
                )
                goto ____switch5_end
            end
        end
        ::____switch5_case_1::
        do
            __TS__ArrayForEach(
                Scripting.get_keys(settings.controls),
                function(____, key)
                    if event.key.keysym.mod ~= settings.controls[key] then
                        return
                    end
                    player.input[key] = 0
                end
            )
            goto ____switch5_end
        end
        ::____switch5_case_2::
        do
            do
                local refs = Refs.create({x = "int", y = "int"})
                local button_state = SDL.SDL_GetMouseState(refs)
                mouse_position = Refs.result(refs)
                goto ____switch5_end
            end
        end
        ::____switch5_case_default::
        do
            goto ____switch5_end
        end
        ::____switch5_end::
    end
    sdl.SDL_RenderClear(renderer)
    sdl.SDL_RenderCopy(renderer, sheets["background.bmp"].texture, nil, nil)
    do
        local function sign(value)
            if value == 0 then
                return 0
            end
            return value / math.abs(value)
        end
        local direction = sign(player.input.right - player.input.left)
        local ____obj, ____index = player.position, "x"
        ____obj[____index] = ____obj[____index] + ((direction * delta_time) * player_stats.speed)
    end
    do
        local i = 0
        while i < count do
            Graphics2D.draw_sprite(
                renderer,
                __TS__ObjectAssign(
                    {},
                    Graphics2D.loop_animation({time = time, sheet = sheets["seagull.bmp"], animation = "fly"}),
                    {position = positions[i + 1]}
                )
            )
            i = i + 1
        end
    end
    Graphics2D.draw_sprite(
        renderer,
        __TS__ObjectAssign(
            {},
            Graphics2D.loop_animation({time = time, sheet = sheets["feather.bmp"], animation = "float"}),
            {position = mouse_position}
        )
    )
    Graphics2D.draw_sprite(renderer, {sheet = sheets["player.bmp"], sprite = 0, position = player.position})
    sdl.SDL_RenderPresent(renderer)
    frames = frames + 1
end
return ____exports
end,
["Entry.NeuralTraining"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Lib_2ESDL = require("Lib.SDL")
local sdl = ____Lib_2ESDL.sdl
local ____Game_2EInit = require("Game.Init")
local renderer = ____Game_2EInit.renderer
local ____Util_2EFFI = require("Util.FFI")
local ffi = ____Util_2EFFI.ffi
function ____exports.set_pixel_easy(renderer, x, y, r, g, b)
    sdl.SDL_SetRenderDrawColor(renderer, r, g, b, 255)
    sdl.SDL_RenderDrawPoint(renderer, x, y)
end
ffi.load("tensorflow")
local dimension = 16
local colors = 3
local pixels = {}
do
    local y = 0
    while y < dimension do
        do
            local x = 0
            while x < dimension do
                local index = (x + (y * dimension)) * colors
                local distance_from_centre = math.sqrt(
                    math.pow(x - (dimension / 2), 2) + math.pow(y - (dimension / 2), 2)
                )
                if distance_from_centre > (dimension / 2) then
                    pixels[(index + 0) + 1] = 0
                    pixels[(index + 1) + 1] = 0
                    pixels[(index + 2) + 1] = 0
                else
                    pixels[(index + 0) + 1] = 255
                    pixels[(index + 1) + 1] = 255
                    pixels[(index + 2) + 1] = 255
                end
                x = x + 1
            end
        end
        y = y + 1
    end
end
sdl.SDL_RenderClear(renderer)
do
    local y = 0
    while y < dimension do
        do
            local x = 0
            while x < dimension do
                local index = (x + (y * dimension)) * colors
                ____exports.set_pixel_easy(renderer, x, y, pixels[(index + 0) + 1], pixels[(index + 1) + 1], pixels[(index + 2) + 1])
                x = x + 1
            end
        end
        y = y + 1
    end
end
sdl.SDL_RenderPresent(renderer)
sdl.SDL_Delay(3000)
return ____exports
end,
["Util.Neural"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local example = {{input_weights = {{offset = 0, weight = 1}}, child_weights = {{x = 0, y = 0, weight = 1}, {x = 0, y = 1, weight = 1}, {x = 1, y = 0, weight = 1}, {x = 1, y = 1, weight = 1}}}, {parent_weights = {{x = 0, y = 0, weight = 1}}, input_weights = {{offset = 0, weight = 1}}, child_weights = {{x = 0, y = 0, weight = 1}, {x = 0, y = 1, weight = -1}, {x = 1, y = 0, weight = -1}, {x = 1, y = 1, weight = 1}}}}
function ____exports.generate(network)
end
return ____exports
end,
["Util.Promise"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
end,
["Util.SmoothCurve"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.SmoothCurve = {}
local SmoothCurve = ____exports.SmoothCurve
do
    function SmoothCurve.sample(curve, time)
        local smooth_index = ((time - curve.x_range[1]) / (curve.x_range[2] - curve.x_range[1])) * (#curve.y_values - 1)
        local index = math.floor(smooth_index)
        local current = math.min(
            math.max(index, 0),
            #curve.y_values - 1
        )
        local next = math.min(
            math.max(index + 1, 0),
            #curve.y_values - 1
        )
        local lerp = smooth_index - index
        return (curve.y_values[current + 1] * (1 - lerp)) + (curve.y_values[next + 1] * lerp)
    end
end
return ____exports
end,
}
return require("Entry.LuaGame")
