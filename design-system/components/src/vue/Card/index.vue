<script setup lang="ts">
import { computed } from 'vue';
import cx from 'classnames';
import type { CardProps } from '../../shared/types/card';
import styles from '../../css/card.module.css';

const props = withDefaults(defineProps<CardProps>(), {
  elevation: 'raised',
});

const classes = computed(() => cx(styles.card, styles[`card--${props.elevation}`]));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
