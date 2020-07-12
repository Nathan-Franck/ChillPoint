export type Thingie = {};

export class Model<T> {
    _listeners: {
        members: keyof T | ReadonlyArray<keyof T>,
        callback: (state: T) => void
    }[] = [];
    _responders: {
        members: keyof T | ReadonlyArray<keyof T>,
        response: (state: T) => Partial<T> | undefined
    }[] = [];
    _lastState: T | undefined = undefined;
    _changeMicrotask: (() => void) | undefined = undefined;

    constructor(private _state: T) { }

    public set state(value: T) {
        this._state = value;

        if (this._changeMicrotask == null) {
            this._changeMicrotask = () => {
                while (this._state != this._lastState) {
                    const lastState = this._lastState;

                    // 🚥 Filter functions to determine which listeners should run
                    const memberChanged = (member: keyof T) =>
                        lastState == null || this._state[member] != lastState[member];
                    const anyMemberChanged = (listener: { members: keyof T | ReadonlyArray<keyof T> }) =>
                        typeof listener.members == "object" ?
                            listener.members.some(member => memberChanged(member)) :
                            memberChanged(listener.members);

                    this._lastState = this._state;
                    
                    // 👂 Listeners that don't directly affect the state [most of the time]
                    this._listeners.
                        filter(anyMemberChanged).
                        forEach(listener =>
                            listener.callback(this._state));
                    // 🏃 Responders that directly write back to the state
                    this._state = this._responders.
                        filter(anyMemberChanged).
                        reduce((state, responder) => ({
                            ...state,
                            ...responder.response(state)
                        }), this._state);
                }
                this._changeMicrotask = undefined;
            };
            queueMicrotask(this._changeMicrotask);
        }
    }

    public get state(): T {
        return this._state;
    }

    public listen(members: keyof T | ReadonlyArray<keyof T>, callback: (state: T) => void) {
        this._listeners.push({ members, callback });
    }

    public respond(members: keyof T | ReadonlyArray<keyof T>, response: (state: T) => Partial<T> | undefined) {
        this._responders.push({ members, response });
    }
}