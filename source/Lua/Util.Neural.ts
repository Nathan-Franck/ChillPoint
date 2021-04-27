
export type BaseNeuron = {
    input_weights: { offset: number, weight: number }[],
    child_weights: { x: number, y: number, weight: number }[],
}

export type ChildNeuron = BaseNeuron & {
    parent_weights: { x: number, y: number, weight: number }[],
}

// 🏁 Simple network that can generate a checker pattern, in either variation, depending on input
const example: Network<[ChildNeuron]> = [{
    input_weights: [{
        offset: 0,
        weight: 1,
    }],
    child_weights: [{
        x: 0,
        y: 0,
        weight: 1,
    }, {
        x: 0,
        y: 1,
        weight: 1,
    }, {
        x: 1,
        y: 0,
        weight: 1,
    }, {
        x: 1,
        y: 1,
        weight: 1,
    }]
}, {
    parent_weights: [{
        x: 0,
        y: 0,
        weight: 1,
    }],
    input_weights: [{
        offset: 0,
        weight: 1,
    }],
    child_weights: [{
        x: 0,
        y: 0,
        weight: 1,
    }, {
        x: 0,
        y: 1,
        weight: -1,
    }, {
        x: 1,
        y: 0,
        weight: -1,
    }, {
        x: 1,
        y: 1,
        weight: 1,
    }]
}]

export type Network<T extends ChildNeuron[]> = [BaseNeuron, ...T];

export function generate<T extends ChildNeuron[]>(network: Network<T>) {
    
}