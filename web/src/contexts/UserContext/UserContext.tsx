import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
} | null;

export interface UserContextType {
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
}

export const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
});

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserType | null>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const UserConsumer = UserContext.Consumer;
