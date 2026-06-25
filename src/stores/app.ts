import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref<ThemeMode>(
    (localStorage.getItem('theme-mode') as ThemeMode) || 'light'
  )

  // 系统偏好
  const systemPrefersDark = ref(false)
  let mediaQuery: MediaQueryList | null = null

  // 实际生效的主题
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (theme.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return theme.value
  })

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', effectiveTheme.value)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setTheme = (newTheme: ThemeMode) => {
    theme.value = newTheme
    localStorage.setItem('theme-mode', newTheme)
    applyTheme()
  }

  // 监听系统主题变化
  const initSystemThemeListener = () => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      systemPrefersDark.value = e.matches
      if (theme.value === 'system') {
        applyTheme()
      }
    }
    mediaQuery.addEventListener('change', handler)
  }

  // 监听 store 内 theme 变化
  watch(theme, () => {
    applyTheme()
  })

  return {
    sidebarCollapsed,
    theme,
    effectiveTheme,
    toggleSidebar,
    setTheme,
    initSystemThemeListener
  }
})