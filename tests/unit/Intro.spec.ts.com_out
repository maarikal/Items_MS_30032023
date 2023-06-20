import { mount } from '@vue/test-utils'
import Intro from '../../frontend/src/views/Intro.vue'
import { expect } from '@jest/globals'

describe('Intro', () => {
    test('should display header text', () => {
        const wrapper = mount(Intro)

        expect(wrapper.find('h1').text()).toEqual('Items intro page')

    })
})