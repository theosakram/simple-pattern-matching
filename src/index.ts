/**
 * A sum-type generator. Uses the keys of the passed type as string discriminators
 *
 *
 * ```ts
 * type Option<T> = ADT<{
 *   none: {},
 *   some: {value: T}
 * }>
 *
 * type These<A, B> = ADT<{
 *   left: {left: A},
 *   right: {right: B},
 *   both: {left: A, right: B}
 * }>
 * ```
 */
export type EmptyRecord = Record<string, unknown>;

export type ADT<T extends EmptyRecord> = {
  [K in keyof T]: K extends "_" ? never : { _tag: K } & T[K];
}[keyof T];

type MatchObj<ADT extends { _tag: string }, Z> = {
  [K in ADT["_tag"]]: (v: ADTMember<ADT, K>) => Z;
};

type PartialMatchObj<ADT extends { _tag: string }, Z> = Partial<
  MatchObj<ADT, Z>
> & { _: (v: ADT) => Z };

/**
 * Helper type for omitting the '_tag' field from values
 */
export type ADTMember<ADT, Type extends string> = Omit<
  Extract<ADT, { _tag: Type }>,
  "_tag"
>;

/**
 * ```ts
 * declare const foo: Option<string>
 *
 * matchI(foo)({
 *   none: () => 'none',
 *   some: ({value}) => 'some'
 * })
 * ```
 */
function matchI<ADT extends { _tag: string }>(
  v: ADT
): <Z>(matchObj: MatchObj<ADT, Z>) => Z {
  return (matchObj) => (matchObj as any)[v._tag](v);
}

/**
 * Item-first version of matchP, useful for better inference in some circumstances
 *
 * ```ts
 * declare const foo: Option<string>
 *
 * matchP(foo)({
 *   some: ({value}) => 'some'
 *   _: (_option) => 'none',
 * })
 * ```
 */
function matchPI<ADT extends { _tag: string }>(
  v: ADT
): <Z>(matchObj: MatchObj<ADT, Z> | PartialMatchObj<ADT, Z>) => Z {
  return (matchObj) =>
    (matchObj as any)[v._tag] != null
      ? (matchObj as any)[v._tag](v)
      : (matchObj as any)._(v);
}

/**
 * Item-first version of matchL, useful for better inference in some circumstances
 *
 * ```ts
 * declare const foo: 'student' | 'teacher' | 'admin'
 *
 * matchLI(foo)({
 *   student: () => 'Murid'
 *   teacher: () => 'Guru',
 *   admin: () => 'Admin',
 * })
 * ```
 */
function matchLI<E extends string>(
  v: E
): <Z>(matchObj: { [K in E]: () => Z }) => Z {
  return (matchObj) => matchObj[v]();
}

export { matchI, matchPI, matchLI };
