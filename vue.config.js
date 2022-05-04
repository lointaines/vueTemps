module.exports = {

    devServer: {
        open: true,
        port: 8083,
        proxy: {
            '/api': {
                target: 'http://localhost:8082/tibetan',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
            }

        }
    }
}