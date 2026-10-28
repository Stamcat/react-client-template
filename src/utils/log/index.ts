type LogLevel = "debug" | "info" | "warn" | "error";
type LogDestination = "console";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- log payloads are heterogeneous by nature
type LogArgs = any[];

const destinations: Record<LogLevel, LogDestination[]> = {
    debug: ["console"],
    info: ["console"],
    warn: ["console"],
    error: ["console"],
};

export const setLogDestinations = (next: Partial<Record<LogLevel, LogDestination[]>>): void => {
    Object.assign(destinations, next);
};

const write = (level: LogLevel, message: string, ...args: LogArgs): void => {
    if (destinations[level].includes("console")) {
        // eslint-disable-next-line no-console -- this is the one module allowed to call console directly
        console[level](message, ...args);
    }
};

export const log = {
    debug: (message: string, ...args: LogArgs): void => write("debug", message, ...args),
    info: (message: string, ...args: LogArgs): void => write("info", message, ...args),
    warn: (message: string, ...args: LogArgs): void => write("warn", message, ...args),
    error: (message: string, ...args: LogArgs): void => write("error", message, ...args),
};
