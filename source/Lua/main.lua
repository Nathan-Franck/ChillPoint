
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
["Lua.Util.FFI"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.ForeignFunction = {}
local ForeignFunction = ____exports.ForeignFunction
do
    local ffi = require(nil, "ffi")
    function ForeignFunction.load_library(self, args)
        ffi.cdef(args.simplified_header)
        return {
            types = ffi.load(args.file_name),
            values = args.values
        }
    end
end
return ____exports
end,
["Lua.Lib.SDL"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Util_2EFFI = require("Util.FFI")
local ForeignFunction = ____Util_2EFFI.ForeignFunction
local ____ = ForeignFunction:load_library(
    {
        file_name = "SDL2",
        simplified_header = "\n        int SDL_Init(int flags);\n        extern void* SDL_CreateWindow(const char *title, int x, int y, int w, int h, int flags);\n    ",
        types = {},
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
            SDL_WINDOWPOS_UNDEFINED = 536805376
        }
    }
)
____exports.sdl = ____.types
____exports.SDL = ____.values
return ____exports
end,
["Util.SmoothCurve"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.SmoothCurve = {}
local SmoothCurve = ____exports.SmoothCurve
do
    function SmoothCurve.sample(self, curve, time)
        local smooth_index = ((time - curve.x_range[1]) / (curve.x_range[2] - curve.x_range[1])) * (curve.y_values.length - 1)
        local index = Math:floor(smooth_index)
        local current = Math:min(
            Math:max(index, 0),
            curve.y_values.length - 1
        )
        local next = Math:min(
            Math:max(index + 1, 0),
            curve.y_values.length - 1
        )
        local lerp = smooth_index - index
        return (curve.y_values[current] * (1 - lerp)) + (curve.y_values[next] * lerp)
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
    function Num.abs(self, n)
        return ((n < 0) and -n) or n
    end
    function Num.clamp(self, n, min, max)
        return ((n < min) and min) or (((n > max) and max) or n)
    end
    function Num.lerp(self, a, b, t)
        return a + ((b - a) * t)
    end
    function Num.max(self, a, b)
        return ((a > b) and a) or b
    end
    function Num.min(self, a, b)
        return ((a > b) and b) or a
    end
    function Num.mod(self, a, b)
        return a % b
    end
    function Num.flatten_angle(self, angle, rate)
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
    function Vec2.len2(self, a)
        local ax = a[1]
        local ay = a[2]
        return (ax * ax) + (ay * ay)
    end
    function Vec2.sub(self, a, b)
        return {a[1] - b[1], a[2] - b[2]}
    end
    function Vec2.add(self, a, b)
        return {a[1] + b[1], a[2] + b[2]}
    end
    function Vec2.applymat2(self, a, b)
        local ax = a[1]
        local ay = a[2]
        return {(b[1] * ax) + (b[3] * ay), (b[2] * ax) + (b[4] * ay)}
    end
    function Vec2.applymat3x2(self, a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[3] * ay)) + b[5], ((b[2] * ax) + (b[4] * ay)) + b[6]}
    end
    function Vec2.applymat3(self, a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[4] * ay)) + b[7], ((b[2] * ax) + (b[5] * ay)) + b[8]}
    end
    function Vec2.applymat4(self, a, b)
        local ax = a[1]
        local ay = a[2]
        return {((b[1] * ax) + (b[5] * ay)) + b[13], ((b[2] * ax) + (b[6] * ay)) + b[14]}
    end
    function Vec2.clamp(self, a, min, max)
        return {
            ____exports.Num:clamp(a[1], min[1], max[1]),
            ____exports.Num:clamp(a[2], min[2], max[2])
        }
    end
    function Vec2.dist(self, a, b)
        return Math:sqrt(
            Vec2.len2(
                nil,
                Vec2.sub(nil, a, b)
            )
        )
    end
    function Vec2.dist2(self, a, b)
        return Vec2.len2(
            nil,
            Vec2.sub(nil, b, a)
        )
    end
    function Vec2.div(self, a, b)
        return {a[1] / b[1], a[2] / b[2]}
    end
    function Vec2.dot(self, a, b)
        return (a[1] * b[1]) + (a[2] * b[2])
    end
    function Vec2.inverse(self, a)
        return {1 / a[1], 1 / a[2]}
    end
    function Vec2.len(self, a)
        return Math:sqrt(
            Vec2.len2(nil, a)
        )
    end
    function Vec2.lerp(self, a, b, t)
        return {
            ____exports.Num:lerp(a[1], b[1], t),
            ____exports.Num:lerp(a[2], b[2], t)
        }
    end
    function Vec2.max(self, a, b)
        return {
            Math:max(a[1], b[1]),
            Math:max(a[2], b[2])
        }
    end
    function Vec2.min(self, a, b)
        return {
            Math:min(a[1], b[1]),
            Math:min(a[2], b[2])
        }
    end
    function Vec2.mul(self, a, b)
        return {a[1] * b[1], a[2] * b[2]}
    end
    function Vec2.neg(self, a)
        return {-a[1], -a[2]}
    end
    function Vec2.normal(self, a)
        local ax = a[1]
        local ay = a[2]
        local len = (ax * ax) + (ay * ay)
        if len > 0 then
            len = 1 / Math:sqrt(len)
            return {ax * len, ay * len}
        end
        return a
    end
    function Vec2.scale(self, a, s)
        return {a[1] * s, a[2] * s}
    end
