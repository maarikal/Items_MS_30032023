module.exports = {
    verbose: true,
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['vue', 'js', 'jsx', 'json', 'node', 'ts'],
    testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)', '**/tests/unit/**/*.test.[jt]s?(x)'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons'],
    },
    preset: 'ts-jest',
};
