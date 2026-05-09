export interface Project {
  title: string
  description: string
  repo?: string
  url?: string
  image?: string
  tags?: string[]
}

export const projects: Project[] = [
  {
    title: 'tuya-open-meteo',
    description:
      'Solar heater control system that integrates Tuya smart devices with real-time weather monitoring via Open Meteo API.',
    repo: 'https://github.com/mrkpatchaa/tuya-open-meteo',
    tags: ['TypeScript', 'IoT', 'Tuya', 'Open Meteo'],
  },
  {
    title: 'PassGen',
    description:
      'A minimal, privacy-first Chrome extension for generating secure passwords — no network requests, no tracking, no dependencies.',
    repo: 'https://github.com/mrkpatchaa/chrome-password-generator',
    tags: ['Chrome Extension', 'CSS', 'Privacy'],
  },
  {
    title: 'phosphor-react-native',
    description:
      'A flexible icon family for React Native. Port of the Phosphor icon library with support for all icon weights and customizable size, color, and style.',
    repo: 'https://github.com/duongdev/phosphor-react-native',
    tags: ['React Native', 'TypeScript', 'Icons'],
  },
  {
    title: 'Blinker',
    description:
      'Inspired by the 20-20-20 rule: a little reminder to look 20 feet away from your screen every 20 minutes. Keep your eyes healthy and reduce eye strain.',
    repo: 'https://github.com/mrkpatchaa/blinker',
    tags: ['Electron', 'JavaScript', 'Health'],
  },
  {
    title: 'electron-icon-maker',
    description:
      'CLI tool to generate all icon files needed for Electron app packaging — outputs .icns, .ico, and @2x PNG from a single source PNG. Updated fork for Electron Forge.',
    repo: 'https://github.com/mrkpatchaa/electron-icon-maker',
    tags: ['Electron', 'JavaScript', 'CLI', 'Tooling'],
  },
  {
    title: 'react-native-ionicons',
    description:
      'Use the latest version of Ionicons (v6+) in your React Native project. A drop-in replacement based on the original package.',
    repo: 'https://github.com/mrkpatchaa/react-native-ionicons',
    tags: ['React Native', 'TypeScript', 'Icons'],
  },
  //   {
  //     title: 'react-native-nyx-printer',
  //     description: 'React Native module to use Nyx device printers (e.g. NB55) directly from JavaScript, bridging the native Java SDK.',
  //     repo: 'https://github.com/mrkpatchaa/react-native-nyx-printer',
  //     tags: ['React Native', 'Java', 'Hardware'],
  //   },
  //   {
  //     title: 'react-native-ssl-pinning',
  //     description: 'Practical examples of how to implement SSL pinning in React Native applications to protect against man-in-the-middle attacks.',
  //     repo: 'https://github.com/mrkpatchaa/react-native-ssl-pinning',
  //     tags: ['React Native', 'Security', 'SSL'],
  //   },
  //   {
  //     title: 'pattern-replace',
  //     description: 'A CLI tool for search-and-replace by pattern — useful for bulk configuration replacements, originally built for Keycloak config management.',
  //     repo: 'https://github.com/mrkpatchaa/pattern-replace',
  //     tags: ['JavaScript', 'CLI', 'Tooling'],
  //   },
]
