import { shallowMount } from '@vue/test-utils'
import webskitKnobControl from '../../src/webskitKnobControl.vue'

describe('webskitKnobControl', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(webskitKnobControl)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('Set degree to 45', async () => {
    const wrapper = shallowMount(webskitKnobControl)

    await wrapper.vm.$nextTick()

    wrapper.vm.$nextTick(async () => {
      wrapper.find('.jest-45').trigger('mousedown')
      await wrapper.vm.$nextTick()
      wrapper.vm.$nextTick(() => {
        console.log(wrapper.vm.wheelDegrees)
        wrapper.vm.$nextTick(() => {
          console.log(wrapper.vm.value)
        })
      })
    })

    // expect(wrapper.vm.value).toBe('45.00')
  })
})
