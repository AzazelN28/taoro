#include <stdint.h>
#include "wasm.h"

#define MODULUS 2147483648 // Math.pow(2, 31)
#define MULTIPLIER 1103515245
#define INCREMENT 12345
#define MASK 0x3fffffff // (Math.pow(2, 30) - 1)
#define DIVISOR 1073741824 // Math.pow(2, 30)

#define MAX_STATES 256

typedef struct random_lcg_state_
{
  uint32_t seed;
} random_lcg_state_t;

static random_lcg_state_t state[MAX_STATES];

/**
 * Linear Congruential Generator
 */
static uint32_t _lcg(uint32_t x, uint32_t a, uint32_t c, uint32_t m) {
  return (x * a + c) % m;
}

/**
 * Reset random LCG.
 */
static void _random_lcg_reset(random_lcg_state_t *state, uint32_t seed) {
  state->seed = seed;
}

/**
 * Get next value from LCG.
 */
static float _random_lcg_next(random_lcg_state_t *state) {
  state->seed = _lcg(state->seed, MULTIPLIER, INCREMENT, MODULUS);
  return (float)(state->seed & MASK) / (float)DIVISOR;
}

WASM_EXPORT
uint32_t random_lcg_get_seed(uint8_t index) {
  return state[index].seed;
}

WASM_EXPORT
void random_lcg_reset(uint8_t index, uint32_t seed) {
  _random_lcg_reset(&state[index], seed);
}

WASM_EXPORT
float random_lcg_next(uint8_t index) {
  return _random_lcg_next(&state[index]);
}
