<template>
    <div>
        <label>
            Quantity
            <input v-model="qty" type="number">
        </label>
        <p>
            {{ qty }}
        </p>
    </div>
</template>

<script>
export default {
  name: 'value',
  data () {
    return {
      qty: 0
    }
  },
  methods: {
    onmousedown (e) {
      e.stopPropagation()
      this.qty++
    }
  }
}
</script>

<style scoped>

</style>
