module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: "file-loader?name=/public/[name].[ext]"
      }
    ]
  }
}