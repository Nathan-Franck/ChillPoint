import { reduceEachTrailingCommentRange } from "typescript";
import { Scripting } from "./Util.Scripting";

export function substate_example() {

    type Pane = "left" | "right";
    type SubState = {
        readonly fun?: number,
        readonly fashion?: string,
        readonly flair?: boolean,
    };

    type SuperState = {
        readonly funk?: number,
    } & {
            readonly [Key in keyof SubState as `${Pane}_${Key}`]?: SubState[Key];
        };

    const super_state: SuperState = {
        left_fashion: "hi",
        left_flair: true,
        left_fun: 1,
        funk: 41,
    };

    const first_sub_keys: Pane[] = ["left", "right"];
    const second_sub_keys = Scripting.get_keys(super_state). // 🤔 creates duplicate keys but technically works for next step
        map(key => {
            const sub_key = first_sub_keys.find(sub_key =>
                key.slice(0, sub_key.length) == sub_key)
            if (sub_key == null)
                return;
            return key.slice(`${sub_key}_`.length, key.length);
        }).
        filter((key): key is keyof SubState =>
            key != null);

    const sub_states = first_sub_keys.map(first_key =>
        second_sub_keys.reduce((sub_state, second_key) => {
            const super_key = `${first_key}_${second_key}` as `${typeof first_key}_${typeof second_key}`;
            return {
                ...sub_state,
                [second_key]: super_state[super_key],
            };
        }, {} as SubState));

    console.log(JSON.stringify(sub_states));

}