export type Immutable<T> = Readonly<{
    [key in keyof T]: Immutable<T[key]>
}>

export class Model<T> {

    constructor(private _state: Immutable<T>) { }

    public listen(members: "all" | keyof T | ReadonlyArray<keyof T>, callback: (state: T) => void) {
        this._listeners.push({ members, callback });
    }

    public respond(members: keyof T | ReadonlyArray<keyof T>, response: (state: T) => Partial<T> | undefined) {
        this._responders.push({ members, response });
    }

    public get state(): Immutable<T> {
        return this._state;
    }

    public set state(value: Immutable<T>) {
        this._state = value;

        // 👀 Trigger all relevant responders/listeners
        if (this._changeMicrotask == null) {

            this._changeMicrotask = () => {
                while (this._state != this._lastState) {
                    const lastState = this._lastState;

                    // 🚥 Filter functions to determine which listeners should run
                    const memberChanged = (member: keyof T) =>
                        lastState == null || this._state[member] != lastState[member];
                    const anyMemberChanged = (listener: { members: "all" | keyof T | ReadonlyArray<keyof T> }) =>
                        listener.members == "all" ? true :
                            typeof listener.members == "object" ?
                                listener.members.some(member =>
                                    memberChanged(member)) :
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

    /** 🤵👰 Marry two models together forever 😻 */
    public submodel<U extends keyof T>(member: U) {
        const submodel = new Model<T[U]>(this.state[member]);
        submodel.listen("all", state => {
            this.state = {
                ...this.state,
                emotion: submodel.state,
            };
        });
        this.listen(member, state => {
            submodel.state = state[member];
        });
        return submodel;
    }

    _listeners: {
        members: "all" | keyof T | ReadonlyArray<keyof T>,
        callback: (state: Immutable<T>) => void
    }[] = [];
    _responders: {
        members: keyof T | ReadonlyArray<keyof T>,
        response: (state: Immutable<T>) => Partial<T> | undefined
    }[] = [];
    _lastState: Immutable<T> | undefined = undefined;
    _changeMicrotask: (() => void) | undefined = undefined;
}