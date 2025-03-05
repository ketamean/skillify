import { Client } from "pg";

const connectionString = `postgresql://postgres.qlgqwskmctxlhulicvrw:${process.env.SUPABASE_PASSWORD || ""}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
const client = new Client({
    connectionString,
    user: 'anon'
})
async function createEnums(client: Client) {
    
}