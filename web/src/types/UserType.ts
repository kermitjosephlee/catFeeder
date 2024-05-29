import { SearchType } from "./SearchType";

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
	searches?: SearchType[];
};
