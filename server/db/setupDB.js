const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const setupDatabase = async () => {
    console.log("Connecting to the database...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected successfully!");

        console.log("Running schema.sql...");
        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await client.query(schemaSql);
        console.log("Schema applied successfully.");

        console.log("Running seed.sql...");
        const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
        await client.query(seedSql);
        console.log("Seed data applied successfully.");

        console.log("Database setup is complete!");
    } catch (err) {
        console.error("Error setting up the database:", err);
    } finally {
        await client.end();
    }
};

setupDatabase();
