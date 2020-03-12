<template>
    <div class="wk-value">
        <label>
            Quantity
            <input :value="value" @input="$emit('input', parseFloat($event.target.value))" type="number">
        </label>
    </div>
</template>

<script>
export default {
  name: 'value',
  props: {
    value: {
      type: Number
    }
  }
}
</script>

<style scoped>
    .wk-value {
        padding: 20px;
    }
</style>
