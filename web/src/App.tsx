import { Suspense } from "react";
import { TopNav, Main } from "@components";

export interface IResult {
	id: number;
	brand: string;
	name: string;
	image_url?: string;
	link_url: string;
	ingredients: string;
	created_at?: Date;
	updated_at?: Date;
	productCount?: number;
}

function App() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex flex-col w-full text-red-800">
				<TopNav />
				<Main />
			</div>
		</Suspense>
	);
}

export default App;
