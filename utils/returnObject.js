exports.returnObject = (status, returnMsg, data) => {
    const statusCode = status > 300 ? 0 : 1;
    const errorTypeCode = status > 300 ? 0 : null;
    const msg = status === 500 ? 'An error occurred! Please try again' : returnMsg;

    return {
        responseStatus: {
            statusCode,
            message: msg,
            errorTypeCode,
        },
        responseData: data,
    };
};
