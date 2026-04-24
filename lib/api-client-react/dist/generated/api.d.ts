import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AuthResponse, CalculatorResult, ChartDataPoint, ChecklistItem, ChecklistItemUpdate, CompressorInput, CreateDiseaseBody, CreateFarmBody, CreateMeasurementBody, CreatePoolBody, CreateTaskBody, DashboardSummary, Disease, DrumFilterInput, ErrorResponse, ExportMeasurementsCsvParams, Farm, GetDiseasesParams, GetMeasurementsChartParams, GetMeasurementsParams, GetPoolsParams, GetTasksParams, HealthStatus, InviteWorkerBody, LoginBody, Measurement, OxygenInput, Pool, PoolVolumeInput, PoolWithLatestMeasurement, PumpInput, RegisterBody, SuccessResponse, Task, UpdateTaskBody, UpdateTaskStatusBody, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerBody: RegisterBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useRegister: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
/**
 * @summary Login
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Login
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Logout
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<SuccessResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Logout
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Invite a worker (owner only)
 */
export declare const getInviteWorkerUrl: () => string;
export declare const inviteWorker: (inviteWorkerBody: InviteWorkerBody, options?: RequestInit) => Promise<User>;
export declare const getInviteWorkerMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof inviteWorker>>, TError, {
        data: BodyType<InviteWorkerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof inviteWorker>>, TError, {
    data: BodyType<InviteWorkerBody>;
}, TContext>;
export type InviteWorkerMutationResult = NonNullable<Awaited<ReturnType<typeof inviteWorker>>>;
export type InviteWorkerMutationBody = BodyType<InviteWorkerBody>;
export type InviteWorkerMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Invite a worker (owner only)
 */
export declare const useInviteWorker: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof inviteWorker>>, TError, {
        data: BodyType<InviteWorkerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof inviteWorker>>, TError, {
    data: BodyType<InviteWorkerBody>;
}, TContext>;
/**
 * @summary Get list of workers (owner only)
 */
export declare const getGetWorkersUrl: () => string;
export declare const getWorkers: (options?: RequestInit) => Promise<User[]>;
export declare const getGetWorkersQueryKey: () => readonly ["/api/users/workers"];
export declare const getGetWorkersQueryOptions: <TData = Awaited<ReturnType<typeof getWorkers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWorkers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWorkers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWorkersQueryResult = NonNullable<Awaited<ReturnType<typeof getWorkers>>>;
export type GetWorkersQueryError = ErrorType<unknown>;
/**
 * @summary Get list of workers (owner only)
 */
export declare function useGetWorkers<TData = Awaited<ReturnType<typeof getWorkers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWorkers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get farms for current user
 */
export declare const getGetFarmsUrl: () => string;
export declare const getFarms: (options?: RequestInit) => Promise<Farm[]>;
export declare const getGetFarmsQueryKey: () => readonly ["/api/farms"];
export declare const getGetFarmsQueryOptions: <TData = Awaited<ReturnType<typeof getFarms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFarms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFarms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFarmsQueryResult = NonNullable<Awaited<ReturnType<typeof getFarms>>>;
export type GetFarmsQueryError = ErrorType<unknown>;
/**
 * @summary Get farms for current user
 */
export declare function useGetFarms<TData = Awaited<ReturnType<typeof getFarms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFarms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a farm
 */
export declare const getCreateFarmUrl: () => string;
export declare const createFarm: (createFarmBody: CreateFarmBody, options?: RequestInit) => Promise<Farm>;
export declare const getCreateFarmMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFarm>>, TError, {
        data: BodyType<CreateFarmBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFarm>>, TError, {
    data: BodyType<CreateFarmBody>;
}, TContext>;
export type CreateFarmMutationResult = NonNullable<Awaited<ReturnType<typeof createFarm>>>;
export type CreateFarmMutationBody = BodyType<CreateFarmBody>;
export type CreateFarmMutationError = ErrorType<unknown>;
/**
 * @summary Create a farm
 */
export declare const useCreateFarm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFarm>>, TError, {
        data: BodyType<CreateFarmBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFarm>>, TError, {
    data: BodyType<CreateFarmBody>;
}, TContext>;
/**
 * @summary Get a farm by ID
 */
export declare const getGetFarmUrl: (id: number) => string;
export declare const getFarm: (id: number, options?: RequestInit) => Promise<Farm>;
export declare const getGetFarmQueryKey: (id: number) => readonly [`/api/farms/${number}`];
export declare const getGetFarmQueryOptions: <TData = Awaited<ReturnType<typeof getFarm>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFarm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFarm>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFarmQueryResult = NonNullable<Awaited<ReturnType<typeof getFarm>>>;
export type GetFarmQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a farm by ID
 */
export declare function useGetFarm<TData = Awaited<ReturnType<typeof getFarm>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFarm>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a farm
 */
export declare const getUpdateFarmUrl: (id: number) => string;
export declare const updateFarm: (id: number, createFarmBody: CreateFarmBody, options?: RequestInit) => Promise<Farm>;
export declare const getUpdateFarmMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFarm>>, TError, {
        id: number;
        data: BodyType<CreateFarmBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFarm>>, TError, {
    id: number;
    data: BodyType<CreateFarmBody>;
}, TContext>;
export type UpdateFarmMutationResult = NonNullable<Awaited<ReturnType<typeof updateFarm>>>;
export type UpdateFarmMutationBody = BodyType<CreateFarmBody>;
export type UpdateFarmMutationError = ErrorType<unknown>;
/**
 * @summary Update a farm
 */
export declare const useUpdateFarm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFarm>>, TError, {
        id: number;
        data: BodyType<CreateFarmBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFarm>>, TError, {
    id: number;
    data: BodyType<CreateFarmBody>;
}, TContext>;
/**
 * @summary Delete a farm
 */
export declare const getDeleteFarmUrl: (id: number) => string;
export declare const deleteFarm: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteFarmMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFarm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteFarm>>, TError, {
    id: number;
}, TContext>;
export type DeleteFarmMutationResult = NonNullable<Awaited<ReturnType<typeof deleteFarm>>>;
export type DeleteFarmMutationError = ErrorType<unknown>;
/**
 * @summary Delete a farm
 */
export declare const useDeleteFarm: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFarm>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteFarm>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get pools
 */
export declare const getGetPoolsUrl: (params?: GetPoolsParams) => string;
export declare const getPools: (params?: GetPoolsParams, options?: RequestInit) => Promise<Pool[]>;
export declare const getGetPoolsQueryKey: (params?: GetPoolsParams) => readonly ["/api/pools", ...GetPoolsParams[]];
export declare const getGetPoolsQueryOptions: <TData = Awaited<ReturnType<typeof getPools>>, TError = ErrorType<unknown>>(params?: GetPoolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPools>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPoolsQueryResult = NonNullable<Awaited<ReturnType<typeof getPools>>>;
export type GetPoolsQueryError = ErrorType<unknown>;
/**
 * @summary Get pools
 */
export declare function useGetPools<TData = Awaited<ReturnType<typeof getPools>>, TError = ErrorType<unknown>>(params?: GetPoolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a pool
 */
export declare const getCreatePoolUrl: () => string;
export declare const createPool: (createPoolBody: CreatePoolBody, options?: RequestInit) => Promise<Pool>;
export declare const getCreatePoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPool>>, TError, {
        data: BodyType<CreatePoolBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPool>>, TError, {
    data: BodyType<CreatePoolBody>;
}, TContext>;
export type CreatePoolMutationResult = NonNullable<Awaited<ReturnType<typeof createPool>>>;
export type CreatePoolMutationBody = BodyType<CreatePoolBody>;
export type CreatePoolMutationError = ErrorType<unknown>;
/**
 * @summary Create a pool
 */
export declare const useCreatePool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPool>>, TError, {
        data: BodyType<CreatePoolBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPool>>, TError, {
    data: BodyType<CreatePoolBody>;
}, TContext>;
/**
 * @summary Get a pool by ID
 */
export declare const getGetPoolUrl: (id: number) => string;
export declare const getPool: (id: number, options?: RequestInit) => Promise<Pool>;
export declare const getGetPoolQueryKey: (id: number) => readonly [`/api/pools/${number}`];
export declare const getGetPoolQueryOptions: <TData = Awaited<ReturnType<typeof getPool>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPool>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPoolQueryResult = NonNullable<Awaited<ReturnType<typeof getPool>>>;
export type GetPoolQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a pool by ID
 */
export declare function useGetPool<TData = Awaited<ReturnType<typeof getPool>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a pool
 */
export declare const getUpdatePoolUrl: (id: number) => string;
export declare const updatePool: (id: number, createPoolBody: CreatePoolBody, options?: RequestInit) => Promise<Pool>;
export declare const getUpdatePoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePool>>, TError, {
        id: number;
        data: BodyType<CreatePoolBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePool>>, TError, {
    id: number;
    data: BodyType<CreatePoolBody>;
}, TContext>;
export type UpdatePoolMutationResult = NonNullable<Awaited<ReturnType<typeof updatePool>>>;
export type UpdatePoolMutationBody = BodyType<CreatePoolBody>;
export type UpdatePoolMutationError = ErrorType<unknown>;
/**
 * @summary Update a pool
 */
export declare const useUpdatePool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePool>>, TError, {
        id: number;
        data: BodyType<CreatePoolBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePool>>, TError, {
    id: number;
    data: BodyType<CreatePoolBody>;
}, TContext>;
/**
 * @summary Delete a pool
 */
export declare const getDeletePoolUrl: (id: number) => string;
export declare const deletePool: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeletePoolMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePool>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePool>>, TError, {
    id: number;
}, TContext>;
export type DeletePoolMutationResult = NonNullable<Awaited<ReturnType<typeof deletePool>>>;
export type DeletePoolMutationError = ErrorType<unknown>;
/**
 * @summary Delete a pool
 */
export declare const useDeletePool: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePool>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePool>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get measurements
 */
export declare const getGetMeasurementsUrl: (params?: GetMeasurementsParams) => string;
export declare const getMeasurements: (params?: GetMeasurementsParams, options?: RequestInit) => Promise<Measurement[]>;
export declare const getGetMeasurementsQueryKey: (params?: GetMeasurementsParams) => readonly ["/api/measurements", ...GetMeasurementsParams[]];
export declare const getGetMeasurementsQueryOptions: <TData = Awaited<ReturnType<typeof getMeasurements>>, TError = ErrorType<unknown>>(params?: GetMeasurementsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMeasurements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMeasurements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeasurementsQueryResult = NonNullable<Awaited<ReturnType<typeof getMeasurements>>>;
export type GetMeasurementsQueryError = ErrorType<unknown>;
/**
 * @summary Get measurements
 */
export declare function useGetMeasurements<TData = Awaited<ReturnType<typeof getMeasurements>>, TError = ErrorType<unknown>>(params?: GetMeasurementsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMeasurements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a measurement
 */
export declare const getCreateMeasurementUrl: () => string;
export declare const createMeasurement: (createMeasurementBody: CreateMeasurementBody, options?: RequestInit) => Promise<Measurement>;
export declare const getCreateMeasurementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMeasurement>>, TError, {
        data: BodyType<CreateMeasurementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMeasurement>>, TError, {
    data: BodyType<CreateMeasurementBody>;
}, TContext>;
export type CreateMeasurementMutationResult = NonNullable<Awaited<ReturnType<typeof createMeasurement>>>;
export type CreateMeasurementMutationBody = BodyType<CreateMeasurementBody>;
export type CreateMeasurementMutationError = ErrorType<unknown>;
/**
 * @summary Add a measurement
 */
export declare const useCreateMeasurement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMeasurement>>, TError, {
        data: BodyType<CreateMeasurementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMeasurement>>, TError, {
    data: BodyType<CreateMeasurementBody>;
}, TContext>;
/**
 * @summary Get chart data for a pool
 */
export declare const getGetMeasurementsChartUrl: (poolId: number, params?: GetMeasurementsChartParams) => string;
export declare const getMeasurementsChart: (poolId: number, params?: GetMeasurementsChartParams, options?: RequestInit) => Promise<ChartDataPoint[]>;
export declare const getGetMeasurementsChartQueryKey: (poolId: number, params?: GetMeasurementsChartParams) => readonly [`/api/measurements/${number}/chart`, ...GetMeasurementsChartParams[]];
export declare const getGetMeasurementsChartQueryOptions: <TData = Awaited<ReturnType<typeof getMeasurementsChart>>, TError = ErrorType<unknown>>(poolId: number, params?: GetMeasurementsChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMeasurementsChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMeasurementsChart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeasurementsChartQueryResult = NonNullable<Awaited<ReturnType<typeof getMeasurementsChart>>>;
export type GetMeasurementsChartQueryError = ErrorType<unknown>;
/**
 * @summary Get chart data for a pool
 */
export declare function useGetMeasurementsChart<TData = Awaited<ReturnType<typeof getMeasurementsChart>>, TError = ErrorType<unknown>>(poolId: number, params?: GetMeasurementsChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMeasurementsChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get latest measurement per pool
 */
export declare const getGetLatestMeasurementsUrl: () => string;
export declare const getLatestMeasurements: (options?: RequestInit) => Promise<PoolWithLatestMeasurement[]>;
export declare const getGetLatestMeasurementsQueryKey: () => readonly ["/api/measurements/latest"];
export declare const getGetLatestMeasurementsQueryOptions: <TData = Awaited<ReturnType<typeof getLatestMeasurements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLatestMeasurements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLatestMeasurements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLatestMeasurementsQueryResult = NonNullable<Awaited<ReturnType<typeof getLatestMeasurements>>>;
export type GetLatestMeasurementsQueryError = ErrorType<unknown>;
/**
 * @summary Get latest measurement per pool
 */
export declare function useGetLatestMeasurements<TData = Awaited<ReturnType<typeof getLatestMeasurements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLatestMeasurements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get tasks
 */
export declare const getGetTasksUrl: (params?: GetTasksParams) => string;
export declare const getTasks: (params?: GetTasksParams, options?: RequestInit) => Promise<Task[]>;
export declare const getGetTasksQueryKey: (params?: GetTasksParams) => readonly ["/api/tasks", ...GetTasksParams[]];
export declare const getGetTasksQueryOptions: <TData = Awaited<ReturnType<typeof getTasks>>, TError = ErrorType<unknown>>(params?: GetTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTasksQueryResult = NonNullable<Awaited<ReturnType<typeof getTasks>>>;
export type GetTasksQueryError = ErrorType<unknown>;
/**
 * @summary Get tasks
 */
export declare function useGetTasks<TData = Awaited<ReturnType<typeof getTasks>>, TError = ErrorType<unknown>>(params?: GetTasksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a task
 */
export declare const getCreateTaskUrl: () => string;
export declare const createTask: (createTaskBody: CreateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getCreateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
export type CreateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof createTask>>>;
export type CreateTaskMutationBody = BodyType<CreateTaskBody>;
export type CreateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Create a task
 */
export declare const useCreateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError, {
        data: BodyType<CreateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTask>>, TError, {
    data: BodyType<CreateTaskBody>;
}, TContext>;
/**
 * @summary Get a task
 */
export declare const getGetTaskUrl: (id: number) => string;
export declare const getTask: (id: number, options?: RequestInit) => Promise<Task>;
export declare const getGetTaskQueryKey: (id: number) => readonly [`/api/tasks/${number}`];
export declare const getGetTaskQueryOptions: <TData = Awaited<ReturnType<typeof getTask>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTaskQueryResult = NonNullable<Awaited<ReturnType<typeof getTask>>>;
export type GetTaskQueryError = ErrorType<unknown>;
/**
 * @summary Get a task
 */
export declare function useGetTask<TData = Awaited<ReturnType<typeof getTask>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a task
 */
export declare const getUpdateTaskUrl: (id: number) => string;
export declare const updateTask: (id: number, updateTaskBody: UpdateTaskBody, options?: RequestInit) => Promise<Task>;
export declare const getUpdateTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
export type UpdateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof updateTask>>>;
export type UpdateTaskMutationBody = BodyType<UpdateTaskBody>;
export type UpdateTaskMutationError = ErrorType<unknown>;
/**
 * @summary Update a task
 */
export declare const useUpdateTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError, {
        id: number;
        data: BodyType<UpdateTaskBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTask>>, TError, {
    id: number;
    data: BodyType<UpdateTaskBody>;
}, TContext>;
/**
 * @summary Delete a task
 */
export declare const getDeleteTaskUrl: (id: number) => string;
export declare const deleteTask: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTaskMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
export type DeleteTaskMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTask>>>;
export type DeleteTaskMutationError = ErrorType<unknown>;
/**
 * @summary Delete a task
 */
export declare const useDeleteTask: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTask>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Update task status
 */
export declare const getUpdateTaskStatusUrl: (id: number) => string;
export declare const updateTaskStatus: (id: number, updateTaskStatusBody: UpdateTaskStatusBody, options?: RequestInit) => Promise<Task>;
export declare const getUpdateTaskStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTaskStatus>>, TError, {
        id: number;
        data: BodyType<UpdateTaskStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTaskStatus>>, TError, {
    id: number;
    data: BodyType<UpdateTaskStatusBody>;
}, TContext>;
export type UpdateTaskStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateTaskStatus>>>;
export type UpdateTaskStatusMutationBody = BodyType<UpdateTaskStatusBody>;
export type UpdateTaskStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update task status
 */
export declare const useUpdateTaskStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTaskStatus>>, TError, {
        id: number;
        data: BodyType<UpdateTaskStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTaskStatus>>, TError, {
    id: number;
    data: BodyType<UpdateTaskStatusBody>;
}, TContext>;
/**
 * @summary Get diseases
 */
export declare const getGetDiseasesUrl: (params?: GetDiseasesParams) => string;
export declare const getDiseases: (params?: GetDiseasesParams, options?: RequestInit) => Promise<Disease[]>;
export declare const getGetDiseasesQueryKey: (params?: GetDiseasesParams) => readonly ["/api/diseases", ...GetDiseasesParams[]];
export declare const getGetDiseasesQueryOptions: <TData = Awaited<ReturnType<typeof getDiseases>>, TError = ErrorType<unknown>>(params?: GetDiseasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDiseases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDiseases>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDiseasesQueryResult = NonNullable<Awaited<ReturnType<typeof getDiseases>>>;
export type GetDiseasesQueryError = ErrorType<unknown>;
/**
 * @summary Get diseases
 */
export declare function useGetDiseases<TData = Awaited<ReturnType<typeof getDiseases>>, TError = ErrorType<unknown>>(params?: GetDiseasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDiseases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a disease (owner only)
 */
export declare const getCreateDiseaseUrl: () => string;
export declare const createDisease: (createDiseaseBody: CreateDiseaseBody, options?: RequestInit) => Promise<Disease>;
export declare const getCreateDiseaseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDisease>>, TError, {
        data: BodyType<CreateDiseaseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDisease>>, TError, {
    data: BodyType<CreateDiseaseBody>;
}, TContext>;
export type CreateDiseaseMutationResult = NonNullable<Awaited<ReturnType<typeof createDisease>>>;
export type CreateDiseaseMutationBody = BodyType<CreateDiseaseBody>;
export type CreateDiseaseMutationError = ErrorType<unknown>;
/**
 * @summary Add a disease (owner only)
 */
export declare const useCreateDisease: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDisease>>, TError, {
        data: BodyType<CreateDiseaseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDisease>>, TError, {
    data: BodyType<CreateDiseaseBody>;
}, TContext>;
/**
 * @summary Get a disease
 */
export declare const getGetDiseaseUrl: (id: number) => string;
export declare const getDisease: (id: number, options?: RequestInit) => Promise<Disease>;
export declare const getGetDiseaseQueryKey: (id: number) => readonly [`/api/diseases/${number}`];
export declare const getGetDiseaseQueryOptions: <TData = Awaited<ReturnType<typeof getDisease>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDisease>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDisease>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDiseaseQueryResult = NonNullable<Awaited<ReturnType<typeof getDisease>>>;
export type GetDiseaseQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a disease
 */
export declare function useGetDisease<TData = Awaited<ReturnType<typeof getDisease>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDisease>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Calculate pool volume
 */
export declare const getCalcPoolVolumeUrl: () => string;
export declare const calcPoolVolume: (poolVolumeInput: PoolVolumeInput, options?: RequestInit) => Promise<CalculatorResult>;
export declare const getCalcPoolVolumeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcPoolVolume>>, TError, {
        data: BodyType<PoolVolumeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calcPoolVolume>>, TError, {
    data: BodyType<PoolVolumeInput>;
}, TContext>;
export type CalcPoolVolumeMutationResult = NonNullable<Awaited<ReturnType<typeof calcPoolVolume>>>;
export type CalcPoolVolumeMutationBody = BodyType<PoolVolumeInput>;
export type CalcPoolVolumeMutationError = ErrorType<unknown>;
/**
 * @summary Calculate pool volume
 */
export declare const useCalcPoolVolume: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcPoolVolume>>, TError, {
        data: BodyType<PoolVolumeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calcPoolVolume>>, TError, {
    data: BodyType<PoolVolumeInput>;
}, TContext>;
/**
 * @summary Calculate drum filter performance
 */
export declare const getCalcDrumFilterUrl: () => string;
export declare const calcDrumFilter: (drumFilterInput: DrumFilterInput, options?: RequestInit) => Promise<CalculatorResult>;
export declare const getCalcDrumFilterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcDrumFilter>>, TError, {
        data: BodyType<DrumFilterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calcDrumFilter>>, TError, {
    data: BodyType<DrumFilterInput>;
}, TContext>;
export type CalcDrumFilterMutationResult = NonNullable<Awaited<ReturnType<typeof calcDrumFilter>>>;
export type CalcDrumFilterMutationBody = BodyType<DrumFilterInput>;
export type CalcDrumFilterMutationError = ErrorType<unknown>;
/**
 * @summary Calculate drum filter performance
 */
export declare const useCalcDrumFilter: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcDrumFilter>>, TError, {
        data: BodyType<DrumFilterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calcDrumFilter>>, TError, {
    data: BodyType<DrumFilterInput>;
}, TContext>;
/**
 * @summary Calculate pump power
 */
export declare const getCalcPumpUrl: () => string;
export declare const calcPump: (pumpInput: PumpInput, options?: RequestInit) => Promise<CalculatorResult>;
export declare const getCalcPumpMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcPump>>, TError, {
        data: BodyType<PumpInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calcPump>>, TError, {
    data: BodyType<PumpInput>;
}, TContext>;
export type CalcPumpMutationResult = NonNullable<Awaited<ReturnType<typeof calcPump>>>;
export type CalcPumpMutationBody = BodyType<PumpInput>;
export type CalcPumpMutationError = ErrorType<unknown>;
/**
 * @summary Calculate pump power
 */
export declare const useCalcPump: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcPump>>, TError, {
        data: BodyType<PumpInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calcPump>>, TError, {
    data: BodyType<PumpInput>;
}, TContext>;
/**
 * @summary Calculate compressor
 */
export declare const getCalcCompressorUrl: () => string;
export declare const calcCompressor: (compressorInput: CompressorInput, options?: RequestInit) => Promise<CalculatorResult>;
export declare const getCalcCompressorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcCompressor>>, TError, {
        data: BodyType<CompressorInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calcCompressor>>, TError, {
    data: BodyType<CompressorInput>;
}, TContext>;
export type CalcCompressorMutationResult = NonNullable<Awaited<ReturnType<typeof calcCompressor>>>;
export type CalcCompressorMutationBody = BodyType<CompressorInput>;
export type CalcCompressorMutationError = ErrorType<unknown>;
/**
 * @summary Calculate compressor
 */
export declare const useCalcCompressor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcCompressor>>, TError, {
        data: BodyType<CompressorInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calcCompressor>>, TError, {
    data: BodyType<CompressorInput>;
}, TContext>;
/**
 * @summary Calculate oxygen concentrator
 */
export declare const getCalcOxygenUrl: () => string;
export declare const calcOxygen: (oxygenInput: OxygenInput, options?: RequestInit) => Promise<CalculatorResult>;
export declare const getCalcOxygenMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcOxygen>>, TError, {
        data: BodyType<OxygenInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calcOxygen>>, TError, {
    data: BodyType<OxygenInput>;
}, TContext>;
export type CalcOxygenMutationResult = NonNullable<Awaited<ReturnType<typeof calcOxygen>>>;
export type CalcOxygenMutationBody = BodyType<OxygenInput>;
export type CalcOxygenMutationError = ErrorType<unknown>;
/**
 * @summary Calculate oxygen concentrator
 */
export declare const useCalcOxygen: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calcOxygen>>, TError, {
        data: BodyType<OxygenInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calcOxygen>>, TError, {
    data: BodyType<OxygenInput>;
}, TContext>;
/**
 * @summary Get equipment checklist
 */
export declare const getGetChecklistUrl: () => string;
export declare const getChecklist: (options?: RequestInit) => Promise<ChecklistItem[]>;
export declare const getGetChecklistQueryKey: () => readonly ["/api/calculators/checklist"];
export declare const getGetChecklistQueryOptions: <TData = Awaited<ReturnType<typeof getChecklist>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChecklist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getChecklist>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetChecklistQueryResult = NonNullable<Awaited<ReturnType<typeof getChecklist>>>;
export type GetChecklistQueryError = ErrorType<unknown>;
/**
 * @summary Get equipment checklist
 */
export declare function useGetChecklist<TData = Awaited<ReturnType<typeof getChecklist>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getChecklist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Save checklist progress
 */
export declare const getSaveChecklistUrl: () => string;
export declare const saveChecklist: (checklistItemUpdate: ChecklistItemUpdate[], options?: RequestInit) => Promise<SuccessResponse>;
export declare const getSaveChecklistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveChecklist>>, TError, {
        data: BodyType<ChecklistItemUpdate[]>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveChecklist>>, TError, {
    data: BodyType<ChecklistItemUpdate[]>;
}, TContext>;
export type SaveChecklistMutationResult = NonNullable<Awaited<ReturnType<typeof saveChecklist>>>;
export type SaveChecklistMutationBody = BodyType<ChecklistItemUpdate[]>;
export type SaveChecklistMutationError = ErrorType<unknown>;
/**
 * @summary Save checklist progress
 */
export declare const useSaveChecklist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveChecklist>>, TError, {
        data: BodyType<ChecklistItemUpdate[]>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof saveChecklist>>, TError, {
    data: BodyType<ChecklistItemUpdate[]>;
}, TContext>;
/**
 * @summary Export measurements as CSV
 */
export declare const getExportMeasurementsCsvUrl: (params?: ExportMeasurementsCsvParams) => string;
export declare const exportMeasurementsCsv: (params?: ExportMeasurementsCsvParams, options?: RequestInit) => Promise<string>;
export declare const getExportMeasurementsCsvQueryKey: (params?: ExportMeasurementsCsvParams) => readonly ["/api/reports/measurements/csv", ...ExportMeasurementsCsvParams[]];
export declare const getExportMeasurementsCsvQueryOptions: <TData = Awaited<ReturnType<typeof exportMeasurementsCsv>>, TError = ErrorType<unknown>>(params?: ExportMeasurementsCsvParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof exportMeasurementsCsv>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof exportMeasurementsCsv>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ExportMeasurementsCsvQueryResult = NonNullable<Awaited<ReturnType<typeof exportMeasurementsCsv>>>;
export type ExportMeasurementsCsvQueryError = ErrorType<unknown>;
/**
 * @summary Export measurements as CSV
 */
export declare function useExportMeasurementsCsv<TData = Awaited<ReturnType<typeof exportMeasurementsCsv>>, TError = ErrorType<unknown>>(params?: ExportMeasurementsCsvParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof exportMeasurementsCsv>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard summary
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map