const axios = require('axios');

exports.querySubgraph = (url, query, variables) => {
    return axios
        .post(
            url,
            {
                query,
                variables
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
}