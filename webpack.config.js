const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');


module.exports = {
  node: {
    fs: 'empty'
  },
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'es2015']
       }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'FACEBOOKAPI': JSON.stringify("151471828880746"),
      'GOOGLEMAPAPI': JSON.stringify("AIzaSyCkfO-RW0Nnrf20PbGUQ8t_Wj25RhPT6oA"),
      'firebaseApiKey': JSON.stringify("AIzaSyCrsU8SDvy9t6bjCfeMOYIq4ZdAP9D_vTA"),
      'firebaseDatabaseURL': JSON.stringify("https://friendly-af05e.firebaseio.com"),
      'firebaseAuthDomain': JSON.stringify("friendly-1f06b.firebaseapp.com"),
      'firebaseProjectId': JSON.stringify("friendly-1f06b"),
      'firebaseStorageBucket': JSON.stringify("friendly-1f06b.appspot.com"),
      'firebaseMessagingSenderId': JSON.stringify("843003113068")
    })
  ]
};