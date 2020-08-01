import { Model } from './Model';

export function modelTests() {

    type State = {
        greeting: string | undefined,
        expression: "sullen" | "ecstatic" | "mute",
        emotion: {
            tension: number,
            happiness: number,
        },
    };

    const initialState = {
        greeting: undefined,
        expression: "mute",
        emotion: {
            happiness: 0.5,
            tension: 0.5,
        },
    } as const

    type Test<T> = { name: string, expect: T, test: () => Promise<T> };

    const tests: Test<any>[] = [{
        name: 'model.listen ignore unchanged members',
        expect: "ecstatic",
        test: async () => {

            const model = Model.create<State>(initialState);

            // 🔨 Force model to consider itself unchanged
            model.state = model.state;
            await Promise.resolve();

            return await new Promise(resolve => {

                model.listen("greeting", state => {
                    resolve(state.greeting);
                });

                model.listen("expression", state => {
                    resolve(state.expression);
                });

                model.state = {
                    ...model.state,
                    expression: "ecstatic",
                };
            });
        },
    }, {
        name: 'model.listen',
        expect: "hello world",
        test: async () => {

            const model = Model.create<State>(initialState);

            return await new Promise(resolve => {

                model.listen("greeting", state => {
                    resolve(state.greeting);
                });

                model.state = {
                    ...model.state,
                    greeting: "hello world",
                };

            });
        },
    }, {
        name: 'model.respond',
        expect: "sullen",
        test: async () => {

            const model = Model.create<State>(initialState);

            const newState = await new Promise((resolve: (x: State) => void) => {

                model.respond("greeting", state => {
                    if (state.greeting == "what are you looking at?") {
                        return {
                            expression: "sullen",
                        };
                    }
                });

                model.listen("expression", state => {
                    if (state.expression == initialState.expression)
                        return;
                    resolve(state);
                });

                model.state = {
                    ...model.state,
                    greeting: "what are you looking at?",
                };

            });

            return newState.expression;
        },
    }, {
        name: 'submodel example',
        expect: 1,
        test: async () => {

            const model = Model.create<State>(initialState);
            const emotionModel = model.submodel("emotion");

            return await new Promise(resolve => {

                emotionModel.listen("tension", state => {
                    resolve(state.tension);
                });

                model.state = {
                    ...model.state,
                    emotion: {
                        ...model.state.emotion,
                        tension: 1,
                    }
                };
            });
        },
    }, {
        name: 'reverse submodel example',
        expect: 1,
        test: async () => {

            const model = Model.create<State>(initialState);
            const emotionModel = model.submodel("emotion");

            return await new Promise(resolve => {

                model.listen("emotion", state => {
                    resolve(state.emotion.tension);
                });

                emotionModel.state = {
                    ...emotionModel.state,
                    tension: 1,
                };
            });
        },
    }];
    
    tests.forEach(async (test: Test<any>) => {
        const timeoutPromise = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(false);
            }, 2000);
        });
        const result = await Promise.race([test.test(), timeoutPromise]);
        const success = result == test.expect;
        console.log(`${success ? "✅" : "❌"}: ${test.name} ${success ? `` : `--- got ${result} instead of ${test.expect}`}`);
    });
}