import { defineFormKitConfig } from '@formkit/vue'
import { ru } from '@formkit/i18n'
import { createAutoAnimatePlugin } from '@formkit/addons'
import { createProPlugin, mask } from '@formkit/pro'

const proPlugin = createProPlugin('fk-62b0de8f08', {
  mask, 
  // any other Pro Inputs
})

export default defineFormKitConfig({
  // rules: {},
  locales: { ru },
  locale: 'ru',
  plugins: [
    createAutoAnimatePlugin, proPlugin
  ]
  // etc. 
})