all:
	clang \
		-nostdlib \
		-Wl,--no-entry \
		-Wl,--export-dynamic \
		--target=wasm32 \
		-mbulk-memory \
		-msimd128 \
		-o random.wasm \
		src/xorshift32.c \
		src/lcg.c

