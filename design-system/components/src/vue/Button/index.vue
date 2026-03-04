<script setup lang="ts">
import { computed } from 'vue';
import cx from 'classnames';
import type { ButtonProps } from '../../shared/types/button';
import styles from '../../css/button.module.css';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const classes = computed(() =>
  cx(
    styles.button,
    styles[`button--${props.variant}`],
    styles[`button--${props.size}`],
    props.disabled && styles['button--disabled'],
  )
);
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
