// tests/setup.js

jest.mock('./__mocks__/yaml');
console.log('setup.js is running');

jest.mock('yaml', () => ({
    load: jest.fn(() => {
        console.log('Mocked YAML.load called');
        // Return a mock Swagger document
        return { /* Your mock Swagger data here */ };
    }),
}));
