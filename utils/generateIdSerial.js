const { executeQuery } = require('../models/controller');

exports.generateIdSerial = async (tableName, IdColumnName, prefix, pad) => {
    const latestIdQuery = `
        SELECT ${IdColumnName}
        FROM ${tableName}
        ORDER BY ${IdColumnName} DESC
        LIMIT 1
    `;
    try {
        const resp = await executeQuery(latestIdQuery, []);
        const lastId = resp[0][IdColumnName];
        const num = parseInt(lastId.split(prefix)[1], 10);
        let val = num + 1;
        val = `${val}`;
        const finalNum = pad.substring(0, pad.length - val.length) + val;
        const finalId = `${prefix}${finalNum}`;
        return finalId;
    } catch (err) {
        const numOfId = `
            SELECT COUNT(${IdColumnName}) as count
            FROM ${tableName}
        `;
        const resp = await executeQuery(numOfId, []);
        if (resp[0].count === 0) {
            return `${prefix}${pad.slice(0, -1) + 1}`;
        }
        throw new Error('could not generate vendorId');
    }
};
