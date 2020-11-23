
export namespace Model {
    export function create<T>(_state: Readonly<T>) {
        type Members = "all-members" | keyof T | ReadonlyArray<keyof T>;
        
        const _listeners: {
            members: Members,
            callback: (state: Readonly<T>) => void
        }[] = [];
        const _responders: {
            members: Members,
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
                        const any_member_changed = (listener: { members: Members }) =>
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
            listen: (members: Members, callback: (state: T) => void) => {
                _listeners.push({ members, callback });
            },
            respond: (members: Members, response: (state: T) => Promise<Partial<T> | undefined> | Partial<T> | undefined) => {
                _responders.push({ members, response });
            },
            get state(): Readonly<T> {
                return _state;
            },
            set state(value: Readonly<T>) {
                _state = value;
                trigger_microtask();
            },
            merge: (partial_state: Partial<T>) => {
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
        } as const;
    }
}