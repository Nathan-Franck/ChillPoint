type Cons<H, T> = T extends readonly any[] ? ((h: H, ...t: T) => void) extends ((...r: infer R) => void) ? R : never : never;
type Tail<T extends readonly any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never;
type Head<T extends readonly any[]> = T[0];

export type ExcludeFromTuple<T extends readonly any[], E> = T["length"] extends 0 ? [] : Exclude.X0<Tail<T>, E> extends infer X ? Head<T> extends E ? [] & X : Cons<Head<T>, X> : never;
namespace Exclude {
  export type X0<T extends readonly any[], E> = T["length"] extends 0 ? [] : X1<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X1<T extends readonly any[], E> = T["length"] extends 0 ? [] : X2<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X2<T extends readonly any[], E> = T["length"] extends 0 ? [] : X3<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X3<T extends readonly any[], E> = T["length"] extends 0 ? [] : X4<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X4<T extends readonly any[], E> = T["length"] extends 0 ? [] : X5<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X5<T extends readonly any[], E> = T["length"] extends 0 ? [] : X6<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X6<T extends readonly any[], E> = T["length"] extends 0 ? [] : X7<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X7<T extends readonly any[], E> = T["length"] extends 0 ? [] : X8<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X8<T extends readonly any[], E> = T["length"] extends 0 ? [] : X9<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type X9<T extends readonly any[], E> = T["length"] extends 0 ? [] : XA<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type XA<T extends readonly any[], E> = T["length"] extends 0 ? [] : XB<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type XB<T extends readonly any[], E> = T["length"] extends 0 ? [] : XC<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type XC<T extends readonly any[], E> = T["length"] extends 0 ? [] : XD<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type XD<T extends readonly any[], E> = T["length"] extends 0 ? [] : XE<Tail<T>, E> extends infer X ? Head<T> extends E ? X : Cons<Head<T>, X> : never;
  export type XE<T extends readonly any[], E> = T; // bail out
}

export type ExtractFromTuple<T extends readonly any[], E> = ExcludeFromTuple<T, Exclude<T[number], E>>