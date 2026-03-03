<script setup lang="ts">
import { computed } from 'vue';
import cx from 'classnames';
import type { TagProps } from '../../shared/types/tag';
import styles from '../../css/tag.module.css';

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'default',
});

const classes = computed(() => cx(styles.tag, styles[`tag--${props.variant}`]));
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
