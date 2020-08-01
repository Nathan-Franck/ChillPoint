
type Members<T> = "all-members" | keyof T | ReadonlyArray<keyof T>;

export type Model<T> = {
    listen: (members: Members<T>, callback: (state: T) => void) => void;
    respond: (members: Members<T>, response: (state: T) => Promise<Partial<T> | undefined> | Partial<T> | undefined) => void;
    state: Readonly<T>;
    submodel: <U extends keyof T>(member: U) => Model<T[U]>,
    refresh_all: () => void,
};

export namespace Model {
    export function create<T>(_state: Readonly<T>): Model<T> {

        const _listeners: {
            members: Members<T>,
            callback: (state: Readonly<T>) => void
        }[] = [];
        const _responders: {
            members: Members<T>,
            response: (state: Readonly<T>) => Promise<Partial<T> | undefined> | Partial<T> | undefined
        }[] = [];
        let _last_state: Readonly<T> | undefined = undefined;
        let _change_microtask: (() => void) | undefined = undefined;

        const trigger_microtask = () => {
            // 👀 Trigger all relevant responders/listeners
            if (_change_microtask == null) {
                _change_microtask = async () => {
                    while (_state != _last_state) {
                        const last_state = _last_state;
                        _last_state = _state;

                        // 🚥 Filter functions to determine which listeners should run
                        const member_changed = (member: keyof T) =>
                            last_state == null || _state[member] != last_state[member];
                        const any_member_changed = (listener: { members: Members<T> }) =>
                            listener.members == "all-members" ? true :
                                typeof listener.members != "object" ?
                                    member_changed(listener.members) :
                                    listener.members.some(member =>
                                        member_changed(member));


                        // 👂 Listeners that don't directly affect the state [most of the time]
                        await Promise.all(_listeners.
                            map(async listener => {
                                if (!any_member_changed(listener))
                                    return;
                                try {
                                    listener.callback(_state)
                                } catch (e) {
                                    console.error(e);
                                }
                            }));

                        // 🏃 Responders that directly write back to the state
                        await Promise.all(_responders.
                            map(async responder => {
                                if (!any_member_changed(responder))
                                    return;
                                try {
                                    const result = await responder.response(_state);
                                    _state = {
                                        ..._state,
                                        ...result,
                                    };
                                } catch (e) {
                                    console.error(e);
                                }
                            }, _state));

                    }
                    _change_microtask = undefined;
                }
            };
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
            submodel: <U extends keyof T>(member: U) => {
                const submodel = Model.create<T[U]>(_state[member]);
                submodel.listen("all-members", state => {
                    _state = {
                        ..._state,
                        [member]: state,
                    };
                    trigger_microtask();
                });
                _listeners.push({
                    members: member, callback: state => {
                        submodel.state = state[member];
                    }
                });
                return submodel;
            },
            refresh_all: () => {
                _last_state = undefined;
                trigger_microtask();
            }
        };
    }
}