module.exports = {

    devServer: {
        open: true,
        port: 8083,
        proxy: {
            '/api': {
                target: 'http://localhost:8082/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
            }

        }
    }
}