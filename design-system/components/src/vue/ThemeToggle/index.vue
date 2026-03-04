<script setup lang="ts">
import { ref, onMounted } from 'vue';
import cx from 'classnames';
import type { Theme } from '../../shared/types/theme-toggle';
import { getInitialTheme, applyTheme, persistTheme } from '../../shared/js/theme';
import styles from '../../css/theme-toggle.module.css';

const theme = ref<Theme>('light');

onMounted(() => {
  const initial = getInitialTheme();
  theme.value = initial;
  applyTheme(initial);
});

function toggle() {
  const next: Theme = theme.value === 'light' ? 'dark' : 'light';
  theme.value = next;
  applyTheme(next);
  persistTheme(next);
}

const isDark = () => theme.value === 'dark';

const classes = () =>
  cx(styles['theme-toggle'], isDark() && styles['theme-toggle--dark']);
</script>

<template>
  <button
    type="button"
    :class="classes()"
    :aria-label="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark()"
    @click="toggle"
  >
    {{ isDark() ? 'Dark' : 'Light' }}
  </button>
</template>
