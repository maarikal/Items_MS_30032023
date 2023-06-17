// Added type declaration for .vue components in vue-shims.d.ts
// Tests for Intro.vue

// @ts-ignore
import { mount, RouterLinkStub } from '@vue/test-utils';
import {expect, jest, test} from '@jest/globals';
import Intro from '../../frontend/src/views/Intro.vue';

describe('Intro', () => {
    test('renders correctly', () => {
        const wrapper = mount(Intro);

        expect(wrapper.html()).toContain('Items intro page');
        expect(wrapper.html()).toMatch(/If you want to see/);
    });

    test('user can click links', async () => {
        const mockRoute = {
            params: {
                id: 1
            }
        }
        const mockRouter = {
            push: jest.fn()
        }

        const wrapper = mount(Intro, {
            props: {
                isAuthenticated: true
            },
            global: {
                mocks: {
                    $route: mockRoute,
                    $router: mockRouter
                }
            }
        })

        // Find the signup link and click it
        let foundLink = await wrapper.find('router-link[to="/signup"]')
        if (foundLink) {
            console.log(foundLink)
            foundLink.trigger('click')
        }
        // Check that foundLink is not null
        expect(foundLink).not.toBeNull()
        console.log(foundLink)
        // Assert that the router was called with the correct URL
        expect(mockRouter.push).toHaveBeenCalledTimes(1)
        expect(mockRouter.push).toHaveBeenCalledWith('/signup')
    })
});




