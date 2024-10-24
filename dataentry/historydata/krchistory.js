const mysql = require('mysql2/promise');

const kasdataConfig = {
    host: 'localhost',
    user: 'root',
    password: 'karangkobar',
    database: 'kasdata',
};

const kashistoryConfig = {
    host: 'localhost',
    user: 'root',
    password: 'karangkobar',
    database: 'kashistory',
};

const kasdataPool = mysql.createPool(kasdataConfig);
let kashistoryPool; 


async function createKashistoryDatabase() {
    try {
            const connection = await mysql.createConnection({
            host: kashistoryConfig.host,
            user: kashistoryConfig.user,
            password: kashistoryConfig.password,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${kashistoryConfig.database}`);
        console.log(`Database '${kashistoryConfig.database}' created or already exists.`);

        kashistoryPool = mysql.createPool(kashistoryConfig);
        
        await connection.end();
    } catch (error) {
        console.error('Error creating kashistory database:', error);
    }
}

async function copyDataToKashistory() {
    try {
        const [kasinfoRows] = await kasdataPool.query('SELECT * FROM kasinfo');
        
        for (const item of kasinfoRows) {
            const ticker = item.ticker;

            const createTickerTableQuery = `
                CREATE TABLE IF NOT EXISTS \`${ticker}\` (
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
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            await kashistoryPool.query(createTickerTableQuery); 

            const insertDataQuery = `
                INSERT INTO \`${ticker}\` 
                (ticker, revealHash, maxSupply, preMint, mintLimit, \`decimal\`, totalMinted, opScoreCreated, opScoreUpdated, deployedAt, status, holderTotal, transferTotal, mintTotal, floorPrice, marketCapInUsd, change24h, tradeAmount, tradeAmountInKas, tradeAmountInUsd, iconUrl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                item.ticker, item.revealHash, item.maxSupply, item.preMint, item.mintLimit, item.decimal, 
                item.totalMinted, item.opScoreCreated, item.opScoreUpdated, item.deployedAt, 
                item.status, item.holderTotal, item.transferTotal, item.mintTotal, item.floorPrice, 
                item.marketCapInUsd, item.change24h, item.tradeAmount, item.tradeAmountInKas, item.tradeAmountInUsd, 
                item.iconUrl
            ];

            await kashistoryPool.query(insertDataQuery, values);
        }

        console.log('Data copied to kashistory successfully!');
    } catch (error) {
        console.error('Error copying data to kashistory:', error);
    }
}


function startInterval() {
    setInterval(copyDataToKashistory, 60000);  
}

async function main() {
    await createKashistoryDatabase();  
    startInterval();                  
}

main();
c