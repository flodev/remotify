const path = require('path')
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.module.rules.push({
      test: /\.scss$/i,
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
                mode: 'local',
                // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                // localIdentName: '[sha1:hash:hex:4]',
                // context: path.resolve(__dirname, 'src'),
                // hashPrefix: 'my-custom-hash',
            },
          },
        },
        require.resolve('sass-loader')
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
