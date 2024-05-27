import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { UserProvider } from "../contexts";
import { useGetUser } from "../hooks";

import App from "../App";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const user = useGetUser();
	useEffect(() => {
		console.log("Index", { user });
	}, [user]);
	return (
		<UserProvider>
			<App />
		</UserProvider>
	);
}
