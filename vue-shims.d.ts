// Type declaration that matches all Vue components with the *.vue extension

declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const component: ComponentOptions
    export default component
}

declare module '@vue/test-utils' {
    import { ComponentPublicInstance } from 'vue';

    export class RouterLinkStub extends ComponentPublicInstance {
        $route?: any;
        $router?: any;
    }

    export interface VueWrapper<T> {
        findComponent(query: string | object): VueWrapper<ComponentPublicInstance>;
    }
}