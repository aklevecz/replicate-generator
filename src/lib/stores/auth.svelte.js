import api from '$lib/api';
import { responses } from '$lib/responses';

/**@type {AuthState} initialState */
const initialState = {
	authorized: false,
	user: { phoneNumber: '' },
	flow: null
};

export function createAuth() {
	let auth = $state({ ...initialState });

	return {
		get state() {
			return auth;
		},
		/** @param {{authorized:boolean, user: {phoneNumber:string}}} data */
		init: (data) => {
			auth.authorized = data.authorized;
            auth.user = data.user;
		},
		/** @param {FlowState} flow */
		updateFlow: (flow) => {
			auth.flow = flow;
		},
		/** @param {string} phoneNumber */
		sendCode: async (phoneNumber) => {
			/** @type {{phoneNumber: string, message: Responses['CODE_SENT']}} */
			const data = await api.sendCode(phoneNumber);
			if (data.message === responses.CODE_SENT) {
				auth.user.phoneNumber = data.phoneNumber;
				auth.flow = 'code sent';
				return true;
			}
			return false;
		},
		/** @param {string} code */
		verifyCode: async (code) => {
			const data = await api.verifyCode(code);
            console.log('api verifyCode:', data)
			if (data.message === responses.AUTHED) {
				auth.authorized = true;
				return true;
			}
			return false;
		},
		logout: async () => {
			auth = initialState;
			await api.logout();
            window.location.reload()
			return true;
		}
	};
}

export default createAuth();
