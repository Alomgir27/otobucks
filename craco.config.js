const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#0E4A86', '@border-color-base': '#0B3A69', '@secondary-color': 'grey' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};