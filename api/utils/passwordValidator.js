import passwordValidator from "password-validator";

const passwordSchema = new passwordValidator();

passwordSchema.is().min(8);

function isPasswordValid(password) {
	return passwordSchema.validate(password);
}

export { isPasswordValid };
