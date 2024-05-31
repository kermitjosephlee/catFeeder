import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CatFoodCard, CatFoodSkeletons, CatFoodNoResults } from "@components";
import { IResult as ICatFood } from "../../App";

interface IProps {
	results: ICatFood[];
	isLoading: boolean;
	isFirstLoading: boolean;
	productCount: number;
	handleNextPageLoad: () => void;
}

function CatFoodCards({
	results,
	productCount,
	handleNextPageLoad,
}: {
	results: ICatFood[];
	productCount: number;
	handleNextPageLoad: () => void;
}) {
	const hasMore = results.length < productCount;

	return (
		<InfiniteScroll
			dataLength={results.length}
			next={handleNextPageLoad}
			hasMore={hasMore}
			loader={<CatFoodSkeletons />}>
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 300: 1, 680: 2, 1080: 3, 1200: 4 }}>
				<Masonry gutter="10px">
					{results.map((catFood: ICatFood) => (
						<CatFoodCard key={catFood.id} {...catFood} />
					))}

					{/* {images.map((image) => {
							return (
								<img
									key={image.id}
									src={image.urls.regular}
									alt={image.alt_description}
									style={{ width: "100%", borderRadius: "8px", margin: "3px" }}
								/>
							);
						})} */}
				</Masonry>
			</ResponsiveMasonry>
		</InfiniteScroll>
	);
}

export function CatFoodData({
	results,
	isLoading,
	isFirstLoading,
	productCount,
	handleNextPageLoad,
}: IProps) {
	const noResults = results.length === 0;
	const showSkeletons = isLoading && noResults;
	const showResults = results.length > 0;
	const showNoResults = !isLoading && !isFirstLoading && noResults;

	return (
		<div className="p-4">
			{showResults && (
				<CatFoodCards
					results={results}
					productCount={productCount}
					handleNextPageLoad={handleNextPageLoad}
				/>
			)}
			{showSkeletons && <CatFoodSkeletons />}
			{showNoResults && <CatFoodNoResults />}
		</div>
	);
}
