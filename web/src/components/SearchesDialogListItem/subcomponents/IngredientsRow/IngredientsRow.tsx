export function IngredientsRow({
	ingredients,
	isIncluded,
}: {
	ingredients: string[];
	isIncluded: boolean;
}) {
	const className = isIncluded
		? "text-green-500 p-3 mr-2 border-2 rounded-full border-green-500"
		: "text-red-500 p-3 mr-2 border-2 rounded-full border-red-500";
	return ingredients.map((ingredient) => (
		<div className={className} key={ingredient}>
			{ingredient}
		</div>
	));
}
