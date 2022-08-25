const conn = require('./repository');

exports.executeQuery = async (query, value) => {
    const res = await conn.execute(query, [...value]);
    if (res[0].length === 0) {
        throw new Error('No Data Found For Query');
    }
    return res[0];
};
