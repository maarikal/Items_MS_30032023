/*// jest.config.js
module.exports = {
    moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.vue$': 'vue-jest',
    },
/!*    preset: 'ts-jest/presets/default-esm'*!/
}*/

module.exports = {
    moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
        '^.+\\.vue$': 'vue-jest',
    },
}