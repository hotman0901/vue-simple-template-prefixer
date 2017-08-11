module.exports = {
  plugins: [require('autoprefixer')({
      browsers: [
        'last 3 version',
        'Explorer >= 8',
        'Edge >= 12',
        'ios 8',
        'Chrome >= 35',
        'Firefox >= 38',
        'Opera >= 10',
        'Safari >= 8',
        'Android >= 4'
      ],
      cascade: true,
      add: true,
      remove: true
    })]
}