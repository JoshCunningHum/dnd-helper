import {
    type UseAsyncStateOptions,
    promiseTimeout,
    useAsyncState,
} from "@vueuse/core";

interface UseAsyncStateTimeoutOptions<Shallow extends boolean, D = any>
    extends UseAsyncStateOptions<Shallow, D> {
    timeout?: number;
}

export const useAsyncStateTimeout = <
    Data,
    Params extends any[] = [],
    Shallow extends boolean = true,
>(
    promise: Promise<Data> | ((...args: Params) => Promise<Data>),
    initialState: Data,
    options?: UseAsyncStateTimeoutOptions<Shallow, Data>,
) => {
    const { timeout } = options ?? {};
    const asyncstatereturn = useAsyncState(
        (...args: Params) =>
            new Promise<Data>(async (resolve, reject) => {
                const _promise =
                    typeof promise === "function" ? promise(...args) : promise;
                _promise
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                // another promise for the timeout
                if (timeout && timeout > 0)
                    promiseTimeout(timeout).then(() => reject(`Timeout`));
            }),
        initialState,
        options,
    );

    const { execute: executeWithDelay, ...others } = asyncstatereturn;
    const execute = (...args: Params) => executeWithDelay(0, ...args);

    return { ...others, execute, executeWithDelay };
};
