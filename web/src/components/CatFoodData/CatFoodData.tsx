import { CatFoodCard } from "@components";
import { IResult as ICatFood } from "@components";

interface IProps {
	results: ICatFood[];
}

export function CatFoodData({ results }: IProps) {
	return (
		<div className="columns-sm p-4 gap-4">
			{results.map((catFood: ICatFood) => {
				return <CatFoodCard key={catFood.id} {...catFood} />;
			})}
		</div>
	);
}
