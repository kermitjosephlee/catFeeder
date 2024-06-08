import { createLazyFileRoute } from "@tanstack/react-router";
import { PetProvider, SearchProvider, UserProvider } from "@contexts";

import App from "../App";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<PetProvider>
			<SearchProvider>
				<UserProvider>
					<App />
				</UserProvider>
			</SearchProvider>
		</PetProvider>
	);
}
