import { createLazyFileRoute } from "@tanstack/react-router";
import { UserProvider } from "../contexts";

import App from "../App";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<UserProvider>
			<App />
		</UserProvider>
	);
}
