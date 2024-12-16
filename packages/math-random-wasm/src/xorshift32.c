#include <stdint.h>
#include "wasm.h"

#define XORSHIFT32_MASK 0x7fffffff
#define XORSHIFT32_DIVISOR 0x80000000

#define MAX_STATES 256

typedef struct random_xorshift32_state_
{
  uint32_t seed;
} random_xorshift32_state_t;

static random_xorshift32_state_t state[MAX_STATES];

/**
 * Xorshift32
 */
uint32_t _xorshift32(uint32_t seed)
{
  uint32_t x = seed;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return x;
}

/**
 * Reset random LCG.
 */
static void _random_xorshift32_reset(random_xorshift32_state_t *state, uint32_t seed)
{
  state->seed = seed;
}

/**
 * Get next value from LCG.
 */
static float _random_xorshift32_next(random_xorshift32_state_t *state)
{
  state->seed = _xorshift32(state->seed);
  return (float)(state->seed & XORSHIFT32_MASK) / (float)XORSHIFT32_DIVISOR;
}

WASM_EXPORT
uint32_t random_xorshift32_get_seed(uint8_t index)
{
  return state[index].seed;
}

WASM_EXPORT
void random_xorshift32_reset(uint8_t index, uint32_t seed)
{
  _random_xorshift32_reset(&state[index], seed);
}

WASM_EXPORT
float random_xorshift32_next(uint8_t index)
{
  return _random_xorshift32_next(&state[index]);
}
