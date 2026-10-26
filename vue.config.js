module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/styles/sass/_index.scss";`,
      },
    },
  },
  devServer: {
    disableHostCheck: true, // npm run serve 시 로컬에서 다른 호스트로 접근할 수 있도록 설정
  },
  transpileDependencies: ['native-toast'],
  configureWebpack: config => {
    config.output.filename = 'js/[name].[hash].js';
    config.output.chunkFilename = 'js/[name].[hash].js';
  },
};
