import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

import { UserType } from "@/types";

export interface IUserContext {
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
}

export const UserContext = createContext<IUserContext>({
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
