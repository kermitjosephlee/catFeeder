import { capitalize } from "../../utils/capitalize";

export interface ICatFoodCard {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  link_url: string;
  ingredients: string;
}

export function CatFoodCard({
  id,
  brand,
  name,
  // image_url,
  link_url,
  ingredients,
}: ICatFoodCard) {
  const capitalizeBrand = capitalize(brand);

  return (
    <div key={id} className="h-auto max-w-full my-4 p-4 rounded-lg bg-red-200">
      <a href={link_url} target="_blank">
        <h2>{capitalizeBrand}</h2>
        <h3>{name}</h3>
      </a>
      {/* <img src={fixedImageUrl} alt={name} /> */}
      <p className="text-xs ">{ingredients}</p>
    </div>
  );
}
