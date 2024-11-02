<script>
	import auth from '$lib/stores/auth.svelte';
	import RaptorAnimated from '$lib/raptor-animated.svelte';

	let phoneNumber = $state('');
	let code = $state('');

	let fetching = $state(false);
	let error = $state('');

	function onStartAuth() {
		auth.updateFlow('authenticating');
	}

	async function sendCode() {
		if (fetching) return;
		fetching = true;
		error = '';
		const success = await auth.sendCode(phoneNumber);
		if (success) {
			auth.updateFlow('code sent');
		} else {
			error = 'Failed to send code :(';
		}
		fetching = false;
	}

	async function verifyCode() {
		if (fetching) return;
		fetching = true;
		error = '';
		const success = await auth.verifyCode(code);
		if (success) {
			auth.updateFlow('code verified');
			// rsvp.createRSVP(eventName);
		} else {
			error = 'Failed to verify code :(';
		}
		fetching = false;
	}
</script>

{#if !auth.state.authorized}
	<div class="login-container">
		{#if auth.state.flow === null}
			<button class="btn lg" onclick={onStartAuth}>Login</button>
		{/if}
		{#if auth.state.flow === 'authenticating'}
			<div class="cta">
				enter your phone number to sign in <img
					src="/smiley.svg"
					style="width:24px;"
					alt="smiley"
				/>
			</div>
			<input
				autocomplete="tel-national"
				onchange={/** @param {Event & { target: HTMLInputElement }} e */ (e) => {
					phoneNumber = e.currentTarget.value;
				}}
				onkeydown={/** @param {KeyboardEvent} e */ (e) => {
					if (e.key === 'Enter') {
						sendCode();
					}
				}}
				bind:value={phoneNumber}
				type="tel"
				placeholder="Phone number"
			/>
			<button class="btn" onclick={sendCode} disabled={fetching}
				>{#if fetching}<RaptorAnimated />{:else}
					Send Code{/if}</button
			>
		{/if}
		{#if auth.state.flow === 'code sent'}
			<div class="cta">
				enter the code we sent you <img src="/smiley.svg" style="width:24px;" alt="smiley" />
			</div>
			<input
				type="text"
				onchange={/** @param {Event & { target: HTMLInputElement }} e */ (e) =>
					(code = e.currentTarget.value)}
				onkeydown={/** @param {KeyboardEvent} e */ (e) => {
					if (e.key === 'Enter') {
						verifyCode();
					}
				}}
				onkeyup={(e) => {
					// @ts-ignore
					if (e.target.value.length === 6) {
						verifyCode();
					}
				}}
				bind:value={code}
				placeholder="Code"
			/>
			<button class="btn" onclick={verifyCode} disabled={fetching}>
				{#if fetching}
					<RaptorAnimated />
				{:else}
					Verify Code
				{/if}
			</button>
		{/if}
	</div>
{/if}

{#if error}
	<p class="error">{error}</p>
{/if}

<style>
	.login-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 200px;
		padding: 1rem;
	}
	.cta {
		font-size: 1.25rem;
	}
	.error {
		color: var(--red);
	}
</style>
