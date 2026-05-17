declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL?: string;
    GEMINI_API_KEY?: string;
    LOG_LEVEL?: string;
  }

  interface Process {
    env: ProcessEnv;
    exit(code?: number): never;
    cwd(): string;
    platform: string;
  }
}

declare var process: NodeJS.Process;

declare module 'process' {
  export = process;
}

// Made with Bob
