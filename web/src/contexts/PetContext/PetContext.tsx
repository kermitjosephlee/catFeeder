import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { PetType } from "@types";

export interface IPetContext {
	pets: PetType[];
	selectedPet: PetType | null;
	setPets: Dispatch<SetStateAction<PetType[]>>;
	setSelectedPet: Dispatch<SetStateAction<PetType | null>>;
}

export const PetContext = createContext<IPetContext>({
	pets: [],
	selectedPet: null,
	setPets: () => {},
	setSelectedPet: () => {},
});

export const PetProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [pets, setPets] = useState<PetType[]>([]);
	const [selectedPet, setSelectedPet] = useState<PetType | null>(null);

	return (
		<PetContext.Provider
			value={{
				pets,
				selectedPet,
				setPets,
				setSelectedPet,
			}}>
			{children}
		</PetContext.Provider>
	);
};

export const PetConsumer = PetContext.Consumer;
