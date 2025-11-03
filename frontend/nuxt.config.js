import colors from 'vuetify/es5/util/colors'
import es from 'vuetify/es5/locale/es'
export default {
    ssr: true, // SSR en Nuxt 2
    target: 'server',

    head: {
        title: 'Frontend Minders',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Proyecto Nuxt 2 + Vuetify 2' }
        ]
    },

    css: [
        'vuetify/dist/vuetify.min.css'
    ],

    // Si no tienes esta línea, añádela para que el Web Component funcione con Vue 2:
    vue: {
        config: {
            ignoredElements: ['my-sdk'],
        },
    },

    plugins: [
        { src: '~/plugins/sdk-loader.js', mode: 'client' },
        '~/plugins/vuetify.js'
    ],

    buildModules: [],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/vuetify'
    ],

    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        lang: {
            locales: { es },
            current: 'es',
        },
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: colors.blue.darken2,
                    secondary: colors.grey.darken3,
                    error: colors.red,
                    success: colors.green,
                    background: colors.blueGrey.lighten5
                }
            }
        }
    },

    build: {
        extend(config, ctx) {}
    }
}
