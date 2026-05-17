declare module 'winston' {
  export interface LoggerOptions {
    level?: string;
    format?: any;
    transports?: any[];
    exitOnError?: boolean;
    defaultMeta?: any;
  }

  export interface Logger {
    error(message: string | object, ...meta: any[]): void;
    warn(message: string | object, ...meta: any[]): void;
    info(message: string | object, ...meta: any[]): void;
    debug(message: string | object, ...meta: any[]): void;
    log(level: string, message: string | object, ...meta: any[]): void;
    add(transport: any): void;
  }

  export const format: {
    combine(...formats: any[]): any;
    timestamp(options?: any): any;
    errors(options?: any): any;
    json(): any;
    simple(): any;
    colorize(): any;
    printf(templateFunction: (info: any) => string): any;
    splat(): any;
  };

  export const transports: {
    Console: new (options?: any) => any;
    File: new (options?: any) => any;
  };

  export function createLogger(options: LoggerOptions): Logger;
}

// Made with Bob
