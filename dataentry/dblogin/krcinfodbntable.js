const { createConnection, pool, dbConfig } = require('./krcinfologin');

async function createDatabase() {
    const connection = await createConnection();
    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`Database '${dbConfig.database}' created or already exists.`);
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await connection.end();
    }
}

async function createTables() {
    const createKasinfoTable = `
        CREATE TABLE IF NOT EXISTS kasinfo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticker VARCHAR(255),
            revealHash VARCHAR(255),
            maxSupply DECIMAL(65, 8),
            preMint DECIMAL(65, 8),
            mintLimit DECIMAL(65, 8),
            \`decimal\` INT,
            totalMinted DECIMAL(65, 8),
            opScoreCreated DECIMAL(65, 8),
            opScoreUpdated DECIMAL(65, 8),
            deployedAt DECIMAL(65, 8),
            status VARCHAR(255),
            holderTotal INT,
            transferTotal INT,
            mintTotal DECIMAL(65, 8),
            floorPrice DECIMAL(65, 8),
            marketCapInUsd DECIMAL(65, 8),
            change24h DECIMAL(65, 8),
            tradeAmount DECIMAL(65, 8),
            tradeAmountInKas DECIMAL(65, 8),
            tradeAmountInUsd DECIMAL(65, 8),
            iconUrl VARCHAR(255),
            UNIQUE KEY unique_ticker_revealHash (ticker, revealHash)
        );
    `;

    const createPriceHistoryTable = `
        CREATE TABLE IF NOT EXISTS priceHistory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticker VARCHAR(255),
            price DECIMAL(64,8),
            timestamp BIGINT
        );
    `;

    try {
        await pool.execute(createKasinfoTable);
        await pool.execute(createPriceHistoryTable);
        console.log("Tables created or already exist.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}

module.exports = {
    createDatabase,
    createTables
};
