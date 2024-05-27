export function CatFoodSkeletons() {
	const skeletons = Array.from({ length: 10 }, (_, i) => i);

	return skeletons.map((skeleton) => {
		return (
			<div key={skeleton} className="m-4 w-96 border-gray-400">
				<div className="skeleton h-6 w-24 my-2" />
				<div className="skeleton h-5 w-24 my-2" />
				<div className="skeleton h-4 w-full my-2" />
				<div className="skeleton h-4 w-full my-2" />
				<div className="skeleton h-4 w-full mb-4" />
			</div>
		);
	});
}
