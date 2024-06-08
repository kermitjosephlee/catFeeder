import { colors, capitalize, letters, countingNumbers } from "@utils";
import { IResult as ICatFoodCard } from "../../App";

export function CatFoodCard({
	id,
	brand,
	name,
	// image_url,
	link_url,
	ingredients,
}: ICatFoodCard) {
	const capitalizeBrand = capitalize(brand);
	const firstLetter = capitalizeBrand[0].toLowerCase();
	const combinedLetters = letters.concat(countingNumbers);
	const borderColor =
		colors[combinedLetters.indexOf(firstLetter) % colors.length];

	return (
		<div
			key={id}
			style={{
				borderColor,
				filter: "saturation(0.1)",
			}}
			className="text-gray-800 bg-gray-50 p-4 rounded-lg my-1/2 mx-1/2 border-4 border-solid">
			{link_url ? (
				<a href={link_url} target="_blank">
					<h1 className="font-extrabold">{capitalizeBrand}</h1>
					<h2 className="font-semibold">{name}</h2>
				</a>
			) : (
				<>
					<h1 className="font-extrabold">{capitalizeBrand}</h1>
					<h2 className="font-semibold">{name}</h2>
				</>
			)}

			{/* <img src={fixedImageUrl} alt={name} /> */}
			<p className="text-xs">{ingredients}</p>
		</div>
	);
}
