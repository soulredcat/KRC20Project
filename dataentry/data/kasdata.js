const axios = require('axios');
const { pool } = require('../dblogin/krcinfologin');

async function fetchDataAndSave() {
    try {
        const apiUrl = 'https://api-v2-do.kas.fyi/token/krc20/tokens';
        const response = await axios.get(apiUrl);
        const data = response.data.results;

        console.log('API Response:', response.data);

        if (!Array.isArray(data)) {
            console.error('Expected data to be an array, but got:', data);
            return;
        }

        const kasinfoValues = [];
        const priceHistoryValues = [];

        for (const item of data) {
            console.log('Item:', item);

            kasinfoValues.push([
                item.ticker || null,
                item.revealHash || null,
                item.maxSupply || null,
                item.preMint || null,
                item.mintLimit || null,
                item.decimal || null,
                item.totalMinted || null,
                item.opScoreCreated || null,
                item.opScoreUpdated || null,
                item.deployedAt || null,
                item.status || null,
                item.holderTotal || null,
                item.transferTotal || null,
                item.mintTotal || null,
                item.price ? item.price.floorPrice : null,
                item.price ? item.price.marketCapInUsd : null,
                item.price ? item.price.change24h : null,
                item.tradeVolume ? item.tradeVolume.amount : null,
                item.tradeVolume ? item.tradeVolume.amountInKas : null,
                item.tradeVolume ? item.tradeVolume.amountInUsd : null,
                item.iconUrl || null,
            ]);

            if (item.priceHistory) {
                for (const history of item.priceHistory) {
                    priceHistoryValues.push([
                        item.ticker || null,
                        history.p || null,
                        history.t || null
                    ]);
                }
            }
        }

        if (kasinfoValues.length > 0) {
            await pool.query(
                `INSERT INTO kasinfo (ticker, revealHash, maxSupply, preMint, mintLimit, \`decimal\`, totalMinted, opScoreCreated, opScoreUpdated, deployedAt, status, holderTotal, transferTotal, mintTotal, floorPrice, marketCapInUsd, change24h, tradeAmount, tradeAmountInKas, tradeAmountInUsd, iconUrl)
                VALUES ?
                ON DUPLICATE KEY UPDATE maxSupply=VALUES(maxSupply), totalMinted=VALUES(totalMinted), holderTotal=VALUES(holderTotal), transferTotal=VALUES(transferTotal), mintTotal=VALUES(mintTotal), floorPrice=VALUES(floorPrice), marketCapInUsd=VALUES(marketCapInUsd), change24h=VALUES(change24h), tradeAmount=VALUES(tradeAmount), tradeAmountInKas=VALUES(tradeAmountInKas), tradeAmountInUsd=VALUES(tradeAmountInUsd), iconUrl=VALUES(iconUrl)`,
                [kasinfoValues]
            );
        }

        if (priceHistoryValues.length > 0) {
            await pool.query(
                `INSERT INTO priceHistory (ticker, price, timestamp) VALUES ?`,
                [priceHistoryValues]
            );
        }

        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error fetching and saving data:', error);
    }
}

module.exports = {
    fetchDataAndSave
};
