import { capitalize } from "../../utils/capitalize";
import { colors, lighterColors } from "../../utils/colors";
// import { twMerge } from "tailwind-merge";
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

	const borderColor = colors[Number(id) % colors.length];
	const backgroundColor = lighterColors[Number(id) % lighterColors.length];

	return (
		<div
			key={id}
			style={{
				borderColor,
				backgroundColor,
				filter: "saturation(0.1)",
			}}
			className="text-gray-800 break-inside-avoid-column h-auto w-auto p-4 rounded-lg my-4 mx-1/2 border-4 border-solid"
		>
			<a href={link_url} target="_blank">
				<h2>{capitalizeBrand}</h2>
				<h3>{name}</h3>
			</a>
			{/* <img src={fixedImageUrl} alt={name} /> */}
			<p className="text-xs ">{ingredients}</p>
		</div>
	);
}
