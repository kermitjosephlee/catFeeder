import * as EmailValidator from "email-validator";

export function isEmailValid(email) {
	return EmailValidator.validate(email);
}
