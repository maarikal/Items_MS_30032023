import { mount } from '@vue/test-utils';
import Intro from '../../frontend/src/views/Intro.vue';

describe('ItemsIntro', () => {
    it('renders correctly', () => {
        const wrapper = mount(Intro);
        // @ts-ignore
        expect(wrapper.html()).toContain('Items intro page');
        // @ts-ignore
        expect(wrapper.html()).toContain('If you want to see a list of items or add/delete items');
    });
});
