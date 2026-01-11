
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CouponPolicy
 * 
 */
export type CouponPolicy = $Result.DefaultSelection<Prisma.$CouponPolicyPayload>
/**
 * Model Coupon
 * 
 */
export type Coupon = $Result.DefaultSelection<Prisma.$CouponPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DiscountType: {
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  PERCENTAGE: 'PERCENTAGE'
};

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType]


export const CouponStatus: {
  AVAILABLE: 'AVAILABLE',
  USED: 'USED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED'
};

export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus]

}

export type DiscountType = $Enums.DiscountType

export const DiscountType: typeof $Enums.DiscountType

export type CouponStatus = $Enums.CouponStatus

export const CouponStatus: typeof $Enums.CouponStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CouponPolicies
 * const couponPolicies = await prisma.couponPolicy.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CouponPolicies
   * const couponPolicies = await prisma.couponPolicy.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.couponPolicy`: Exposes CRUD operations for the **CouponPolicy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CouponPolicies
    * const couponPolicies = await prisma.couponPolicy.findMany()
    * ```
    */
  get couponPolicy(): Prisma.CouponPolicyDelegate<ExtArgs>;

  /**
   * `prisma.coupon`: Exposes CRUD operations for the **Coupon** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Coupons
    * const coupons = await prisma.coupon.findMany()
    * ```
    */
  get coupon(): Prisma.CouponDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CouponPolicy: 'CouponPolicy',
    Coupon: 'Coupon'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "couponPolicy" | "coupon"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CouponPolicy: {
        payload: Prisma.$CouponPolicyPayload<ExtArgs>
        fields: Prisma.CouponPolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CouponPolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CouponPolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          findFirst: {
            args: Prisma.CouponPolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CouponPolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          findMany: {
            args: Prisma.CouponPolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>[]
          }
          create: {
            args: Prisma.CouponPolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          createMany: {
            args: Prisma.CouponPolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CouponPolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          update: {
            args: Prisma.CouponPolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          deleteMany: {
            args: Prisma.CouponPolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CouponPolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CouponPolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPolicyPayload>
          }
          aggregate: {
            args: Prisma.CouponPolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCouponPolicy>
          }
          groupBy: {
            args: Prisma.CouponPolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CouponPolicyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CouponPolicyCountArgs<ExtArgs>
            result: $Utils.Optional<CouponPolicyCountAggregateOutputType> | number
          }
        }
      }
      Coupon: {
        payload: Prisma.$CouponPayload<ExtArgs>
        fields: Prisma.CouponFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CouponFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CouponFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findFirst: {
            args: Prisma.CouponFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CouponFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findMany: {
            args: Prisma.CouponFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>[]
          }
          create: {
            args: Prisma.CouponCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          createMany: {
            args: Prisma.CouponCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CouponDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          update: {
            args: Prisma.CouponUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          deleteMany: {
            args: Prisma.CouponDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CouponUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CouponUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          aggregate: {
            args: Prisma.CouponAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCoupon>
          }
          groupBy: {
            args: Prisma.CouponGroupByArgs<ExtArgs>
            result: $Utils.Optional<CouponGroupByOutputType>[]
          }
          count: {
            args: Prisma.CouponCountArgs<ExtArgs>
            result: $Utils.Optional<CouponCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CouponPolicyCountOutputType
   */

  export type CouponPolicyCountOutputType = {
    coupons: number
  }

  export type CouponPolicyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coupons?: boolean | CouponPolicyCountOutputTypeCountCouponsArgs
  }

  // Custom InputTypes
  /**
   * CouponPolicyCountOutputType without action
   */
  export type CouponPolicyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicyCountOutputType
     */
    select?: CouponPolicyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CouponPolicyCountOutputType without action
   */
  export type CouponPolicyCountOutputTypeCountCouponsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CouponPolicy
   */

  export type AggregateCouponPolicy = {
    _count: CouponPolicyCountAggregateOutputType | null
    _avg: CouponPolicyAvgAggregateOutputType | null
    _sum: CouponPolicySumAggregateOutputType | null
    _min: CouponPolicyMinAggregateOutputType | null
    _max: CouponPolicyMaxAggregateOutputType | null
  }

  export type CouponPolicyAvgAggregateOutputType = {
    id: number | null
    totalQuantity: number | null
    discountValue: number | null
    minimumOrderAmount: number | null
    maximumDiscountAmount: number | null
  }

  export type CouponPolicySumAggregateOutputType = {
    id: bigint | null
    totalQuantity: number | null
    discountValue: number | null
    minimumOrderAmount: number | null
    maximumDiscountAmount: number | null
  }

  export type CouponPolicyMinAggregateOutputType = {
    id: bigint | null
    title: string | null
    description: string | null
    totalQuantity: number | null
    startTime: Date | null
    endTime: Date | null
    discountType: $Enums.DiscountType | null
    discountValue: number | null
    minimumOrderAmount: number | null
    maximumDiscountAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CouponPolicyMaxAggregateOutputType = {
    id: bigint | null
    title: string | null
    description: string | null
    totalQuantity: number | null
    startTime: Date | null
    endTime: Date | null
    discountType: $Enums.DiscountType | null
    discountValue: number | null
    minimumOrderAmount: number | null
    maximumDiscountAmount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CouponPolicyCountAggregateOutputType = {
    id: number
    title: number
    description: number
    totalQuantity: number
    startTime: number
    endTime: number
    discountType: number
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CouponPolicyAvgAggregateInputType = {
    id?: true
    totalQuantity?: true
    discountValue?: true
    minimumOrderAmount?: true
    maximumDiscountAmount?: true
  }

  export type CouponPolicySumAggregateInputType = {
    id?: true
    totalQuantity?: true
    discountValue?: true
    minimumOrderAmount?: true
    maximumDiscountAmount?: true
  }

  export type CouponPolicyMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    totalQuantity?: true
    startTime?: true
    endTime?: true
    discountType?: true
    discountValue?: true
    minimumOrderAmount?: true
    maximumDiscountAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CouponPolicyMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    totalQuantity?: true
    startTime?: true
    endTime?: true
    discountType?: true
    discountValue?: true
    minimumOrderAmount?: true
    maximumDiscountAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CouponPolicyCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    totalQuantity?: true
    startTime?: true
    endTime?: true
    discountType?: true
    discountValue?: true
    minimumOrderAmount?: true
    maximumDiscountAmount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CouponPolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CouponPolicy to aggregate.
     */
    where?: CouponPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CouponPolicies to fetch.
     */
    orderBy?: CouponPolicyOrderByWithRelationInput | CouponPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CouponPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CouponPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CouponPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CouponPolicies
    **/
    _count?: true | CouponPolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CouponPolicyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CouponPolicySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CouponPolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CouponPolicyMaxAggregateInputType
  }

  export type GetCouponPolicyAggregateType<T extends CouponPolicyAggregateArgs> = {
        [P in keyof T & keyof AggregateCouponPolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCouponPolicy[P]>
      : GetScalarType<T[P], AggregateCouponPolicy[P]>
  }




  export type CouponPolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponPolicyWhereInput
    orderBy?: CouponPolicyOrderByWithAggregationInput | CouponPolicyOrderByWithAggregationInput[]
    by: CouponPolicyScalarFieldEnum[] | CouponPolicyScalarFieldEnum
    having?: CouponPolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CouponPolicyCountAggregateInputType | true
    _avg?: CouponPolicyAvgAggregateInputType
    _sum?: CouponPolicySumAggregateInputType
    _min?: CouponPolicyMinAggregateInputType
    _max?: CouponPolicyMaxAggregateInputType
  }

  export type CouponPolicyGroupByOutputType = {
    id: bigint
    title: string
    description: string
    totalQuantity: number
    startTime: Date
    endTime: Date
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt: Date
    updatedAt: Date
    _count: CouponPolicyCountAggregateOutputType | null
    _avg: CouponPolicyAvgAggregateOutputType | null
    _sum: CouponPolicySumAggregateOutputType | null
    _min: CouponPolicyMinAggregateOutputType | null
    _max: CouponPolicyMaxAggregateOutputType | null
  }

  type GetCouponPolicyGroupByPayload<T extends CouponPolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CouponPolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CouponPolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CouponPolicyGroupByOutputType[P]>
            : GetScalarType<T[P], CouponPolicyGroupByOutputType[P]>
        }
      >
    >


  export type CouponPolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    totalQuantity?: boolean
    startTime?: boolean
    endTime?: boolean
    discountType?: boolean
    discountValue?: boolean
    minimumOrderAmount?: boolean
    maximumDiscountAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    coupons?: boolean | CouponPolicy$couponsArgs<ExtArgs>
    _count?: boolean | CouponPolicyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["couponPolicy"]>


  export type CouponPolicySelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    totalQuantity?: boolean
    startTime?: boolean
    endTime?: boolean
    discountType?: boolean
    discountValue?: boolean
    minimumOrderAmount?: boolean
    maximumDiscountAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CouponPolicyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coupons?: boolean | CouponPolicy$couponsArgs<ExtArgs>
    _count?: boolean | CouponPolicyCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CouponPolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CouponPolicy"
    objects: {
      coupons: Prisma.$CouponPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      title: string
      description: string
      totalQuantity: number
      startTime: Date
      endTime: Date
      discountType: $Enums.DiscountType
      discountValue: number
      minimumOrderAmount: number
      maximumDiscountAmount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["couponPolicy"]>
    composites: {}
  }

  type CouponPolicyGetPayload<S extends boolean | null | undefined | CouponPolicyDefaultArgs> = $Result.GetResult<Prisma.$CouponPolicyPayload, S>

  type CouponPolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CouponPolicyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CouponPolicyCountAggregateInputType | true
    }

  export interface CouponPolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CouponPolicy'], meta: { name: 'CouponPolicy' } }
    /**
     * Find zero or one CouponPolicy that matches the filter.
     * @param {CouponPolicyFindUniqueArgs} args - Arguments to find a CouponPolicy
     * @example
     * // Get one CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CouponPolicyFindUniqueArgs>(args: SelectSubset<T, CouponPolicyFindUniqueArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CouponPolicy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CouponPolicyFindUniqueOrThrowArgs} args - Arguments to find a CouponPolicy
     * @example
     * // Get one CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CouponPolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, CouponPolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CouponPolicy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyFindFirstArgs} args - Arguments to find a CouponPolicy
     * @example
     * // Get one CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CouponPolicyFindFirstArgs>(args?: SelectSubset<T, CouponPolicyFindFirstArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CouponPolicy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyFindFirstOrThrowArgs} args - Arguments to find a CouponPolicy
     * @example
     * // Get one CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CouponPolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, CouponPolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CouponPolicies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CouponPolicies
     * const couponPolicies = await prisma.couponPolicy.findMany()
     * 
     * // Get first 10 CouponPolicies
     * const couponPolicies = await prisma.couponPolicy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const couponPolicyWithIdOnly = await prisma.couponPolicy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CouponPolicyFindManyArgs>(args?: SelectSubset<T, CouponPolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CouponPolicy.
     * @param {CouponPolicyCreateArgs} args - Arguments to create a CouponPolicy.
     * @example
     * // Create one CouponPolicy
     * const CouponPolicy = await prisma.couponPolicy.create({
     *   data: {
     *     // ... data to create a CouponPolicy
     *   }
     * })
     * 
     */
    create<T extends CouponPolicyCreateArgs>(args: SelectSubset<T, CouponPolicyCreateArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CouponPolicies.
     * @param {CouponPolicyCreateManyArgs} args - Arguments to create many CouponPolicies.
     * @example
     * // Create many CouponPolicies
     * const couponPolicy = await prisma.couponPolicy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CouponPolicyCreateManyArgs>(args?: SelectSubset<T, CouponPolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CouponPolicy.
     * @param {CouponPolicyDeleteArgs} args - Arguments to delete one CouponPolicy.
     * @example
     * // Delete one CouponPolicy
     * const CouponPolicy = await prisma.couponPolicy.delete({
     *   where: {
     *     // ... filter to delete one CouponPolicy
     *   }
     * })
     * 
     */
    delete<T extends CouponPolicyDeleteArgs>(args: SelectSubset<T, CouponPolicyDeleteArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CouponPolicy.
     * @param {CouponPolicyUpdateArgs} args - Arguments to update one CouponPolicy.
     * @example
     * // Update one CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CouponPolicyUpdateArgs>(args: SelectSubset<T, CouponPolicyUpdateArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CouponPolicies.
     * @param {CouponPolicyDeleteManyArgs} args - Arguments to filter CouponPolicies to delete.
     * @example
     * // Delete a few CouponPolicies
     * const { count } = await prisma.couponPolicy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CouponPolicyDeleteManyArgs>(args?: SelectSubset<T, CouponPolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CouponPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CouponPolicies
     * const couponPolicy = await prisma.couponPolicy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CouponPolicyUpdateManyArgs>(args: SelectSubset<T, CouponPolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CouponPolicy.
     * @param {CouponPolicyUpsertArgs} args - Arguments to update or create a CouponPolicy.
     * @example
     * // Update or create a CouponPolicy
     * const couponPolicy = await prisma.couponPolicy.upsert({
     *   create: {
     *     // ... data to create a CouponPolicy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CouponPolicy we want to update
     *   }
     * })
     */
    upsert<T extends CouponPolicyUpsertArgs>(args: SelectSubset<T, CouponPolicyUpsertArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CouponPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyCountArgs} args - Arguments to filter CouponPolicies to count.
     * @example
     * // Count the number of CouponPolicies
     * const count = await prisma.couponPolicy.count({
     *   where: {
     *     // ... the filter for the CouponPolicies we want to count
     *   }
     * })
    **/
    count<T extends CouponPolicyCountArgs>(
      args?: Subset<T, CouponPolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CouponPolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CouponPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CouponPolicyAggregateArgs>(args: Subset<T, CouponPolicyAggregateArgs>): Prisma.PrismaPromise<GetCouponPolicyAggregateType<T>>

    /**
     * Group by CouponPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponPolicyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CouponPolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CouponPolicyGroupByArgs['orderBy'] }
        : { orderBy?: CouponPolicyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CouponPolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCouponPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CouponPolicy model
   */
  readonly fields: CouponPolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CouponPolicy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CouponPolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    coupons<T extends CouponPolicy$couponsArgs<ExtArgs> = {}>(args?: Subset<T, CouponPolicy$couponsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CouponPolicy model
   */ 
  interface CouponPolicyFieldRefs {
    readonly id: FieldRef<"CouponPolicy", 'BigInt'>
    readonly title: FieldRef<"CouponPolicy", 'String'>
    readonly description: FieldRef<"CouponPolicy", 'String'>
    readonly totalQuantity: FieldRef<"CouponPolicy", 'Int'>
    readonly startTime: FieldRef<"CouponPolicy", 'DateTime'>
    readonly endTime: FieldRef<"CouponPolicy", 'DateTime'>
    readonly discountType: FieldRef<"CouponPolicy", 'DiscountType'>
    readonly discountValue: FieldRef<"CouponPolicy", 'Int'>
    readonly minimumOrderAmount: FieldRef<"CouponPolicy", 'Int'>
    readonly maximumDiscountAmount: FieldRef<"CouponPolicy", 'Int'>
    readonly createdAt: FieldRef<"CouponPolicy", 'DateTime'>
    readonly updatedAt: FieldRef<"CouponPolicy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CouponPolicy findUnique
   */
  export type CouponPolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter, which CouponPolicy to fetch.
     */
    where: CouponPolicyWhereUniqueInput
  }

  /**
   * CouponPolicy findUniqueOrThrow
   */
  export type CouponPolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter, which CouponPolicy to fetch.
     */
    where: CouponPolicyWhereUniqueInput
  }

  /**
   * CouponPolicy findFirst
   */
  export type CouponPolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter, which CouponPolicy to fetch.
     */
    where?: CouponPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CouponPolicies to fetch.
     */
    orderBy?: CouponPolicyOrderByWithRelationInput | CouponPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CouponPolicies.
     */
    cursor?: CouponPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CouponPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CouponPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CouponPolicies.
     */
    distinct?: CouponPolicyScalarFieldEnum | CouponPolicyScalarFieldEnum[]
  }

  /**
   * CouponPolicy findFirstOrThrow
   */
  export type CouponPolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter, which CouponPolicy to fetch.
     */
    where?: CouponPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CouponPolicies to fetch.
     */
    orderBy?: CouponPolicyOrderByWithRelationInput | CouponPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CouponPolicies.
     */
    cursor?: CouponPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CouponPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CouponPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CouponPolicies.
     */
    distinct?: CouponPolicyScalarFieldEnum | CouponPolicyScalarFieldEnum[]
  }

  /**
   * CouponPolicy findMany
   */
  export type CouponPolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter, which CouponPolicies to fetch.
     */
    where?: CouponPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CouponPolicies to fetch.
     */
    orderBy?: CouponPolicyOrderByWithRelationInput | CouponPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CouponPolicies.
     */
    cursor?: CouponPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CouponPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CouponPolicies.
     */
    skip?: number
    distinct?: CouponPolicyScalarFieldEnum | CouponPolicyScalarFieldEnum[]
  }

  /**
   * CouponPolicy create
   */
  export type CouponPolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * The data needed to create a CouponPolicy.
     */
    data: XOR<CouponPolicyCreateInput, CouponPolicyUncheckedCreateInput>
  }

  /**
   * CouponPolicy createMany
   */
  export type CouponPolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CouponPolicies.
     */
    data: CouponPolicyCreateManyInput | CouponPolicyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CouponPolicy update
   */
  export type CouponPolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * The data needed to update a CouponPolicy.
     */
    data: XOR<CouponPolicyUpdateInput, CouponPolicyUncheckedUpdateInput>
    /**
     * Choose, which CouponPolicy to update.
     */
    where: CouponPolicyWhereUniqueInput
  }

  /**
   * CouponPolicy updateMany
   */
  export type CouponPolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CouponPolicies.
     */
    data: XOR<CouponPolicyUpdateManyMutationInput, CouponPolicyUncheckedUpdateManyInput>
    /**
     * Filter which CouponPolicies to update
     */
    where?: CouponPolicyWhereInput
  }

  /**
   * CouponPolicy upsert
   */
  export type CouponPolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * The filter to search for the CouponPolicy to update in case it exists.
     */
    where: CouponPolicyWhereUniqueInput
    /**
     * In case the CouponPolicy found by the `where` argument doesn't exist, create a new CouponPolicy with this data.
     */
    create: XOR<CouponPolicyCreateInput, CouponPolicyUncheckedCreateInput>
    /**
     * In case the CouponPolicy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CouponPolicyUpdateInput, CouponPolicyUncheckedUpdateInput>
  }

  /**
   * CouponPolicy delete
   */
  export type CouponPolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
    /**
     * Filter which CouponPolicy to delete.
     */
    where: CouponPolicyWhereUniqueInput
  }

  /**
   * CouponPolicy deleteMany
   */
  export type CouponPolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CouponPolicies to delete
     */
    where?: CouponPolicyWhereInput
  }

  /**
   * CouponPolicy.coupons
   */
  export type CouponPolicy$couponsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    where?: CouponWhereInput
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    cursor?: CouponWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * CouponPolicy without action
   */
  export type CouponPolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponPolicy
     */
    select?: CouponPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponPolicyInclude<ExtArgs> | null
  }


  /**
   * Model Coupon
   */

  export type AggregateCoupon = {
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  export type CouponAvgAggregateOutputType = {
    id: number | null
    couponPolicyId: number | null
    userId: number | null
    orderId: number | null
  }

  export type CouponSumAggregateOutputType = {
    id: bigint | null
    couponPolicyId: bigint | null
    userId: bigint | null
    orderId: bigint | null
  }

  export type CouponMinAggregateOutputType = {
    id: bigint | null
    couponPolicyId: bigint | null
    userId: bigint | null
    orderId: bigint | null
    status: $Enums.CouponStatus | null
    expirationTime: Date | null
    issuedAt: Date | null
  }

  export type CouponMaxAggregateOutputType = {
    id: bigint | null
    couponPolicyId: bigint | null
    userId: bigint | null
    orderId: bigint | null
    status: $Enums.CouponStatus | null
    expirationTime: Date | null
    issuedAt: Date | null
  }

  export type CouponCountAggregateOutputType = {
    id: number
    couponPolicyId: number
    userId: number
    orderId: number
    status: number
    expirationTime: number
    issuedAt: number
    _all: number
  }


  export type CouponAvgAggregateInputType = {
    id?: true
    couponPolicyId?: true
    userId?: true
    orderId?: true
  }

  export type CouponSumAggregateInputType = {
    id?: true
    couponPolicyId?: true
    userId?: true
    orderId?: true
  }

  export type CouponMinAggregateInputType = {
    id?: true
    couponPolicyId?: true
    userId?: true
    orderId?: true
    status?: true
    expirationTime?: true
    issuedAt?: true
  }

  export type CouponMaxAggregateInputType = {
    id?: true
    couponPolicyId?: true
    userId?: true
    orderId?: true
    status?: true
    expirationTime?: true
    issuedAt?: true
  }

  export type CouponCountAggregateInputType = {
    id?: true
    couponPolicyId?: true
    userId?: true
    orderId?: true
    status?: true
    expirationTime?: true
    issuedAt?: true
    _all?: true
  }

  export type CouponAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupon to aggregate.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Coupons
    **/
    _count?: true | CouponCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CouponAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CouponSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CouponMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CouponMaxAggregateInputType
  }

  export type GetCouponAggregateType<T extends CouponAggregateArgs> = {
        [P in keyof T & keyof AggregateCoupon]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoupon[P]>
      : GetScalarType<T[P], AggregateCoupon[P]>
  }




  export type CouponGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponWhereInput
    orderBy?: CouponOrderByWithAggregationInput | CouponOrderByWithAggregationInput[]
    by: CouponScalarFieldEnum[] | CouponScalarFieldEnum
    having?: CouponScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CouponCountAggregateInputType | true
    _avg?: CouponAvgAggregateInputType
    _sum?: CouponSumAggregateInputType
    _min?: CouponMinAggregateInputType
    _max?: CouponMaxAggregateInputType
  }

  export type CouponGroupByOutputType = {
    id: bigint
    couponPolicyId: bigint
    userId: bigint
    orderId: bigint | null
    status: $Enums.CouponStatus
    expirationTime: Date
    issuedAt: Date
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  type GetCouponGroupByPayload<T extends CouponGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CouponGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CouponGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CouponGroupByOutputType[P]>
            : GetScalarType<T[P], CouponGroupByOutputType[P]>
        }
      >
    >


  export type CouponSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    couponPolicyId?: boolean
    userId?: boolean
    orderId?: boolean
    status?: boolean
    expirationTime?: boolean
    issuedAt?: boolean
    couponPolicy?: boolean | CouponPolicyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coupon"]>


  export type CouponSelectScalar = {
    id?: boolean
    couponPolicyId?: boolean
    userId?: boolean
    orderId?: boolean
    status?: boolean
    expirationTime?: boolean
    issuedAt?: boolean
  }

  export type CouponInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    couponPolicy?: boolean | CouponPolicyDefaultArgs<ExtArgs>
  }

  export type $CouponPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Coupon"
    objects: {
      couponPolicy: Prisma.$CouponPolicyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      couponPolicyId: bigint
      userId: bigint
      orderId: bigint | null
      status: $Enums.CouponStatus
      expirationTime: Date
      issuedAt: Date
    }, ExtArgs["result"]["coupon"]>
    composites: {}
  }

  type CouponGetPayload<S extends boolean | null | undefined | CouponDefaultArgs> = $Result.GetResult<Prisma.$CouponPayload, S>

  type CouponCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CouponFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CouponCountAggregateInputType | true
    }

  export interface CouponDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Coupon'], meta: { name: 'Coupon' } }
    /**
     * Find zero or one Coupon that matches the filter.
     * @param {CouponFindUniqueArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CouponFindUniqueArgs>(args: SelectSubset<T, CouponFindUniqueArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Coupon that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CouponFindUniqueOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CouponFindUniqueOrThrowArgs>(args: SelectSubset<T, CouponFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Coupon that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CouponFindFirstArgs>(args?: SelectSubset<T, CouponFindFirstArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Coupon that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CouponFindFirstOrThrowArgs>(args?: SelectSubset<T, CouponFindFirstOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Coupons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Coupons
     * const coupons = await prisma.coupon.findMany()
     * 
     * // Get first 10 Coupons
     * const coupons = await prisma.coupon.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const couponWithIdOnly = await prisma.coupon.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CouponFindManyArgs>(args?: SelectSubset<T, CouponFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Coupon.
     * @param {CouponCreateArgs} args - Arguments to create a Coupon.
     * @example
     * // Create one Coupon
     * const Coupon = await prisma.coupon.create({
     *   data: {
     *     // ... data to create a Coupon
     *   }
     * })
     * 
     */
    create<T extends CouponCreateArgs>(args: SelectSubset<T, CouponCreateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Coupons.
     * @param {CouponCreateManyArgs} args - Arguments to create many Coupons.
     * @example
     * // Create many Coupons
     * const coupon = await prisma.coupon.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CouponCreateManyArgs>(args?: SelectSubset<T, CouponCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Coupon.
     * @param {CouponDeleteArgs} args - Arguments to delete one Coupon.
     * @example
     * // Delete one Coupon
     * const Coupon = await prisma.coupon.delete({
     *   where: {
     *     // ... filter to delete one Coupon
     *   }
     * })
     * 
     */
    delete<T extends CouponDeleteArgs>(args: SelectSubset<T, CouponDeleteArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Coupon.
     * @param {CouponUpdateArgs} args - Arguments to update one Coupon.
     * @example
     * // Update one Coupon
     * const coupon = await prisma.coupon.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CouponUpdateArgs>(args: SelectSubset<T, CouponUpdateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Coupons.
     * @param {CouponDeleteManyArgs} args - Arguments to filter Coupons to delete.
     * @example
     * // Delete a few Coupons
     * const { count } = await prisma.coupon.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CouponDeleteManyArgs>(args?: SelectSubset<T, CouponDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Coupons
     * const coupon = await prisma.coupon.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CouponUpdateManyArgs>(args: SelectSubset<T, CouponUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Coupon.
     * @param {CouponUpsertArgs} args - Arguments to update or create a Coupon.
     * @example
     * // Update or create a Coupon
     * const coupon = await prisma.coupon.upsert({
     *   create: {
     *     // ... data to create a Coupon
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Coupon we want to update
     *   }
     * })
     */
    upsert<T extends CouponUpsertArgs>(args: SelectSubset<T, CouponUpsertArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponCountArgs} args - Arguments to filter Coupons to count.
     * @example
     * // Count the number of Coupons
     * const count = await prisma.coupon.count({
     *   where: {
     *     // ... the filter for the Coupons we want to count
     *   }
     * })
    **/
    count<T extends CouponCountArgs>(
      args?: Subset<T, CouponCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CouponCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CouponAggregateArgs>(args: Subset<T, CouponAggregateArgs>): Prisma.PrismaPromise<GetCouponAggregateType<T>>

    /**
     * Group by Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CouponGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CouponGroupByArgs['orderBy'] }
        : { orderBy?: CouponGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CouponGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCouponGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Coupon model
   */
  readonly fields: CouponFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Coupon.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CouponClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    couponPolicy<T extends CouponPolicyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CouponPolicyDefaultArgs<ExtArgs>>): Prisma__CouponPolicyClient<$Result.GetResult<Prisma.$CouponPolicyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Coupon model
   */ 
  interface CouponFieldRefs {
    readonly id: FieldRef<"Coupon", 'BigInt'>
    readonly couponPolicyId: FieldRef<"Coupon", 'BigInt'>
    readonly userId: FieldRef<"Coupon", 'BigInt'>
    readonly orderId: FieldRef<"Coupon", 'BigInt'>
    readonly status: FieldRef<"Coupon", 'CouponStatus'>
    readonly expirationTime: FieldRef<"Coupon", 'DateTime'>
    readonly issuedAt: FieldRef<"Coupon", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Coupon findUnique
   */
  export type CouponFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findUniqueOrThrow
   */
  export type CouponFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findFirst
   */
  export type CouponFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findFirstOrThrow
   */
  export type CouponFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findMany
   */
  export type CouponFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupons to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon create
   */
  export type CouponCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to create a Coupon.
     */
    data: XOR<CouponCreateInput, CouponUncheckedCreateInput>
  }

  /**
   * Coupon createMany
   */
  export type CouponCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Coupons.
     */
    data: CouponCreateManyInput | CouponCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Coupon update
   */
  export type CouponUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to update a Coupon.
     */
    data: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
    /**
     * Choose, which Coupon to update.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon updateMany
   */
  export type CouponUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Coupons.
     */
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyInput>
    /**
     * Filter which Coupons to update
     */
    where?: CouponWhereInput
  }

  /**
   * Coupon upsert
   */
  export type CouponUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The filter to search for the Coupon to update in case it exists.
     */
    where: CouponWhereUniqueInput
    /**
     * In case the Coupon found by the `where` argument doesn't exist, create a new Coupon with this data.
     */
    create: XOR<CouponCreateInput, CouponUncheckedCreateInput>
    /**
     * In case the Coupon was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
  }

  /**
   * Coupon delete
   */
  export type CouponDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter which Coupon to delete.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon deleteMany
   */
  export type CouponDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupons to delete
     */
    where?: CouponWhereInput
  }

  /**
   * Coupon without action
   */
  export type CouponDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CouponPolicyScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    totalQuantity: 'totalQuantity',
    startTime: 'startTime',
    endTime: 'endTime',
    discountType: 'discountType',
    discountValue: 'discountValue',
    minimumOrderAmount: 'minimumOrderAmount',
    maximumDiscountAmount: 'maximumDiscountAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CouponPolicyScalarFieldEnum = (typeof CouponPolicyScalarFieldEnum)[keyof typeof CouponPolicyScalarFieldEnum]


  export const CouponScalarFieldEnum: {
    id: 'id',
    couponPolicyId: 'couponPolicyId',
    userId: 'userId',
    orderId: 'orderId',
    status: 'status',
    expirationTime: 'expirationTime',
    issuedAt: 'issuedAt'
  };

  export type CouponScalarFieldEnum = (typeof CouponScalarFieldEnum)[keyof typeof CouponScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DiscountType'
   */
  export type EnumDiscountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscountType'>
    


  /**
   * Reference to a field of type 'CouponStatus'
   */
  export type EnumCouponStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CouponStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CouponPolicyWhereInput = {
    AND?: CouponPolicyWhereInput | CouponPolicyWhereInput[]
    OR?: CouponPolicyWhereInput[]
    NOT?: CouponPolicyWhereInput | CouponPolicyWhereInput[]
    id?: BigIntFilter<"CouponPolicy"> | bigint | number
    title?: StringFilter<"CouponPolicy"> | string
    description?: StringFilter<"CouponPolicy"> | string
    totalQuantity?: IntFilter<"CouponPolicy"> | number
    startTime?: DateTimeFilter<"CouponPolicy"> | Date | string
    endTime?: DateTimeFilter<"CouponPolicy"> | Date | string
    discountType?: EnumDiscountTypeFilter<"CouponPolicy"> | $Enums.DiscountType
    discountValue?: IntFilter<"CouponPolicy"> | number
    minimumOrderAmount?: IntFilter<"CouponPolicy"> | number
    maximumDiscountAmount?: IntFilter<"CouponPolicy"> | number
    createdAt?: DateTimeFilter<"CouponPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"CouponPolicy"> | Date | string
    coupons?: CouponListRelationFilter
  }

  export type CouponPolicyOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    totalQuantity?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coupons?: CouponOrderByRelationAggregateInput
  }

  export type CouponPolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: CouponPolicyWhereInput | CouponPolicyWhereInput[]
    OR?: CouponPolicyWhereInput[]
    NOT?: CouponPolicyWhereInput | CouponPolicyWhereInput[]
    title?: StringFilter<"CouponPolicy"> | string
    description?: StringFilter<"CouponPolicy"> | string
    totalQuantity?: IntFilter<"CouponPolicy"> | number
    startTime?: DateTimeFilter<"CouponPolicy"> | Date | string
    endTime?: DateTimeFilter<"CouponPolicy"> | Date | string
    discountType?: EnumDiscountTypeFilter<"CouponPolicy"> | $Enums.DiscountType
    discountValue?: IntFilter<"CouponPolicy"> | number
    minimumOrderAmount?: IntFilter<"CouponPolicy"> | number
    maximumDiscountAmount?: IntFilter<"CouponPolicy"> | number
    createdAt?: DateTimeFilter<"CouponPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"CouponPolicy"> | Date | string
    coupons?: CouponListRelationFilter
  }, "id">

  export type CouponPolicyOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    totalQuantity?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CouponPolicyCountOrderByAggregateInput
    _avg?: CouponPolicyAvgOrderByAggregateInput
    _max?: CouponPolicyMaxOrderByAggregateInput
    _min?: CouponPolicyMinOrderByAggregateInput
    _sum?: CouponPolicySumOrderByAggregateInput
  }

  export type CouponPolicyScalarWhereWithAggregatesInput = {
    AND?: CouponPolicyScalarWhereWithAggregatesInput | CouponPolicyScalarWhereWithAggregatesInput[]
    OR?: CouponPolicyScalarWhereWithAggregatesInput[]
    NOT?: CouponPolicyScalarWhereWithAggregatesInput | CouponPolicyScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"CouponPolicy"> | bigint | number
    title?: StringWithAggregatesFilter<"CouponPolicy"> | string
    description?: StringWithAggregatesFilter<"CouponPolicy"> | string
    totalQuantity?: IntWithAggregatesFilter<"CouponPolicy"> | number
    startTime?: DateTimeWithAggregatesFilter<"CouponPolicy"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"CouponPolicy"> | Date | string
    discountType?: EnumDiscountTypeWithAggregatesFilter<"CouponPolicy"> | $Enums.DiscountType
    discountValue?: IntWithAggregatesFilter<"CouponPolicy"> | number
    minimumOrderAmount?: IntWithAggregatesFilter<"CouponPolicy"> | number
    maximumDiscountAmount?: IntWithAggregatesFilter<"CouponPolicy"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CouponPolicy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CouponPolicy"> | Date | string
  }

  export type CouponWhereInput = {
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    id?: BigIntFilter<"Coupon"> | bigint | number
    couponPolicyId?: BigIntFilter<"Coupon"> | bigint | number
    userId?: BigIntFilter<"Coupon"> | bigint | number
    orderId?: BigIntNullableFilter<"Coupon"> | bigint | number | null
    status?: EnumCouponStatusFilter<"Coupon"> | $Enums.CouponStatus
    expirationTime?: DateTimeFilter<"Coupon"> | Date | string
    issuedAt?: DateTimeFilter<"Coupon"> | Date | string
    couponPolicy?: XOR<CouponPolicyRelationFilter, CouponPolicyWhereInput>
  }

  export type CouponOrderByWithRelationInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrderInput | SortOrder
    status?: SortOrder
    expirationTime?: SortOrder
    issuedAt?: SortOrder
    couponPolicy?: CouponPolicyOrderByWithRelationInput
  }

  export type CouponWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    couponPolicyId?: BigIntFilter<"Coupon"> | bigint | number
    userId?: BigIntFilter<"Coupon"> | bigint | number
    orderId?: BigIntNullableFilter<"Coupon"> | bigint | number | null
    status?: EnumCouponStatusFilter<"Coupon"> | $Enums.CouponStatus
    expirationTime?: DateTimeFilter<"Coupon"> | Date | string
    issuedAt?: DateTimeFilter<"Coupon"> | Date | string
    couponPolicy?: XOR<CouponPolicyRelationFilter, CouponPolicyWhereInput>
  }, "id">

  export type CouponOrderByWithAggregationInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrderInput | SortOrder
    status?: SortOrder
    expirationTime?: SortOrder
    issuedAt?: SortOrder
    _count?: CouponCountOrderByAggregateInput
    _avg?: CouponAvgOrderByAggregateInput
    _max?: CouponMaxOrderByAggregateInput
    _min?: CouponMinOrderByAggregateInput
    _sum?: CouponSumOrderByAggregateInput
  }

  export type CouponScalarWhereWithAggregatesInput = {
    AND?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    OR?: CouponScalarWhereWithAggregatesInput[]
    NOT?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Coupon"> | bigint | number
    couponPolicyId?: BigIntWithAggregatesFilter<"Coupon"> | bigint | number
    userId?: BigIntWithAggregatesFilter<"Coupon"> | bigint | number
    orderId?: BigIntNullableWithAggregatesFilter<"Coupon"> | bigint | number | null
    status?: EnumCouponStatusWithAggregatesFilter<"Coupon"> | $Enums.CouponStatus
    expirationTime?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
    issuedAt?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
  }

  export type CouponPolicyCreateInput = {
    id?: bigint | number
    title: string
    description: string
    totalQuantity: number
    startTime: Date | string
    endTime: Date | string
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    coupons?: CouponCreateNestedManyWithoutCouponPolicyInput
  }

  export type CouponPolicyUncheckedCreateInput = {
    id?: bigint | number
    title: string
    description: string
    totalQuantity: number
    startTime: Date | string
    endTime: Date | string
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    coupons?: CouponUncheckedCreateNestedManyWithoutCouponPolicyInput
  }

  export type CouponPolicyUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coupons?: CouponUpdateManyWithoutCouponPolicyNestedInput
  }

  export type CouponPolicyUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coupons?: CouponUncheckedUpdateManyWithoutCouponPolicyNestedInput
  }

  export type CouponPolicyCreateManyInput = {
    id?: bigint | number
    title: string
    description: string
    totalQuantity: number
    startTime: Date | string
    endTime: Date | string
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponPolicyUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponPolicyUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponCreateInput = {
    id?: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
    couponPolicy: CouponPolicyCreateNestedOneWithoutCouponsInput
  }

  export type CouponUncheckedCreateInput = {
    id?: bigint | number
    couponPolicyId: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
  }

  export type CouponUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    couponPolicy?: CouponPolicyUpdateOneRequiredWithoutCouponsNestedInput
  }

  export type CouponUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    couponPolicyId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponCreateManyInput = {
    id?: bigint | number
    couponPolicyId: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
  }

  export type CouponUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    couponPolicyId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[]
    notIn?: $Enums.DiscountType[]
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type CouponListRelationFilter = {
    every?: CouponWhereInput
    some?: CouponWhereInput
    none?: CouponWhereInput
  }

  export type CouponOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CouponPolicyCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    totalQuantity?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponPolicyAvgOrderByAggregateInput = {
    id?: SortOrder
    totalQuantity?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
  }

  export type CouponPolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    totalQuantity?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponPolicyMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    totalQuantity?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponPolicySumOrderByAggregateInput = {
    id?: SortOrder
    totalQuantity?: SortOrder
    discountValue?: SortOrder
    minimumOrderAmount?: SortOrder
    maximumDiscountAmount?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[]
    notIn?: $Enums.DiscountType[]
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type EnumCouponStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CouponStatus | EnumCouponStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CouponStatus[]
    notIn?: $Enums.CouponStatus[]
    not?: NestedEnumCouponStatusFilter<$PrismaModel> | $Enums.CouponStatus
  }

  export type CouponPolicyRelationFilter = {
    is?: CouponPolicyWhereInput
    isNot?: CouponPolicyWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CouponCountOrderByAggregateInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    expirationTime?: SortOrder
    issuedAt?: SortOrder
  }

  export type CouponAvgOrderByAggregateInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
  }

  export type CouponMaxOrderByAggregateInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    expirationTime?: SortOrder
    issuedAt?: SortOrder
  }

  export type CouponMinOrderByAggregateInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    expirationTime?: SortOrder
    issuedAt?: SortOrder
  }

  export type CouponSumOrderByAggregateInput = {
    id?: SortOrder
    couponPolicyId?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type EnumCouponStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CouponStatus | EnumCouponStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CouponStatus[]
    notIn?: $Enums.CouponStatus[]
    not?: NestedEnumCouponStatusWithAggregatesFilter<$PrismaModel> | $Enums.CouponStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCouponStatusFilter<$PrismaModel>
    _max?: NestedEnumCouponStatusFilter<$PrismaModel>
  }

  export type CouponCreateNestedManyWithoutCouponPolicyInput = {
    create?: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput> | CouponCreateWithoutCouponPolicyInput[] | CouponUncheckedCreateWithoutCouponPolicyInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutCouponPolicyInput | CouponCreateOrConnectWithoutCouponPolicyInput[]
    createMany?: CouponCreateManyCouponPolicyInputEnvelope
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
  }

  export type CouponUncheckedCreateNestedManyWithoutCouponPolicyInput = {
    create?: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput> | CouponCreateWithoutCouponPolicyInput[] | CouponUncheckedCreateWithoutCouponPolicyInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutCouponPolicyInput | CouponCreateOrConnectWithoutCouponPolicyInput[]
    createMany?: CouponCreateManyCouponPolicyInputEnvelope
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumDiscountTypeFieldUpdateOperationsInput = {
    set?: $Enums.DiscountType
  }

  export type CouponUpdateManyWithoutCouponPolicyNestedInput = {
    create?: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput> | CouponCreateWithoutCouponPolicyInput[] | CouponUncheckedCreateWithoutCouponPolicyInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutCouponPolicyInput | CouponCreateOrConnectWithoutCouponPolicyInput[]
    upsert?: CouponUpsertWithWhereUniqueWithoutCouponPolicyInput | CouponUpsertWithWhereUniqueWithoutCouponPolicyInput[]
    createMany?: CouponCreateManyCouponPolicyInputEnvelope
    set?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    disconnect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    delete?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    update?: CouponUpdateWithWhereUniqueWithoutCouponPolicyInput | CouponUpdateWithWhereUniqueWithoutCouponPolicyInput[]
    updateMany?: CouponUpdateManyWithWhereWithoutCouponPolicyInput | CouponUpdateManyWithWhereWithoutCouponPolicyInput[]
    deleteMany?: CouponScalarWhereInput | CouponScalarWhereInput[]
  }

  export type CouponUncheckedUpdateManyWithoutCouponPolicyNestedInput = {
    create?: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput> | CouponCreateWithoutCouponPolicyInput[] | CouponUncheckedCreateWithoutCouponPolicyInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutCouponPolicyInput | CouponCreateOrConnectWithoutCouponPolicyInput[]
    upsert?: CouponUpsertWithWhereUniqueWithoutCouponPolicyInput | CouponUpsertWithWhereUniqueWithoutCouponPolicyInput[]
    createMany?: CouponCreateManyCouponPolicyInputEnvelope
    set?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    disconnect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    delete?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    update?: CouponUpdateWithWhereUniqueWithoutCouponPolicyInput | CouponUpdateWithWhereUniqueWithoutCouponPolicyInput[]
    updateMany?: CouponUpdateManyWithWhereWithoutCouponPolicyInput | CouponUpdateManyWithWhereWithoutCouponPolicyInput[]
    deleteMany?: CouponScalarWhereInput | CouponScalarWhereInput[]
  }

  export type CouponPolicyCreateNestedOneWithoutCouponsInput = {
    create?: XOR<CouponPolicyCreateWithoutCouponsInput, CouponPolicyUncheckedCreateWithoutCouponsInput>
    connectOrCreate?: CouponPolicyCreateOrConnectWithoutCouponsInput
    connect?: CouponPolicyWhereUniqueInput
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type EnumCouponStatusFieldUpdateOperationsInput = {
    set?: $Enums.CouponStatus
  }

  export type CouponPolicyUpdateOneRequiredWithoutCouponsNestedInput = {
    create?: XOR<CouponPolicyCreateWithoutCouponsInput, CouponPolicyUncheckedCreateWithoutCouponsInput>
    connectOrCreate?: CouponPolicyCreateOrConnectWithoutCouponsInput
    upsert?: CouponPolicyUpsertWithoutCouponsInput
    connect?: CouponPolicyWhereUniqueInput
    update?: XOR<XOR<CouponPolicyUpdateToOneWithWhereWithoutCouponsInput, CouponPolicyUpdateWithoutCouponsInput>, CouponPolicyUncheckedUpdateWithoutCouponsInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[]
    notIn?: $Enums.DiscountType[]
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[]
    notIn?: $Enums.DiscountType[]
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedEnumCouponStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CouponStatus | EnumCouponStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CouponStatus[]
    notIn?: $Enums.CouponStatus[]
    not?: NestedEnumCouponStatusFilter<$PrismaModel> | $Enums.CouponStatus
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumCouponStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CouponStatus | EnumCouponStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CouponStatus[]
    notIn?: $Enums.CouponStatus[]
    not?: NestedEnumCouponStatusWithAggregatesFilter<$PrismaModel> | $Enums.CouponStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCouponStatusFilter<$PrismaModel>
    _max?: NestedEnumCouponStatusFilter<$PrismaModel>
  }

  export type CouponCreateWithoutCouponPolicyInput = {
    id?: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
  }

  export type CouponUncheckedCreateWithoutCouponPolicyInput = {
    id?: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
  }

  export type CouponCreateOrConnectWithoutCouponPolicyInput = {
    where: CouponWhereUniqueInput
    create: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput>
  }

  export type CouponCreateManyCouponPolicyInputEnvelope = {
    data: CouponCreateManyCouponPolicyInput | CouponCreateManyCouponPolicyInput[]
    skipDuplicates?: boolean
  }

  export type CouponUpsertWithWhereUniqueWithoutCouponPolicyInput = {
    where: CouponWhereUniqueInput
    update: XOR<CouponUpdateWithoutCouponPolicyInput, CouponUncheckedUpdateWithoutCouponPolicyInput>
    create: XOR<CouponCreateWithoutCouponPolicyInput, CouponUncheckedCreateWithoutCouponPolicyInput>
  }

  export type CouponUpdateWithWhereUniqueWithoutCouponPolicyInput = {
    where: CouponWhereUniqueInput
    data: XOR<CouponUpdateWithoutCouponPolicyInput, CouponUncheckedUpdateWithoutCouponPolicyInput>
  }

  export type CouponUpdateManyWithWhereWithoutCouponPolicyInput = {
    where: CouponScalarWhereInput
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyWithoutCouponPolicyInput>
  }

  export type CouponScalarWhereInput = {
    AND?: CouponScalarWhereInput | CouponScalarWhereInput[]
    OR?: CouponScalarWhereInput[]
    NOT?: CouponScalarWhereInput | CouponScalarWhereInput[]
    id?: BigIntFilter<"Coupon"> | bigint | number
    couponPolicyId?: BigIntFilter<"Coupon"> | bigint | number
    userId?: BigIntFilter<"Coupon"> | bigint | number
    orderId?: BigIntNullableFilter<"Coupon"> | bigint | number | null
    status?: EnumCouponStatusFilter<"Coupon"> | $Enums.CouponStatus
    expirationTime?: DateTimeFilter<"Coupon"> | Date | string
    issuedAt?: DateTimeFilter<"Coupon"> | Date | string
  }

  export type CouponPolicyCreateWithoutCouponsInput = {
    id?: bigint | number
    title: string
    description: string
    totalQuantity: number
    startTime: Date | string
    endTime: Date | string
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponPolicyUncheckedCreateWithoutCouponsInput = {
    id?: bigint | number
    title: string
    description: string
    totalQuantity: number
    startTime: Date | string
    endTime: Date | string
    discountType: $Enums.DiscountType
    discountValue: number
    minimumOrderAmount: number
    maximumDiscountAmount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponPolicyCreateOrConnectWithoutCouponsInput = {
    where: CouponPolicyWhereUniqueInput
    create: XOR<CouponPolicyCreateWithoutCouponsInput, CouponPolicyUncheckedCreateWithoutCouponsInput>
  }

  export type CouponPolicyUpsertWithoutCouponsInput = {
    update: XOR<CouponPolicyUpdateWithoutCouponsInput, CouponPolicyUncheckedUpdateWithoutCouponsInput>
    create: XOR<CouponPolicyCreateWithoutCouponsInput, CouponPolicyUncheckedCreateWithoutCouponsInput>
    where?: CouponPolicyWhereInput
  }

  export type CouponPolicyUpdateToOneWithWhereWithoutCouponsInput = {
    where?: CouponPolicyWhereInput
    data: XOR<CouponPolicyUpdateWithoutCouponsInput, CouponPolicyUncheckedUpdateWithoutCouponsInput>
  }

  export type CouponPolicyUpdateWithoutCouponsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponPolicyUncheckedUpdateWithoutCouponsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    totalQuantity?: IntFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountValue?: IntFieldUpdateOperationsInput | number
    minimumOrderAmount?: IntFieldUpdateOperationsInput | number
    maximumDiscountAmount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponCreateManyCouponPolicyInput = {
    id?: bigint | number
    userId: bigint | number
    orderId?: bigint | number | null
    status?: $Enums.CouponStatus
    expirationTime: Date | string
    issuedAt?: Date | string
  }

  export type CouponUpdateWithoutCouponPolicyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateWithoutCouponPolicyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateManyWithoutCouponPolicyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    orderId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    status?: EnumCouponStatusFieldUpdateOperationsInput | $Enums.CouponStatus
    expirationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CouponPolicyCountOutputTypeDefaultArgs instead
     */
    export type CouponPolicyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CouponPolicyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CouponPolicyDefaultArgs instead
     */
    export type CouponPolicyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CouponPolicyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CouponDefaultArgs instead
     */
    export type CouponArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CouponDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}