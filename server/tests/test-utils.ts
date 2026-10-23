import type { Express } from "express";

export type Row = Record<string, unknown>;
export type TableName = "applications" | "profiles" | "resumes";
type Operation = "select" | "insert" | "update" | "delete";
type ServiceError = { message: string } | null;
type QueryResult = { data: Row | Row[] | null; error: ServiceError };
interface Query extends PromiseLike<QueryResult> {
  select: (columns?: string) => Query;
  insert: (value: Row) => Query;
  update: (value: Row) => Query;
  delete: () => Query;
  eq: (key: string, value: unknown) => Query;
  single: () => Promise<QueryResult>;
  maybeSingle: () => Promise<QueryResult>;
}
type AuthResult = {
  data: { user: Row | null };
  error: ServiceError;
};
type LoginResult = {
  data: { session: { access_token: string } | null };
  error: ServiceError;
};

const users: Record<string, Row> = {
  "token-user-a": { id: "user-a", email: "a@example.com" },
  "token-user-b": { id: "user-b", email: "b@example.com" },
};

export const database: Record<TableName, Row[]> = {
  applications: [],
  profiles: [],
  resumes: [],
};
export const databaseErrors: Partial<Record<`${TableName}:${Operation}`, string>> = {};
let nextId = 1;

// Query-level fake, not a PostgreSQL/schema emulator. Constraint failures are
// injected explicitly through databaseErrors. It never enforces ownership for
// the controller: only actual eq() filters determine which rows are accessed.
function createQuery(table: TableName): Query {
  let operation: Operation = "select";
  let payload: Row | null = null;
  let returning = false;
  const filters: Array<[string, unknown]> = [];
  let cachedResult: QueryResult | undefined;

  const execute = (): QueryResult => {
    if (cachedResult) return cachedResult;
    const configuredError = databaseErrors[`${table}:${operation}`];
    if (configuredError) {
      return (cachedResult = { data: null, error: { message: configuredError } });
    }

    const matchingRows = database[table].filter((row) =>
      filters.every(([key, value]) => row[key] === value),
    );
    let rows = matchingRows;
    if (operation === "insert" && payload) {
      // Supabase omits undefined JSON properties when sending a mutation.
      const values = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
      rows = [{ id: `${table}-${nextId++}`, ...values }];
      database[table].push(...rows);
    } else if (operation === "update" && payload) {
      matchingRows.forEach((row) => Object.assign(row, payload));
    } else if (operation === "delete") {
      database[table] = database[table].filter((row) => !matchingRows.includes(row));
    }
    // Supabase mutations return no data unless followed by select(). Return
    // detached snapshots so response assertions cannot pass via shared objects.
    return (cachedResult = {
      data: operation === "select" || returning ? structuredClone(rows) : null,
      error: null,
    });
  };

  const toSingle = async (allowEmpty: boolean): Promise<QueryResult> => {
    const result = execute();
    if (result.error || result.data === null) return result;
    const rows = result.data as Row[];
    if (rows.length === 1) return { data: rows[0]!, error: null };
    if (allowEmpty && rows.length === 0) return { data: null, error: null };
    return { data: null, error: { message: "Expected a single row" } };
  };

  const query: Query = {
    select: jest.fn(() => {
      if (operation !== "select") returning = true;
      return query;
    }),
    insert: jest.fn((value: Row) => {
      operation = "insert";
      payload = value;
      return query;
    }),
    update: jest.fn((value: Row) => {
      operation = "update";
      payload = value;
      return query;
    }),
    delete: jest.fn(() => {
      operation = "delete";
      return query;
    }),
    eq: jest.fn((key: string, value: unknown) => {
      filters.push([key, value]);
      return query;
    }),
    single: jest.fn(() => toSingle(false)),
    maybeSingle: jest.fn(() => toSingle(true)),
    then: (resolve, reject) => Promise.resolve(execute()).then(resolve, reject),
  };
  return query;
}

const getUser = async (token: string): Promise<AuthResult> => {
  const user = users[token];
  return user
    ? { data: { user }, error: null }
    : { data: { user: null }, error: { message: "Invalid token" } };
};
const signUp: (credentials: {
  email: string; password: string; options: { data: { full_name: string } };
}) => Promise<{ error: ServiceError }> = async () => ({ error: null });
const signInWithPassword: (credentials: {
  email: string; password: string;
}) => Promise<LoginResult> = async () => ({
  data: { session: { access_token: "token-user-a" } }, error: null,
});

export const mockSupabase = {
  auth: {
    getUser: jest.fn(getUser),
    signUp: jest.fn(signUp),
    signInWithPassword: jest.fn(signInWithPassword),
  },
  from: jest.fn((table: TableName) => createQuery(table)),
};

// Mock before importing app: no real Supabase client (or credentials) is loaded.
jest.doMock("../src/db/supabase-client", () => ({
  __esModule: true,
  default: mockSupabase,
}));
export const app = require("../src/app").default as Express;

export function asUser(token = "token-user-a") {
  return { Cookie: `accessToken=${token}` };
}

beforeEach(() => {
  database.applications = [];
  database.profiles = [];
  database.resumes = [];
  for (const key of Object.keys(databaseErrors)) {
    delete databaseErrors[key as keyof typeof databaseErrors];
  }
  nextId = 1;
  jest.resetAllMocks();
  mockSupabase.from.mockImplementation((table) => createQuery(table));
  mockSupabase.auth.getUser.mockImplementation(getUser);
  mockSupabase.auth.signUp.mockImplementation(signUp);
  mockSupabase.auth.signInWithPassword.mockImplementation(signInWithPassword);
});
