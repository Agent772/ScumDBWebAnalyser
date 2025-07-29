declare module 'sql.js' {
  // Minimal type declarations for sql.js
  export interface QueryExecResult {
    columns: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any[][];
  }
  export class Database {
    constructor(data?: Uint8Array);
    exec(sql: string): QueryExecResult[];
    close(): void;
  }
  export default function initSqlJs(config?: { locateFile: (file: string) => string }): Promise<{ Database: typeof Database }>;
}
