import { createTheme } from '@mantine/core'

import components from './overrides'

export const theme = createTheme({
    components,
    cursorType: 'pointer',
    fontFamily:
        'Golos Text, Vazirmatn, Apple Color Emoji, Noto Sans SC, Twemoji Country Flags, sans-serif',
    fontFamilyMonospace: 'Fira Mono, monospace',
    breakpoints: {
        xs: '25em',
        sm: '30em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },
    scale: 1,
    fontSmoothing: true,
    focusRing: 'never',
    white: '#fbf6ec',
    black: '#16130f',
    colors: {
        red: [
            '#fdecec',
            '#f8d3d4',
            '#f0a9ab',
            '#e77d80',
            '#dd5257',
            '#d33338',
            '#c81e26',
            '#a5161d',
            '#7f1016',
            '#5a0a0e'
        ],
        gray: [
            '#f4ede3',
            '#ebe1d3',
            '#ddd1c0',
            '#c4b6a2',
            '#8a7f70',
            '#5a5046',
            '#403a33',
            '#2a2520',
            '#1d1914',
            '#16130f'
        ]
    },
    primaryShade: 6,
    primaryColor: 'red',
    autoContrast: true,
    luminanceThreshold: 0.3,
    headings: {
        fontFamily: 'Geologica, Vazirmatn, Apple Color Emoji, Noto Sans SC, sans-serif',
        fontWeight: '800'
    },
    radius: {
        xs: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px'
    },
    defaultRadius: 'md'
})
