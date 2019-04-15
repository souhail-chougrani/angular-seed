// angular
import { FormControl } from '@angular/forms';

// patterns
export const patterns: any = {
	username: /^[a-zA-Z0-9@\-_.]{5,256}$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/,
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

export class ValidationService {
	/**
	 * username validator
	 * @param control
	 */
	static usernameValidator(control: FormControl): { [s: string]: boolean } {
		const value = control.value;

		if (value && value.match(patterns.username)) {
			return null;
		}

		return { username: true };
	}

	/**
	 * password validator
	 * @param control
	 */
	static passwordValidator(control: FormControl): { [s: string]: boolean } {
		const value = control.value;

		if (value && value.match(patterns.password)) {
			return null;
		}

		return { password: true };
	}

	/**
	 * email validator
	 * @param control
	 */
	static emailValidator(control: FormControl): { [s: string]: boolean } {
		const value = control.value;

		if (value && value.match(patterns.email)) {
			return null;
		}

		return { email: true };
	}
}
