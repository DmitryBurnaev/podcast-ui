let plugins = []
if (process.env.VUE_APP_DEBUG !== 'true'){
  plugins.push(["transform-remove-console", { "exclude": ["error", "warn"] }])
}
module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset"
  ],
  plugins: plugins
}
