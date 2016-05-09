module.exports = {
  'extends': 'agco',
  'plugins': [
    'standard',
    'extra-rules'
  ],
  'rules': {
    'extra-rules/no-commented-out-code': 2,
    'extra-rules/no-for-loops': 2,
    'extra-rules/no-long-files': [2, 113],
    'extra-rules/potential-point-free': 2
  },
  'parserOptions': {
    'sourceType': 'module'
  },
  'globals': {
    'expect': true
  }
};
