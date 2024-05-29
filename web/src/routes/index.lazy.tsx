import { createLazyFileRoute } from "@tanstack/react-router";
import { SearchProvider, UserProvider } from "@contexts";

import App from "../App";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<SearchProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</SearchProvider>
	);
}
