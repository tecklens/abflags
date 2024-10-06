const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'react/jsx-no-useless-fragment': 'off',
      'jsx-a11y/accessible-emoji': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/heading-has-content': 'off'
    },
  },
];
