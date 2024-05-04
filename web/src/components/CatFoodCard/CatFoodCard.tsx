export interface ICatFoodCard {
  id: string;
  brand: string;
  name: string;
  image_url: string;
  link_url: string;
  ingredients: string;
}

export function CatFoodCard({
  id,
  brand,
  name,
  image_url,
  link_url,
  ingredients,
}: ICatFoodCard) {
  const fixedImageUrl = image_url.replace(/\\/g, "").replace("//img", "/img");

  console.log({ image_url, fixedImageUrl });

  return (
    <div
      key={id}
      className="h-auto max-w-full gap-13 m-4 p-4 rounded-lg bg-red-200"
    >
      <a href={link_url} target="_blank">
        <h2>
          {brand} {name}
        </h2>
      </a>
      {/* <img src={fixedImageUrl} alt={name} /> */}
      <p className="text-xs ">{ingredients}</p>
    </div>
  );
}