end
____exports.Vec3 = {}
local Vec3 = ____exports.Vec3
do
    function Vec3.dot(self, a, b)
        return ((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])
    end
    function Vec3.len2(self, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return ((ax * ax) + (ay * ay)) + (az * az)
    end
    function Vec3.nangle(self, a, b)
        local c = Vec3.dot(nil, a, b)
        if (c < -1) or (c > 1) then
            return 0
        end
        return Math:acos(c)
    end
    function Vec3.normal(self, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local len = ((ax * ax) + (ay * ay)) + (az * az)
        if len > 0 then
            len = 1 / Math:sqrt(len)
            return {ax * len, ay * len, az * len}
        end
        return a
    end
    function Vec3.sub(self, a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3]}
    end
    function Vec3.add(self, a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3]}
    end
    function Vec3.angle(self, a, b)
        return Vec3.nangle(
            nil,
            Vec3.normal(nil, a),
            Vec3.normal(nil, b)
        )
    end
    function Vec3.applymat3x2(self, a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return {((ax * b[1]) + (ay * b[3])) + (az * b[5]), ((ax * b[2]) + (ay * b[4])) + (az * b[6]), az}
    end
    function Vec3.applymat3(self, a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        return {((ax * b[1]) + (ay * b[4])) + (az * b[7]), ((ax * b[2]) + (ay * b[5])) + (az * b[8]), ((ax * b[3]) + (ay * b[6])) + (az * b[9])}
    end
    function Vec3.apply_mat4(self, a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local w = (((b[4] * ax) + (b[8] * ay)) + (b[12] * az)) + b[16]
        if w == 0 then
            w = 1
        end
        return {((((b[1] * ax) + (b[5] * ay)) + (b[9] * az)) + b[13]) / w, ((((b[2] * ax) + (b[6] * ay)) + (b[10] * az)) + b[14]) / w, ((((b[3] * ax) + (b[7] * ay)) + (b[11] * az)) + b[15]) / w}
    end
    function Vec3.apply_quat(self, a, b)
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
    function Vec3.clamp(self, a, min, max)
        return {
            ____exports.Num:clamp(a[1], min[1], max[1]),
            ____exports.Num:clamp(a[2], min[2], max[2]),
            ____exports.Num:clamp(a[3], min[3], max[3])
        }
    end
    function Vec3.cross(self, a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local bx = b[1]
        local by = b[2]
        local bz = b[3]
        return {(ay * bz) - (az * by), (az * bx) - (ax * bz), (ax * by) - (ay * bx)}
    end
    function Vec3.dist(self, a, b)
        return Math:sqrt(
            Vec3.len2(
                nil,
                Vec3.sub(nil, a, b)
            )
        )
    end
    function Vec3.dist2(self, a, b)
        return Vec3.len2(
            nil,
            Vec3.sub(nil, b, a)
        )
    end
    function Vec3.div(self, a, b)
        return {a[1] / b[1], a[2] / b[2], a[3] / b[3]}
    end
    function Vec3.inverse(self, a)
        return {1 / a[1], 1 / a[2], 1 / a[3]}
    end
    function Vec3.len(self, a)
        return Math:sqrt(
            Vec3.len2(nil, a)
        )
    end
    function Vec3.lerp(self, a, b, t)
        return {
            ____exports.Num:lerp(a[1], b[1], t),
            ____exports.Num:lerp(a[2], b[2], t),
            ____exports.Num:lerp(a[3], b[3], t)
        }
    end
    function Vec3.max(self, a, b)
        return {
            Math:max(a[1], b[1]),
            Math:max(a[2], b[2]),
            Math:max(a[3], b[3])
        }
    end
    function Vec3.min(self, a, b)
        return {
            Math:min(a[1], b[1]),
            Math:min(a[2], b[2]),
            Math:min(a[3], b[3])
        }
    end
    function Vec3.mul(self, a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3]}
    end
    function Vec3.neg(self, a)
        return {-a[1], -a[2], -a[3]}
    end
    function Vec3.orthogonal(self, a, b)
        return Vec3.normal(
            nil,
            Vec3.cross(nil, a, b)
        )
    end
    function Vec3.scale(self, a, s)
        return {a[1] * s, a[2] * s, a[3] * s}
    end
end
____exports.Vec4 = {}
local Vec4 = ____exports.Vec4
do
    function Vec4.len2(self, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        return (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
    end
    function Vec4.sub(self, a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]}
    end
    function Vec4.add(self, a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4]}
    end
    function Vec4.applymat4(self, a, b)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        return {(((b[1] * ax) + (b[5] * ay)) + (b[9] * az)) + (b[13] * aw), (((b[2] * ax) + (b[6] * ay)) + (b[10] * az)) + (b[14] * aw), (((b[3] * ax) + (b[7] * ay)) + (b[11] * az)) + (b[15] * aw), (((b[4] * ax) + (b[8] * ay)) + (b[12] * az)) + (b[16] * aw)}
    end
    function Vec4.applyquat(self, a, b)
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
    function Vec4.clamp(self, a, min, max)
        return {
            ____exports.Num:clamp(a[1], min[1], max[1]),
            ____exports.Num:clamp(a[2], min[2], max[2]),
            ____exports.Num:clamp(a[3], min[3], max[3]),
            ____exports.Num:clamp(a[4], min[4], max[4])
        }
    end
    function Vec4.dist(self, a, b)
        return Math:sqrt(
            Vec4.len2(
                nil,
                Vec4.sub(nil, a, b)
            )
        )
    end
    function Vec4.dist2(self, a, b)
        return Vec4.len2(
            nil,
            Vec4.sub(nil, b, a)
        )
    end
    function Vec4.div(self, a, b)
        return {a[1] / b[1], a[2] / b[2], a[3] / b[3], a[4] / b[4]}
    end
    function Vec4.dot(self, a, b)
        return (((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])) + (a[4] * b[4])
    end
    function Vec4.inverse(self, a)
        return {1 / a[1], 1 / a[2], 1 / a[3], 1 / a[4]}
    end
    function Vec4.len(self, a)
        return Math:sqrt(
            Vec4.len2(nil, a)
        )
    end
    function Vec4.lerp(self, a, b, t)
        return {
            ____exports.Num:lerp(a[1], b[1], t),
            ____exports.Num:lerp(a[2], b[2], t),
            ____exports.Num:lerp(a[3], b[3], t),
            ____exports.Num:lerp(a[4], b[4], t)
        }
    end
    function Vec4.max(self, a, b)
        return {
            Math:max(a[1], b[1]),
            Math:max(a[2], b[2]),
            Math:max(a[3], b[3]),
            Math:max(a[4], b[4])
        }
    end
    function Vec4.min(self, a, b)
        return {
            Math:min(a[1], b[1]),
            Math:min(a[2], b[2]),
            Math:min(a[3], b[3]),
            Math:min(a[4], b[4])
        }
    end
    function Vec4.mul(self, a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4]}
    end
    function Vec4.neg(self, a)
        return {-a[1], -a[2], -a[3], -a[4]}
    end
    function Vec4.normal(self, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local len = (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
        if len > 0 then
            len = 1 / Math:sqrt(len)
            return {ax * len, ay * len, az * len, aw * len}
        end
        return a
    end
    function Vec4.scale(self, a, s)
        return {a[1] * s, a[2] * s, a[3] * s, a[4] * s}
    end
end
____exports.Quat = {}
local Quat = ____exports.Quat
do
    function Quat.naxisang(self, axis, ang)
        ang = ang * 0.5
        local s = Math:sin(ang)
        return {
            axis[1] * s,
            axis[2] * s,
            axis[3] * s,
            Math:cos(ang)
        }
    end
    function Quat.nbetween(self, from, to)
        local r = ____exports.Vec3:dot(from, to) + 1
        local cross
        if r < 0.000001 then
            if Math:abs(from[1]) > Math:abs(from[3]) then
                cross = {-from[2], from[1], 0}
            else
                cross = {0, -from[3], from[2]}
            end
        else
            cross = ____exports.Vec3:cross(from, to)
        end
        return Quat.normal(nil, {cross[0], cross[1], cross[2], r})
    end
    function Quat.normal(self, a)
        local ax = a[1]
        local ay = a[2]
        local az = a[3]
        local aw = a[4]
        local len = (((ax * ax) + (ay * ay)) + (az * az)) + (aw * aw)
        if len > 0 then
            len = 1 / Math:sqrt(len)
            return {ax * len, ay * len, az * len, aw * len}
        end
        return a
    end
    function Quat.axis_angle(self, axis, ang)
        return Quat.naxisang(
            nil,
            ____exports.Vec3:normal(axis),
            ang
        )
    end
    function Quat.between(self, from, to)
        return Quat.nbetween(
            nil,
            ____exports.Vec3:normal(from),
            ____exports.Vec3:normal(to)
        )
    end
    function Quat.dot(self, a, b)
        return (((a[1] * b[1]) + (a[2] * b[2])) + (a[3] * b[3])) + (a[4] * b[4])
    end
    function Quat.euler_xyz(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_xzy(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.euler_yxz(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) - ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.euler_yzx(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) + ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_zxy(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) + ((sx * sy) * cz), ((cx * cy) * cz) - ((sx * sy) * sz)}
    end
    function Quat.euler_zyx(self, rot)
        local a0 = rot[1] * 0.5
        local a1 = rot[2] * 0.5
        local a2 = rot[3] * 0.5
        local cx = Math:cos(a0)
        local cy = Math:cos(a1)
        local cz = Math:cos(a2)
        local sx = Math:sin(a0)
        local sy = Math:sin(a1)
        local sz = Math:sin(a2)
        return {((sx * cy) * cz) - ((cx * sy) * sz), ((cx * sy) * cz) + ((sx * cy) * sz), ((cx * cy) * sz) - ((sx * sy) * cz), ((cx * cy) * cz) + ((sx * sy) * sz)}
    end
    function Quat.identity(self)
        return {0, 0, 0, 1}
    end
    function Quat.invert(self, a)
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
    function Quat.lerp(self, a, b, t)
        return {
            ____exports.Num:lerp(a[1], b[1], t),
            ____exports.Num:lerp(a[2], b[2], t),
            ____exports.Num:lerp(a[3], b[3], t),
            ____exports.Num:lerp(a[4], b[4], t)
        }
    end
    function Quat.mul(self, a, b)
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
    function Quat.neg(self, a)
        return {-a[1], -a[2], -a[3], -a[4]}
    end
    function Quat.nlerp(self, a, b, t)
        return Quat.normal(
            nil,
            Quat.lerp(nil, a, b, t)
        )
    end
    function Quat.slerp(self, a, b, t)
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
            omega = Math:acos(cosom)
            sinom = Math:sin(omega)
            scale0 = Math:sin((1 - t) * omega) / sinom
            scale1 = Math:sin(t * omega) / sinom
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
    function Mat2.add(self, a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4]}
    end
    function Mat2.adjoint(self, a)
        return {a[4], -a[2], -a[3], a[1]}
    end
    function Mat2.compmul(self, a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4]}
    end
    function Mat2.det(self, a)
        return (a[1] * a[4]) - (a[3] * a[2])
    end
    function Mat2.identity(self)
        return {1, 0, 0, 1}
    end
    function Mat2.invert(self, a)
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
    function Mat2.mul(self, a, b)
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
    function Mat2.rotate(self, a, ang)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local s = Math:sin(ang)
        local c = Math:cos(ang)
        return {(a0 * c) + (a2 * s), (a1 * c) + (a3 * s), (a0 * -s) + (a2 * c), (a1 * -s) + (a3 * c)}
    end
    function Mat2.rotation(self, ang)
        local s = Math:sin(ang)
        local c = Math:cos(ang)
        return {c, s, -s, c}
    end
    function Mat2.scale(self, a, b)
        local a0 = a[1]
        local a1 = a[2]
        local a2 = a[3]
        local a3 = a[4]
        local b0 = b[1]
        local b1 = b[2]
        return {a0 * b0, a1 * b0, a2 * b1, a3 * b1}
    end
    function Mat2.scaling(self, a)
        return {a[1], 0, 0, a[2]}
    end
    function Mat2.sub(self, a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]}
    end
    function Mat2.transpose(self, a)
        return {a[1], a[3], a[2], a[4]}
    end
end
____exports.Mat3x2 = {}
local Mat3x2 = ____exports.Mat3x2
do
    function Mat3x2.add(self, a, b)
        return {a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5], a[6] + b[6]}
    end
    function Mat3x2.compmul(self, a, b)
        return {a[1] * b[1], a[2] * b[2], a[3] * b[3], a[4] * b[4], a[5] * b[5], a[6] * b[6]}
    end
    function Mat3x2.det(self, a)
        return (a[1] * a[4]) - (a[3] * a[2])
    end
    function Mat3x2.identity(self)
        return {1, 0, 0, 1, 0, 0}
    end
    function Mat3x2.invert(self, a)
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
    function Mat3x2.mul(self, a, b)
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
    function Mat3x2.rotate(self, a, ang)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local s = Math:sin(ang)
        local c = Math:cos(ang)
        return {(c * a00) + (s * a10), (c * a01) + (s * a11), (c * a10) - (s * a00), (c * a11) - (s * a01), a[5], a[6]}
    end
    function Mat3x2.rotation(self, ang)
        local s = Math:sin(ang)
        local c = Math:cos(ang)
        return {c, s, -s, c, 0, 0}
    end
    function Mat3x2.scale(self, a, b)
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
    function Mat3x2.scaling(self, a)
        if type(a) == "number" then
            return {a, 0, 0, a, 0, 0}
        end
        return {a[1], 0, 0, a[2], 0, 0}
    end
    function Mat3x2.sub(self, a, b)
        return {a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5], a[6] - b[6]}
    end
    function Mat3x2.translate(self, a, b)
        local a00 = a[1]
        local a01 = a[2]
        local a10 = a[3]
        local a11 = a[4]
        local bx = b[1]
        local by = b[2]
        return {a00, a01, a10, a11, ((bx * a00) + (by * a10)) + a[5], ((bx * a01) + (by * a11)) + a[6]}
    end
    function Mat3x2.translation(self, a)
        return {1, 0, 0, 1, a[1], a[2]}
    end
