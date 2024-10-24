const { createDatabase, createTables } = require('./dataentry/dblogin/krcinfodbntable');
const { fetchDataAndSave } = require('./dataentry/data/kasdata');

async function main() {
    await createDatabase();    // Create the database
    await createTables();      // Create the tables
    await fetchDataAndSave();  // Fetch and store the data
}

setInterval(main, 30000);  // Run every 30 seconds
