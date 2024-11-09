// import db from '$lib/db';
import { responses } from '$lib/responses';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return new Response();
}
const myNumber = '1234'
const testPhoneNumber = myNumber;
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, platform }) {
	const { phoneNumber, code } = await request.json();

    // sending code
	if (phoneNumber) {
        /** @param {string} phoneNumber */
        const success = async (phoneNumber) => {
            cookies.set('phoneNumber', phoneNumber, { path: '/' });
			return json({ phoneNumber, message: responses.CODE_SENT });
        }
        // IF TEST PHONE NUMBER
		if (phoneNumber === testPhoneNumber) {
            return success(testPhoneNumber);
		}
		const r = await platform?.env.AUTH_SERVICE.sendCode(phoneNumber);
		if (r.status === 'pending') {
			return success(r.phoneNumber)
		}
	}

    // verifying code
	if (code) {
		const storedPhoneNumber = cookies.get('phoneNumber');

        if (storedPhoneNumber) {
			const approved = async () => {
				const token = await platform?.env.AUTH_SERVICE.generateToken({
					phoneNumber: storedPhoneNumber
				});
				try {
					// await db.createRaptor(platform?.env.DATABASE, { phoneNumber: storedPhoneNumber });
				} catch (e) {
					console.log('user exists probably');
				}
				cookies.set('token', token, { path: '/' });
				cookies.set('authed', 'true', { path: '/' });
				return json({ message: responses.AUTHED });
			}
            // IF TEST PHONE NUMBER
			if (storedPhoneNumber === testPhoneNumber) {
				return approved();
			}
			const r = await platform?.env.AUTH_SERVICE.verifyCode({
				phoneNumber: storedPhoneNumber,
				code
			});
			if (r.status === 'approved') {
				return approved();
			}
		}
		return json({ message: responses.CODE_INVALID });
	}

	return json({ status: 400, message: responses.UNKNOWN_AUTH_ERROR });
}

export async function DELETE({ cookies }) {
	cookies.set('token', '', { path: '/' });
	cookies.set('authed', '', { path: '/' });
	return json({ success: true, message: responses.LOGGED_OUT });
}
