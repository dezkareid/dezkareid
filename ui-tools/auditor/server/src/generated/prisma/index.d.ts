
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Domain
 * 
 */
export type Domain = $Result.DefaultSelection<Prisma.$DomainPayload>
/**
 * Model Url
 * 
 */
export type Url = $Result.DefaultSelection<Prisma.$UrlPayload>
/**
 * Model Environment
 * 
 */
export type Environment = $Result.DefaultSelection<Prisma.$EnvironmentPayload>
/**
 * Model AuditRun
 * 
 */
export type AuditRun = $Result.DefaultSelection<Prisma.$AuditRunPayload>
/**
 * Model Metric
 * 
 */
export type Metric = $Result.DefaultSelection<Prisma.$MetricPayload>
/**
 * Model Budget
 * 
 */
export type Budget = $Result.DefaultSelection<Prisma.$BudgetPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Domains
 * const domains = await prisma.domain.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Domains
   * const domains = await prisma.domain.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.domain`: Exposes CRUD operations for the **Domain** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Domains
    * const domains = await prisma.domain.findMany()
    * ```
    */
  get domain(): Prisma.DomainDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.url`: Exposes CRUD operations for the **Url** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Urls
    * const urls = await prisma.url.findMany()
    * ```
    */
  get url(): Prisma.UrlDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.environment`: Exposes CRUD operations for the **Environment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Environments
    * const environments = await prisma.environment.findMany()
    * ```
    */
  get environment(): Prisma.EnvironmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditRun`: Exposes CRUD operations for the **AuditRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditRuns
    * const auditRuns = await prisma.auditRun.findMany()
    * ```
    */
  get auditRun(): Prisma.AuditRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metric`: Exposes CRUD operations for the **Metric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Metrics
    * const metrics = await prisma.metric.findMany()
    * ```
    */
  get metric(): Prisma.MetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.budget`: Exposes CRUD operations for the **Budget** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Budgets
    * const budgets = await prisma.budget.findMany()
    * ```
    */
  get budget(): Prisma.BudgetDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    Domain: 'Domain',
    Url: 'Url',
    Environment: 'Environment',
    AuditRun: 'AuditRun',
    Metric: 'Metric',
    Budget: 'Budget'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "domain" | "url" | "environment" | "auditRun" | "metric" | "budget"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Domain: {
        payload: Prisma.$DomainPayload<ExtArgs>
        fields: Prisma.DomainFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DomainFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DomainFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          findFirst: {
            args: Prisma.DomainFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DomainFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          findMany: {
            args: Prisma.DomainFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          create: {
            args: Prisma.DomainCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          createMany: {
            args: Prisma.DomainCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DomainCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          delete: {
            args: Prisma.DomainDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          update: {
            args: Prisma.DomainUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          deleteMany: {
            args: Prisma.DomainDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DomainUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DomainUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>[]
          }
          upsert: {
            args: Prisma.DomainUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DomainPayload>
          }
          aggregate: {
            args: Prisma.DomainAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDomain>
          }
          groupBy: {
            args: Prisma.DomainGroupByArgs<ExtArgs>
            result: $Utils.Optional<DomainGroupByOutputType>[]
          }
          count: {
            args: Prisma.DomainCountArgs<ExtArgs>
            result: $Utils.Optional<DomainCountAggregateOutputType> | number
          }
        }
      }
      Url: {
        payload: Prisma.$UrlPayload<ExtArgs>
        fields: Prisma.UrlFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UrlFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UrlFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          findFirst: {
            args: Prisma.UrlFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UrlFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          findMany: {
            args: Prisma.UrlFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>[]
          }
          create: {
            args: Prisma.UrlCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          createMany: {
            args: Prisma.UrlCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UrlCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>[]
          }
          delete: {
            args: Prisma.UrlDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          update: {
            args: Prisma.UrlUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          deleteMany: {
            args: Prisma.UrlDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UrlUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UrlUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>[]
          }
          upsert: {
            args: Prisma.UrlUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlPayload>
          }
          aggregate: {
            args: Prisma.UrlAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUrl>
          }
          groupBy: {
            args: Prisma.UrlGroupByArgs<ExtArgs>
            result: $Utils.Optional<UrlGroupByOutputType>[]
          }
          count: {
            args: Prisma.UrlCountArgs<ExtArgs>
            result: $Utils.Optional<UrlCountAggregateOutputType> | number
          }
        }
      }
      Environment: {
        payload: Prisma.$EnvironmentPayload<ExtArgs>
        fields: Prisma.EnvironmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnvironmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnvironmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          findFirst: {
            args: Prisma.EnvironmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnvironmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          findMany: {
            args: Prisma.EnvironmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          create: {
            args: Prisma.EnvironmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          createMany: {
            args: Prisma.EnvironmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnvironmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          delete: {
            args: Prisma.EnvironmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          update: {
            args: Prisma.EnvironmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          deleteMany: {
            args: Prisma.EnvironmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnvironmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EnvironmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>[]
          }
          upsert: {
            args: Prisma.EnvironmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnvironmentPayload>
          }
          aggregate: {
            args: Prisma.EnvironmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnvironment>
          }
          groupBy: {
            args: Prisma.EnvironmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnvironmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnvironmentCountArgs<ExtArgs>
            result: $Utils.Optional<EnvironmentCountAggregateOutputType> | number
          }
        }
      }
      AuditRun: {
        payload: Prisma.$AuditRunPayload<ExtArgs>
        fields: Prisma.AuditRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          findFirst: {
            args: Prisma.AuditRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          findMany: {
            args: Prisma.AuditRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          create: {
            args: Prisma.AuditRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          createMany: {
            args: Prisma.AuditRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          delete: {
            args: Prisma.AuditRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          update: {
            args: Prisma.AuditRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          deleteMany: {
            args: Prisma.AuditRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          upsert: {
            args: Prisma.AuditRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          aggregate: {
            args: Prisma.AuditRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditRun>
          }
          groupBy: {
            args: Prisma.AuditRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditRunCountArgs<ExtArgs>
            result: $Utils.Optional<AuditRunCountAggregateOutputType> | number
          }
        }
      }
      Metric: {
        payload: Prisma.$MetricPayload<ExtArgs>
        fields: Prisma.MetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          findFirst: {
            args: Prisma.MetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          findMany: {
            args: Prisma.MetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>[]
          }
          create: {
            args: Prisma.MetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          createMany: {
            args: Prisma.MetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>[]
          }
          delete: {
            args: Prisma.MetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          update: {
            args: Prisma.MetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          deleteMany: {
            args: Prisma.MetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>[]
          }
          upsert: {
            args: Prisma.MetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          aggregate: {
            args: Prisma.MetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetric>
          }
          groupBy: {
            args: Prisma.MetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetricCountArgs<ExtArgs>
            result: $Utils.Optional<MetricCountAggregateOutputType> | number
          }
        }
      }
      Budget: {
        payload: Prisma.$BudgetPayload<ExtArgs>
        fields: Prisma.BudgetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BudgetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BudgetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          findFirst: {
            args: Prisma.BudgetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BudgetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          findMany: {
            args: Prisma.BudgetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          create: {
            args: Prisma.BudgetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          createMany: {
            args: Prisma.BudgetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BudgetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          delete: {
            args: Prisma.BudgetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          update: {
            args: Prisma.BudgetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          deleteMany: {
            args: Prisma.BudgetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BudgetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BudgetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          upsert: {
            args: Prisma.BudgetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          aggregate: {
            args: Prisma.BudgetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBudget>
          }
          groupBy: {
            args: Prisma.BudgetGroupByArgs<ExtArgs>
            result: $Utils.Optional<BudgetGroupByOutputType>[]
          }
          count: {
            args: Prisma.BudgetCountArgs<ExtArgs>
            result: $Utils.Optional<BudgetCountAggregateOutputType> | number
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
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    domain?: DomainOmit
    url?: UrlOmit
    environment?: EnvironmentOmit
    auditRun?: AuditRunOmit
    metric?: MetricOmit
    budget?: BudgetOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Count Type DomainCountOutputType
   */

  export type DomainCountOutputType = {
    urls: number
  }

  export type DomainCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    urls?: boolean | DomainCountOutputTypeCountUrlsArgs
  }

  // Custom InputTypes
  /**
   * DomainCountOutputType without action
   */
  export type DomainCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DomainCountOutputType
     */
    select?: DomainCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DomainCountOutputType without action
   */
  export type DomainCountOutputTypeCountUrlsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UrlWhereInput
  }


  /**
   * Count Type UrlCountOutputType
   */

  export type UrlCountOutputType = {
    audits: number
    budgets: number
  }

  export type UrlCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audits?: boolean | UrlCountOutputTypeCountAuditsArgs
    budgets?: boolean | UrlCountOutputTypeCountBudgetsArgs
  }

  // Custom InputTypes
  /**
   * UrlCountOutputType without action
   */
  export type UrlCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlCountOutputType
     */
    select?: UrlCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UrlCountOutputType without action
   */
  export type UrlCountOutputTypeCountAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditRunWhereInput
  }

  /**
   * UrlCountOutputType without action
   */
  export type UrlCountOutputTypeCountBudgetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetWhereInput
  }


  /**
   * Count Type EnvironmentCountOutputType
   */

  export type EnvironmentCountOutputType = {
    audits: number
  }

  export type EnvironmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audits?: boolean | EnvironmentCountOutputTypeCountAuditsArgs
  }

  // Custom InputTypes
  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnvironmentCountOutputType
     */
    select?: EnvironmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnvironmentCountOutputType without action
   */
  export type EnvironmentCountOutputTypeCountAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditRunWhereInput
  }


  /**
   * Count Type AuditRunCountOutputType
   */

  export type AuditRunCountOutputType = {
    metrics: number
  }

  export type AuditRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metrics?: boolean | AuditRunCountOutputTypeCountMetricsArgs
  }

  // Custom InputTypes
  /**
   * AuditRunCountOutputType without action
   */
  export type AuditRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRunCountOutputType
     */
    select?: AuditRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuditRunCountOutputType without action
   */
  export type AuditRunCountOutputTypeCountMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetricWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Domain
   */

  export type AggregateDomain = {
    _count: DomainCountAggregateOutputType | null
    _min: DomainMinAggregateOutputType | null
    _max: DomainMaxAggregateOutputType | null
  }

  export type DomainMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DomainMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DomainCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DomainMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DomainMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DomainCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DomainAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Domain to aggregate.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Domains
    **/
    _count?: true | DomainCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DomainMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DomainMaxAggregateInputType
  }

  export type GetDomainAggregateType<T extends DomainAggregateArgs> = {
        [P in keyof T & keyof AggregateDomain]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDomain[P]>
      : GetScalarType<T[P], AggregateDomain[P]>
  }




  export type DomainGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DomainWhereInput
    orderBy?: DomainOrderByWithAggregationInput | DomainOrderByWithAggregationInput[]
    by: DomainScalarFieldEnum[] | DomainScalarFieldEnum
    having?: DomainScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DomainCountAggregateInputType | true
    _min?: DomainMinAggregateInputType
    _max?: DomainMaxAggregateInputType
  }

  export type DomainGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: DomainCountAggregateOutputType | null
    _min: DomainMinAggregateOutputType | null
    _max: DomainMaxAggregateOutputType | null
  }

  type GetDomainGroupByPayload<T extends DomainGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DomainGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DomainGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DomainGroupByOutputType[P]>
            : GetScalarType<T[P], DomainGroupByOutputType[P]>
        }
      >
    >


  export type DomainSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    urls?: boolean | Domain$urlsArgs<ExtArgs>
    _count?: boolean | DomainCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["domain"]>

  export type DomainSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DomainOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["domain"]>
  export type DomainInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    urls?: boolean | Domain$urlsArgs<ExtArgs>
    _count?: boolean | DomainCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DomainIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DomainIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DomainPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Domain"
    objects: {
      urls: Prisma.$UrlPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["domain"]>
    composites: {}
  }

  type DomainGetPayload<S extends boolean | null | undefined | DomainDefaultArgs> = $Result.GetResult<Prisma.$DomainPayload, S>

  type DomainCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DomainFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DomainCountAggregateInputType | true
    }

  export interface DomainDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Domain'], meta: { name: 'Domain' } }
    /**
     * Find zero or one Domain that matches the filter.
     * @param {DomainFindUniqueArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DomainFindUniqueArgs>(args: SelectSubset<T, DomainFindUniqueArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Domain that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DomainFindUniqueOrThrowArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DomainFindUniqueOrThrowArgs>(args: SelectSubset<T, DomainFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domain that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindFirstArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DomainFindFirstArgs>(args?: SelectSubset<T, DomainFindFirstArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domain that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindFirstOrThrowArgs} args - Arguments to find a Domain
     * @example
     * // Get one Domain
     * const domain = await prisma.domain.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DomainFindFirstOrThrowArgs>(args?: SelectSubset<T, DomainFindFirstOrThrowArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Domains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Domains
     * const domains = await prisma.domain.findMany()
     * 
     * // Get first 10 Domains
     * const domains = await prisma.domain.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const domainWithIdOnly = await prisma.domain.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DomainFindManyArgs>(args?: SelectSubset<T, DomainFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Domain.
     * @param {DomainCreateArgs} args - Arguments to create a Domain.
     * @example
     * // Create one Domain
     * const Domain = await prisma.domain.create({
     *   data: {
     *     // ... data to create a Domain
     *   }
     * })
     * 
     */
    create<T extends DomainCreateArgs>(args: SelectSubset<T, DomainCreateArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Domains.
     * @param {DomainCreateManyArgs} args - Arguments to create many Domains.
     * @example
     * // Create many Domains
     * const domain = await prisma.domain.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DomainCreateManyArgs>(args?: SelectSubset<T, DomainCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Domains and returns the data saved in the database.
     * @param {DomainCreateManyAndReturnArgs} args - Arguments to create many Domains.
     * @example
     * // Create many Domains
     * const domain = await prisma.domain.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Domains and only return the `id`
     * const domainWithIdOnly = await prisma.domain.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DomainCreateManyAndReturnArgs>(args?: SelectSubset<T, DomainCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Domain.
     * @param {DomainDeleteArgs} args - Arguments to delete one Domain.
     * @example
     * // Delete one Domain
     * const Domain = await prisma.domain.delete({
     *   where: {
     *     // ... filter to delete one Domain
     *   }
     * })
     * 
     */
    delete<T extends DomainDeleteArgs>(args: SelectSubset<T, DomainDeleteArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Domain.
     * @param {DomainUpdateArgs} args - Arguments to update one Domain.
     * @example
     * // Update one Domain
     * const domain = await prisma.domain.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DomainUpdateArgs>(args: SelectSubset<T, DomainUpdateArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Domains.
     * @param {DomainDeleteManyArgs} args - Arguments to filter Domains to delete.
     * @example
     * // Delete a few Domains
     * const { count } = await prisma.domain.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DomainDeleteManyArgs>(args?: SelectSubset<T, DomainDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Domains
     * const domain = await prisma.domain.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DomainUpdateManyArgs>(args: SelectSubset<T, DomainUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Domains and returns the data updated in the database.
     * @param {DomainUpdateManyAndReturnArgs} args - Arguments to update many Domains.
     * @example
     * // Update many Domains
     * const domain = await prisma.domain.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Domains and only return the `id`
     * const domainWithIdOnly = await prisma.domain.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DomainUpdateManyAndReturnArgs>(args: SelectSubset<T, DomainUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Domain.
     * @param {DomainUpsertArgs} args - Arguments to update or create a Domain.
     * @example
     * // Update or create a Domain
     * const domain = await prisma.domain.upsert({
     *   create: {
     *     // ... data to create a Domain
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Domain we want to update
     *   }
     * })
     */
    upsert<T extends DomainUpsertArgs>(args: SelectSubset<T, DomainUpsertArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainCountArgs} args - Arguments to filter Domains to count.
     * @example
     * // Count the number of Domains
     * const count = await prisma.domain.count({
     *   where: {
     *     // ... the filter for the Domains we want to count
     *   }
     * })
    **/
    count<T extends DomainCountArgs>(
      args?: Subset<T, DomainCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DomainCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Domain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DomainAggregateArgs>(args: Subset<T, DomainAggregateArgs>): Prisma.PrismaPromise<GetDomainAggregateType<T>>

    /**
     * Group by Domain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainGroupByArgs} args - Group by arguments.
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
      T extends DomainGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DomainGroupByArgs['orderBy'] }
        : { orderBy?: DomainGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DomainGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDomainGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Domain model
   */
  readonly fields: DomainFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Domain.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DomainClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    urls<T extends Domain$urlsArgs<ExtArgs> = {}>(args?: Subset<T, Domain$urlsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Domain model
   */
  interface DomainFieldRefs {
    readonly id: FieldRef<"Domain", 'String'>
    readonly name: FieldRef<"Domain", 'String'>
    readonly description: FieldRef<"Domain", 'String'>
    readonly createdAt: FieldRef<"Domain", 'DateTime'>
    readonly updatedAt: FieldRef<"Domain", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Domain findUnique
   */
  export type DomainFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain findUniqueOrThrow
   */
  export type DomainFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain findFirst
   */
  export type DomainFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Domains.
     */
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain findFirstOrThrow
   */
  export type DomainFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domain to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Domains.
     */
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain findMany
   */
  export type DomainFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter, which Domains to fetch.
     */
    where?: DomainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Domains to fetch.
     */
    orderBy?: DomainOrderByWithRelationInput | DomainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Domains.
     */
    cursor?: DomainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Domains.
     */
    distinct?: DomainScalarFieldEnum | DomainScalarFieldEnum[]
  }

  /**
   * Domain create
   */
  export type DomainCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The data needed to create a Domain.
     */
    data: XOR<DomainCreateInput, DomainUncheckedCreateInput>
  }

  /**
   * Domain createMany
   */
  export type DomainCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Domains.
     */
    data: DomainCreateManyInput | DomainCreateManyInput[]
  }

  /**
   * Domain createManyAndReturn
   */
  export type DomainCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * The data used to create many Domains.
     */
    data: DomainCreateManyInput | DomainCreateManyInput[]
  }

  /**
   * Domain update
   */
  export type DomainUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The data needed to update a Domain.
     */
    data: XOR<DomainUpdateInput, DomainUncheckedUpdateInput>
    /**
     * Choose, which Domain to update.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain updateMany
   */
  export type DomainUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Domains.
     */
    data: XOR<DomainUpdateManyMutationInput, DomainUncheckedUpdateManyInput>
    /**
     * Filter which Domains to update
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to update.
     */
    limit?: number
  }

  /**
   * Domain updateManyAndReturn
   */
  export type DomainUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * The data used to update Domains.
     */
    data: XOR<DomainUpdateManyMutationInput, DomainUncheckedUpdateManyInput>
    /**
     * Filter which Domains to update
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to update.
     */
    limit?: number
  }

  /**
   * Domain upsert
   */
  export type DomainUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * The filter to search for the Domain to update in case it exists.
     */
    where: DomainWhereUniqueInput
    /**
     * In case the Domain found by the `where` argument doesn't exist, create a new Domain with this data.
     */
    create: XOR<DomainCreateInput, DomainUncheckedCreateInput>
    /**
     * In case the Domain was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DomainUpdateInput, DomainUncheckedUpdateInput>
  }

  /**
   * Domain delete
   */
  export type DomainDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
    /**
     * Filter which Domain to delete.
     */
    where: DomainWhereUniqueInput
  }

  /**
   * Domain deleteMany
   */
  export type DomainDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Domains to delete
     */
    where?: DomainWhereInput
    /**
     * Limit how many Domains to delete.
     */
    limit?: number
  }

  /**
   * Domain.urls
   */
  export type Domain$urlsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    where?: UrlWhereInput
    orderBy?: UrlOrderByWithRelationInput | UrlOrderByWithRelationInput[]
    cursor?: UrlWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UrlScalarFieldEnum | UrlScalarFieldEnum[]
  }

  /**
   * Domain without action
   */
  export type DomainDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Domain
     */
    select?: DomainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Domain
     */
    omit?: DomainOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DomainInclude<ExtArgs> | null
  }


  /**
   * Model Url
   */

  export type AggregateUrl = {
    _count: UrlCountAggregateOutputType | null
    _min: UrlMinAggregateOutputType | null
    _max: UrlMaxAggregateOutputType | null
  }

  export type UrlMinAggregateOutputType = {
    id: string | null
    address: string | null
    description: string | null
    domainId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrlMaxAggregateOutputType = {
    id: string | null
    address: string | null
    description: string | null
    domainId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrlCountAggregateOutputType = {
    id: number
    address: number
    description: number
    domainId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UrlMinAggregateInputType = {
    id?: true
    address?: true
    description?: true
    domainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrlMaxAggregateInputType = {
    id?: true
    address?: true
    description?: true
    domainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrlCountAggregateInputType = {
    id?: true
    address?: true
    description?: true
    domainId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UrlAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Url to aggregate.
     */
    where?: UrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Urls to fetch.
     */
    orderBy?: UrlOrderByWithRelationInput | UrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Urls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Urls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Urls
    **/
    _count?: true | UrlCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UrlMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UrlMaxAggregateInputType
  }

  export type GetUrlAggregateType<T extends UrlAggregateArgs> = {
        [P in keyof T & keyof AggregateUrl]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUrl[P]>
      : GetScalarType<T[P], AggregateUrl[P]>
  }




  export type UrlGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UrlWhereInput
    orderBy?: UrlOrderByWithAggregationInput | UrlOrderByWithAggregationInput[]
    by: UrlScalarFieldEnum[] | UrlScalarFieldEnum
    having?: UrlScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UrlCountAggregateInputType | true
    _min?: UrlMinAggregateInputType
    _max?: UrlMaxAggregateInputType
  }

  export type UrlGroupByOutputType = {
    id: string
    address: string
    description: string | null
    domainId: string
    createdAt: Date
    updatedAt: Date
    _count: UrlCountAggregateOutputType | null
    _min: UrlMinAggregateOutputType | null
    _max: UrlMaxAggregateOutputType | null
  }

  type GetUrlGroupByPayload<T extends UrlGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UrlGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UrlGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UrlGroupByOutputType[P]>
            : GetScalarType<T[P], UrlGroupByOutputType[P]>
        }
      >
    >


  export type UrlSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    description?: boolean
    domainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    domain?: boolean | DomainDefaultArgs<ExtArgs>
    audits?: boolean | Url$auditsArgs<ExtArgs>
    budgets?: boolean | Url$budgetsArgs<ExtArgs>
    _count?: boolean | UrlCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["url"]>

  export type UrlSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    description?: boolean
    domainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    domain?: boolean | DomainDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["url"]>

  export type UrlSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    description?: boolean
    domainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    domain?: boolean | DomainDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["url"]>

  export type UrlSelectScalar = {
    id?: boolean
    address?: boolean
    description?: boolean
    domainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UrlOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "description" | "domainId" | "createdAt" | "updatedAt", ExtArgs["result"]["url"]>
  export type UrlInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | DomainDefaultArgs<ExtArgs>
    audits?: boolean | Url$auditsArgs<ExtArgs>
    budgets?: boolean | Url$budgetsArgs<ExtArgs>
    _count?: boolean | UrlCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UrlIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | DomainDefaultArgs<ExtArgs>
  }
  export type UrlIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    domain?: boolean | DomainDefaultArgs<ExtArgs>
  }

  export type $UrlPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Url"
    objects: {
      domain: Prisma.$DomainPayload<ExtArgs>
      audits: Prisma.$AuditRunPayload<ExtArgs>[]
      budgets: Prisma.$BudgetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      description: string | null
      domainId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["url"]>
    composites: {}
  }

  type UrlGetPayload<S extends boolean | null | undefined | UrlDefaultArgs> = $Result.GetResult<Prisma.$UrlPayload, S>

  type UrlCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UrlFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UrlCountAggregateInputType | true
    }

  export interface UrlDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Url'], meta: { name: 'Url' } }
    /**
     * Find zero or one Url that matches the filter.
     * @param {UrlFindUniqueArgs} args - Arguments to find a Url
     * @example
     * // Get one Url
     * const url = await prisma.url.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UrlFindUniqueArgs>(args: SelectSubset<T, UrlFindUniqueArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Url that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UrlFindUniqueOrThrowArgs} args - Arguments to find a Url
     * @example
     * // Get one Url
     * const url = await prisma.url.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UrlFindUniqueOrThrowArgs>(args: SelectSubset<T, UrlFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Url that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlFindFirstArgs} args - Arguments to find a Url
     * @example
     * // Get one Url
     * const url = await prisma.url.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UrlFindFirstArgs>(args?: SelectSubset<T, UrlFindFirstArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Url that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlFindFirstOrThrowArgs} args - Arguments to find a Url
     * @example
     * // Get one Url
     * const url = await prisma.url.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UrlFindFirstOrThrowArgs>(args?: SelectSubset<T, UrlFindFirstOrThrowArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Urls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Urls
     * const urls = await prisma.url.findMany()
     * 
     * // Get first 10 Urls
     * const urls = await prisma.url.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const urlWithIdOnly = await prisma.url.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UrlFindManyArgs>(args?: SelectSubset<T, UrlFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Url.
     * @param {UrlCreateArgs} args - Arguments to create a Url.
     * @example
     * // Create one Url
     * const Url = await prisma.url.create({
     *   data: {
     *     // ... data to create a Url
     *   }
     * })
     * 
     */
    create<T extends UrlCreateArgs>(args: SelectSubset<T, UrlCreateArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Urls.
     * @param {UrlCreateManyArgs} args - Arguments to create many Urls.
     * @example
     * // Create many Urls
     * const url = await prisma.url.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UrlCreateManyArgs>(args?: SelectSubset<T, UrlCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Urls and returns the data saved in the database.
     * @param {UrlCreateManyAndReturnArgs} args - Arguments to create many Urls.
     * @example
     * // Create many Urls
     * const url = await prisma.url.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Urls and only return the `id`
     * const urlWithIdOnly = await prisma.url.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UrlCreateManyAndReturnArgs>(args?: SelectSubset<T, UrlCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Url.
     * @param {UrlDeleteArgs} args - Arguments to delete one Url.
     * @example
     * // Delete one Url
     * const Url = await prisma.url.delete({
     *   where: {
     *     // ... filter to delete one Url
     *   }
     * })
     * 
     */
    delete<T extends UrlDeleteArgs>(args: SelectSubset<T, UrlDeleteArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Url.
     * @param {UrlUpdateArgs} args - Arguments to update one Url.
     * @example
     * // Update one Url
     * const url = await prisma.url.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UrlUpdateArgs>(args: SelectSubset<T, UrlUpdateArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Urls.
     * @param {UrlDeleteManyArgs} args - Arguments to filter Urls to delete.
     * @example
     * // Delete a few Urls
     * const { count } = await prisma.url.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UrlDeleteManyArgs>(args?: SelectSubset<T, UrlDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Urls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Urls
     * const url = await prisma.url.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UrlUpdateManyArgs>(args: SelectSubset<T, UrlUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Urls and returns the data updated in the database.
     * @param {UrlUpdateManyAndReturnArgs} args - Arguments to update many Urls.
     * @example
     * // Update many Urls
     * const url = await prisma.url.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Urls and only return the `id`
     * const urlWithIdOnly = await prisma.url.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UrlUpdateManyAndReturnArgs>(args: SelectSubset<T, UrlUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Url.
     * @param {UrlUpsertArgs} args - Arguments to update or create a Url.
     * @example
     * // Update or create a Url
     * const url = await prisma.url.upsert({
     *   create: {
     *     // ... data to create a Url
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Url we want to update
     *   }
     * })
     */
    upsert<T extends UrlUpsertArgs>(args: SelectSubset<T, UrlUpsertArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Urls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlCountArgs} args - Arguments to filter Urls to count.
     * @example
     * // Count the number of Urls
     * const count = await prisma.url.count({
     *   where: {
     *     // ... the filter for the Urls we want to count
     *   }
     * })
    **/
    count<T extends UrlCountArgs>(
      args?: Subset<T, UrlCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UrlCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Url.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UrlAggregateArgs>(args: Subset<T, UrlAggregateArgs>): Prisma.PrismaPromise<GetUrlAggregateType<T>>

    /**
     * Group by Url.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlGroupByArgs} args - Group by arguments.
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
      T extends UrlGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UrlGroupByArgs['orderBy'] }
        : { orderBy?: UrlGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UrlGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUrlGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Url model
   */
  readonly fields: UrlFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Url.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UrlClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    domain<T extends DomainDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DomainDefaultArgs<ExtArgs>>): Prisma__DomainClient<$Result.GetResult<Prisma.$DomainPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    audits<T extends Url$auditsArgs<ExtArgs> = {}>(args?: Subset<T, Url$auditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    budgets<T extends Url$budgetsArgs<ExtArgs> = {}>(args?: Subset<T, Url$budgetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Url model
   */
  interface UrlFieldRefs {
    readonly id: FieldRef<"Url", 'String'>
    readonly address: FieldRef<"Url", 'String'>
    readonly description: FieldRef<"Url", 'String'>
    readonly domainId: FieldRef<"Url", 'String'>
    readonly createdAt: FieldRef<"Url", 'DateTime'>
    readonly updatedAt: FieldRef<"Url", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Url findUnique
   */
  export type UrlFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter, which Url to fetch.
     */
    where: UrlWhereUniqueInput
  }

  /**
   * Url findUniqueOrThrow
   */
  export type UrlFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter, which Url to fetch.
     */
    where: UrlWhereUniqueInput
  }

  /**
   * Url findFirst
   */
  export type UrlFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter, which Url to fetch.
     */
    where?: UrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Urls to fetch.
     */
    orderBy?: UrlOrderByWithRelationInput | UrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Urls.
     */
    cursor?: UrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Urls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Urls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Urls.
     */
    distinct?: UrlScalarFieldEnum | UrlScalarFieldEnum[]
  }

  /**
   * Url findFirstOrThrow
   */
  export type UrlFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter, which Url to fetch.
     */
    where?: UrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Urls to fetch.
     */
    orderBy?: UrlOrderByWithRelationInput | UrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Urls.
     */
    cursor?: UrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Urls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Urls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Urls.
     */
    distinct?: UrlScalarFieldEnum | UrlScalarFieldEnum[]
  }

  /**
   * Url findMany
   */
  export type UrlFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter, which Urls to fetch.
     */
    where?: UrlWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Urls to fetch.
     */
    orderBy?: UrlOrderByWithRelationInput | UrlOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Urls.
     */
    cursor?: UrlWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Urls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Urls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Urls.
     */
    distinct?: UrlScalarFieldEnum | UrlScalarFieldEnum[]
  }

  /**
   * Url create
   */
  export type UrlCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * The data needed to create a Url.
     */
    data: XOR<UrlCreateInput, UrlUncheckedCreateInput>
  }

  /**
   * Url createMany
   */
  export type UrlCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Urls.
     */
    data: UrlCreateManyInput | UrlCreateManyInput[]
  }

  /**
   * Url createManyAndReturn
   */
  export type UrlCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * The data used to create many Urls.
     */
    data: UrlCreateManyInput | UrlCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Url update
   */
  export type UrlUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * The data needed to update a Url.
     */
    data: XOR<UrlUpdateInput, UrlUncheckedUpdateInput>
    /**
     * Choose, which Url to update.
     */
    where: UrlWhereUniqueInput
  }

  /**
   * Url updateMany
   */
  export type UrlUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Urls.
     */
    data: XOR<UrlUpdateManyMutationInput, UrlUncheckedUpdateManyInput>
    /**
     * Filter which Urls to update
     */
    where?: UrlWhereInput
    /**
     * Limit how many Urls to update.
     */
    limit?: number
  }

  /**
   * Url updateManyAndReturn
   */
  export type UrlUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * The data used to update Urls.
     */
    data: XOR<UrlUpdateManyMutationInput, UrlUncheckedUpdateManyInput>
    /**
     * Filter which Urls to update
     */
    where?: UrlWhereInput
    /**
     * Limit how many Urls to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Url upsert
   */
  export type UrlUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * The filter to search for the Url to update in case it exists.
     */
    where: UrlWhereUniqueInput
    /**
     * In case the Url found by the `where` argument doesn't exist, create a new Url with this data.
     */
    create: XOR<UrlCreateInput, UrlUncheckedCreateInput>
    /**
     * In case the Url was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UrlUpdateInput, UrlUncheckedUpdateInput>
  }

  /**
   * Url delete
   */
  export type UrlDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
    /**
     * Filter which Url to delete.
     */
    where: UrlWhereUniqueInput
  }

  /**
   * Url deleteMany
   */
  export type UrlDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Urls to delete
     */
    where?: UrlWhereInput
    /**
     * Limit how many Urls to delete.
     */
    limit?: number
  }

  /**
   * Url.audits
   */
  export type Url$auditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    where?: AuditRunWhereInput
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    cursor?: AuditRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * Url.budgets
   */
  export type Url$budgetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    where?: BudgetWhereInput
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    cursor?: BudgetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Url without action
   */
  export type UrlDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Url
     */
    select?: UrlSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Url
     */
    omit?: UrlOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UrlInclude<ExtArgs> | null
  }


  /**
   * Model Environment
   */

  export type AggregateEnvironment = {
    _count: EnvironmentCountAggregateOutputType | null
    _min: EnvironmentMinAggregateOutputType | null
    _max: EnvironmentMaxAggregateOutputType | null
  }

  export type EnvironmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    urlPrefix: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnvironmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    urlPrefix: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EnvironmentCountAggregateOutputType = {
    id: number
    name: number
    urlPrefix: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EnvironmentMinAggregateInputType = {
    id?: true
    name?: true
    urlPrefix?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnvironmentMaxAggregateInputType = {
    id?: true
    name?: true
    urlPrefix?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EnvironmentCountAggregateInputType = {
    id?: true
    name?: true
    urlPrefix?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EnvironmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Environment to aggregate.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Environments
    **/
    _count?: true | EnvironmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnvironmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnvironmentMaxAggregateInputType
  }

  export type GetEnvironmentAggregateType<T extends EnvironmentAggregateArgs> = {
        [P in keyof T & keyof AggregateEnvironment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnvironment[P]>
      : GetScalarType<T[P], AggregateEnvironment[P]>
  }




  export type EnvironmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnvironmentWhereInput
    orderBy?: EnvironmentOrderByWithAggregationInput | EnvironmentOrderByWithAggregationInput[]
    by: EnvironmentScalarFieldEnum[] | EnvironmentScalarFieldEnum
    having?: EnvironmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnvironmentCountAggregateInputType | true
    _min?: EnvironmentMinAggregateInputType
    _max?: EnvironmentMaxAggregateInputType
  }

  export type EnvironmentGroupByOutputType = {
    id: string
    name: string
    urlPrefix: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: EnvironmentCountAggregateOutputType | null
    _min: EnvironmentMinAggregateOutputType | null
    _max: EnvironmentMaxAggregateOutputType | null
  }

  type GetEnvironmentGroupByPayload<T extends EnvironmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnvironmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnvironmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>
            : GetScalarType<T[P], EnvironmentGroupByOutputType[P]>
        }
      >
    >


  export type EnvironmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    urlPrefix?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    audits?: boolean | Environment$auditsArgs<ExtArgs>
    _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    urlPrefix?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    urlPrefix?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["environment"]>

  export type EnvironmentSelectScalar = {
    id?: boolean
    name?: boolean
    urlPrefix?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EnvironmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "urlPrefix" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["environment"]>
  export type EnvironmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audits?: boolean | Environment$auditsArgs<ExtArgs>
    _count?: boolean | EnvironmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EnvironmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EnvironmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EnvironmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Environment"
    objects: {
      audits: Prisma.$AuditRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      urlPrefix: string | null
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["environment"]>
    composites: {}
  }

  type EnvironmentGetPayload<S extends boolean | null | undefined | EnvironmentDefaultArgs> = $Result.GetResult<Prisma.$EnvironmentPayload, S>

  type EnvironmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnvironmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnvironmentCountAggregateInputType | true
    }

  export interface EnvironmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Environment'], meta: { name: 'Environment' } }
    /**
     * Find zero or one Environment that matches the filter.
     * @param {EnvironmentFindUniqueArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnvironmentFindUniqueArgs>(args: SelectSubset<T, EnvironmentFindUniqueArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Environment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnvironmentFindUniqueOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnvironmentFindUniqueOrThrowArgs>(args: SelectSubset<T, EnvironmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Environment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnvironmentFindFirstArgs>(args?: SelectSubset<T, EnvironmentFindFirstArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Environment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindFirstOrThrowArgs} args - Arguments to find a Environment
     * @example
     * // Get one Environment
     * const environment = await prisma.environment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnvironmentFindFirstOrThrowArgs>(args?: SelectSubset<T, EnvironmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Environments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Environments
     * const environments = await prisma.environment.findMany()
     * 
     * // Get first 10 Environments
     * const environments = await prisma.environment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const environmentWithIdOnly = await prisma.environment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnvironmentFindManyArgs>(args?: SelectSubset<T, EnvironmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Environment.
     * @param {EnvironmentCreateArgs} args - Arguments to create a Environment.
     * @example
     * // Create one Environment
     * const Environment = await prisma.environment.create({
     *   data: {
     *     // ... data to create a Environment
     *   }
     * })
     * 
     */
    create<T extends EnvironmentCreateArgs>(args: SelectSubset<T, EnvironmentCreateArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Environments.
     * @param {EnvironmentCreateManyArgs} args - Arguments to create many Environments.
     * @example
     * // Create many Environments
     * const environment = await prisma.environment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnvironmentCreateManyArgs>(args?: SelectSubset<T, EnvironmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Environments and returns the data saved in the database.
     * @param {EnvironmentCreateManyAndReturnArgs} args - Arguments to create many Environments.
     * @example
     * // Create many Environments
     * const environment = await prisma.environment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Environments and only return the `id`
     * const environmentWithIdOnly = await prisma.environment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnvironmentCreateManyAndReturnArgs>(args?: SelectSubset<T, EnvironmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Environment.
     * @param {EnvironmentDeleteArgs} args - Arguments to delete one Environment.
     * @example
     * // Delete one Environment
     * const Environment = await prisma.environment.delete({
     *   where: {
     *     // ... filter to delete one Environment
     *   }
     * })
     * 
     */
    delete<T extends EnvironmentDeleteArgs>(args: SelectSubset<T, EnvironmentDeleteArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Environment.
     * @param {EnvironmentUpdateArgs} args - Arguments to update one Environment.
     * @example
     * // Update one Environment
     * const environment = await prisma.environment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnvironmentUpdateArgs>(args: SelectSubset<T, EnvironmentUpdateArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Environments.
     * @param {EnvironmentDeleteManyArgs} args - Arguments to filter Environments to delete.
     * @example
     * // Delete a few Environments
     * const { count } = await prisma.environment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnvironmentDeleteManyArgs>(args?: SelectSubset<T, EnvironmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Environments
     * const environment = await prisma.environment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnvironmentUpdateManyArgs>(args: SelectSubset<T, EnvironmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Environments and returns the data updated in the database.
     * @param {EnvironmentUpdateManyAndReturnArgs} args - Arguments to update many Environments.
     * @example
     * // Update many Environments
     * const environment = await prisma.environment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Environments and only return the `id`
     * const environmentWithIdOnly = await prisma.environment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EnvironmentUpdateManyAndReturnArgs>(args: SelectSubset<T, EnvironmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Environment.
     * @param {EnvironmentUpsertArgs} args - Arguments to update or create a Environment.
     * @example
     * // Update or create a Environment
     * const environment = await prisma.environment.upsert({
     *   create: {
     *     // ... data to create a Environment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Environment we want to update
     *   }
     * })
     */
    upsert<T extends EnvironmentUpsertArgs>(args: SelectSubset<T, EnvironmentUpsertArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Environments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentCountArgs} args - Arguments to filter Environments to count.
     * @example
     * // Count the number of Environments
     * const count = await prisma.environment.count({
     *   where: {
     *     // ... the filter for the Environments we want to count
     *   }
     * })
    **/
    count<T extends EnvironmentCountArgs>(
      args?: Subset<T, EnvironmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnvironmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EnvironmentAggregateArgs>(args: Subset<T, EnvironmentAggregateArgs>): Prisma.PrismaPromise<GetEnvironmentAggregateType<T>>

    /**
     * Group by Environment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnvironmentGroupByArgs} args - Group by arguments.
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
      T extends EnvironmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnvironmentGroupByArgs['orderBy'] }
        : { orderBy?: EnvironmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EnvironmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnvironmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Environment model
   */
  readonly fields: EnvironmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Environment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnvironmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    audits<T extends Environment$auditsArgs<ExtArgs> = {}>(args?: Subset<T, Environment$auditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Environment model
   */
  interface EnvironmentFieldRefs {
    readonly id: FieldRef<"Environment", 'String'>
    readonly name: FieldRef<"Environment", 'String'>
    readonly urlPrefix: FieldRef<"Environment", 'String'>
    readonly description: FieldRef<"Environment", 'String'>
    readonly createdAt: FieldRef<"Environment", 'DateTime'>
    readonly updatedAt: FieldRef<"Environment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Environment findUnique
   */
  export type EnvironmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment findUniqueOrThrow
   */
  export type EnvironmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment findFirst
   */
  export type EnvironmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment findFirstOrThrow
   */
  export type EnvironmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environment to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment findMany
   */
  export type EnvironmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter, which Environments to fetch.
     */
    where?: EnvironmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Environments to fetch.
     */
    orderBy?: EnvironmentOrderByWithRelationInput | EnvironmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Environments.
     */
    cursor?: EnvironmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Environments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Environments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Environments.
     */
    distinct?: EnvironmentScalarFieldEnum | EnvironmentScalarFieldEnum[]
  }

  /**
   * Environment create
   */
  export type EnvironmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Environment.
     */
    data: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>
  }

  /**
   * Environment createMany
   */
  export type EnvironmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Environments.
     */
    data: EnvironmentCreateManyInput | EnvironmentCreateManyInput[]
  }

  /**
   * Environment createManyAndReturn
   */
  export type EnvironmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * The data used to create many Environments.
     */
    data: EnvironmentCreateManyInput | EnvironmentCreateManyInput[]
  }

  /**
   * Environment update
   */
  export type EnvironmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Environment.
     */
    data: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>
    /**
     * Choose, which Environment to update.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment updateMany
   */
  export type EnvironmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Environments.
     */
    data: XOR<EnvironmentUpdateManyMutationInput, EnvironmentUncheckedUpdateManyInput>
    /**
     * Filter which Environments to update
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to update.
     */
    limit?: number
  }

  /**
   * Environment updateManyAndReturn
   */
  export type EnvironmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * The data used to update Environments.
     */
    data: XOR<EnvironmentUpdateManyMutationInput, EnvironmentUncheckedUpdateManyInput>
    /**
     * Filter which Environments to update
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to update.
     */
    limit?: number
  }

  /**
   * Environment upsert
   */
  export type EnvironmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Environment to update in case it exists.
     */
    where: EnvironmentWhereUniqueInput
    /**
     * In case the Environment found by the `where` argument doesn't exist, create a new Environment with this data.
     */
    create: XOR<EnvironmentCreateInput, EnvironmentUncheckedCreateInput>
    /**
     * In case the Environment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnvironmentUpdateInput, EnvironmentUncheckedUpdateInput>
  }

  /**
   * Environment delete
   */
  export type EnvironmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
    /**
     * Filter which Environment to delete.
     */
    where: EnvironmentWhereUniqueInput
  }

  /**
   * Environment deleteMany
   */
  export type EnvironmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Environments to delete
     */
    where?: EnvironmentWhereInput
    /**
     * Limit how many Environments to delete.
     */
    limit?: number
  }

  /**
   * Environment.audits
   */
  export type Environment$auditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    where?: AuditRunWhereInput
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    cursor?: AuditRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * Environment without action
   */
  export type EnvironmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Environment
     */
    select?: EnvironmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Environment
     */
    omit?: EnvironmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnvironmentInclude<ExtArgs> | null
  }


  /**
   * Model AuditRun
   */

  export type AggregateAuditRun = {
    _count: AuditRunCountAggregateOutputType | null
    _min: AuditRunMinAggregateOutputType | null
    _max: AuditRunMaxAggregateOutputType | null
  }

  export type AuditRunMinAggregateOutputType = {
    id: string | null
    urlId: string | null
    environmentId: string | null
    status: string | null
    inBudget: boolean | null
    reportPath: string | null
    scheduledAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type AuditRunMaxAggregateOutputType = {
    id: string | null
    urlId: string | null
    environmentId: string | null
    status: string | null
    inBudget: boolean | null
    reportPath: string | null
    scheduledAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type AuditRunCountAggregateOutputType = {
    id: number
    urlId: number
    environmentId: number
    status: number
    inBudget: number
    reportPath: number
    scheduledAt: number
    startedAt: number
    completedAt: number
    createdAt: number
    _all: number
  }


  export type AuditRunMinAggregateInputType = {
    id?: true
    urlId?: true
    environmentId?: true
    status?: true
    inBudget?: true
    reportPath?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
  }

  export type AuditRunMaxAggregateInputType = {
    id?: true
    urlId?: true
    environmentId?: true
    status?: true
    inBudget?: true
    reportPath?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
  }

  export type AuditRunCountAggregateInputType = {
    id?: true
    urlId?: true
    environmentId?: true
    status?: true
    inBudget?: true
    reportPath?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    _all?: true
  }

  export type AuditRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditRun to aggregate.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditRuns
    **/
    _count?: true | AuditRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditRunMaxAggregateInputType
  }

  export type GetAuditRunAggregateType<T extends AuditRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditRun[P]>
      : GetScalarType<T[P], AggregateAuditRun[P]>
  }




  export type AuditRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditRunWhereInput
    orderBy?: AuditRunOrderByWithAggregationInput | AuditRunOrderByWithAggregationInput[]
    by: AuditRunScalarFieldEnum[] | AuditRunScalarFieldEnum
    having?: AuditRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditRunCountAggregateInputType | true
    _min?: AuditRunMinAggregateInputType
    _max?: AuditRunMaxAggregateInputType
  }

  export type AuditRunGroupByOutputType = {
    id: string
    urlId: string
    environmentId: string
    status: string
    inBudget: boolean
    reportPath: string | null
    scheduledAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    _count: AuditRunCountAggregateOutputType | null
    _min: AuditRunMinAggregateOutputType | null
    _max: AuditRunMaxAggregateOutputType | null
  }

  type GetAuditRunGroupByPayload<T extends AuditRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditRunGroupByOutputType[P]>
            : GetScalarType<T[P], AuditRunGroupByOutputType[P]>
        }
      >
    >


  export type AuditRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    environmentId?: boolean
    status?: boolean
    inBudget?: boolean
    reportPath?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    metrics?: boolean | AuditRun$metricsArgs<ExtArgs>
    _count?: boolean | AuditRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    environmentId?: boolean
    status?: boolean
    inBudget?: boolean
    reportPath?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    environmentId?: boolean
    status?: boolean
    inBudget?: boolean
    reportPath?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectScalar = {
    id?: boolean
    urlId?: boolean
    environmentId?: boolean
    status?: boolean
    inBudget?: boolean
    reportPath?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }

  export type AuditRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "urlId" | "environmentId" | "status" | "inBudget" | "reportPath" | "scheduledAt" | "startedAt" | "completedAt" | "createdAt", ExtArgs["result"]["auditRun"]>
  export type AuditRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
    metrics?: boolean | AuditRun$metricsArgs<ExtArgs>
    _count?: boolean | AuditRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuditRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
  }
  export type AuditRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
    environment?: boolean | EnvironmentDefaultArgs<ExtArgs>
  }

  export type $AuditRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditRun"
    objects: {
      url: Prisma.$UrlPayload<ExtArgs>
      environment: Prisma.$EnvironmentPayload<ExtArgs>
      metrics: Prisma.$MetricPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      urlId: string
      environmentId: string
      status: string
      inBudget: boolean
      reportPath: string | null
      scheduledAt: Date | null
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["auditRun"]>
    composites: {}
  }

  type AuditRunGetPayload<S extends boolean | null | undefined | AuditRunDefaultArgs> = $Result.GetResult<Prisma.$AuditRunPayload, S>

  type AuditRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditRunCountAggregateInputType | true
    }

  export interface AuditRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditRun'], meta: { name: 'AuditRun' } }
    /**
     * Find zero or one AuditRun that matches the filter.
     * @param {AuditRunFindUniqueArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditRunFindUniqueArgs>(args: SelectSubset<T, AuditRunFindUniqueArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditRunFindUniqueOrThrowArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindFirstArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditRunFindFirstArgs>(args?: SelectSubset<T, AuditRunFindFirstArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindFirstOrThrowArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditRuns
     * const auditRuns = await prisma.auditRun.findMany()
     * 
     * // Get first 10 AuditRuns
     * const auditRuns = await prisma.auditRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditRunFindManyArgs>(args?: SelectSubset<T, AuditRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditRun.
     * @param {AuditRunCreateArgs} args - Arguments to create a AuditRun.
     * @example
     * // Create one AuditRun
     * const AuditRun = await prisma.auditRun.create({
     *   data: {
     *     // ... data to create a AuditRun
     *   }
     * })
     * 
     */
    create<T extends AuditRunCreateArgs>(args: SelectSubset<T, AuditRunCreateArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditRuns.
     * @param {AuditRunCreateManyArgs} args - Arguments to create many AuditRuns.
     * @example
     * // Create many AuditRuns
     * const auditRun = await prisma.auditRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditRunCreateManyArgs>(args?: SelectSubset<T, AuditRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditRuns and returns the data saved in the database.
     * @param {AuditRunCreateManyAndReturnArgs} args - Arguments to create many AuditRuns.
     * @example
     * // Create many AuditRuns
     * const auditRun = await prisma.auditRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditRuns and only return the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditRun.
     * @param {AuditRunDeleteArgs} args - Arguments to delete one AuditRun.
     * @example
     * // Delete one AuditRun
     * const AuditRun = await prisma.auditRun.delete({
     *   where: {
     *     // ... filter to delete one AuditRun
     *   }
     * })
     * 
     */
    delete<T extends AuditRunDeleteArgs>(args: SelectSubset<T, AuditRunDeleteArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditRun.
     * @param {AuditRunUpdateArgs} args - Arguments to update one AuditRun.
     * @example
     * // Update one AuditRun
     * const auditRun = await prisma.auditRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditRunUpdateArgs>(args: SelectSubset<T, AuditRunUpdateArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditRuns.
     * @param {AuditRunDeleteManyArgs} args - Arguments to filter AuditRuns to delete.
     * @example
     * // Delete a few AuditRuns
     * const { count } = await prisma.auditRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditRunDeleteManyArgs>(args?: SelectSubset<T, AuditRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditRuns
     * const auditRun = await prisma.auditRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditRunUpdateManyArgs>(args: SelectSubset<T, AuditRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditRuns and returns the data updated in the database.
     * @param {AuditRunUpdateManyAndReturnArgs} args - Arguments to update many AuditRuns.
     * @example
     * // Update many AuditRuns
     * const auditRun = await prisma.auditRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditRuns and only return the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditRunUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditRun.
     * @param {AuditRunUpsertArgs} args - Arguments to update or create a AuditRun.
     * @example
     * // Update or create a AuditRun
     * const auditRun = await prisma.auditRun.upsert({
     *   create: {
     *     // ... data to create a AuditRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditRun we want to update
     *   }
     * })
     */
    upsert<T extends AuditRunUpsertArgs>(args: SelectSubset<T, AuditRunUpsertArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunCountArgs} args - Arguments to filter AuditRuns to count.
     * @example
     * // Count the number of AuditRuns
     * const count = await prisma.auditRun.count({
     *   where: {
     *     // ... the filter for the AuditRuns we want to count
     *   }
     * })
    **/
    count<T extends AuditRunCountArgs>(
      args?: Subset<T, AuditRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditRunAggregateArgs>(args: Subset<T, AuditRunAggregateArgs>): Prisma.PrismaPromise<GetAuditRunAggregateType<T>>

    /**
     * Group by AuditRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunGroupByArgs} args - Group by arguments.
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
      T extends AuditRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditRunGroupByArgs['orderBy'] }
        : { orderBy?: AuditRunGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditRun model
   */
  readonly fields: AuditRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    url<T extends UrlDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UrlDefaultArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    environment<T extends EnvironmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnvironmentDefaultArgs<ExtArgs>>): Prisma__EnvironmentClient<$Result.GetResult<Prisma.$EnvironmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    metrics<T extends AuditRun$metricsArgs<ExtArgs> = {}>(args?: Subset<T, AuditRun$metricsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the AuditRun model
   */
  interface AuditRunFieldRefs {
    readonly id: FieldRef<"AuditRun", 'String'>
    readonly urlId: FieldRef<"AuditRun", 'String'>
    readonly environmentId: FieldRef<"AuditRun", 'String'>
    readonly status: FieldRef<"AuditRun", 'String'>
    readonly inBudget: FieldRef<"AuditRun", 'Boolean'>
    readonly reportPath: FieldRef<"AuditRun", 'String'>
    readonly scheduledAt: FieldRef<"AuditRun", 'DateTime'>
    readonly startedAt: FieldRef<"AuditRun", 'DateTime'>
    readonly completedAt: FieldRef<"AuditRun", 'DateTime'>
    readonly createdAt: FieldRef<"AuditRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditRun findUnique
   */
  export type AuditRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun findUniqueOrThrow
   */
  export type AuditRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun findFirst
   */
  export type AuditRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditRuns.
     */
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun findFirstOrThrow
   */
  export type AuditRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditRuns.
     */
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun findMany
   */
  export type AuditRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter, which AuditRuns to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditRuns.
     */
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun create
   */
  export type AuditRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditRun.
     */
    data: XOR<AuditRunCreateInput, AuditRunUncheckedCreateInput>
  }

  /**
   * AuditRun createMany
   */
  export type AuditRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditRuns.
     */
    data: AuditRunCreateManyInput | AuditRunCreateManyInput[]
  }

  /**
   * AuditRun createManyAndReturn
   */
  export type AuditRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data used to create many AuditRuns.
     */
    data: AuditRunCreateManyInput | AuditRunCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditRun update
   */
  export type AuditRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditRun.
     */
    data: XOR<AuditRunUpdateInput, AuditRunUncheckedUpdateInput>
    /**
     * Choose, which AuditRun to update.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun updateMany
   */
  export type AuditRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditRuns.
     */
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyInput>
    /**
     * Filter which AuditRuns to update
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to update.
     */
    limit?: number
  }

  /**
   * AuditRun updateManyAndReturn
   */
  export type AuditRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data used to update AuditRuns.
     */
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyInput>
    /**
     * Filter which AuditRuns to update
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditRun upsert
   */
  export type AuditRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditRun to update in case it exists.
     */
    where: AuditRunWhereUniqueInput
    /**
     * In case the AuditRun found by the `where` argument doesn't exist, create a new AuditRun with this data.
     */
    create: XOR<AuditRunCreateInput, AuditRunUncheckedCreateInput>
    /**
     * In case the AuditRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditRunUpdateInput, AuditRunUncheckedUpdateInput>
  }

  /**
   * AuditRun delete
   */
  export type AuditRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
    /**
     * Filter which AuditRun to delete.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun deleteMany
   */
  export type AuditRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditRuns to delete
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to delete.
     */
    limit?: number
  }

  /**
   * AuditRun.metrics
   */
  export type AuditRun$metricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    where?: MetricWhereInput
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    cursor?: MetricWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * AuditRun without action
   */
  export type AuditRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditRunInclude<ExtArgs> | null
  }


  /**
   * Model Metric
   */

  export type AggregateMetric = {
    _count: MetricCountAggregateOutputType | null
    _avg: MetricAvgAggregateOutputType | null
    _sum: MetricSumAggregateOutputType | null
    _min: MetricMinAggregateOutputType | null
    _max: MetricMaxAggregateOutputType | null
  }

  export type MetricAvgAggregateOutputType = {
    value: number | null
  }

  export type MetricSumAggregateOutputType = {
    value: number | null
  }

  export type MetricMinAggregateOutputType = {
    id: string | null
    auditRunId: string | null
    name: string | null
    value: number | null
    unit: string | null
    category: string | null
    createdAt: Date | null
  }

  export type MetricMaxAggregateOutputType = {
    id: string | null
    auditRunId: string | null
    name: string | null
    value: number | null
    unit: string | null
    category: string | null
    createdAt: Date | null
  }

  export type MetricCountAggregateOutputType = {
    id: number
    auditRunId: number
    name: number
    value: number
    unit: number
    category: number
    createdAt: number
    _all: number
  }


  export type MetricAvgAggregateInputType = {
    value?: true
  }

  export type MetricSumAggregateInputType = {
    value?: true
  }

  export type MetricMinAggregateInputType = {
    id?: true
    auditRunId?: true
    name?: true
    value?: true
    unit?: true
    category?: true
    createdAt?: true
  }

  export type MetricMaxAggregateInputType = {
    id?: true
    auditRunId?: true
    name?: true
    value?: true
    unit?: true
    category?: true
    createdAt?: true
  }

  export type MetricCountAggregateInputType = {
    id?: true
    auditRunId?: true
    name?: true
    value?: true
    unit?: true
    category?: true
    createdAt?: true
    _all?: true
  }

  export type MetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metric to aggregate.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Metrics
    **/
    _count?: true | MetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetricMaxAggregateInputType
  }

  export type GetMetricAggregateType<T extends MetricAggregateArgs> = {
        [P in keyof T & keyof AggregateMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetric[P]>
      : GetScalarType<T[P], AggregateMetric[P]>
  }




  export type MetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetricWhereInput
    orderBy?: MetricOrderByWithAggregationInput | MetricOrderByWithAggregationInput[]
    by: MetricScalarFieldEnum[] | MetricScalarFieldEnum
    having?: MetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetricCountAggregateInputType | true
    _avg?: MetricAvgAggregateInputType
    _sum?: MetricSumAggregateInputType
    _min?: MetricMinAggregateInputType
    _max?: MetricMaxAggregateInputType
  }

  export type MetricGroupByOutputType = {
    id: string
    auditRunId: string
    name: string
    value: number
    unit: string | null
    category: string
    createdAt: Date
    _count: MetricCountAggregateOutputType | null
    _avg: MetricAvgAggregateOutputType | null
    _sum: MetricSumAggregateOutputType | null
    _min: MetricMinAggregateOutputType | null
    _max: MetricMaxAggregateOutputType | null
  }

  type GetMetricGroupByPayload<T extends MetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetricGroupByOutputType[P]>
            : GetScalarType<T[P], MetricGroupByOutputType[P]>
        }
      >
    >


  export type MetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auditRunId?: boolean
    name?: boolean
    value?: boolean
    unit?: boolean
    category?: boolean
    createdAt?: boolean
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metric"]>

  export type MetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auditRunId?: boolean
    name?: boolean
    value?: boolean
    unit?: boolean
    category?: boolean
    createdAt?: boolean
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metric"]>

  export type MetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    auditRunId?: boolean
    name?: boolean
    value?: boolean
    unit?: boolean
    category?: boolean
    createdAt?: boolean
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metric"]>

  export type MetricSelectScalar = {
    id?: boolean
    auditRunId?: boolean
    name?: boolean
    value?: boolean
    unit?: boolean
    category?: boolean
    createdAt?: boolean
  }

  export type MetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "auditRunId" | "name" | "value" | "unit" | "category" | "createdAt", ExtArgs["result"]["metric"]>
  export type MetricInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }
  export type MetricIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }
  export type MetricIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRun?: boolean | AuditRunDefaultArgs<ExtArgs>
  }

  export type $MetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Metric"
    objects: {
      auditRun: Prisma.$AuditRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      auditRunId: string
      name: string
      value: number
      unit: string | null
      category: string
      createdAt: Date
    }, ExtArgs["result"]["metric"]>
    composites: {}
  }

  type MetricGetPayload<S extends boolean | null | undefined | MetricDefaultArgs> = $Result.GetResult<Prisma.$MetricPayload, S>

  type MetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetricCountAggregateInputType | true
    }

  export interface MetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Metric'], meta: { name: 'Metric' } }
    /**
     * Find zero or one Metric that matches the filter.
     * @param {MetricFindUniqueArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetricFindUniqueArgs>(args: SelectSubset<T, MetricFindUniqueArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Metric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetricFindUniqueOrThrowArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetricFindUniqueOrThrowArgs>(args: SelectSubset<T, MetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindFirstArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetricFindFirstArgs>(args?: SelectSubset<T, MetricFindFirstArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindFirstOrThrowArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetricFindFirstOrThrowArgs>(args?: SelectSubset<T, MetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Metrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Metrics
     * const metrics = await prisma.metric.findMany()
     * 
     * // Get first 10 Metrics
     * const metrics = await prisma.metric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metricWithIdOnly = await prisma.metric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetricFindManyArgs>(args?: SelectSubset<T, MetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Metric.
     * @param {MetricCreateArgs} args - Arguments to create a Metric.
     * @example
     * // Create one Metric
     * const Metric = await prisma.metric.create({
     *   data: {
     *     // ... data to create a Metric
     *   }
     * })
     * 
     */
    create<T extends MetricCreateArgs>(args: SelectSubset<T, MetricCreateArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Metrics.
     * @param {MetricCreateManyArgs} args - Arguments to create many Metrics.
     * @example
     * // Create many Metrics
     * const metric = await prisma.metric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetricCreateManyArgs>(args?: SelectSubset<T, MetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Metrics and returns the data saved in the database.
     * @param {MetricCreateManyAndReturnArgs} args - Arguments to create many Metrics.
     * @example
     * // Create many Metrics
     * const metric = await prisma.metric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Metrics and only return the `id`
     * const metricWithIdOnly = await prisma.metric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetricCreateManyAndReturnArgs>(args?: SelectSubset<T, MetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Metric.
     * @param {MetricDeleteArgs} args - Arguments to delete one Metric.
     * @example
     * // Delete one Metric
     * const Metric = await prisma.metric.delete({
     *   where: {
     *     // ... filter to delete one Metric
     *   }
     * })
     * 
     */
    delete<T extends MetricDeleteArgs>(args: SelectSubset<T, MetricDeleteArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Metric.
     * @param {MetricUpdateArgs} args - Arguments to update one Metric.
     * @example
     * // Update one Metric
     * const metric = await prisma.metric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetricUpdateArgs>(args: SelectSubset<T, MetricUpdateArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Metrics.
     * @param {MetricDeleteManyArgs} args - Arguments to filter Metrics to delete.
     * @example
     * // Delete a few Metrics
     * const { count } = await prisma.metric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetricDeleteManyArgs>(args?: SelectSubset<T, MetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Metrics
     * const metric = await prisma.metric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetricUpdateManyArgs>(args: SelectSubset<T, MetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metrics and returns the data updated in the database.
     * @param {MetricUpdateManyAndReturnArgs} args - Arguments to update many Metrics.
     * @example
     * // Update many Metrics
     * const metric = await prisma.metric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Metrics and only return the `id`
     * const metricWithIdOnly = await prisma.metric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetricUpdateManyAndReturnArgs>(args: SelectSubset<T, MetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Metric.
     * @param {MetricUpsertArgs} args - Arguments to update or create a Metric.
     * @example
     * // Update or create a Metric
     * const metric = await prisma.metric.upsert({
     *   create: {
     *     // ... data to create a Metric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Metric we want to update
     *   }
     * })
     */
    upsert<T extends MetricUpsertArgs>(args: SelectSubset<T, MetricUpsertArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricCountArgs} args - Arguments to filter Metrics to count.
     * @example
     * // Count the number of Metrics
     * const count = await prisma.metric.count({
     *   where: {
     *     // ... the filter for the Metrics we want to count
     *   }
     * })
    **/
    count<T extends MetricCountArgs>(
      args?: Subset<T, MetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Metric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MetricAggregateArgs>(args: Subset<T, MetricAggregateArgs>): Prisma.PrismaPromise<GetMetricAggregateType<T>>

    /**
     * Group by Metric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricGroupByArgs} args - Group by arguments.
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
      T extends MetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetricGroupByArgs['orderBy'] }
        : { orderBy?: MetricGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Metric model
   */
  readonly fields: MetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Metric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditRun<T extends AuditRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuditRunDefaultArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Metric model
   */
  interface MetricFieldRefs {
    readonly id: FieldRef<"Metric", 'String'>
    readonly auditRunId: FieldRef<"Metric", 'String'>
    readonly name: FieldRef<"Metric", 'String'>
    readonly value: FieldRef<"Metric", 'Float'>
    readonly unit: FieldRef<"Metric", 'String'>
    readonly category: FieldRef<"Metric", 'String'>
    readonly createdAt: FieldRef<"Metric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Metric findUnique
   */
  export type MetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric findUniqueOrThrow
   */
  export type MetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric findFirst
   */
  export type MetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric findFirstOrThrow
   */
  export type MetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric findMany
   */
  export type MetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter, which Metrics to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric create
   */
  export type MetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * The data needed to create a Metric.
     */
    data: XOR<MetricCreateInput, MetricUncheckedCreateInput>
  }

  /**
   * Metric createMany
   */
  export type MetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Metrics.
     */
    data: MetricCreateManyInput | MetricCreateManyInput[]
  }

  /**
   * Metric createManyAndReturn
   */
  export type MetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * The data used to create many Metrics.
     */
    data: MetricCreateManyInput | MetricCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Metric update
   */
  export type MetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * The data needed to update a Metric.
     */
    data: XOR<MetricUpdateInput, MetricUncheckedUpdateInput>
    /**
     * Choose, which Metric to update.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric updateMany
   */
  export type MetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Metrics.
     */
    data: XOR<MetricUpdateManyMutationInput, MetricUncheckedUpdateManyInput>
    /**
     * Filter which Metrics to update
     */
    where?: MetricWhereInput
    /**
     * Limit how many Metrics to update.
     */
    limit?: number
  }

  /**
   * Metric updateManyAndReturn
   */
  export type MetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * The data used to update Metrics.
     */
    data: XOR<MetricUpdateManyMutationInput, MetricUncheckedUpdateManyInput>
    /**
     * Filter which Metrics to update
     */
    where?: MetricWhereInput
    /**
     * Limit how many Metrics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Metric upsert
   */
  export type MetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * The filter to search for the Metric to update in case it exists.
     */
    where: MetricWhereUniqueInput
    /**
     * In case the Metric found by the `where` argument doesn't exist, create a new Metric with this data.
     */
    create: XOR<MetricCreateInput, MetricUncheckedCreateInput>
    /**
     * In case the Metric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetricUpdateInput, MetricUncheckedUpdateInput>
  }

  /**
   * Metric delete
   */
  export type MetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
    /**
     * Filter which Metric to delete.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric deleteMany
   */
  export type MetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metrics to delete
     */
    where?: MetricWhereInput
    /**
     * Limit how many Metrics to delete.
     */
    limit?: number
  }

  /**
   * Metric without action
   */
  export type MetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetricInclude<ExtArgs> | null
  }


  /**
   * Model Budget
   */

  export type AggregateBudget = {
    _count: BudgetCountAggregateOutputType | null
    _avg: BudgetAvgAggregateOutputType | null
    _sum: BudgetSumAggregateOutputType | null
    _min: BudgetMinAggregateOutputType | null
    _max: BudgetMaxAggregateOutputType | null
  }

  export type BudgetAvgAggregateOutputType = {
    threshold: number | null
  }

  export type BudgetSumAggregateOutputType = {
    threshold: number | null
  }

  export type BudgetMinAggregateOutputType = {
    id: string | null
    urlId: string | null
    metricName: string | null
    threshold: number | null
    operator: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BudgetMaxAggregateOutputType = {
    id: string | null
    urlId: string | null
    metricName: string | null
    threshold: number | null
    operator: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BudgetCountAggregateOutputType = {
    id: number
    urlId: number
    metricName: number
    threshold: number
    operator: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BudgetAvgAggregateInputType = {
    threshold?: true
  }

  export type BudgetSumAggregateInputType = {
    threshold?: true
  }

  export type BudgetMinAggregateInputType = {
    id?: true
    urlId?: true
    metricName?: true
    threshold?: true
    operator?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BudgetMaxAggregateInputType = {
    id?: true
    urlId?: true
    metricName?: true
    threshold?: true
    operator?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BudgetCountAggregateInputType = {
    id?: true
    urlId?: true
    metricName?: true
    threshold?: true
    operator?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BudgetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Budget to aggregate.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Budgets
    **/
    _count?: true | BudgetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BudgetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BudgetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BudgetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BudgetMaxAggregateInputType
  }

  export type GetBudgetAggregateType<T extends BudgetAggregateArgs> = {
        [P in keyof T & keyof AggregateBudget]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBudget[P]>
      : GetScalarType<T[P], AggregateBudget[P]>
  }




  export type BudgetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetWhereInput
    orderBy?: BudgetOrderByWithAggregationInput | BudgetOrderByWithAggregationInput[]
    by: BudgetScalarFieldEnum[] | BudgetScalarFieldEnum
    having?: BudgetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BudgetCountAggregateInputType | true
    _avg?: BudgetAvgAggregateInputType
    _sum?: BudgetSumAggregateInputType
    _min?: BudgetMinAggregateInputType
    _max?: BudgetMaxAggregateInputType
  }

  export type BudgetGroupByOutputType = {
    id: string
    urlId: string
    metricName: string
    threshold: number
    operator: string
    createdAt: Date
    updatedAt: Date
    _count: BudgetCountAggregateOutputType | null
    _avg: BudgetAvgAggregateOutputType | null
    _sum: BudgetSumAggregateOutputType | null
    _min: BudgetMinAggregateOutputType | null
    _max: BudgetMaxAggregateOutputType | null
  }

  type GetBudgetGroupByPayload<T extends BudgetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BudgetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BudgetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BudgetGroupByOutputType[P]>
            : GetScalarType<T[P], BudgetGroupByOutputType[P]>
        }
      >
    >


  export type BudgetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    metricName?: boolean
    threshold?: boolean
    operator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    metricName?: boolean
    threshold?: boolean
    operator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urlId?: boolean
    metricName?: boolean
    threshold?: boolean
    operator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectScalar = {
    id?: boolean
    urlId?: boolean
    metricName?: boolean
    threshold?: boolean
    operator?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BudgetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "urlId" | "metricName" | "threshold" | "operator" | "createdAt" | "updatedAt", ExtArgs["result"]["budget"]>
  export type BudgetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }
  export type BudgetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }
  export type BudgetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    url?: boolean | UrlDefaultArgs<ExtArgs>
  }

  export type $BudgetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Budget"
    objects: {
      url: Prisma.$UrlPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      urlId: string
      metricName: string
      threshold: number
      operator: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["budget"]>
    composites: {}
  }

  type BudgetGetPayload<S extends boolean | null | undefined | BudgetDefaultArgs> = $Result.GetResult<Prisma.$BudgetPayload, S>

  type BudgetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BudgetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BudgetCountAggregateInputType | true
    }

  export interface BudgetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Budget'], meta: { name: 'Budget' } }
    /**
     * Find zero or one Budget that matches the filter.
     * @param {BudgetFindUniqueArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BudgetFindUniqueArgs>(args: SelectSubset<T, BudgetFindUniqueArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Budget that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BudgetFindUniqueOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BudgetFindUniqueOrThrowArgs>(args: SelectSubset<T, BudgetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Budget that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BudgetFindFirstArgs>(args?: SelectSubset<T, BudgetFindFirstArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Budget that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BudgetFindFirstOrThrowArgs>(args?: SelectSubset<T, BudgetFindFirstOrThrowArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Budgets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Budgets
     * const budgets = await prisma.budget.findMany()
     * 
     * // Get first 10 Budgets
     * const budgets = await prisma.budget.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const budgetWithIdOnly = await prisma.budget.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BudgetFindManyArgs>(args?: SelectSubset<T, BudgetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Budget.
     * @param {BudgetCreateArgs} args - Arguments to create a Budget.
     * @example
     * // Create one Budget
     * const Budget = await prisma.budget.create({
     *   data: {
     *     // ... data to create a Budget
     *   }
     * })
     * 
     */
    create<T extends BudgetCreateArgs>(args: SelectSubset<T, BudgetCreateArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Budgets.
     * @param {BudgetCreateManyArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BudgetCreateManyArgs>(args?: SelectSubset<T, BudgetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Budgets and returns the data saved in the database.
     * @param {BudgetCreateManyAndReturnArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BudgetCreateManyAndReturnArgs>(args?: SelectSubset<T, BudgetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Budget.
     * @param {BudgetDeleteArgs} args - Arguments to delete one Budget.
     * @example
     * // Delete one Budget
     * const Budget = await prisma.budget.delete({
     *   where: {
     *     // ... filter to delete one Budget
     *   }
     * })
     * 
     */
    delete<T extends BudgetDeleteArgs>(args: SelectSubset<T, BudgetDeleteArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Budget.
     * @param {BudgetUpdateArgs} args - Arguments to update one Budget.
     * @example
     * // Update one Budget
     * const budget = await prisma.budget.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BudgetUpdateArgs>(args: SelectSubset<T, BudgetUpdateArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Budgets.
     * @param {BudgetDeleteManyArgs} args - Arguments to filter Budgets to delete.
     * @example
     * // Delete a few Budgets
     * const { count } = await prisma.budget.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BudgetDeleteManyArgs>(args?: SelectSubset<T, BudgetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BudgetUpdateManyArgs>(args: SelectSubset<T, BudgetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Budgets and returns the data updated in the database.
     * @param {BudgetUpdateManyAndReturnArgs} args - Arguments to update many Budgets.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BudgetUpdateManyAndReturnArgs>(args: SelectSubset<T, BudgetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Budget.
     * @param {BudgetUpsertArgs} args - Arguments to update or create a Budget.
     * @example
     * // Update or create a Budget
     * const budget = await prisma.budget.upsert({
     *   create: {
     *     // ... data to create a Budget
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Budget we want to update
     *   }
     * })
     */
    upsert<T extends BudgetUpsertArgs>(args: SelectSubset<T, BudgetUpsertArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCountArgs} args - Arguments to filter Budgets to count.
     * @example
     * // Count the number of Budgets
     * const count = await prisma.budget.count({
     *   where: {
     *     // ... the filter for the Budgets we want to count
     *   }
     * })
    **/
    count<T extends BudgetCountArgs>(
      args?: Subset<T, BudgetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BudgetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BudgetAggregateArgs>(args: Subset<T, BudgetAggregateArgs>): Prisma.PrismaPromise<GetBudgetAggregateType<T>>

    /**
     * Group by Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetGroupByArgs} args - Group by arguments.
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
      T extends BudgetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BudgetGroupByArgs['orderBy'] }
        : { orderBy?: BudgetGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BudgetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBudgetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Budget model
   */
  readonly fields: BudgetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Budget.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BudgetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    url<T extends UrlDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UrlDefaultArgs<ExtArgs>>): Prisma__UrlClient<$Result.GetResult<Prisma.$UrlPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Budget model
   */
  interface BudgetFieldRefs {
    readonly id: FieldRef<"Budget", 'String'>
    readonly urlId: FieldRef<"Budget", 'String'>
    readonly metricName: FieldRef<"Budget", 'String'>
    readonly threshold: FieldRef<"Budget", 'Float'>
    readonly operator: FieldRef<"Budget", 'String'>
    readonly createdAt: FieldRef<"Budget", 'DateTime'>
    readonly updatedAt: FieldRef<"Budget", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Budget findUnique
   */
  export type BudgetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget findUniqueOrThrow
   */
  export type BudgetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget findFirst
   */
  export type BudgetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget findFirstOrThrow
   */
  export type BudgetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget findMany
   */
  export type BudgetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budgets to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget create
   */
  export type BudgetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The data needed to create a Budget.
     */
    data: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>
  }

  /**
   * Budget createMany
   */
  export type BudgetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[]
  }

  /**
   * Budget createManyAndReturn
   */
  export type BudgetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Budget update
   */
  export type BudgetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The data needed to update a Budget.
     */
    data: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>
    /**
     * Choose, which Budget to update.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget updateMany
   */
  export type BudgetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to update.
     */
    limit?: number
  }

  /**
   * Budget updateManyAndReturn
   */
  export type BudgetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Budget upsert
   */
  export type BudgetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The filter to search for the Budget to update in case it exists.
     */
    where: BudgetWhereUniqueInput
    /**
     * In case the Budget found by the `where` argument doesn't exist, create a new Budget with this data.
     */
    create: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>
    /**
     * In case the Budget was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>
  }

  /**
   * Budget delete
   */
  export type BudgetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter which Budget to delete.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget deleteMany
   */
  export type BudgetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Budgets to delete
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to delete.
     */
    limit?: number
  }

  /**
   * Budget without action
   */
  export type BudgetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DomainScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DomainScalarFieldEnum = (typeof DomainScalarFieldEnum)[keyof typeof DomainScalarFieldEnum]


  export const UrlScalarFieldEnum: {
    id: 'id',
    address: 'address',
    description: 'description',
    domainId: 'domainId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UrlScalarFieldEnum = (typeof UrlScalarFieldEnum)[keyof typeof UrlScalarFieldEnum]


  export const EnvironmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    urlPrefix: 'urlPrefix',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EnvironmentScalarFieldEnum = (typeof EnvironmentScalarFieldEnum)[keyof typeof EnvironmentScalarFieldEnum]


  export const AuditRunScalarFieldEnum: {
    id: 'id',
    urlId: 'urlId',
    environmentId: 'environmentId',
    status: 'status',
    inBudget: 'inBudget',
    reportPath: 'reportPath',
    scheduledAt: 'scheduledAt',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
  };

  export type AuditRunScalarFieldEnum = (typeof AuditRunScalarFieldEnum)[keyof typeof AuditRunScalarFieldEnum]


  export const MetricScalarFieldEnum: {
    id: 'id',
    auditRunId: 'auditRunId',
    name: 'name',
    value: 'value',
    unit: 'unit',
    category: 'category',
    createdAt: 'createdAt'
  };

  export type MetricScalarFieldEnum = (typeof MetricScalarFieldEnum)[keyof typeof MetricScalarFieldEnum]


  export const BudgetScalarFieldEnum: {
    id: 'id',
    urlId: 'urlId',
    metricName: 'metricName',
    threshold: 'threshold',
    operator: 'operator',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BudgetScalarFieldEnum = (typeof BudgetScalarFieldEnum)[keyof typeof BudgetScalarFieldEnum]


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
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type DomainWhereInput = {
    AND?: DomainWhereInput | DomainWhereInput[]
    OR?: DomainWhereInput[]
    NOT?: DomainWhereInput | DomainWhereInput[]
    id?: StringFilter<"Domain"> | string
    name?: StringFilter<"Domain"> | string
    description?: StringNullableFilter<"Domain"> | string | null
    createdAt?: DateTimeFilter<"Domain"> | Date | string
    updatedAt?: DateTimeFilter<"Domain"> | Date | string
    urls?: UrlListRelationFilter
  }

  export type DomainOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    urls?: UrlOrderByRelationAggregateInput
  }

  export type DomainWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: DomainWhereInput | DomainWhereInput[]
    OR?: DomainWhereInput[]
    NOT?: DomainWhereInput | DomainWhereInput[]
    description?: StringNullableFilter<"Domain"> | string | null
    createdAt?: DateTimeFilter<"Domain"> | Date | string
    updatedAt?: DateTimeFilter<"Domain"> | Date | string
    urls?: UrlListRelationFilter
  }, "id" | "name">

  export type DomainOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DomainCountOrderByAggregateInput
    _max?: DomainMaxOrderByAggregateInput
    _min?: DomainMinOrderByAggregateInput
  }

  export type DomainScalarWhereWithAggregatesInput = {
    AND?: DomainScalarWhereWithAggregatesInput | DomainScalarWhereWithAggregatesInput[]
    OR?: DomainScalarWhereWithAggregatesInput[]
    NOT?: DomainScalarWhereWithAggregatesInput | DomainScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Domain"> | string
    name?: StringWithAggregatesFilter<"Domain"> | string
    description?: StringNullableWithAggregatesFilter<"Domain"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Domain"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Domain"> | Date | string
  }

  export type UrlWhereInput = {
    AND?: UrlWhereInput | UrlWhereInput[]
    OR?: UrlWhereInput[]
    NOT?: UrlWhereInput | UrlWhereInput[]
    id?: StringFilter<"Url"> | string
    address?: StringFilter<"Url"> | string
    description?: StringNullableFilter<"Url"> | string | null
    domainId?: StringFilter<"Url"> | string
    createdAt?: DateTimeFilter<"Url"> | Date | string
    updatedAt?: DateTimeFilter<"Url"> | Date | string
    domain?: XOR<DomainScalarRelationFilter, DomainWhereInput>
    audits?: AuditRunListRelationFilter
    budgets?: BudgetListRelationFilter
  }

  export type UrlOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    description?: SortOrderInput | SortOrder
    domainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    domain?: DomainOrderByWithRelationInput
    audits?: AuditRunOrderByRelationAggregateInput
    budgets?: BudgetOrderByRelationAggregateInput
  }

  export type UrlWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    address_domainId?: UrlAddressDomainIdCompoundUniqueInput
    AND?: UrlWhereInput | UrlWhereInput[]
    OR?: UrlWhereInput[]
    NOT?: UrlWhereInput | UrlWhereInput[]
    address?: StringFilter<"Url"> | string
    description?: StringNullableFilter<"Url"> | string | null
    domainId?: StringFilter<"Url"> | string
    createdAt?: DateTimeFilter<"Url"> | Date | string
    updatedAt?: DateTimeFilter<"Url"> | Date | string
    domain?: XOR<DomainScalarRelationFilter, DomainWhereInput>
    audits?: AuditRunListRelationFilter
    budgets?: BudgetListRelationFilter
  }, "id" | "address_domainId">

  export type UrlOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    description?: SortOrderInput | SortOrder
    domainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UrlCountOrderByAggregateInput
    _max?: UrlMaxOrderByAggregateInput
    _min?: UrlMinOrderByAggregateInput
  }

  export type UrlScalarWhereWithAggregatesInput = {
    AND?: UrlScalarWhereWithAggregatesInput | UrlScalarWhereWithAggregatesInput[]
    OR?: UrlScalarWhereWithAggregatesInput[]
    NOT?: UrlScalarWhereWithAggregatesInput | UrlScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Url"> | string
    address?: StringWithAggregatesFilter<"Url"> | string
    description?: StringNullableWithAggregatesFilter<"Url"> | string | null
    domainId?: StringWithAggregatesFilter<"Url"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Url"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Url"> | Date | string
  }

  export type EnvironmentWhereInput = {
    AND?: EnvironmentWhereInput | EnvironmentWhereInput[]
    OR?: EnvironmentWhereInput[]
    NOT?: EnvironmentWhereInput | EnvironmentWhereInput[]
    id?: StringFilter<"Environment"> | string
    name?: StringFilter<"Environment"> | string
    urlPrefix?: StringNullableFilter<"Environment"> | string | null
    description?: StringNullableFilter<"Environment"> | string | null
    createdAt?: DateTimeFilter<"Environment"> | Date | string
    updatedAt?: DateTimeFilter<"Environment"> | Date | string
    audits?: AuditRunListRelationFilter
  }

  export type EnvironmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    urlPrefix?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    audits?: AuditRunOrderByRelationAggregateInput
  }

  export type EnvironmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: EnvironmentWhereInput | EnvironmentWhereInput[]
    OR?: EnvironmentWhereInput[]
    NOT?: EnvironmentWhereInput | EnvironmentWhereInput[]
    urlPrefix?: StringNullableFilter<"Environment"> | string | null
    description?: StringNullableFilter<"Environment"> | string | null
    createdAt?: DateTimeFilter<"Environment"> | Date | string
    updatedAt?: DateTimeFilter<"Environment"> | Date | string
    audits?: AuditRunListRelationFilter
  }, "id" | "name">

  export type EnvironmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    urlPrefix?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EnvironmentCountOrderByAggregateInput
    _max?: EnvironmentMaxOrderByAggregateInput
    _min?: EnvironmentMinOrderByAggregateInput
  }

  export type EnvironmentScalarWhereWithAggregatesInput = {
    AND?: EnvironmentScalarWhereWithAggregatesInput | EnvironmentScalarWhereWithAggregatesInput[]
    OR?: EnvironmentScalarWhereWithAggregatesInput[]
    NOT?: EnvironmentScalarWhereWithAggregatesInput | EnvironmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Environment"> | string
    name?: StringWithAggregatesFilter<"Environment"> | string
    urlPrefix?: StringNullableWithAggregatesFilter<"Environment"> | string | null
    description?: StringNullableWithAggregatesFilter<"Environment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Environment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Environment"> | Date | string
  }

  export type AuditRunWhereInput = {
    AND?: AuditRunWhereInput | AuditRunWhereInput[]
    OR?: AuditRunWhereInput[]
    NOT?: AuditRunWhereInput | AuditRunWhereInput[]
    id?: StringFilter<"AuditRun"> | string
    urlId?: StringFilter<"AuditRun"> | string
    environmentId?: StringFilter<"AuditRun"> | string
    status?: StringFilter<"AuditRun"> | string
    inBudget?: BoolFilter<"AuditRun"> | boolean
    reportPath?: StringNullableFilter<"AuditRun"> | string | null
    scheduledAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    createdAt?: DateTimeFilter<"AuditRun"> | Date | string
    url?: XOR<UrlScalarRelationFilter, UrlWhereInput>
    environment?: XOR<EnvironmentScalarRelationFilter, EnvironmentWhereInput>
    metrics?: MetricListRelationFilter
  }

  export type AuditRunOrderByWithRelationInput = {
    id?: SortOrder
    urlId?: SortOrder
    environmentId?: SortOrder
    status?: SortOrder
    inBudget?: SortOrder
    reportPath?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    url?: UrlOrderByWithRelationInput
    environment?: EnvironmentOrderByWithRelationInput
    metrics?: MetricOrderByRelationAggregateInput
  }

  export type AuditRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditRunWhereInput | AuditRunWhereInput[]
    OR?: AuditRunWhereInput[]
    NOT?: AuditRunWhereInput | AuditRunWhereInput[]
    urlId?: StringFilter<"AuditRun"> | string
    environmentId?: StringFilter<"AuditRun"> | string
    status?: StringFilter<"AuditRun"> | string
    inBudget?: BoolFilter<"AuditRun"> | boolean
    reportPath?: StringNullableFilter<"AuditRun"> | string | null
    scheduledAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    createdAt?: DateTimeFilter<"AuditRun"> | Date | string
    url?: XOR<UrlScalarRelationFilter, UrlWhereInput>
    environment?: XOR<EnvironmentScalarRelationFilter, EnvironmentWhereInput>
    metrics?: MetricListRelationFilter
  }, "id">

  export type AuditRunOrderByWithAggregationInput = {
    id?: SortOrder
    urlId?: SortOrder
    environmentId?: SortOrder
    status?: SortOrder
    inBudget?: SortOrder
    reportPath?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditRunCountOrderByAggregateInput
    _max?: AuditRunMaxOrderByAggregateInput
    _min?: AuditRunMinOrderByAggregateInput
  }

  export type AuditRunScalarWhereWithAggregatesInput = {
    AND?: AuditRunScalarWhereWithAggregatesInput | AuditRunScalarWhereWithAggregatesInput[]
    OR?: AuditRunScalarWhereWithAggregatesInput[]
    NOT?: AuditRunScalarWhereWithAggregatesInput | AuditRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditRun"> | string
    urlId?: StringWithAggregatesFilter<"AuditRun"> | string
    environmentId?: StringWithAggregatesFilter<"AuditRun"> | string
    status?: StringWithAggregatesFilter<"AuditRun"> | string
    inBudget?: BoolWithAggregatesFilter<"AuditRun"> | boolean
    reportPath?: StringNullableWithAggregatesFilter<"AuditRun"> | string | null
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"AuditRun"> | Date | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"AuditRun"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"AuditRun"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditRun"> | Date | string
  }

  export type MetricWhereInput = {
    AND?: MetricWhereInput | MetricWhereInput[]
    OR?: MetricWhereInput[]
    NOT?: MetricWhereInput | MetricWhereInput[]
    id?: StringFilter<"Metric"> | string
    auditRunId?: StringFilter<"Metric"> | string
    name?: StringFilter<"Metric"> | string
    value?: FloatFilter<"Metric"> | number
    unit?: StringNullableFilter<"Metric"> | string | null
    category?: StringFilter<"Metric"> | string
    createdAt?: DateTimeFilter<"Metric"> | Date | string
    auditRun?: XOR<AuditRunScalarRelationFilter, AuditRunWhereInput>
  }

  export type MetricOrderByWithRelationInput = {
    id?: SortOrder
    auditRunId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    auditRun?: AuditRunOrderByWithRelationInput
  }

  export type MetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MetricWhereInput | MetricWhereInput[]
    OR?: MetricWhereInput[]
    NOT?: MetricWhereInput | MetricWhereInput[]
    auditRunId?: StringFilter<"Metric"> | string
    name?: StringFilter<"Metric"> | string
    value?: FloatFilter<"Metric"> | number
    unit?: StringNullableFilter<"Metric"> | string | null
    category?: StringFilter<"Metric"> | string
    createdAt?: DateTimeFilter<"Metric"> | Date | string
    auditRun?: XOR<AuditRunScalarRelationFilter, AuditRunWhereInput>
  }, "id">

  export type MetricOrderByWithAggregationInput = {
    id?: SortOrder
    auditRunId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    _count?: MetricCountOrderByAggregateInput
    _avg?: MetricAvgOrderByAggregateInput
    _max?: MetricMaxOrderByAggregateInput
    _min?: MetricMinOrderByAggregateInput
    _sum?: MetricSumOrderByAggregateInput
  }

  export type MetricScalarWhereWithAggregatesInput = {
    AND?: MetricScalarWhereWithAggregatesInput | MetricScalarWhereWithAggregatesInput[]
    OR?: MetricScalarWhereWithAggregatesInput[]
    NOT?: MetricScalarWhereWithAggregatesInput | MetricScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Metric"> | string
    auditRunId?: StringWithAggregatesFilter<"Metric"> | string
    name?: StringWithAggregatesFilter<"Metric"> | string
    value?: FloatWithAggregatesFilter<"Metric"> | number
    unit?: StringNullableWithAggregatesFilter<"Metric"> | string | null
    category?: StringWithAggregatesFilter<"Metric"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Metric"> | Date | string
  }

  export type BudgetWhereInput = {
    AND?: BudgetWhereInput | BudgetWhereInput[]
    OR?: BudgetWhereInput[]
    NOT?: BudgetWhereInput | BudgetWhereInput[]
    id?: StringFilter<"Budget"> | string
    urlId?: StringFilter<"Budget"> | string
    metricName?: StringFilter<"Budget"> | string
    threshold?: FloatFilter<"Budget"> | number
    operator?: StringFilter<"Budget"> | string
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
    url?: XOR<UrlScalarRelationFilter, UrlWhereInput>
  }

  export type BudgetOrderByWithRelationInput = {
    id?: SortOrder
    urlId?: SortOrder
    metricName?: SortOrder
    threshold?: SortOrder
    operator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    url?: UrlOrderByWithRelationInput
  }

  export type BudgetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    urlId_metricName?: BudgetUrlIdMetricNameCompoundUniqueInput
    AND?: BudgetWhereInput | BudgetWhereInput[]
    OR?: BudgetWhereInput[]
    NOT?: BudgetWhereInput | BudgetWhereInput[]
    urlId?: StringFilter<"Budget"> | string
    metricName?: StringFilter<"Budget"> | string
    threshold?: FloatFilter<"Budget"> | number
    operator?: StringFilter<"Budget"> | string
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
    url?: XOR<UrlScalarRelationFilter, UrlWhereInput>
  }, "id" | "urlId_metricName">

  export type BudgetOrderByWithAggregationInput = {
    id?: SortOrder
    urlId?: SortOrder
    metricName?: SortOrder
    threshold?: SortOrder
    operator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BudgetCountOrderByAggregateInput
    _avg?: BudgetAvgOrderByAggregateInput
    _max?: BudgetMaxOrderByAggregateInput
    _min?: BudgetMinOrderByAggregateInput
    _sum?: BudgetSumOrderByAggregateInput
  }

  export type BudgetScalarWhereWithAggregatesInput = {
    AND?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[]
    OR?: BudgetScalarWhereWithAggregatesInput[]
    NOT?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Budget"> | string
    urlId?: StringWithAggregatesFilter<"Budget"> | string
    metricName?: StringWithAggregatesFilter<"Budget"> | string
    threshold?: FloatWithAggregatesFilter<"Budget"> | number
    operator?: StringWithAggregatesFilter<"Budget"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Budget"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Budget"> | Date | string
  }

  export type DomainCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    urls?: UrlCreateNestedManyWithoutDomainInput
  }

  export type DomainUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    urls?: UrlUncheckedCreateNestedManyWithoutDomainInput
  }

  export type DomainUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    urls?: UrlUpdateManyWithoutDomainNestedInput
  }

  export type DomainUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    urls?: UrlUncheckedUpdateManyWithoutDomainNestedInput
  }

  export type DomainCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DomainUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DomainUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlCreateInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    domain: DomainCreateNestedOneWithoutUrlsInput
    audits?: AuditRunCreateNestedManyWithoutUrlInput
    budgets?: BudgetCreateNestedManyWithoutUrlInput
  }

  export type UrlUncheckedCreateInput = {
    id?: string
    address: string
    description?: string | null
    domainId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunUncheckedCreateNestedManyWithoutUrlInput
    budgets?: BudgetUncheckedCreateNestedManyWithoutUrlInput
  }

  export type UrlUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domain?: DomainUpdateOneRequiredWithoutUrlsNestedInput
    audits?: AuditRunUpdateManyWithoutUrlNestedInput
    budgets?: BudgetUpdateManyWithoutUrlNestedInput
  }

  export type UrlUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUncheckedUpdateManyWithoutUrlNestedInput
    budgets?: BudgetUncheckedUpdateManyWithoutUrlNestedInput
  }

  export type UrlCreateManyInput = {
    id?: string
    address: string
    description?: string | null
    domainId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrlUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentCreateInput = {
    id?: string
    name: string
    urlPrefix?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentUncheckedCreateInput = {
    id?: string
    name: string
    urlPrefix?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunUncheckedCreateNestedManyWithoutEnvironmentInput
  }

  export type EnvironmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUncheckedUpdateManyWithoutEnvironmentNestedInput
  }

  export type EnvironmentCreateManyInput = {
    id?: string
    name: string
    urlPrefix?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunCreateInput = {
    id?: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    url: UrlCreateNestedOneWithoutAuditsInput
    environment: EnvironmentCreateNestedOneWithoutAuditsInput
    metrics?: MetricCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunUncheckedCreateInput = {
    id?: string
    urlId: string
    environmentId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    metrics?: MetricUncheckedCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: UrlUpdateOneRequiredWithoutAuditsNestedInput
    environment?: EnvironmentUpdateOneRequiredWithoutAuditsNestedInput
    metrics?: MetricUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: MetricUncheckedUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunCreateManyInput = {
    id?: string
    urlId: string
    environmentId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuditRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricCreateInput = {
    id?: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
    auditRun: AuditRunCreateNestedOneWithoutMetricsInput
  }

  export type MetricUncheckedCreateInput = {
    id?: string
    auditRunId: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
  }

  export type MetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditRun?: AuditRunUpdateOneRequiredWithoutMetricsNestedInput
  }

  export type MetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    auditRunId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricCreateManyInput = {
    id?: string
    auditRunId: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
  }

  export type MetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    auditRunId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetCreateInput = {
    id?: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
    url: UrlCreateNestedOneWithoutBudgetsInput
  }

  export type BudgetUncheckedCreateInput = {
    id?: string
    urlId: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: UrlUpdateOneRequiredWithoutBudgetsNestedInput
  }

  export type BudgetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetCreateManyInput = {
    id?: string
    urlId: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type UrlListRelationFilter = {
    every?: UrlWhereInput
    some?: UrlWhereInput
    none?: UrlWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UrlOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DomainCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DomainMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DomainMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type DomainScalarRelationFilter = {
    is?: DomainWhereInput
    isNot?: DomainWhereInput
  }

  export type AuditRunListRelationFilter = {
    every?: AuditRunWhereInput
    some?: AuditRunWhereInput
    none?: AuditRunWhereInput
  }

  export type BudgetListRelationFilter = {
    every?: BudgetWhereInput
    some?: BudgetWhereInput
    none?: BudgetWhereInput
  }

  export type AuditRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BudgetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UrlAddressDomainIdCompoundUniqueInput = {
    address: string
    domainId: string
  }

  export type UrlCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    description?: SortOrder
    domainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    description?: SortOrder
    domainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    description?: SortOrder
    domainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnvironmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    urlPrefix?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnvironmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    urlPrefix?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnvironmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    urlPrefix?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UrlScalarRelationFilter = {
    is?: UrlWhereInput
    isNot?: UrlWhereInput
  }

  export type EnvironmentScalarRelationFilter = {
    is?: EnvironmentWhereInput
    isNot?: EnvironmentWhereInput
  }

  export type MetricListRelationFilter = {
    every?: MetricWhereInput
    some?: MetricWhereInput
    none?: MetricWhereInput
  }

  export type MetricOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditRunCountOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    environmentId?: SortOrder
    status?: SortOrder
    inBudget?: SortOrder
    reportPath?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunMaxOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    environmentId?: SortOrder
    status?: SortOrder
    inBudget?: SortOrder
    reportPath?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunMinOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    environmentId?: SortOrder
    status?: SortOrder
    inBudget?: SortOrder
    reportPath?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AuditRunScalarRelationFilter = {
    is?: AuditRunWhereInput
    isNot?: AuditRunWhereInput
  }

  export type MetricCountOrderByAggregateInput = {
    id?: SortOrder
    auditRunId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type MetricMaxOrderByAggregateInput = {
    id?: SortOrder
    auditRunId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricMinOrderByAggregateInput = {
    id?: SortOrder
    auditRunId?: SortOrder
    name?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BudgetUrlIdMetricNameCompoundUniqueInput = {
    urlId: string
    metricName: string
  }

  export type BudgetCountOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    metricName?: SortOrder
    threshold?: SortOrder
    operator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetAvgOrderByAggregateInput = {
    threshold?: SortOrder
  }

  export type BudgetMaxOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    metricName?: SortOrder
    threshold?: SortOrder
    operator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetMinOrderByAggregateInput = {
    id?: SortOrder
    urlId?: SortOrder
    metricName?: SortOrder
    threshold?: SortOrder
    operator?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetSumOrderByAggregateInput = {
    threshold?: SortOrder
  }

  export type UrlCreateNestedManyWithoutDomainInput = {
    create?: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput> | UrlCreateWithoutDomainInput[] | UrlUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: UrlCreateOrConnectWithoutDomainInput | UrlCreateOrConnectWithoutDomainInput[]
    createMany?: UrlCreateManyDomainInputEnvelope
    connect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
  }

  export type UrlUncheckedCreateNestedManyWithoutDomainInput = {
    create?: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput> | UrlCreateWithoutDomainInput[] | UrlUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: UrlCreateOrConnectWithoutDomainInput | UrlCreateOrConnectWithoutDomainInput[]
    createMany?: UrlCreateManyDomainInputEnvelope
    connect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UrlUpdateManyWithoutDomainNestedInput = {
    create?: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput> | UrlCreateWithoutDomainInput[] | UrlUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: UrlCreateOrConnectWithoutDomainInput | UrlCreateOrConnectWithoutDomainInput[]
    upsert?: UrlUpsertWithWhereUniqueWithoutDomainInput | UrlUpsertWithWhereUniqueWithoutDomainInput[]
    createMany?: UrlCreateManyDomainInputEnvelope
    set?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    disconnect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    delete?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    connect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    update?: UrlUpdateWithWhereUniqueWithoutDomainInput | UrlUpdateWithWhereUniqueWithoutDomainInput[]
    updateMany?: UrlUpdateManyWithWhereWithoutDomainInput | UrlUpdateManyWithWhereWithoutDomainInput[]
    deleteMany?: UrlScalarWhereInput | UrlScalarWhereInput[]
  }

  export type UrlUncheckedUpdateManyWithoutDomainNestedInput = {
    create?: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput> | UrlCreateWithoutDomainInput[] | UrlUncheckedCreateWithoutDomainInput[]
    connectOrCreate?: UrlCreateOrConnectWithoutDomainInput | UrlCreateOrConnectWithoutDomainInput[]
    upsert?: UrlUpsertWithWhereUniqueWithoutDomainInput | UrlUpsertWithWhereUniqueWithoutDomainInput[]
    createMany?: UrlCreateManyDomainInputEnvelope
    set?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    disconnect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    delete?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    connect?: UrlWhereUniqueInput | UrlWhereUniqueInput[]
    update?: UrlUpdateWithWhereUniqueWithoutDomainInput | UrlUpdateWithWhereUniqueWithoutDomainInput[]
    updateMany?: UrlUpdateManyWithWhereWithoutDomainInput | UrlUpdateManyWithWhereWithoutDomainInput[]
    deleteMany?: UrlScalarWhereInput | UrlScalarWhereInput[]
  }

  export type DomainCreateNestedOneWithoutUrlsInput = {
    create?: XOR<DomainCreateWithoutUrlsInput, DomainUncheckedCreateWithoutUrlsInput>
    connectOrCreate?: DomainCreateOrConnectWithoutUrlsInput
    connect?: DomainWhereUniqueInput
  }

  export type AuditRunCreateNestedManyWithoutUrlInput = {
    create?: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput> | AuditRunCreateWithoutUrlInput[] | AuditRunUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutUrlInput | AuditRunCreateOrConnectWithoutUrlInput[]
    createMany?: AuditRunCreateManyUrlInputEnvelope
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
  }

  export type BudgetCreateNestedManyWithoutUrlInput = {
    create?: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput> | BudgetCreateWithoutUrlInput[] | BudgetUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUrlInput | BudgetCreateOrConnectWithoutUrlInput[]
    createMany?: BudgetCreateManyUrlInputEnvelope
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
  }

  export type AuditRunUncheckedCreateNestedManyWithoutUrlInput = {
    create?: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput> | AuditRunCreateWithoutUrlInput[] | AuditRunUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutUrlInput | AuditRunCreateOrConnectWithoutUrlInput[]
    createMany?: AuditRunCreateManyUrlInputEnvelope
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
  }

  export type BudgetUncheckedCreateNestedManyWithoutUrlInput = {
    create?: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput> | BudgetCreateWithoutUrlInput[] | BudgetUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUrlInput | BudgetCreateOrConnectWithoutUrlInput[]
    createMany?: BudgetCreateManyUrlInputEnvelope
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
  }

  export type DomainUpdateOneRequiredWithoutUrlsNestedInput = {
    create?: XOR<DomainCreateWithoutUrlsInput, DomainUncheckedCreateWithoutUrlsInput>
    connectOrCreate?: DomainCreateOrConnectWithoutUrlsInput
    upsert?: DomainUpsertWithoutUrlsInput
    connect?: DomainWhereUniqueInput
    update?: XOR<XOR<DomainUpdateToOneWithWhereWithoutUrlsInput, DomainUpdateWithoutUrlsInput>, DomainUncheckedUpdateWithoutUrlsInput>
  }

  export type AuditRunUpdateManyWithoutUrlNestedInput = {
    create?: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput> | AuditRunCreateWithoutUrlInput[] | AuditRunUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutUrlInput | AuditRunCreateOrConnectWithoutUrlInput[]
    upsert?: AuditRunUpsertWithWhereUniqueWithoutUrlInput | AuditRunUpsertWithWhereUniqueWithoutUrlInput[]
    createMany?: AuditRunCreateManyUrlInputEnvelope
    set?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    disconnect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    delete?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    update?: AuditRunUpdateWithWhereUniqueWithoutUrlInput | AuditRunUpdateWithWhereUniqueWithoutUrlInput[]
    updateMany?: AuditRunUpdateManyWithWhereWithoutUrlInput | AuditRunUpdateManyWithWhereWithoutUrlInput[]
    deleteMany?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
  }

  export type BudgetUpdateManyWithoutUrlNestedInput = {
    create?: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput> | BudgetCreateWithoutUrlInput[] | BudgetUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUrlInput | BudgetCreateOrConnectWithoutUrlInput[]
    upsert?: BudgetUpsertWithWhereUniqueWithoutUrlInput | BudgetUpsertWithWhereUniqueWithoutUrlInput[]
    createMany?: BudgetCreateManyUrlInputEnvelope
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    update?: BudgetUpdateWithWhereUniqueWithoutUrlInput | BudgetUpdateWithWhereUniqueWithoutUrlInput[]
    updateMany?: BudgetUpdateManyWithWhereWithoutUrlInput | BudgetUpdateManyWithWhereWithoutUrlInput[]
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
  }

  export type AuditRunUncheckedUpdateManyWithoutUrlNestedInput = {
    create?: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput> | AuditRunCreateWithoutUrlInput[] | AuditRunUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutUrlInput | AuditRunCreateOrConnectWithoutUrlInput[]
    upsert?: AuditRunUpsertWithWhereUniqueWithoutUrlInput | AuditRunUpsertWithWhereUniqueWithoutUrlInput[]
    createMany?: AuditRunCreateManyUrlInputEnvelope
    set?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    disconnect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    delete?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    update?: AuditRunUpdateWithWhereUniqueWithoutUrlInput | AuditRunUpdateWithWhereUniqueWithoutUrlInput[]
    updateMany?: AuditRunUpdateManyWithWhereWithoutUrlInput | AuditRunUpdateManyWithWhereWithoutUrlInput[]
    deleteMany?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
  }

  export type BudgetUncheckedUpdateManyWithoutUrlNestedInput = {
    create?: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput> | BudgetCreateWithoutUrlInput[] | BudgetUncheckedCreateWithoutUrlInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUrlInput | BudgetCreateOrConnectWithoutUrlInput[]
    upsert?: BudgetUpsertWithWhereUniqueWithoutUrlInput | BudgetUpsertWithWhereUniqueWithoutUrlInput[]
    createMany?: BudgetCreateManyUrlInputEnvelope
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    update?: BudgetUpdateWithWhereUniqueWithoutUrlInput | BudgetUpdateWithWhereUniqueWithoutUrlInput[]
    updateMany?: BudgetUpdateManyWithWhereWithoutUrlInput | BudgetUpdateManyWithWhereWithoutUrlInput[]
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
  }

  export type AuditRunCreateNestedManyWithoutEnvironmentInput = {
    create?: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput> | AuditRunCreateWithoutEnvironmentInput[] | AuditRunUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutEnvironmentInput | AuditRunCreateOrConnectWithoutEnvironmentInput[]
    createMany?: AuditRunCreateManyEnvironmentInputEnvelope
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
  }

  export type AuditRunUncheckedCreateNestedManyWithoutEnvironmentInput = {
    create?: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput> | AuditRunCreateWithoutEnvironmentInput[] | AuditRunUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutEnvironmentInput | AuditRunCreateOrConnectWithoutEnvironmentInput[]
    createMany?: AuditRunCreateManyEnvironmentInputEnvelope
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
  }

  export type AuditRunUpdateManyWithoutEnvironmentNestedInput = {
    create?: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput> | AuditRunCreateWithoutEnvironmentInput[] | AuditRunUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutEnvironmentInput | AuditRunCreateOrConnectWithoutEnvironmentInput[]
    upsert?: AuditRunUpsertWithWhereUniqueWithoutEnvironmentInput | AuditRunUpsertWithWhereUniqueWithoutEnvironmentInput[]
    createMany?: AuditRunCreateManyEnvironmentInputEnvelope
    set?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    disconnect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    delete?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    update?: AuditRunUpdateWithWhereUniqueWithoutEnvironmentInput | AuditRunUpdateWithWhereUniqueWithoutEnvironmentInput[]
    updateMany?: AuditRunUpdateManyWithWhereWithoutEnvironmentInput | AuditRunUpdateManyWithWhereWithoutEnvironmentInput[]
    deleteMany?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
  }

  export type AuditRunUncheckedUpdateManyWithoutEnvironmentNestedInput = {
    create?: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput> | AuditRunCreateWithoutEnvironmentInput[] | AuditRunUncheckedCreateWithoutEnvironmentInput[]
    connectOrCreate?: AuditRunCreateOrConnectWithoutEnvironmentInput | AuditRunCreateOrConnectWithoutEnvironmentInput[]
    upsert?: AuditRunUpsertWithWhereUniqueWithoutEnvironmentInput | AuditRunUpsertWithWhereUniqueWithoutEnvironmentInput[]
    createMany?: AuditRunCreateManyEnvironmentInputEnvelope
    set?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    disconnect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    delete?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    connect?: AuditRunWhereUniqueInput | AuditRunWhereUniqueInput[]
    update?: AuditRunUpdateWithWhereUniqueWithoutEnvironmentInput | AuditRunUpdateWithWhereUniqueWithoutEnvironmentInput[]
    updateMany?: AuditRunUpdateManyWithWhereWithoutEnvironmentInput | AuditRunUpdateManyWithWhereWithoutEnvironmentInput[]
    deleteMany?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
  }

  export type UrlCreateNestedOneWithoutAuditsInput = {
    create?: XOR<UrlCreateWithoutAuditsInput, UrlUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: UrlCreateOrConnectWithoutAuditsInput
    connect?: UrlWhereUniqueInput
  }

  export type EnvironmentCreateNestedOneWithoutAuditsInput = {
    create?: XOR<EnvironmentCreateWithoutAuditsInput, EnvironmentUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: EnvironmentCreateOrConnectWithoutAuditsInput
    connect?: EnvironmentWhereUniqueInput
  }

  export type MetricCreateNestedManyWithoutAuditRunInput = {
    create?: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput> | MetricCreateWithoutAuditRunInput[] | MetricUncheckedCreateWithoutAuditRunInput[]
    connectOrCreate?: MetricCreateOrConnectWithoutAuditRunInput | MetricCreateOrConnectWithoutAuditRunInput[]
    createMany?: MetricCreateManyAuditRunInputEnvelope
    connect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
  }

  export type MetricUncheckedCreateNestedManyWithoutAuditRunInput = {
    create?: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput> | MetricCreateWithoutAuditRunInput[] | MetricUncheckedCreateWithoutAuditRunInput[]
    connectOrCreate?: MetricCreateOrConnectWithoutAuditRunInput | MetricCreateOrConnectWithoutAuditRunInput[]
    createMany?: MetricCreateManyAuditRunInputEnvelope
    connect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UrlUpdateOneRequiredWithoutAuditsNestedInput = {
    create?: XOR<UrlCreateWithoutAuditsInput, UrlUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: UrlCreateOrConnectWithoutAuditsInput
    upsert?: UrlUpsertWithoutAuditsInput
    connect?: UrlWhereUniqueInput
    update?: XOR<XOR<UrlUpdateToOneWithWhereWithoutAuditsInput, UrlUpdateWithoutAuditsInput>, UrlUncheckedUpdateWithoutAuditsInput>
  }

  export type EnvironmentUpdateOneRequiredWithoutAuditsNestedInput = {
    create?: XOR<EnvironmentCreateWithoutAuditsInput, EnvironmentUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: EnvironmentCreateOrConnectWithoutAuditsInput
    upsert?: EnvironmentUpsertWithoutAuditsInput
    connect?: EnvironmentWhereUniqueInput
    update?: XOR<XOR<EnvironmentUpdateToOneWithWhereWithoutAuditsInput, EnvironmentUpdateWithoutAuditsInput>, EnvironmentUncheckedUpdateWithoutAuditsInput>
  }

  export type MetricUpdateManyWithoutAuditRunNestedInput = {
    create?: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput> | MetricCreateWithoutAuditRunInput[] | MetricUncheckedCreateWithoutAuditRunInput[]
    connectOrCreate?: MetricCreateOrConnectWithoutAuditRunInput | MetricCreateOrConnectWithoutAuditRunInput[]
    upsert?: MetricUpsertWithWhereUniqueWithoutAuditRunInput | MetricUpsertWithWhereUniqueWithoutAuditRunInput[]
    createMany?: MetricCreateManyAuditRunInputEnvelope
    set?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    disconnect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    delete?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    connect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    update?: MetricUpdateWithWhereUniqueWithoutAuditRunInput | MetricUpdateWithWhereUniqueWithoutAuditRunInput[]
    updateMany?: MetricUpdateManyWithWhereWithoutAuditRunInput | MetricUpdateManyWithWhereWithoutAuditRunInput[]
    deleteMany?: MetricScalarWhereInput | MetricScalarWhereInput[]
  }

  export type MetricUncheckedUpdateManyWithoutAuditRunNestedInput = {
    create?: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput> | MetricCreateWithoutAuditRunInput[] | MetricUncheckedCreateWithoutAuditRunInput[]
    connectOrCreate?: MetricCreateOrConnectWithoutAuditRunInput | MetricCreateOrConnectWithoutAuditRunInput[]
    upsert?: MetricUpsertWithWhereUniqueWithoutAuditRunInput | MetricUpsertWithWhereUniqueWithoutAuditRunInput[]
    createMany?: MetricCreateManyAuditRunInputEnvelope
    set?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    disconnect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    delete?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    connect?: MetricWhereUniqueInput | MetricWhereUniqueInput[]
    update?: MetricUpdateWithWhereUniqueWithoutAuditRunInput | MetricUpdateWithWhereUniqueWithoutAuditRunInput[]
    updateMany?: MetricUpdateManyWithWhereWithoutAuditRunInput | MetricUpdateManyWithWhereWithoutAuditRunInput[]
    deleteMany?: MetricScalarWhereInput | MetricScalarWhereInput[]
  }

  export type AuditRunCreateNestedOneWithoutMetricsInput = {
    create?: XOR<AuditRunCreateWithoutMetricsInput, AuditRunUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: AuditRunCreateOrConnectWithoutMetricsInput
    connect?: AuditRunWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AuditRunUpdateOneRequiredWithoutMetricsNestedInput = {
    create?: XOR<AuditRunCreateWithoutMetricsInput, AuditRunUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: AuditRunCreateOrConnectWithoutMetricsInput
    upsert?: AuditRunUpsertWithoutMetricsInput
    connect?: AuditRunWhereUniqueInput
    update?: XOR<XOR<AuditRunUpdateToOneWithWhereWithoutMetricsInput, AuditRunUpdateWithoutMetricsInput>, AuditRunUncheckedUpdateWithoutMetricsInput>
  }

  export type UrlCreateNestedOneWithoutBudgetsInput = {
    create?: XOR<UrlCreateWithoutBudgetsInput, UrlUncheckedCreateWithoutBudgetsInput>
    connectOrCreate?: UrlCreateOrConnectWithoutBudgetsInput
    connect?: UrlWhereUniqueInput
  }

  export type UrlUpdateOneRequiredWithoutBudgetsNestedInput = {
    create?: XOR<UrlCreateWithoutBudgetsInput, UrlUncheckedCreateWithoutBudgetsInput>
    connectOrCreate?: UrlCreateOrConnectWithoutBudgetsInput
    upsert?: UrlUpsertWithoutBudgetsInput
    connect?: UrlWhereUniqueInput
    update?: XOR<XOR<UrlUpdateToOneWithWhereWithoutBudgetsInput, UrlUpdateWithoutBudgetsInput>, UrlUncheckedUpdateWithoutBudgetsInput>
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

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UrlCreateWithoutDomainInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunCreateNestedManyWithoutUrlInput
    budgets?: BudgetCreateNestedManyWithoutUrlInput
  }

  export type UrlUncheckedCreateWithoutDomainInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunUncheckedCreateNestedManyWithoutUrlInput
    budgets?: BudgetUncheckedCreateNestedManyWithoutUrlInput
  }

  export type UrlCreateOrConnectWithoutDomainInput = {
    where: UrlWhereUniqueInput
    create: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput>
  }

  export type UrlCreateManyDomainInputEnvelope = {
    data: UrlCreateManyDomainInput | UrlCreateManyDomainInput[]
  }

  export type UrlUpsertWithWhereUniqueWithoutDomainInput = {
    where: UrlWhereUniqueInput
    update: XOR<UrlUpdateWithoutDomainInput, UrlUncheckedUpdateWithoutDomainInput>
    create: XOR<UrlCreateWithoutDomainInput, UrlUncheckedCreateWithoutDomainInput>
  }

  export type UrlUpdateWithWhereUniqueWithoutDomainInput = {
    where: UrlWhereUniqueInput
    data: XOR<UrlUpdateWithoutDomainInput, UrlUncheckedUpdateWithoutDomainInput>
  }

  export type UrlUpdateManyWithWhereWithoutDomainInput = {
    where: UrlScalarWhereInput
    data: XOR<UrlUpdateManyMutationInput, UrlUncheckedUpdateManyWithoutDomainInput>
  }

  export type UrlScalarWhereInput = {
    AND?: UrlScalarWhereInput | UrlScalarWhereInput[]
    OR?: UrlScalarWhereInput[]
    NOT?: UrlScalarWhereInput | UrlScalarWhereInput[]
    id?: StringFilter<"Url"> | string
    address?: StringFilter<"Url"> | string
    description?: StringNullableFilter<"Url"> | string | null
    domainId?: StringFilter<"Url"> | string
    createdAt?: DateTimeFilter<"Url"> | Date | string
    updatedAt?: DateTimeFilter<"Url"> | Date | string
  }

  export type DomainCreateWithoutUrlsInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DomainUncheckedCreateWithoutUrlsInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DomainCreateOrConnectWithoutUrlsInput = {
    where: DomainWhereUniqueInput
    create: XOR<DomainCreateWithoutUrlsInput, DomainUncheckedCreateWithoutUrlsInput>
  }

  export type AuditRunCreateWithoutUrlInput = {
    id?: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    environment: EnvironmentCreateNestedOneWithoutAuditsInput
    metrics?: MetricCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunUncheckedCreateWithoutUrlInput = {
    id?: string
    environmentId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    metrics?: MetricUncheckedCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunCreateOrConnectWithoutUrlInput = {
    where: AuditRunWhereUniqueInput
    create: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput>
  }

  export type AuditRunCreateManyUrlInputEnvelope = {
    data: AuditRunCreateManyUrlInput | AuditRunCreateManyUrlInput[]
  }

  export type BudgetCreateWithoutUrlInput = {
    id?: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetUncheckedCreateWithoutUrlInput = {
    id?: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetCreateOrConnectWithoutUrlInput = {
    where: BudgetWhereUniqueInput
    create: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput>
  }

  export type BudgetCreateManyUrlInputEnvelope = {
    data: BudgetCreateManyUrlInput | BudgetCreateManyUrlInput[]
  }

  export type DomainUpsertWithoutUrlsInput = {
    update: XOR<DomainUpdateWithoutUrlsInput, DomainUncheckedUpdateWithoutUrlsInput>
    create: XOR<DomainCreateWithoutUrlsInput, DomainUncheckedCreateWithoutUrlsInput>
    where?: DomainWhereInput
  }

  export type DomainUpdateToOneWithWhereWithoutUrlsInput = {
    where?: DomainWhereInput
    data: XOR<DomainUpdateWithoutUrlsInput, DomainUncheckedUpdateWithoutUrlsInput>
  }

  export type DomainUpdateWithoutUrlsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DomainUncheckedUpdateWithoutUrlsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunUpsertWithWhereUniqueWithoutUrlInput = {
    where: AuditRunWhereUniqueInput
    update: XOR<AuditRunUpdateWithoutUrlInput, AuditRunUncheckedUpdateWithoutUrlInput>
    create: XOR<AuditRunCreateWithoutUrlInput, AuditRunUncheckedCreateWithoutUrlInput>
  }

  export type AuditRunUpdateWithWhereUniqueWithoutUrlInput = {
    where: AuditRunWhereUniqueInput
    data: XOR<AuditRunUpdateWithoutUrlInput, AuditRunUncheckedUpdateWithoutUrlInput>
  }

  export type AuditRunUpdateManyWithWhereWithoutUrlInput = {
    where: AuditRunScalarWhereInput
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyWithoutUrlInput>
  }

  export type AuditRunScalarWhereInput = {
    AND?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
    OR?: AuditRunScalarWhereInput[]
    NOT?: AuditRunScalarWhereInput | AuditRunScalarWhereInput[]
    id?: StringFilter<"AuditRun"> | string
    urlId?: StringFilter<"AuditRun"> | string
    environmentId?: StringFilter<"AuditRun"> | string
    status?: StringFilter<"AuditRun"> | string
    inBudget?: BoolFilter<"AuditRun"> | boolean
    reportPath?: StringNullableFilter<"AuditRun"> | string | null
    scheduledAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    startedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"AuditRun"> | Date | string | null
    createdAt?: DateTimeFilter<"AuditRun"> | Date | string
  }

  export type BudgetUpsertWithWhereUniqueWithoutUrlInput = {
    where: BudgetWhereUniqueInput
    update: XOR<BudgetUpdateWithoutUrlInput, BudgetUncheckedUpdateWithoutUrlInput>
    create: XOR<BudgetCreateWithoutUrlInput, BudgetUncheckedCreateWithoutUrlInput>
  }

  export type BudgetUpdateWithWhereUniqueWithoutUrlInput = {
    where: BudgetWhereUniqueInput
    data: XOR<BudgetUpdateWithoutUrlInput, BudgetUncheckedUpdateWithoutUrlInput>
  }

  export type BudgetUpdateManyWithWhereWithoutUrlInput = {
    where: BudgetScalarWhereInput
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyWithoutUrlInput>
  }

  export type BudgetScalarWhereInput = {
    AND?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
    OR?: BudgetScalarWhereInput[]
    NOT?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
    id?: StringFilter<"Budget"> | string
    urlId?: StringFilter<"Budget"> | string
    metricName?: StringFilter<"Budget"> | string
    threshold?: FloatFilter<"Budget"> | number
    operator?: StringFilter<"Budget"> | string
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
  }

  export type AuditRunCreateWithoutEnvironmentInput = {
    id?: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    url: UrlCreateNestedOneWithoutAuditsInput
    metrics?: MetricCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunUncheckedCreateWithoutEnvironmentInput = {
    id?: string
    urlId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    metrics?: MetricUncheckedCreateNestedManyWithoutAuditRunInput
  }

  export type AuditRunCreateOrConnectWithoutEnvironmentInput = {
    where: AuditRunWhereUniqueInput
    create: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput>
  }

  export type AuditRunCreateManyEnvironmentInputEnvelope = {
    data: AuditRunCreateManyEnvironmentInput | AuditRunCreateManyEnvironmentInput[]
  }

  export type AuditRunUpsertWithWhereUniqueWithoutEnvironmentInput = {
    where: AuditRunWhereUniqueInput
    update: XOR<AuditRunUpdateWithoutEnvironmentInput, AuditRunUncheckedUpdateWithoutEnvironmentInput>
    create: XOR<AuditRunCreateWithoutEnvironmentInput, AuditRunUncheckedCreateWithoutEnvironmentInput>
  }

  export type AuditRunUpdateWithWhereUniqueWithoutEnvironmentInput = {
    where: AuditRunWhereUniqueInput
    data: XOR<AuditRunUpdateWithoutEnvironmentInput, AuditRunUncheckedUpdateWithoutEnvironmentInput>
  }

  export type AuditRunUpdateManyWithWhereWithoutEnvironmentInput = {
    where: AuditRunScalarWhereInput
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyWithoutEnvironmentInput>
  }

  export type UrlCreateWithoutAuditsInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    domain: DomainCreateNestedOneWithoutUrlsInput
    budgets?: BudgetCreateNestedManyWithoutUrlInput
  }

  export type UrlUncheckedCreateWithoutAuditsInput = {
    id?: string
    address: string
    description?: string | null
    domainId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    budgets?: BudgetUncheckedCreateNestedManyWithoutUrlInput
  }

  export type UrlCreateOrConnectWithoutAuditsInput = {
    where: UrlWhereUniqueInput
    create: XOR<UrlCreateWithoutAuditsInput, UrlUncheckedCreateWithoutAuditsInput>
  }

  export type EnvironmentCreateWithoutAuditsInput = {
    id?: string
    name: string
    urlPrefix?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentUncheckedCreateWithoutAuditsInput = {
    id?: string
    name: string
    urlPrefix?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EnvironmentCreateOrConnectWithoutAuditsInput = {
    where: EnvironmentWhereUniqueInput
    create: XOR<EnvironmentCreateWithoutAuditsInput, EnvironmentUncheckedCreateWithoutAuditsInput>
  }

  export type MetricCreateWithoutAuditRunInput = {
    id?: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
  }

  export type MetricUncheckedCreateWithoutAuditRunInput = {
    id?: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
  }

  export type MetricCreateOrConnectWithoutAuditRunInput = {
    where: MetricWhereUniqueInput
    create: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput>
  }

  export type MetricCreateManyAuditRunInputEnvelope = {
    data: MetricCreateManyAuditRunInput | MetricCreateManyAuditRunInput[]
  }

  export type UrlUpsertWithoutAuditsInput = {
    update: XOR<UrlUpdateWithoutAuditsInput, UrlUncheckedUpdateWithoutAuditsInput>
    create: XOR<UrlCreateWithoutAuditsInput, UrlUncheckedCreateWithoutAuditsInput>
    where?: UrlWhereInput
  }

  export type UrlUpdateToOneWithWhereWithoutAuditsInput = {
    where?: UrlWhereInput
    data: XOR<UrlUpdateWithoutAuditsInput, UrlUncheckedUpdateWithoutAuditsInput>
  }

  export type UrlUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domain?: DomainUpdateOneRequiredWithoutUrlsNestedInput
    budgets?: BudgetUpdateManyWithoutUrlNestedInput
  }

  export type UrlUncheckedUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUncheckedUpdateManyWithoutUrlNestedInput
  }

  export type EnvironmentUpsertWithoutAuditsInput = {
    update: XOR<EnvironmentUpdateWithoutAuditsInput, EnvironmentUncheckedUpdateWithoutAuditsInput>
    create: XOR<EnvironmentCreateWithoutAuditsInput, EnvironmentUncheckedCreateWithoutAuditsInput>
    where?: EnvironmentWhereInput
  }

  export type EnvironmentUpdateToOneWithWhereWithoutAuditsInput = {
    where?: EnvironmentWhereInput
    data: XOR<EnvironmentUpdateWithoutAuditsInput, EnvironmentUncheckedUpdateWithoutAuditsInput>
  }

  export type EnvironmentUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnvironmentUncheckedUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    urlPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricUpsertWithWhereUniqueWithoutAuditRunInput = {
    where: MetricWhereUniqueInput
    update: XOR<MetricUpdateWithoutAuditRunInput, MetricUncheckedUpdateWithoutAuditRunInput>
    create: XOR<MetricCreateWithoutAuditRunInput, MetricUncheckedCreateWithoutAuditRunInput>
  }

  export type MetricUpdateWithWhereUniqueWithoutAuditRunInput = {
    where: MetricWhereUniqueInput
    data: XOR<MetricUpdateWithoutAuditRunInput, MetricUncheckedUpdateWithoutAuditRunInput>
  }

  export type MetricUpdateManyWithWhereWithoutAuditRunInput = {
    where: MetricScalarWhereInput
    data: XOR<MetricUpdateManyMutationInput, MetricUncheckedUpdateManyWithoutAuditRunInput>
  }

  export type MetricScalarWhereInput = {
    AND?: MetricScalarWhereInput | MetricScalarWhereInput[]
    OR?: MetricScalarWhereInput[]
    NOT?: MetricScalarWhereInput | MetricScalarWhereInput[]
    id?: StringFilter<"Metric"> | string
    auditRunId?: StringFilter<"Metric"> | string
    name?: StringFilter<"Metric"> | string
    value?: FloatFilter<"Metric"> | number
    unit?: StringNullableFilter<"Metric"> | string | null
    category?: StringFilter<"Metric"> | string
    createdAt?: DateTimeFilter<"Metric"> | Date | string
  }

  export type AuditRunCreateWithoutMetricsInput = {
    id?: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    url: UrlCreateNestedOneWithoutAuditsInput
    environment: EnvironmentCreateNestedOneWithoutAuditsInput
  }

  export type AuditRunUncheckedCreateWithoutMetricsInput = {
    id?: string
    urlId: string
    environmentId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuditRunCreateOrConnectWithoutMetricsInput = {
    where: AuditRunWhereUniqueInput
    create: XOR<AuditRunCreateWithoutMetricsInput, AuditRunUncheckedCreateWithoutMetricsInput>
  }

  export type AuditRunUpsertWithoutMetricsInput = {
    update: XOR<AuditRunUpdateWithoutMetricsInput, AuditRunUncheckedUpdateWithoutMetricsInput>
    create: XOR<AuditRunCreateWithoutMetricsInput, AuditRunUncheckedCreateWithoutMetricsInput>
    where?: AuditRunWhereInput
  }

  export type AuditRunUpdateToOneWithWhereWithoutMetricsInput = {
    where?: AuditRunWhereInput
    data: XOR<AuditRunUpdateWithoutMetricsInput, AuditRunUncheckedUpdateWithoutMetricsInput>
  }

  export type AuditRunUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: UrlUpdateOneRequiredWithoutAuditsNestedInput
    environment?: EnvironmentUpdateOneRequiredWithoutAuditsNestedInput
  }

  export type AuditRunUncheckedUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlCreateWithoutBudgetsInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    domain: DomainCreateNestedOneWithoutUrlsInput
    audits?: AuditRunCreateNestedManyWithoutUrlInput
  }

  export type UrlUncheckedCreateWithoutBudgetsInput = {
    id?: string
    address: string
    description?: string | null
    domainId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: AuditRunUncheckedCreateNestedManyWithoutUrlInput
  }

  export type UrlCreateOrConnectWithoutBudgetsInput = {
    where: UrlWhereUniqueInput
    create: XOR<UrlCreateWithoutBudgetsInput, UrlUncheckedCreateWithoutBudgetsInput>
  }

  export type UrlUpsertWithoutBudgetsInput = {
    update: XOR<UrlUpdateWithoutBudgetsInput, UrlUncheckedUpdateWithoutBudgetsInput>
    create: XOR<UrlCreateWithoutBudgetsInput, UrlUncheckedCreateWithoutBudgetsInput>
    where?: UrlWhereInput
  }

  export type UrlUpdateToOneWithWhereWithoutBudgetsInput = {
    where?: UrlWhereInput
    data: XOR<UrlUpdateWithoutBudgetsInput, UrlUncheckedUpdateWithoutBudgetsInput>
  }

  export type UrlUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    domain?: DomainUpdateOneRequiredWithoutUrlsNestedInput
    audits?: AuditRunUpdateManyWithoutUrlNestedInput
  }

  export type UrlUncheckedUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    domainId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUncheckedUpdateManyWithoutUrlNestedInput
  }

  export type UrlCreateManyDomainInput = {
    id?: string
    address: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrlUpdateWithoutDomainInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUpdateManyWithoutUrlNestedInput
    budgets?: BudgetUpdateManyWithoutUrlNestedInput
  }

  export type UrlUncheckedUpdateWithoutDomainInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: AuditRunUncheckedUpdateManyWithoutUrlNestedInput
    budgets?: BudgetUncheckedUpdateManyWithoutUrlNestedInput
  }

  export type UrlUncheckedUpdateManyWithoutDomainInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunCreateManyUrlInput = {
    id?: string
    environmentId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BudgetCreateManyUrlInput = {
    id?: string
    metricName: string
    threshold: number
    operator: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditRunUpdateWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    environment?: EnvironmentUpdateOneRequiredWithoutAuditsNestedInput
    metrics?: MetricUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunUncheckedUpdateWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: MetricUncheckedUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunUncheckedUpdateManyWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    environmentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetUpdateWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetUncheckedUpdateWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetUncheckedUpdateManyWithoutUrlInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    threshold?: FloatFieldUpdateOperationsInput | number
    operator?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunCreateManyEnvironmentInput = {
    id?: string
    urlId: string
    status: string
    inBudget?: boolean
    reportPath?: string | null
    scheduledAt?: Date | string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuditRunUpdateWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    url?: UrlUpdateOneRequiredWithoutAuditsNestedInput
    metrics?: MetricUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunUncheckedUpdateWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metrics?: MetricUncheckedUpdateManyWithoutAuditRunNestedInput
  }

  export type AuditRunUncheckedUpdateManyWithoutEnvironmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    urlId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    inBudget?: BoolFieldUpdateOperationsInput | boolean
    reportPath?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricCreateManyAuditRunInput = {
    id?: string
    name: string
    value: number
    unit?: string | null
    category: string
    createdAt?: Date | string
  }

  export type MetricUpdateWithoutAuditRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricUncheckedUpdateWithoutAuditRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricUncheckedUpdateManyWithoutAuditRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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