import { CatFoodData, SideBar } from "@components";

export interface IResult {
	id: number;
	brand: string;
	name: string;
	image_url?: string;
	link_url: string;
	ingredients: string;
	created_at?: Date;
	updated_at?: Date;
}

interface IProps {
	results: IResult[];
}

export function Main({ results }: IProps) {
	return (
		<div className="flex w-full">
			<SideBar />
			<CatFoodData results={results} />
		</div>
	);
}
