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
	selectedPetOptionOpenId: string | null;
	setPets: Dispatch<SetStateAction<PetType[]>>;
	setSelectedPet: Dispatch<SetStateAction<PetType | null>>;
	setSelectedPetOptionOpenId: Dispatch<SetStateAction<string | null>>;
}

export const PetContext = createContext<IPetContext>({
	pets: [],
	selectedPet: null,
	selectedPetOptionOpenId: null,
	setPets: () => {},
	setSelectedPet: () => {},
	setSelectedPetOptionOpenId: () => {},
});

export const PetProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [pets, setPets] = useState<PetType[]>([]);
	const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
	const [selectedPetOptionOpenId, setSelectedPetOptionOpenId] =
		useState<string | null>(null);

	return (
		<PetContext.Provider
			value={{
				pets,
				selectedPet,
				selectedPetOptionOpenId,
				setPets,
				setSelectedPet,
				setSelectedPetOptionOpenId,
			}}>
			{children}
		</PetContext.Provider>
	);
};

export const PetConsumer = PetContext.Consumer;
