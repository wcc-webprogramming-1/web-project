import util from "node:util";
import { env } from '$env/dynamic/private';
import mariadb from "mariadb";
import ssh from "ssh2";

let DATABASE_CONTEXT: ReturnType<typeof createDatabaseContext> | undefined = undefined;

export function getOrCreateDatabaseContext() {
  if (DATABASE_CONTEXT !== undefined)
    return DATABASE_CONTEXT;

  DATABASE_CONTEXT = createDatabaseContext();

  return DATABASE_CONTEXT;
}

function createDatabaseContext() {
  if (env.DATABASE_HOST === undefined)
    throw new Error("DATABASE_HOST is undefined");

  if (env.DATABASE_PORT === undefined)
    throw new Error("DATABASE_PORT is undefined");

  if (isNaN(parseInt(env.DATABASE_PORT)))
    throw new Error("DATABASE_PORT is not a number");

  if (env.DATABASE_USER === undefined)
    throw new Error("DATABASE_USER is undefined");

  if (env.DATABASE_PASS === undefined)
    throw new Error("DATABASE_PASS is undefined");

  const pool = mariadb.createPool({
    host: env.DATABASE_HOST,
    port: parseInt(env.DATABASE_PORT),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASS,
    connectionLimit: 5,
    compress: env.USE_SSH_BRIDGE === "true",
    database: "webgroup1_default",
    stream: env.USE_SSH_BRIDGE !== "true" ? undefined : (callback) => {
      createSshTunnel().then(tunnel => {
        try {
          callback!(undefined, tunnel);
        } catch(err) {
          callback!(err as any);
        }
      })
    },
  });

  return pool;
}


async function createSshTunnel() {
  const client = new ssh.Client();

  if (env.SSH_BRIDGE_HOST === undefined)
    throw new Error("SSH_BRIDGE_HOST is undefined");

  if (env.SSH_BRIDGE_PORT === undefined)
    throw new Error("SSH_BRIDGE_PORT is undefined");

  if (isNaN(parseInt(env.SSH_BRIDGE_PORT)))
    throw new Error("SSH_BRIDGE_PORT is not a number");

  if (env.SSH_BRIDGE_USER === undefined)
    throw new Error("SSH_BRIDGE_USER is undefined");

  if (env.SSH_BRIDGE_PASS === undefined)
    throw new Error("SSH_BRIDGE_PASS is undefined");

  client.connect({
    host: env.SSH_BRIDGE_HOST,
    port: parseInt(env.SSH_BRIDGE_PORT),
    username: env.SSH_BRIDGE_USER,
    password: env.SSH_BRIDGE_PASS,
  })

  await util.promisify(client.once.bind(client) as any)("ready");

  if (env.DATABASE_HOST === undefined)
    throw new Error("DATABASE_HOST is undefined");

  if (env.DATABASE_PORT === undefined)
    throw new Error("DATABASE_PORT is undefined");

  if (isNaN(parseInt(env.DATABASE_PORT)))
    throw new Error("DATABASE_PORT is not a number");

  const stream = await util.promisify(client.forwardOut.bind(client))(
    "127.0.0.1",
    3306,
    env.DATABASE_HOST,
    parseInt(env.DATABASE_PORT));

  (stream as any).address = () => ({})

  return stream;
}