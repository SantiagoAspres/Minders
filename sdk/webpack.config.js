const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const entryFile = './src/index.js';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuración base para Vue 2
const baseConfig = {
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // runtime + compiler
    }
  },
  plugins: [new VueLoaderPlugin()]
};

// --- UMD (para <script> tag) ---
const umdConfig = {
  ...baseConfig,
  mode: isDevelopment ? 'development' : 'production',
  entry: entryFile,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-sdk.umd.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {} // si querés incluir todas las deps, dejar vacío
};

// --- ESM (para import) ---
const esmConfig = {
  ...baseConfig,
  mode: 'production',
  entry: entryFile,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-sdk.esm.js',
    libraryTarget: 'module'
  },
  experiments: {
    outputModule: true
  },
  externals: {
    'vue': 'vue',
    'vuetify': 'vuetify'
  }
};

module.exports = [umdConfig, esmConfig];