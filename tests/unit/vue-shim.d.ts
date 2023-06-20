declare module '*.vue' {
    import { ComponentOptions } from 'vue';
    const componentOptions: ComponentOptions;
    export default componentOptions;
}

// Handle error TS7016: Could not find a declaration file for module 'bcrypt'.
// 'bcrypt' implicitly has an 'any' type.
// Try `npm i --save-dev @types/bcrypt` if it exists or add a new declaration
// (.d.ts) file containing `declare module 'bcrypt';`
declare module 'bcrypt';

// Handle error TS2307: Cannot find module '@prisma/client' or its corresponding type declarations.
// Try `npm i --save-dev @types/prisma__client` if it exists or add a new declaration
// (.d.ts) file containing `declare module '@prisma/client';`
declare module '@prisma/client';