end
____exports.Mat3 = {}
local Mat3 = ____exports.Mat3
do
    function Mat3.add(self, out, a, b)
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
    function Mat3.adjoint(self, out, a)
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
    function Mat3.compmul(self, out, a, b)
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
    function Mat3.copy(self, out, a)
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
    function Mat3.det(self, a)
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
    function Mat3.identity(self, out)
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
    function Mat3.invert(self, out, a)
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
    function Mat3.mul(self, out, a, b)
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
    function Mat3.quat(self, out, a)
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
    function Mat3.rotate(self, out, a, ang)
        local a00 = a[1]
        local a01 = a[2]
        local a02 = a[3]
        local a10 = a[4]
        local a11 = a[5]
        local a12 = a[6]
        local a20 = a[7]
        local a21 = a[8]
        local a22 = a[9]
        local s = Math:sin(ang)
        local c = Math:cos(ang)
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
    function Mat3.rotation(self, out, ang)
        local s = Math:sin(ang)
        local c = Math:cos(ang)
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
    function Mat3.scale(self, out, a, b)
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
    function Mat3.scaling(self, out, a)
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
    function Mat3.sub(self, out, a, b)
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
    function Mat3.translate(self, out, a, b)
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
    function Mat3.translation(self, out, a)
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
    function Mat3.transpose(self, out, a)
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
    function Mat4.add(self, out, a, b)
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
    function Mat4.adjoint(self, out, a)
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
    function Mat4.compmul(self, out, a, b)
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
    function Mat4.copy(self, out, a)
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
    function Mat4.det(self, a)
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
    function Mat4.frustum(self, out, L, R, B, T, N, F)
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
    function Mat4.identity(self, out)
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
    function Mat4.invert(self, out, a)
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
    function Mat4.lookat(self, out, eye, position, up)
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
            return Mat4.identity(nil, out)
        end
        local len = 1 / Math:sqrt(((z0 * z0) + (z1 * z1)) + (z2 * z2))
        z0 = z0 * len
        z1 = z1 * len
        z2 = z2 * len
        local x0 = (uy * z2) - (uz * z1)
        local x1 = (uz * z0) - (ux * z2)
        local x2 = (ux * z1) - (uy * z0)
        len = Math:sqrt(((x0 * x0) + (x1 * x1)) + (x2 * x2))
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
        len = Math:sqrt(((y0 * y0) + (y1 * y1)) + (y2 * y2))
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
    function Mat4.mul(self, out, a, b)
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
    function Mat4.orthogonal(self, out, W, H, N, F)
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
    function Mat4.perspective(self, out, fov, W, H, N, F)
        local f = 1 / Math:tan(fov * 0.5)
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
    function Mat4.quat(self, out, a)
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
    function Mat4.rotate(self, out, a, axis, ang)
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
        local s = Math:sin(ang)
        local c = Math:cos(ang)
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
    function Mat4.rotation(self, out, axis, ang)
        local x = axis[1]
        local y = axis[2]
        local z = axis[3]
        local s = Math:sin(ang)
        local c = Math:cos(ang)
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
    function Mat4.rot_trans(self, a, b)
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
    function Mat4.rottransorigin(self, out, a, b, origin)
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
    function Mat4.scale(self, out, a, b)
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
    function Mat4.scaling(self, out, a)
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
    function Mat4.sub(self, out, a, b)
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
    function Mat4.translate(self, out, a, b)
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
    function Mat4.translation(self, out, a)
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
    function Mat4.transpose(self, out, a)
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
["Lua.Entry.LuaGame"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Lib_2ESDL = require("Lib.SDL")
local SDL = ____Lib_2ESDL.SDL
local sdl = ____Lib_2ESDL.sdl
local ____Util_2ESmoothCurve = require("../Util.SmoothCurve")
local SmoothCurve = ____Util_2ESmoothCurve.SmoothCurve
local ____Util_2EVecMath = require("../Util.VecMath")
local Vec2 = ____Util_2EVecMath.Vec2
local curve = {x_range = {0, 1}, y_values = {0, 1, 0}};
({1, 2, 3, 4, 5, 6, 7, 8, 9, 10}):map(
    function(____, val)
        print(
            nil,
            val / 10,
            SmoothCurve:sample(curve, val / 10)
        )
    end
)
local new_vec = Vec2:add({1, 2}, {3, 4})
print(nil, "Hey! HO!")
local screen_width = 640
local screen_height = 480
sdl.SDL_Init(SDL.SDL_INIT_VIDEO)
local window = sdl.SDL_CreateWindow("SDL Tutorial", SDL.SDL_WINDOWPOS_UNDEFINED, SDL.SDL_WINDOWPOS_UNDEFINED, screen_width, screen_height, SDL.SDL_WINDOW_SHOWN)
return ____exports
end,
}
return require("Lua.Entry.LuaGame")
