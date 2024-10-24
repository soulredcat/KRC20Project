const { createDatabase, createTables } = require('./dataentry/dblogin/krcinfodbntable');
const { fetchDataAndSave } = require('./dataentry/data/kasdata');

async function main() {
    await createDatabase(); 
    await createTables();  
    await fetchDataAndSave(); 
}

setInterval(main, 30000);
