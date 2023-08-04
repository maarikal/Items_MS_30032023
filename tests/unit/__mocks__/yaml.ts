// __mocks__/yaml.ts

export const load = jest.fn((filePath: string) => {
    if (filePath === './swagger.yaml') {
        // Return a mock Swagger document
        return { /* Your mock Swagger data here */ };
    }
    // You can handle other YAML files as needed
});
