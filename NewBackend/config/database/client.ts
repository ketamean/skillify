import { Client, QueryResult } from 'pg';
const connectionString = `postgresql://postgres.qlgqwskmctxlhulicvrw:${process.env.SUPABASE_PASSWORD || ""}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

const client = new Client({ connectionString });

async function connect(): Promise<boolean> {
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    while (retries < maxRetries) {
        try {
            await client.connect();
            console.log("Database connected successfully");
            return true; // Success!
        } catch (err) {
            console.error(`Database connection failed (attempt ${retries + 1}):`, err);

            if (err instanceof Error && (err.message.includes('ECONNREFUSED') || err.message.includes('timeout') || err.message.includes("password authentication failed"))) {
                // Common connection error conditions
                console.log(`Connection lost. Retrying in ${retryDelay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retries++;
            } else {
                // Non-connection specific error, log and return null
                console.error("Non-recoverable database connection error", err);
                return false; // Or throw the error if you want to propagate it.
            }
        }
    }
    console.error(`Failed to connect to the database after ${maxRetries} attempts.`);
    return false; // Return null if all retries fail.
}

(async () => {
    await connect();
})();

async function performTransaction(
    query: string,
    values: Array<any> = []
): Promise<QueryResult> {
    try {
        await client.query('BEGIN');
        const result: QueryResult = await client.query(query, values);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        try {
            await client.query('ROLLBACK');
            console.log('Transaction rolled back.');
        } catch (rollbackErr) {
            console.error('Failed to rollback transaction:', rollbackErr);
        }

        if (err instanceof Error) {
            throw new Error(`Transaction failed: ${err.message}`);
        } else {
            throw new Error('Transaction failed: An unknown error occurred.');
        }
    }
}

const customClient = {
    query: async (query: string, values: Array<any>) => {
        try {
            if (client) {
                return performTransaction(query, values);
            } else if (await connect()) {
                return performTransaction(query, values);
            }
        } catch (err) {
            await connect();
            return performTransaction(query, values);
        }
    }
}

export default customClient