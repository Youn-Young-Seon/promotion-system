
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
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model TimeSale
 * 
 */
export type TimeSale = $Result.DefaultSelection<Prisma.$TimeSalePayload>
/**
 * Model TimeSaleOrder
 * 
 */
export type TimeSaleOrder = $Result.DefaultSelection<Prisma.$TimeSaleOrderPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TimeSaleStatus: {
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  CANCELED: 'CANCELED'
};

export type TimeSaleStatus = (typeof TimeSaleStatus)[keyof typeof TimeSaleStatus]


export const OrderStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

}

export type TimeSaleStatus = $Enums.TimeSaleStatus

export const TimeSaleStatus: typeof $Enums.TimeSaleStatus

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Products
 * const products = await prisma.product.findMany()
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
   * // Fetch zero or more Products
   * const products = await prisma.product.findMany()
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
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.timeSale`: Exposes CRUD operations for the **TimeSale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TimeSales
    * const timeSales = await prisma.timeSale.findMany()
    * ```
    */
  get timeSale(): Prisma.TimeSaleDelegate<ExtArgs>;

  /**
   * `prisma.timeSaleOrder`: Exposes CRUD operations for the **TimeSaleOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TimeSaleOrders
    * const timeSaleOrders = await prisma.timeSaleOrder.findMany()
    * ```
    */
  get timeSaleOrder(): Prisma.TimeSaleOrderDelegate<ExtArgs>;
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
    Product: 'Product',
    TimeSale: 'TimeSale',
    TimeSaleOrder: 'TimeSaleOrder'
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
      modelProps: "product" | "timeSale" | "timeSaleOrder"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      TimeSale: {
        payload: Prisma.$TimeSalePayload<ExtArgs>
        fields: Prisma.TimeSaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TimeSaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TimeSaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          findFirst: {
            args: Prisma.TimeSaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TimeSaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          findMany: {
            args: Prisma.TimeSaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>[]
          }
          create: {
            args: Prisma.TimeSaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          createMany: {
            args: Prisma.TimeSaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TimeSaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          update: {
            args: Prisma.TimeSaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          deleteMany: {
            args: Prisma.TimeSaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TimeSaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TimeSaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSalePayload>
          }
          aggregate: {
            args: Prisma.TimeSaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTimeSale>
          }
          groupBy: {
            args: Prisma.TimeSaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<TimeSaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.TimeSaleCountArgs<ExtArgs>
            result: $Utils.Optional<TimeSaleCountAggregateOutputType> | number
          }
        }
      }
      TimeSaleOrder: {
        payload: Prisma.$TimeSaleOrderPayload<ExtArgs>
        fields: Prisma.TimeSaleOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TimeSaleOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TimeSaleOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          findFirst: {
            args: Prisma.TimeSaleOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TimeSaleOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          findMany: {
            args: Prisma.TimeSaleOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>[]
          }
          create: {
            args: Prisma.TimeSaleOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          createMany: {
            args: Prisma.TimeSaleOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TimeSaleOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          update: {
            args: Prisma.TimeSaleOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          deleteMany: {
            args: Prisma.TimeSaleOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TimeSaleOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TimeSaleOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TimeSaleOrderPayload>
          }
          aggregate: {
            args: Prisma.TimeSaleOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTimeSaleOrder>
          }
          groupBy: {
            args: Prisma.TimeSaleOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<TimeSaleOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.TimeSaleOrderCountArgs<ExtArgs>
            result: $Utils.Optional<TimeSaleOrderCountAggregateOutputType> | number
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
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    timeSales: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timeSales?: boolean | ProductCountOutputTypeCountTimeSalesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountTimeSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimeSaleWhereInput
  }


  /**
   * Count Type TimeSaleCountOutputType
   */

  export type TimeSaleCountOutputType = {
    orders: number
  }

  export type TimeSaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | TimeSaleCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * TimeSaleCountOutputType without action
   */
  export type TimeSaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleCountOutputType
     */
    select?: TimeSaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TimeSaleCountOutputType without action
   */
  export type TimeSaleCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimeSaleOrderWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    price: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: bigint | null
    price: bigint | null
  }

  export type ProductMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    price: bigint | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    price: bigint | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    price: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    price?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    price?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: bigint
    name: string
    price: bigint
    description: string
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    timeSales?: boolean | Product$timeSalesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>


  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timeSales?: boolean | Product$timeSalesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      timeSales: Prisma.$TimeSalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      price: bigint
      description: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
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
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    timeSales<T extends Product$timeSalesArgs<ExtArgs> = {}>(args?: Subset<T, Product$timeSalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'BigInt'>
    readonly name: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'BigInt'>
    readonly description: FieldRef<"Product", 'String'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product.timeSales
   */
  export type Product$timeSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    where?: TimeSaleWhereInput
    orderBy?: TimeSaleOrderByWithRelationInput | TimeSaleOrderByWithRelationInput[]
    cursor?: TimeSaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TimeSaleScalarFieldEnum | TimeSaleScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model TimeSale
   */

  export type AggregateTimeSale = {
    _count: TimeSaleCountAggregateOutputType | null
    _avg: TimeSaleAvgAggregateOutputType | null
    _sum: TimeSaleSumAggregateOutputType | null
    _min: TimeSaleMinAggregateOutputType | null
    _max: TimeSaleMaxAggregateOutputType | null
  }

  export type TimeSaleAvgAggregateOutputType = {
    id: number | null
    productId: number | null
    quantity: number | null
    remainingQuantity: number | null
    discountPrice: number | null
    version: number | null
  }

  export type TimeSaleSumAggregateOutputType = {
    id: bigint | null
    productId: bigint | null
    quantity: bigint | null
    remainingQuantity: bigint | null
    discountPrice: bigint | null
    version: bigint | null
  }

  export type TimeSaleMinAggregateOutputType = {
    id: bigint | null
    productId: bigint | null
    quantity: bigint | null
    remainingQuantity: bigint | null
    discountPrice: bigint | null
    startAt: Date | null
    endAt: Date | null
    status: $Enums.TimeSaleStatus | null
    version: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimeSaleMaxAggregateOutputType = {
    id: bigint | null
    productId: bigint | null
    quantity: bigint | null
    remainingQuantity: bigint | null
    discountPrice: bigint | null
    startAt: Date | null
    endAt: Date | null
    status: $Enums.TimeSaleStatus | null
    version: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimeSaleCountAggregateOutputType = {
    id: number
    productId: number
    quantity: number
    remainingQuantity: number
    discountPrice: number
    startAt: number
    endAt: number
    status: number
    version: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TimeSaleAvgAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    remainingQuantity?: true
    discountPrice?: true
    version?: true
  }

  export type TimeSaleSumAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    remainingQuantity?: true
    discountPrice?: true
    version?: true
  }

  export type TimeSaleMinAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    remainingQuantity?: true
    discountPrice?: true
    startAt?: true
    endAt?: true
    status?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimeSaleMaxAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    remainingQuantity?: true
    discountPrice?: true
    startAt?: true
    endAt?: true
    status?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimeSaleCountAggregateInputType = {
    id?: true
    productId?: true
    quantity?: true
    remainingQuantity?: true
    discountPrice?: true
    startAt?: true
    endAt?: true
    status?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TimeSaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimeSale to aggregate.
     */
    where?: TimeSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSales to fetch.
     */
    orderBy?: TimeSaleOrderByWithRelationInput | TimeSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TimeSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TimeSales
    **/
    _count?: true | TimeSaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TimeSaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TimeSaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TimeSaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TimeSaleMaxAggregateInputType
  }

  export type GetTimeSaleAggregateType<T extends TimeSaleAggregateArgs> = {
        [P in keyof T & keyof AggregateTimeSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTimeSale[P]>
      : GetScalarType<T[P], AggregateTimeSale[P]>
  }




  export type TimeSaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimeSaleWhereInput
    orderBy?: TimeSaleOrderByWithAggregationInput | TimeSaleOrderByWithAggregationInput[]
    by: TimeSaleScalarFieldEnum[] | TimeSaleScalarFieldEnum
    having?: TimeSaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TimeSaleCountAggregateInputType | true
    _avg?: TimeSaleAvgAggregateInputType
    _sum?: TimeSaleSumAggregateInputType
    _min?: TimeSaleMinAggregateInputType
    _max?: TimeSaleMaxAggregateInputType
  }

  export type TimeSaleGroupByOutputType = {
    id: bigint
    productId: bigint
    quantity: bigint
    remainingQuantity: bigint
    discountPrice: bigint
    startAt: Date
    endAt: Date
    status: $Enums.TimeSaleStatus
    version: bigint
    createdAt: Date
    updatedAt: Date
    _count: TimeSaleCountAggregateOutputType | null
    _avg: TimeSaleAvgAggregateOutputType | null
    _sum: TimeSaleSumAggregateOutputType | null
    _min: TimeSaleMinAggregateOutputType | null
    _max: TimeSaleMaxAggregateOutputType | null
  }

  type GetTimeSaleGroupByPayload<T extends TimeSaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TimeSaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TimeSaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TimeSaleGroupByOutputType[P]>
            : GetScalarType<T[P], TimeSaleGroupByOutputType[P]>
        }
      >
    >


  export type TimeSaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    quantity?: boolean
    remainingQuantity?: boolean
    discountPrice?: boolean
    startAt?: boolean
    endAt?: boolean
    status?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    orders?: boolean | TimeSale$ordersArgs<ExtArgs>
    _count?: boolean | TimeSaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timeSale"]>


  export type TimeSaleSelectScalar = {
    id?: boolean
    productId?: boolean
    quantity?: boolean
    remainingQuantity?: boolean
    discountPrice?: boolean
    startAt?: boolean
    endAt?: boolean
    status?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TimeSaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    orders?: boolean | TimeSale$ordersArgs<ExtArgs>
    _count?: boolean | TimeSaleCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TimeSalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TimeSale"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      orders: Prisma.$TimeSaleOrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      productId: bigint
      quantity: bigint
      remainingQuantity: bigint
      discountPrice: bigint
      startAt: Date
      endAt: Date
      status: $Enums.TimeSaleStatus
      version: bigint
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["timeSale"]>
    composites: {}
  }

  type TimeSaleGetPayload<S extends boolean | null | undefined | TimeSaleDefaultArgs> = $Result.GetResult<Prisma.$TimeSalePayload, S>

  type TimeSaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TimeSaleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TimeSaleCountAggregateInputType | true
    }

  export interface TimeSaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TimeSale'], meta: { name: 'TimeSale' } }
    /**
     * Find zero or one TimeSale that matches the filter.
     * @param {TimeSaleFindUniqueArgs} args - Arguments to find a TimeSale
     * @example
     * // Get one TimeSale
     * const timeSale = await prisma.timeSale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TimeSaleFindUniqueArgs>(args: SelectSubset<T, TimeSaleFindUniqueArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TimeSale that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TimeSaleFindUniqueOrThrowArgs} args - Arguments to find a TimeSale
     * @example
     * // Get one TimeSale
     * const timeSale = await prisma.timeSale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TimeSaleFindUniqueOrThrowArgs>(args: SelectSubset<T, TimeSaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TimeSale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleFindFirstArgs} args - Arguments to find a TimeSale
     * @example
     * // Get one TimeSale
     * const timeSale = await prisma.timeSale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TimeSaleFindFirstArgs>(args?: SelectSubset<T, TimeSaleFindFirstArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TimeSale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleFindFirstOrThrowArgs} args - Arguments to find a TimeSale
     * @example
     * // Get one TimeSale
     * const timeSale = await prisma.timeSale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TimeSaleFindFirstOrThrowArgs>(args?: SelectSubset<T, TimeSaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TimeSales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TimeSales
     * const timeSales = await prisma.timeSale.findMany()
     * 
     * // Get first 10 TimeSales
     * const timeSales = await prisma.timeSale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const timeSaleWithIdOnly = await prisma.timeSale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TimeSaleFindManyArgs>(args?: SelectSubset<T, TimeSaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TimeSale.
     * @param {TimeSaleCreateArgs} args - Arguments to create a TimeSale.
     * @example
     * // Create one TimeSale
     * const TimeSale = await prisma.timeSale.create({
     *   data: {
     *     // ... data to create a TimeSale
     *   }
     * })
     * 
     */
    create<T extends TimeSaleCreateArgs>(args: SelectSubset<T, TimeSaleCreateArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TimeSales.
     * @param {TimeSaleCreateManyArgs} args - Arguments to create many TimeSales.
     * @example
     * // Create many TimeSales
     * const timeSale = await prisma.timeSale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TimeSaleCreateManyArgs>(args?: SelectSubset<T, TimeSaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TimeSale.
     * @param {TimeSaleDeleteArgs} args - Arguments to delete one TimeSale.
     * @example
     * // Delete one TimeSale
     * const TimeSale = await prisma.timeSale.delete({
     *   where: {
     *     // ... filter to delete one TimeSale
     *   }
     * })
     * 
     */
    delete<T extends TimeSaleDeleteArgs>(args: SelectSubset<T, TimeSaleDeleteArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TimeSale.
     * @param {TimeSaleUpdateArgs} args - Arguments to update one TimeSale.
     * @example
     * // Update one TimeSale
     * const timeSale = await prisma.timeSale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TimeSaleUpdateArgs>(args: SelectSubset<T, TimeSaleUpdateArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TimeSales.
     * @param {TimeSaleDeleteManyArgs} args - Arguments to filter TimeSales to delete.
     * @example
     * // Delete a few TimeSales
     * const { count } = await prisma.timeSale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TimeSaleDeleteManyArgs>(args?: SelectSubset<T, TimeSaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TimeSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TimeSales
     * const timeSale = await prisma.timeSale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TimeSaleUpdateManyArgs>(args: SelectSubset<T, TimeSaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TimeSale.
     * @param {TimeSaleUpsertArgs} args - Arguments to update or create a TimeSale.
     * @example
     * // Update or create a TimeSale
     * const timeSale = await prisma.timeSale.upsert({
     *   create: {
     *     // ... data to create a TimeSale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TimeSale we want to update
     *   }
     * })
     */
    upsert<T extends TimeSaleUpsertArgs>(args: SelectSubset<T, TimeSaleUpsertArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TimeSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleCountArgs} args - Arguments to filter TimeSales to count.
     * @example
     * // Count the number of TimeSales
     * const count = await prisma.timeSale.count({
     *   where: {
     *     // ... the filter for the TimeSales we want to count
     *   }
     * })
    **/
    count<T extends TimeSaleCountArgs>(
      args?: Subset<T, TimeSaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TimeSaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TimeSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TimeSaleAggregateArgs>(args: Subset<T, TimeSaleAggregateArgs>): Prisma.PrismaPromise<GetTimeSaleAggregateType<T>>

    /**
     * Group by TimeSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleGroupByArgs} args - Group by arguments.
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
      T extends TimeSaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TimeSaleGroupByArgs['orderBy'] }
        : { orderBy?: TimeSaleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TimeSaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimeSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TimeSale model
   */
  readonly fields: TimeSaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TimeSale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TimeSaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    orders<T extends TimeSale$ordersArgs<ExtArgs> = {}>(args?: Subset<T, TimeSale$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the TimeSale model
   */ 
  interface TimeSaleFieldRefs {
    readonly id: FieldRef<"TimeSale", 'BigInt'>
    readonly productId: FieldRef<"TimeSale", 'BigInt'>
    readonly quantity: FieldRef<"TimeSale", 'BigInt'>
    readonly remainingQuantity: FieldRef<"TimeSale", 'BigInt'>
    readonly discountPrice: FieldRef<"TimeSale", 'BigInt'>
    readonly startAt: FieldRef<"TimeSale", 'DateTime'>
    readonly endAt: FieldRef<"TimeSale", 'DateTime'>
    readonly status: FieldRef<"TimeSale", 'TimeSaleStatus'>
    readonly version: FieldRef<"TimeSale", 'BigInt'>
    readonly createdAt: FieldRef<"TimeSale", 'DateTime'>
    readonly updatedAt: FieldRef<"TimeSale", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TimeSale findUnique
   */
  export type TimeSaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter, which TimeSale to fetch.
     */
    where: TimeSaleWhereUniqueInput
  }

  /**
   * TimeSale findUniqueOrThrow
   */
  export type TimeSaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter, which TimeSale to fetch.
     */
    where: TimeSaleWhereUniqueInput
  }

  /**
   * TimeSale findFirst
   */
  export type TimeSaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter, which TimeSale to fetch.
     */
    where?: TimeSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSales to fetch.
     */
    orderBy?: TimeSaleOrderByWithRelationInput | TimeSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimeSales.
     */
    cursor?: TimeSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimeSales.
     */
    distinct?: TimeSaleScalarFieldEnum | TimeSaleScalarFieldEnum[]
  }

  /**
   * TimeSale findFirstOrThrow
   */
  export type TimeSaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter, which TimeSale to fetch.
     */
    where?: TimeSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSales to fetch.
     */
    orderBy?: TimeSaleOrderByWithRelationInput | TimeSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimeSales.
     */
    cursor?: TimeSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimeSales.
     */
    distinct?: TimeSaleScalarFieldEnum | TimeSaleScalarFieldEnum[]
  }

  /**
   * TimeSale findMany
   */
  export type TimeSaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter, which TimeSales to fetch.
     */
    where?: TimeSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSales to fetch.
     */
    orderBy?: TimeSaleOrderByWithRelationInput | TimeSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TimeSales.
     */
    cursor?: TimeSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSales.
     */
    skip?: number
    distinct?: TimeSaleScalarFieldEnum | TimeSaleScalarFieldEnum[]
  }

  /**
   * TimeSale create
   */
  export type TimeSaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * The data needed to create a TimeSale.
     */
    data: XOR<TimeSaleCreateInput, TimeSaleUncheckedCreateInput>
  }

  /**
   * TimeSale createMany
   */
  export type TimeSaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TimeSales.
     */
    data: TimeSaleCreateManyInput | TimeSaleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TimeSale update
   */
  export type TimeSaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * The data needed to update a TimeSale.
     */
    data: XOR<TimeSaleUpdateInput, TimeSaleUncheckedUpdateInput>
    /**
     * Choose, which TimeSale to update.
     */
    where: TimeSaleWhereUniqueInput
  }

  /**
   * TimeSale updateMany
   */
  export type TimeSaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TimeSales.
     */
    data: XOR<TimeSaleUpdateManyMutationInput, TimeSaleUncheckedUpdateManyInput>
    /**
     * Filter which TimeSales to update
     */
    where?: TimeSaleWhereInput
  }

  /**
   * TimeSale upsert
   */
  export type TimeSaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * The filter to search for the TimeSale to update in case it exists.
     */
    where: TimeSaleWhereUniqueInput
    /**
     * In case the TimeSale found by the `where` argument doesn't exist, create a new TimeSale with this data.
     */
    create: XOR<TimeSaleCreateInput, TimeSaleUncheckedCreateInput>
    /**
     * In case the TimeSale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TimeSaleUpdateInput, TimeSaleUncheckedUpdateInput>
  }

  /**
   * TimeSale delete
   */
  export type TimeSaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
    /**
     * Filter which TimeSale to delete.
     */
    where: TimeSaleWhereUniqueInput
  }

  /**
   * TimeSale deleteMany
   */
  export type TimeSaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimeSales to delete
     */
    where?: TimeSaleWhereInput
  }

  /**
   * TimeSale.orders
   */
  export type TimeSale$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    where?: TimeSaleOrderWhereInput
    orderBy?: TimeSaleOrderOrderByWithRelationInput | TimeSaleOrderOrderByWithRelationInput[]
    cursor?: TimeSaleOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TimeSaleOrderScalarFieldEnum | TimeSaleOrderScalarFieldEnum[]
  }

  /**
   * TimeSale without action
   */
  export type TimeSaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSale
     */
    select?: TimeSaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleInclude<ExtArgs> | null
  }


  /**
   * Model TimeSaleOrder
   */

  export type AggregateTimeSaleOrder = {
    _count: TimeSaleOrderCountAggregateOutputType | null
    _avg: TimeSaleOrderAvgAggregateOutputType | null
    _sum: TimeSaleOrderSumAggregateOutputType | null
    _min: TimeSaleOrderMinAggregateOutputType | null
    _max: TimeSaleOrderMaxAggregateOutputType | null
  }

  export type TimeSaleOrderAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    timeSaleId: number | null
    quantity: number | null
  }

  export type TimeSaleOrderSumAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    timeSaleId: bigint | null
    quantity: bigint | null
  }

  export type TimeSaleOrderMinAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    timeSaleId: bigint | null
    quantity: bigint | null
    status: $Enums.OrderStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimeSaleOrderMaxAggregateOutputType = {
    id: bigint | null
    userId: bigint | null
    timeSaleId: bigint | null
    quantity: bigint | null
    status: $Enums.OrderStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TimeSaleOrderCountAggregateOutputType = {
    id: number
    userId: number
    timeSaleId: number
    quantity: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TimeSaleOrderAvgAggregateInputType = {
    id?: true
    userId?: true
    timeSaleId?: true
    quantity?: true
  }

  export type TimeSaleOrderSumAggregateInputType = {
    id?: true
    userId?: true
    timeSaleId?: true
    quantity?: true
  }

  export type TimeSaleOrderMinAggregateInputType = {
    id?: true
    userId?: true
    timeSaleId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimeSaleOrderMaxAggregateInputType = {
    id?: true
    userId?: true
    timeSaleId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TimeSaleOrderCountAggregateInputType = {
    id?: true
    userId?: true
    timeSaleId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TimeSaleOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimeSaleOrder to aggregate.
     */
    where?: TimeSaleOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSaleOrders to fetch.
     */
    orderBy?: TimeSaleOrderOrderByWithRelationInput | TimeSaleOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TimeSaleOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSaleOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSaleOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TimeSaleOrders
    **/
    _count?: true | TimeSaleOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TimeSaleOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TimeSaleOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TimeSaleOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TimeSaleOrderMaxAggregateInputType
  }

  export type GetTimeSaleOrderAggregateType<T extends TimeSaleOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateTimeSaleOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTimeSaleOrder[P]>
      : GetScalarType<T[P], AggregateTimeSaleOrder[P]>
  }




  export type TimeSaleOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TimeSaleOrderWhereInput
    orderBy?: TimeSaleOrderOrderByWithAggregationInput | TimeSaleOrderOrderByWithAggregationInput[]
    by: TimeSaleOrderScalarFieldEnum[] | TimeSaleOrderScalarFieldEnum
    having?: TimeSaleOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TimeSaleOrderCountAggregateInputType | true
    _avg?: TimeSaleOrderAvgAggregateInputType
    _sum?: TimeSaleOrderSumAggregateInputType
    _min?: TimeSaleOrderMinAggregateInputType
    _max?: TimeSaleOrderMaxAggregateInputType
  }

  export type TimeSaleOrderGroupByOutputType = {
    id: bigint
    userId: bigint
    timeSaleId: bigint
    quantity: bigint
    status: $Enums.OrderStatus
    createdAt: Date
    updatedAt: Date
    _count: TimeSaleOrderCountAggregateOutputType | null
    _avg: TimeSaleOrderAvgAggregateOutputType | null
    _sum: TimeSaleOrderSumAggregateOutputType | null
    _min: TimeSaleOrderMinAggregateOutputType | null
    _max: TimeSaleOrderMaxAggregateOutputType | null
  }

  type GetTimeSaleOrderGroupByPayload<T extends TimeSaleOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TimeSaleOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TimeSaleOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TimeSaleOrderGroupByOutputType[P]>
            : GetScalarType<T[P], TimeSaleOrderGroupByOutputType[P]>
        }
      >
    >


  export type TimeSaleOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    timeSaleId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    timeSale?: boolean | TimeSaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["timeSaleOrder"]>


  export type TimeSaleOrderSelectScalar = {
    id?: boolean
    userId?: boolean
    timeSaleId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TimeSaleOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    timeSale?: boolean | TimeSaleDefaultArgs<ExtArgs>
  }

  export type $TimeSaleOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TimeSaleOrder"
    objects: {
      timeSale: Prisma.$TimeSalePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      userId: bigint
      timeSaleId: bigint
      quantity: bigint
      status: $Enums.OrderStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["timeSaleOrder"]>
    composites: {}
  }

  type TimeSaleOrderGetPayload<S extends boolean | null | undefined | TimeSaleOrderDefaultArgs> = $Result.GetResult<Prisma.$TimeSaleOrderPayload, S>

  type TimeSaleOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TimeSaleOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TimeSaleOrderCountAggregateInputType | true
    }

  export interface TimeSaleOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TimeSaleOrder'], meta: { name: 'TimeSaleOrder' } }
    /**
     * Find zero or one TimeSaleOrder that matches the filter.
     * @param {TimeSaleOrderFindUniqueArgs} args - Arguments to find a TimeSaleOrder
     * @example
     * // Get one TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TimeSaleOrderFindUniqueArgs>(args: SelectSubset<T, TimeSaleOrderFindUniqueArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TimeSaleOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TimeSaleOrderFindUniqueOrThrowArgs} args - Arguments to find a TimeSaleOrder
     * @example
     * // Get one TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TimeSaleOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, TimeSaleOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TimeSaleOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderFindFirstArgs} args - Arguments to find a TimeSaleOrder
     * @example
     * // Get one TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TimeSaleOrderFindFirstArgs>(args?: SelectSubset<T, TimeSaleOrderFindFirstArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TimeSaleOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderFindFirstOrThrowArgs} args - Arguments to find a TimeSaleOrder
     * @example
     * // Get one TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TimeSaleOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, TimeSaleOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TimeSaleOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TimeSaleOrders
     * const timeSaleOrders = await prisma.timeSaleOrder.findMany()
     * 
     * // Get first 10 TimeSaleOrders
     * const timeSaleOrders = await prisma.timeSaleOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const timeSaleOrderWithIdOnly = await prisma.timeSaleOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TimeSaleOrderFindManyArgs>(args?: SelectSubset<T, TimeSaleOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TimeSaleOrder.
     * @param {TimeSaleOrderCreateArgs} args - Arguments to create a TimeSaleOrder.
     * @example
     * // Create one TimeSaleOrder
     * const TimeSaleOrder = await prisma.timeSaleOrder.create({
     *   data: {
     *     // ... data to create a TimeSaleOrder
     *   }
     * })
     * 
     */
    create<T extends TimeSaleOrderCreateArgs>(args: SelectSubset<T, TimeSaleOrderCreateArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TimeSaleOrders.
     * @param {TimeSaleOrderCreateManyArgs} args - Arguments to create many TimeSaleOrders.
     * @example
     * // Create many TimeSaleOrders
     * const timeSaleOrder = await prisma.timeSaleOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TimeSaleOrderCreateManyArgs>(args?: SelectSubset<T, TimeSaleOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TimeSaleOrder.
     * @param {TimeSaleOrderDeleteArgs} args - Arguments to delete one TimeSaleOrder.
     * @example
     * // Delete one TimeSaleOrder
     * const TimeSaleOrder = await prisma.timeSaleOrder.delete({
     *   where: {
     *     // ... filter to delete one TimeSaleOrder
     *   }
     * })
     * 
     */
    delete<T extends TimeSaleOrderDeleteArgs>(args: SelectSubset<T, TimeSaleOrderDeleteArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TimeSaleOrder.
     * @param {TimeSaleOrderUpdateArgs} args - Arguments to update one TimeSaleOrder.
     * @example
     * // Update one TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TimeSaleOrderUpdateArgs>(args: SelectSubset<T, TimeSaleOrderUpdateArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TimeSaleOrders.
     * @param {TimeSaleOrderDeleteManyArgs} args - Arguments to filter TimeSaleOrders to delete.
     * @example
     * // Delete a few TimeSaleOrders
     * const { count } = await prisma.timeSaleOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TimeSaleOrderDeleteManyArgs>(args?: SelectSubset<T, TimeSaleOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TimeSaleOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TimeSaleOrders
     * const timeSaleOrder = await prisma.timeSaleOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TimeSaleOrderUpdateManyArgs>(args: SelectSubset<T, TimeSaleOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TimeSaleOrder.
     * @param {TimeSaleOrderUpsertArgs} args - Arguments to update or create a TimeSaleOrder.
     * @example
     * // Update or create a TimeSaleOrder
     * const timeSaleOrder = await prisma.timeSaleOrder.upsert({
     *   create: {
     *     // ... data to create a TimeSaleOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TimeSaleOrder we want to update
     *   }
     * })
     */
    upsert<T extends TimeSaleOrderUpsertArgs>(args: SelectSubset<T, TimeSaleOrderUpsertArgs<ExtArgs>>): Prisma__TimeSaleOrderClient<$Result.GetResult<Prisma.$TimeSaleOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TimeSaleOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderCountArgs} args - Arguments to filter TimeSaleOrders to count.
     * @example
     * // Count the number of TimeSaleOrders
     * const count = await prisma.timeSaleOrder.count({
     *   where: {
     *     // ... the filter for the TimeSaleOrders we want to count
     *   }
     * })
    **/
    count<T extends TimeSaleOrderCountArgs>(
      args?: Subset<T, TimeSaleOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TimeSaleOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TimeSaleOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TimeSaleOrderAggregateArgs>(args: Subset<T, TimeSaleOrderAggregateArgs>): Prisma.PrismaPromise<GetTimeSaleOrderAggregateType<T>>

    /**
     * Group by TimeSaleOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TimeSaleOrderGroupByArgs} args - Group by arguments.
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
      T extends TimeSaleOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TimeSaleOrderGroupByArgs['orderBy'] }
        : { orderBy?: TimeSaleOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TimeSaleOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimeSaleOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TimeSaleOrder model
   */
  readonly fields: TimeSaleOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TimeSaleOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TimeSaleOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    timeSale<T extends TimeSaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TimeSaleDefaultArgs<ExtArgs>>): Prisma__TimeSaleClient<$Result.GetResult<Prisma.$TimeSalePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the TimeSaleOrder model
   */ 
  interface TimeSaleOrderFieldRefs {
    readonly id: FieldRef<"TimeSaleOrder", 'BigInt'>
    readonly userId: FieldRef<"TimeSaleOrder", 'BigInt'>
    readonly timeSaleId: FieldRef<"TimeSaleOrder", 'BigInt'>
    readonly quantity: FieldRef<"TimeSaleOrder", 'BigInt'>
    readonly status: FieldRef<"TimeSaleOrder", 'OrderStatus'>
    readonly createdAt: FieldRef<"TimeSaleOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"TimeSaleOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TimeSaleOrder findUnique
   */
  export type TimeSaleOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter, which TimeSaleOrder to fetch.
     */
    where: TimeSaleOrderWhereUniqueInput
  }

  /**
   * TimeSaleOrder findUniqueOrThrow
   */
  export type TimeSaleOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter, which TimeSaleOrder to fetch.
     */
    where: TimeSaleOrderWhereUniqueInput
  }

  /**
   * TimeSaleOrder findFirst
   */
  export type TimeSaleOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter, which TimeSaleOrder to fetch.
     */
    where?: TimeSaleOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSaleOrders to fetch.
     */
    orderBy?: TimeSaleOrderOrderByWithRelationInput | TimeSaleOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimeSaleOrders.
     */
    cursor?: TimeSaleOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSaleOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSaleOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimeSaleOrders.
     */
    distinct?: TimeSaleOrderScalarFieldEnum | TimeSaleOrderScalarFieldEnum[]
  }

  /**
   * TimeSaleOrder findFirstOrThrow
   */
  export type TimeSaleOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter, which TimeSaleOrder to fetch.
     */
    where?: TimeSaleOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSaleOrders to fetch.
     */
    orderBy?: TimeSaleOrderOrderByWithRelationInput | TimeSaleOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TimeSaleOrders.
     */
    cursor?: TimeSaleOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSaleOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSaleOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TimeSaleOrders.
     */
    distinct?: TimeSaleOrderScalarFieldEnum | TimeSaleOrderScalarFieldEnum[]
  }

  /**
   * TimeSaleOrder findMany
   */
  export type TimeSaleOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter, which TimeSaleOrders to fetch.
     */
    where?: TimeSaleOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TimeSaleOrders to fetch.
     */
    orderBy?: TimeSaleOrderOrderByWithRelationInput | TimeSaleOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TimeSaleOrders.
     */
    cursor?: TimeSaleOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TimeSaleOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TimeSaleOrders.
     */
    skip?: number
    distinct?: TimeSaleOrderScalarFieldEnum | TimeSaleOrderScalarFieldEnum[]
  }

  /**
   * TimeSaleOrder create
   */
  export type TimeSaleOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a TimeSaleOrder.
     */
    data: XOR<TimeSaleOrderCreateInput, TimeSaleOrderUncheckedCreateInput>
  }

  /**
   * TimeSaleOrder createMany
   */
  export type TimeSaleOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TimeSaleOrders.
     */
    data: TimeSaleOrderCreateManyInput | TimeSaleOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TimeSaleOrder update
   */
  export type TimeSaleOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a TimeSaleOrder.
     */
    data: XOR<TimeSaleOrderUpdateInput, TimeSaleOrderUncheckedUpdateInput>
    /**
     * Choose, which TimeSaleOrder to update.
     */
    where: TimeSaleOrderWhereUniqueInput
  }

  /**
   * TimeSaleOrder updateMany
   */
  export type TimeSaleOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TimeSaleOrders.
     */
    data: XOR<TimeSaleOrderUpdateManyMutationInput, TimeSaleOrderUncheckedUpdateManyInput>
    /**
     * Filter which TimeSaleOrders to update
     */
    where?: TimeSaleOrderWhereInput
  }

  /**
   * TimeSaleOrder upsert
   */
  export type TimeSaleOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the TimeSaleOrder to update in case it exists.
     */
    where: TimeSaleOrderWhereUniqueInput
    /**
     * In case the TimeSaleOrder found by the `where` argument doesn't exist, create a new TimeSaleOrder with this data.
     */
    create: XOR<TimeSaleOrderCreateInput, TimeSaleOrderUncheckedCreateInput>
    /**
     * In case the TimeSaleOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TimeSaleOrderUpdateInput, TimeSaleOrderUncheckedUpdateInput>
  }

  /**
   * TimeSaleOrder delete
   */
  export type TimeSaleOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
    /**
     * Filter which TimeSaleOrder to delete.
     */
    where: TimeSaleOrderWhereUniqueInput
  }

  /**
   * TimeSaleOrder deleteMany
   */
  export type TimeSaleOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TimeSaleOrders to delete
     */
    where?: TimeSaleOrderWhereInput
  }

  /**
   * TimeSaleOrder without action
   */
  export type TimeSaleOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TimeSaleOrder
     */
    select?: TimeSaleOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TimeSaleOrderInclude<ExtArgs> | null
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


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const TimeSaleScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    quantity: 'quantity',
    remainingQuantity: 'remainingQuantity',
    discountPrice: 'discountPrice',
    startAt: 'startAt',
    endAt: 'endAt',
    status: 'status',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TimeSaleScalarFieldEnum = (typeof TimeSaleScalarFieldEnum)[keyof typeof TimeSaleScalarFieldEnum]


  export const TimeSaleOrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    timeSaleId: 'timeSaleId',
    quantity: 'quantity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TimeSaleOrderScalarFieldEnum = (typeof TimeSaleOrderScalarFieldEnum)[keyof typeof TimeSaleOrderScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'TimeSaleStatus'
   */
  export type EnumTimeSaleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TimeSaleStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: BigIntFilter<"Product"> | bigint | number
    name?: StringFilter<"Product"> | string
    price?: BigIntFilter<"Product"> | bigint | number
    description?: StringFilter<"Product"> | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    timeSales?: TimeSaleListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    timeSales?: TimeSaleOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    price?: BigIntFilter<"Product"> | bigint | number
    description?: StringFilter<"Product"> | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    timeSales?: TimeSaleListRelationFilter
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Product"> | bigint | number
    name?: StringWithAggregatesFilter<"Product"> | string
    price?: BigIntWithAggregatesFilter<"Product"> | bigint | number
    description?: StringWithAggregatesFilter<"Product"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type TimeSaleWhereInput = {
    AND?: TimeSaleWhereInput | TimeSaleWhereInput[]
    OR?: TimeSaleWhereInput[]
    NOT?: TimeSaleWhereInput | TimeSaleWhereInput[]
    id?: BigIntFilter<"TimeSale"> | bigint | number
    productId?: BigIntFilter<"TimeSale"> | bigint | number
    quantity?: BigIntFilter<"TimeSale"> | bigint | number
    remainingQuantity?: BigIntFilter<"TimeSale"> | bigint | number
    discountPrice?: BigIntFilter<"TimeSale"> | bigint | number
    startAt?: DateTimeFilter<"TimeSale"> | Date | string
    endAt?: DateTimeFilter<"TimeSale"> | Date | string
    status?: EnumTimeSaleStatusFilter<"TimeSale"> | $Enums.TimeSaleStatus
    version?: BigIntFilter<"TimeSale"> | bigint | number
    createdAt?: DateTimeFilter<"TimeSale"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSale"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    orders?: TimeSaleOrderListRelationFilter
  }

  export type TimeSaleOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    status?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    orders?: TimeSaleOrderOrderByRelationAggregateInput
  }

  export type TimeSaleWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: TimeSaleWhereInput | TimeSaleWhereInput[]
    OR?: TimeSaleWhereInput[]
    NOT?: TimeSaleWhereInput | TimeSaleWhereInput[]
    productId?: BigIntFilter<"TimeSale"> | bigint | number
    quantity?: BigIntFilter<"TimeSale"> | bigint | number
    remainingQuantity?: BigIntFilter<"TimeSale"> | bigint | number
    discountPrice?: BigIntFilter<"TimeSale"> | bigint | number
    startAt?: DateTimeFilter<"TimeSale"> | Date | string
    endAt?: DateTimeFilter<"TimeSale"> | Date | string
    status?: EnumTimeSaleStatusFilter<"TimeSale"> | $Enums.TimeSaleStatus
    version?: BigIntFilter<"TimeSale"> | bigint | number
    createdAt?: DateTimeFilter<"TimeSale"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSale"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    orders?: TimeSaleOrderListRelationFilter
  }, "id">

  export type TimeSaleOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    status?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TimeSaleCountOrderByAggregateInput
    _avg?: TimeSaleAvgOrderByAggregateInput
    _max?: TimeSaleMaxOrderByAggregateInput
    _min?: TimeSaleMinOrderByAggregateInput
    _sum?: TimeSaleSumOrderByAggregateInput
  }

  export type TimeSaleScalarWhereWithAggregatesInput = {
    AND?: TimeSaleScalarWhereWithAggregatesInput | TimeSaleScalarWhereWithAggregatesInput[]
    OR?: TimeSaleScalarWhereWithAggregatesInput[]
    NOT?: TimeSaleScalarWhereWithAggregatesInput | TimeSaleScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    productId?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    quantity?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    remainingQuantity?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    discountPrice?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    startAt?: DateTimeWithAggregatesFilter<"TimeSale"> | Date | string
    endAt?: DateTimeWithAggregatesFilter<"TimeSale"> | Date | string
    status?: EnumTimeSaleStatusWithAggregatesFilter<"TimeSale"> | $Enums.TimeSaleStatus
    version?: BigIntWithAggregatesFilter<"TimeSale"> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<"TimeSale"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TimeSale"> | Date | string
  }

  export type TimeSaleOrderWhereInput = {
    AND?: TimeSaleOrderWhereInput | TimeSaleOrderWhereInput[]
    OR?: TimeSaleOrderWhereInput[]
    NOT?: TimeSaleOrderWhereInput | TimeSaleOrderWhereInput[]
    id?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    userId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    timeSaleId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    quantity?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    status?: EnumOrderStatusFilter<"TimeSaleOrder"> | $Enums.OrderStatus
    createdAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
    timeSale?: XOR<TimeSaleRelationFilter, TimeSaleWhereInput>
  }

  export type TimeSaleOrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    timeSale?: TimeSaleOrderByWithRelationInput
  }

  export type TimeSaleOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: TimeSaleOrderWhereInput | TimeSaleOrderWhereInput[]
    OR?: TimeSaleOrderWhereInput[]
    NOT?: TimeSaleOrderWhereInput | TimeSaleOrderWhereInput[]
    userId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    timeSaleId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    quantity?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    status?: EnumOrderStatusFilter<"TimeSaleOrder"> | $Enums.OrderStatus
    createdAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
    timeSale?: XOR<TimeSaleRelationFilter, TimeSaleWhereInput>
  }, "id">

  export type TimeSaleOrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TimeSaleOrderCountOrderByAggregateInput
    _avg?: TimeSaleOrderAvgOrderByAggregateInput
    _max?: TimeSaleOrderMaxOrderByAggregateInput
    _min?: TimeSaleOrderMinOrderByAggregateInput
    _sum?: TimeSaleOrderSumOrderByAggregateInput
  }

  export type TimeSaleOrderScalarWhereWithAggregatesInput = {
    AND?: TimeSaleOrderScalarWhereWithAggregatesInput | TimeSaleOrderScalarWhereWithAggregatesInput[]
    OR?: TimeSaleOrderScalarWhereWithAggregatesInput[]
    NOT?: TimeSaleOrderScalarWhereWithAggregatesInput | TimeSaleOrderScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"TimeSaleOrder"> | bigint | number
    userId?: BigIntWithAggregatesFilter<"TimeSaleOrder"> | bigint | number
    timeSaleId?: BigIntWithAggregatesFilter<"TimeSaleOrder"> | bigint | number
    quantity?: BigIntWithAggregatesFilter<"TimeSaleOrder"> | bigint | number
    status?: EnumOrderStatusWithAggregatesFilter<"TimeSaleOrder"> | $Enums.OrderStatus
    createdAt?: DateTimeWithAggregatesFilter<"TimeSaleOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TimeSaleOrder"> | Date | string
  }

  export type ProductCreateInput = {
    id?: bigint | number
    name: string
    price: bigint | number
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    timeSales?: TimeSaleCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: bigint | number
    name: string
    price: bigint | number
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    timeSales?: TimeSaleUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timeSales?: TimeSaleUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timeSales?: TimeSaleUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: bigint | number
    name: string
    price: bigint | number
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleCreateInput = {
    id?: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutTimeSalesInput
    orders?: TimeSaleOrderCreateNestedManyWithoutTimeSaleInput
  }

  export type TimeSaleUncheckedCreateInput = {
    id?: bigint | number
    productId: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: TimeSaleOrderUncheckedCreateNestedManyWithoutTimeSaleInput
  }

  export type TimeSaleUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutTimeSalesNestedInput
    orders?: TimeSaleOrderUpdateManyWithoutTimeSaleNestedInput
  }

  export type TimeSaleUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    productId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TimeSaleOrderUncheckedUpdateManyWithoutTimeSaleNestedInput
  }

  export type TimeSaleCreateManyInput = {
    id?: bigint | number
    productId: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    productId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderCreateInput = {
    id?: bigint | number
    userId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    timeSale: TimeSaleCreateNestedOneWithoutOrdersInput
  }

  export type TimeSaleOrderUncheckedCreateInput = {
    id?: bigint | number
    userId: bigint | number
    timeSaleId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleOrderUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    timeSale?: TimeSaleUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type TimeSaleOrderUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    timeSaleId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderCreateManyInput = {
    id?: bigint | number
    userId: bigint | number
    timeSaleId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleOrderUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    timeSaleId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type TimeSaleListRelationFilter = {
    every?: TimeSaleWhereInput
    some?: TimeSaleWhereInput
    none?: TimeSaleWhereInput
  }

  export type TimeSaleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
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

  export type EnumTimeSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TimeSaleStatus | EnumTimeSaleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimeSaleStatus[]
    notIn?: $Enums.TimeSaleStatus[]
    not?: NestedEnumTimeSaleStatusFilter<$PrismaModel> | $Enums.TimeSaleStatus
  }

  export type ProductRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type TimeSaleOrderListRelationFilter = {
    every?: TimeSaleOrderWhereInput
    some?: TimeSaleOrderWhereInput
    none?: TimeSaleOrderWhereInput
  }

  export type TimeSaleOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TimeSaleCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    status?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    version?: SortOrder
  }

  export type TimeSaleMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    status?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    status?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    remainingQuantity?: SortOrder
    discountPrice?: SortOrder
    version?: SortOrder
  }

  export type EnumTimeSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimeSaleStatus | EnumTimeSaleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimeSaleStatus[]
    notIn?: $Enums.TimeSaleStatus[]
    not?: NestedEnumTimeSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.TimeSaleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimeSaleStatusFilter<$PrismaModel>
    _max?: NestedEnumTimeSaleStatusFilter<$PrismaModel>
  }

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[]
    notIn?: $Enums.OrderStatus[]
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type TimeSaleRelationFilter = {
    is?: TimeSaleWhereInput
    isNot?: TimeSaleWhereInput
  }

  export type TimeSaleOrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleOrderAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
  }

  export type TimeSaleOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleOrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TimeSaleOrderSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeSaleId?: SortOrder
    quantity?: SortOrder
  }

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[]
    notIn?: $Enums.OrderStatus[]
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type TimeSaleCreateNestedManyWithoutProductInput = {
    create?: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput> | TimeSaleCreateWithoutProductInput[] | TimeSaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TimeSaleCreateOrConnectWithoutProductInput | TimeSaleCreateOrConnectWithoutProductInput[]
    createMany?: TimeSaleCreateManyProductInputEnvelope
    connect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
  }

  export type TimeSaleUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput> | TimeSaleCreateWithoutProductInput[] | TimeSaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TimeSaleCreateOrConnectWithoutProductInput | TimeSaleCreateOrConnectWithoutProductInput[]
    createMany?: TimeSaleCreateManyProductInputEnvelope
    connect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TimeSaleUpdateManyWithoutProductNestedInput = {
    create?: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput> | TimeSaleCreateWithoutProductInput[] | TimeSaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TimeSaleCreateOrConnectWithoutProductInput | TimeSaleCreateOrConnectWithoutProductInput[]
    upsert?: TimeSaleUpsertWithWhereUniqueWithoutProductInput | TimeSaleUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: TimeSaleCreateManyProductInputEnvelope
    set?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    disconnect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    delete?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    connect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    update?: TimeSaleUpdateWithWhereUniqueWithoutProductInput | TimeSaleUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: TimeSaleUpdateManyWithWhereWithoutProductInput | TimeSaleUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: TimeSaleScalarWhereInput | TimeSaleScalarWhereInput[]
  }

  export type TimeSaleUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput> | TimeSaleCreateWithoutProductInput[] | TimeSaleUncheckedCreateWithoutProductInput[]
    connectOrCreate?: TimeSaleCreateOrConnectWithoutProductInput | TimeSaleCreateOrConnectWithoutProductInput[]
    upsert?: TimeSaleUpsertWithWhereUniqueWithoutProductInput | TimeSaleUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: TimeSaleCreateManyProductInputEnvelope
    set?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    disconnect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    delete?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    connect?: TimeSaleWhereUniqueInput | TimeSaleWhereUniqueInput[]
    update?: TimeSaleUpdateWithWhereUniqueWithoutProductInput | TimeSaleUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: TimeSaleUpdateManyWithWhereWithoutProductInput | TimeSaleUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: TimeSaleScalarWhereInput | TimeSaleScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutTimeSalesInput = {
    create?: XOR<ProductCreateWithoutTimeSalesInput, ProductUncheckedCreateWithoutTimeSalesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutTimeSalesInput
    connect?: ProductWhereUniqueInput
  }

  export type TimeSaleOrderCreateNestedManyWithoutTimeSaleInput = {
    create?: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput> | TimeSaleOrderCreateWithoutTimeSaleInput[] | TimeSaleOrderUncheckedCreateWithoutTimeSaleInput[]
    connectOrCreate?: TimeSaleOrderCreateOrConnectWithoutTimeSaleInput | TimeSaleOrderCreateOrConnectWithoutTimeSaleInput[]
    createMany?: TimeSaleOrderCreateManyTimeSaleInputEnvelope
    connect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
  }

  export type TimeSaleOrderUncheckedCreateNestedManyWithoutTimeSaleInput = {
    create?: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput> | TimeSaleOrderCreateWithoutTimeSaleInput[] | TimeSaleOrderUncheckedCreateWithoutTimeSaleInput[]
    connectOrCreate?: TimeSaleOrderCreateOrConnectWithoutTimeSaleInput | TimeSaleOrderCreateOrConnectWithoutTimeSaleInput[]
    createMany?: TimeSaleOrderCreateManyTimeSaleInputEnvelope
    connect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
  }

  export type EnumTimeSaleStatusFieldUpdateOperationsInput = {
    set?: $Enums.TimeSaleStatus
  }

  export type ProductUpdateOneRequiredWithoutTimeSalesNestedInput = {
    create?: XOR<ProductCreateWithoutTimeSalesInput, ProductUncheckedCreateWithoutTimeSalesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutTimeSalesInput
    upsert?: ProductUpsertWithoutTimeSalesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutTimeSalesInput, ProductUpdateWithoutTimeSalesInput>, ProductUncheckedUpdateWithoutTimeSalesInput>
  }

  export type TimeSaleOrderUpdateManyWithoutTimeSaleNestedInput = {
    create?: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput> | TimeSaleOrderCreateWithoutTimeSaleInput[] | TimeSaleOrderUncheckedCreateWithoutTimeSaleInput[]
    connectOrCreate?: TimeSaleOrderCreateOrConnectWithoutTimeSaleInput | TimeSaleOrderCreateOrConnectWithoutTimeSaleInput[]
    upsert?: TimeSaleOrderUpsertWithWhereUniqueWithoutTimeSaleInput | TimeSaleOrderUpsertWithWhereUniqueWithoutTimeSaleInput[]
    createMany?: TimeSaleOrderCreateManyTimeSaleInputEnvelope
    set?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    disconnect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    delete?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    connect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    update?: TimeSaleOrderUpdateWithWhereUniqueWithoutTimeSaleInput | TimeSaleOrderUpdateWithWhereUniqueWithoutTimeSaleInput[]
    updateMany?: TimeSaleOrderUpdateManyWithWhereWithoutTimeSaleInput | TimeSaleOrderUpdateManyWithWhereWithoutTimeSaleInput[]
    deleteMany?: TimeSaleOrderScalarWhereInput | TimeSaleOrderScalarWhereInput[]
  }

  export type TimeSaleOrderUncheckedUpdateManyWithoutTimeSaleNestedInput = {
    create?: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput> | TimeSaleOrderCreateWithoutTimeSaleInput[] | TimeSaleOrderUncheckedCreateWithoutTimeSaleInput[]
    connectOrCreate?: TimeSaleOrderCreateOrConnectWithoutTimeSaleInput | TimeSaleOrderCreateOrConnectWithoutTimeSaleInput[]
    upsert?: TimeSaleOrderUpsertWithWhereUniqueWithoutTimeSaleInput | TimeSaleOrderUpsertWithWhereUniqueWithoutTimeSaleInput[]
    createMany?: TimeSaleOrderCreateManyTimeSaleInputEnvelope
    set?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    disconnect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    delete?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    connect?: TimeSaleOrderWhereUniqueInput | TimeSaleOrderWhereUniqueInput[]
    update?: TimeSaleOrderUpdateWithWhereUniqueWithoutTimeSaleInput | TimeSaleOrderUpdateWithWhereUniqueWithoutTimeSaleInput[]
    updateMany?: TimeSaleOrderUpdateManyWithWhereWithoutTimeSaleInput | TimeSaleOrderUpdateManyWithWhereWithoutTimeSaleInput[]
    deleteMany?: TimeSaleOrderScalarWhereInput | TimeSaleOrderScalarWhereInput[]
  }

  export type TimeSaleCreateNestedOneWithoutOrdersInput = {
    create?: XOR<TimeSaleCreateWithoutOrdersInput, TimeSaleUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TimeSaleCreateOrConnectWithoutOrdersInput
    connect?: TimeSaleWhereUniqueInput
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type TimeSaleUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<TimeSaleCreateWithoutOrdersInput, TimeSaleUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TimeSaleCreateOrConnectWithoutOrdersInput
    upsert?: TimeSaleUpsertWithoutOrdersInput
    connect?: TimeSaleWhereUniqueInput
    update?: XOR<XOR<TimeSaleUpdateToOneWithWhereWithoutOrdersInput, TimeSaleUpdateWithoutOrdersInput>, TimeSaleUncheckedUpdateWithoutOrdersInput>
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

  export type NestedEnumTimeSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TimeSaleStatus | EnumTimeSaleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimeSaleStatus[]
    notIn?: $Enums.TimeSaleStatus[]
    not?: NestedEnumTimeSaleStatusFilter<$PrismaModel> | $Enums.TimeSaleStatus
  }

  export type NestedEnumTimeSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TimeSaleStatus | EnumTimeSaleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TimeSaleStatus[]
    notIn?: $Enums.TimeSaleStatus[]
    not?: NestedEnumTimeSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.TimeSaleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTimeSaleStatusFilter<$PrismaModel>
    _max?: NestedEnumTimeSaleStatusFilter<$PrismaModel>
  }

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[]
    notIn?: $Enums.OrderStatus[]
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[]
    notIn?: $Enums.OrderStatus[]
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type TimeSaleCreateWithoutProductInput = {
    id?: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: TimeSaleOrderCreateNestedManyWithoutTimeSaleInput
  }

  export type TimeSaleUncheckedCreateWithoutProductInput = {
    id?: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: TimeSaleOrderUncheckedCreateNestedManyWithoutTimeSaleInput
  }

  export type TimeSaleCreateOrConnectWithoutProductInput = {
    where: TimeSaleWhereUniqueInput
    create: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput>
  }

  export type TimeSaleCreateManyProductInputEnvelope = {
    data: TimeSaleCreateManyProductInput | TimeSaleCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type TimeSaleUpsertWithWhereUniqueWithoutProductInput = {
    where: TimeSaleWhereUniqueInput
    update: XOR<TimeSaleUpdateWithoutProductInput, TimeSaleUncheckedUpdateWithoutProductInput>
    create: XOR<TimeSaleCreateWithoutProductInput, TimeSaleUncheckedCreateWithoutProductInput>
  }

  export type TimeSaleUpdateWithWhereUniqueWithoutProductInput = {
    where: TimeSaleWhereUniqueInput
    data: XOR<TimeSaleUpdateWithoutProductInput, TimeSaleUncheckedUpdateWithoutProductInput>
  }

  export type TimeSaleUpdateManyWithWhereWithoutProductInput = {
    where: TimeSaleScalarWhereInput
    data: XOR<TimeSaleUpdateManyMutationInput, TimeSaleUncheckedUpdateManyWithoutProductInput>
  }

  export type TimeSaleScalarWhereInput = {
    AND?: TimeSaleScalarWhereInput | TimeSaleScalarWhereInput[]
    OR?: TimeSaleScalarWhereInput[]
    NOT?: TimeSaleScalarWhereInput | TimeSaleScalarWhereInput[]
    id?: BigIntFilter<"TimeSale"> | bigint | number
    productId?: BigIntFilter<"TimeSale"> | bigint | number
    quantity?: BigIntFilter<"TimeSale"> | bigint | number
    remainingQuantity?: BigIntFilter<"TimeSale"> | bigint | number
    discountPrice?: BigIntFilter<"TimeSale"> | bigint | number
    startAt?: DateTimeFilter<"TimeSale"> | Date | string
    endAt?: DateTimeFilter<"TimeSale"> | Date | string
    status?: EnumTimeSaleStatusFilter<"TimeSale"> | $Enums.TimeSaleStatus
    version?: BigIntFilter<"TimeSale"> | bigint | number
    createdAt?: DateTimeFilter<"TimeSale"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSale"> | Date | string
  }

  export type ProductCreateWithoutTimeSalesInput = {
    id?: bigint | number
    name: string
    price: bigint | number
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUncheckedCreateWithoutTimeSalesInput = {
    id?: bigint | number
    name: string
    price: bigint | number
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateOrConnectWithoutTimeSalesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutTimeSalesInput, ProductUncheckedCreateWithoutTimeSalesInput>
  }

  export type TimeSaleOrderCreateWithoutTimeSaleInput = {
    id?: bigint | number
    userId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleOrderUncheckedCreateWithoutTimeSaleInput = {
    id?: bigint | number
    userId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleOrderCreateOrConnectWithoutTimeSaleInput = {
    where: TimeSaleOrderWhereUniqueInput
    create: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput>
  }

  export type TimeSaleOrderCreateManyTimeSaleInputEnvelope = {
    data: TimeSaleOrderCreateManyTimeSaleInput | TimeSaleOrderCreateManyTimeSaleInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithoutTimeSalesInput = {
    update: XOR<ProductUpdateWithoutTimeSalesInput, ProductUncheckedUpdateWithoutTimeSalesInput>
    create: XOR<ProductCreateWithoutTimeSalesInput, ProductUncheckedCreateWithoutTimeSalesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutTimeSalesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutTimeSalesInput, ProductUncheckedUpdateWithoutTimeSalesInput>
  }

  export type ProductUpdateWithoutTimeSalesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateWithoutTimeSalesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    price?: BigIntFieldUpdateOperationsInput | bigint | number
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderUpsertWithWhereUniqueWithoutTimeSaleInput = {
    where: TimeSaleOrderWhereUniqueInput
    update: XOR<TimeSaleOrderUpdateWithoutTimeSaleInput, TimeSaleOrderUncheckedUpdateWithoutTimeSaleInput>
    create: XOR<TimeSaleOrderCreateWithoutTimeSaleInput, TimeSaleOrderUncheckedCreateWithoutTimeSaleInput>
  }

  export type TimeSaleOrderUpdateWithWhereUniqueWithoutTimeSaleInput = {
    where: TimeSaleOrderWhereUniqueInput
    data: XOR<TimeSaleOrderUpdateWithoutTimeSaleInput, TimeSaleOrderUncheckedUpdateWithoutTimeSaleInput>
  }

  export type TimeSaleOrderUpdateManyWithWhereWithoutTimeSaleInput = {
    where: TimeSaleOrderScalarWhereInput
    data: XOR<TimeSaleOrderUpdateManyMutationInput, TimeSaleOrderUncheckedUpdateManyWithoutTimeSaleInput>
  }

  export type TimeSaleOrderScalarWhereInput = {
    AND?: TimeSaleOrderScalarWhereInput | TimeSaleOrderScalarWhereInput[]
    OR?: TimeSaleOrderScalarWhereInput[]
    NOT?: TimeSaleOrderScalarWhereInput | TimeSaleOrderScalarWhereInput[]
    id?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    userId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    timeSaleId?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    quantity?: BigIntFilter<"TimeSaleOrder"> | bigint | number
    status?: EnumOrderStatusFilter<"TimeSaleOrder"> | $Enums.OrderStatus
    createdAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TimeSaleOrder"> | Date | string
  }

  export type TimeSaleCreateWithoutOrdersInput = {
    id?: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutTimeSalesInput
  }

  export type TimeSaleUncheckedCreateWithoutOrdersInput = {
    id?: bigint | number
    productId: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleCreateOrConnectWithoutOrdersInput = {
    where: TimeSaleWhereUniqueInput
    create: XOR<TimeSaleCreateWithoutOrdersInput, TimeSaleUncheckedCreateWithoutOrdersInput>
  }

  export type TimeSaleUpsertWithoutOrdersInput = {
    update: XOR<TimeSaleUpdateWithoutOrdersInput, TimeSaleUncheckedUpdateWithoutOrdersInput>
    create: XOR<TimeSaleCreateWithoutOrdersInput, TimeSaleUncheckedCreateWithoutOrdersInput>
    where?: TimeSaleWhereInput
  }

  export type TimeSaleUpdateToOneWithWhereWithoutOrdersInput = {
    where?: TimeSaleWhereInput
    data: XOR<TimeSaleUpdateWithoutOrdersInput, TimeSaleUncheckedUpdateWithoutOrdersInput>
  }

  export type TimeSaleUpdateWithoutOrdersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutTimeSalesNestedInput
  }

  export type TimeSaleUncheckedUpdateWithoutOrdersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    productId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleCreateManyProductInput = {
    id?: bigint | number
    quantity: bigint | number
    remainingQuantity: bigint | number
    discountPrice: bigint | number
    startAt: Date | string
    endAt: Date | string
    status?: $Enums.TimeSaleStatus
    version?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TimeSaleOrderUpdateManyWithoutTimeSaleNestedInput
  }

  export type TimeSaleUncheckedUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TimeSaleOrderUncheckedUpdateManyWithoutTimeSaleNestedInput
  }

  export type TimeSaleUncheckedUpdateManyWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    remainingQuantity?: BigIntFieldUpdateOperationsInput | bigint | number
    discountPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumTimeSaleStatusFieldUpdateOperationsInput | $Enums.TimeSaleStatus
    version?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderCreateManyTimeSaleInput = {
    id?: bigint | number
    userId: bigint | number
    quantity: bigint | number
    status?: $Enums.OrderStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TimeSaleOrderUpdateWithoutTimeSaleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderUncheckedUpdateWithoutTimeSaleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TimeSaleOrderUncheckedUpdateManyWithoutTimeSaleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ProductCountOutputTypeDefaultArgs instead
     */
    export type ProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TimeSaleCountOutputTypeDefaultArgs instead
     */
    export type TimeSaleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TimeSaleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TimeSaleDefaultArgs instead
     */
    export type TimeSaleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TimeSaleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TimeSaleOrderDefaultArgs instead
     */
    export type TimeSaleOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TimeSaleOrderDefaultArgs<ExtArgs>

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