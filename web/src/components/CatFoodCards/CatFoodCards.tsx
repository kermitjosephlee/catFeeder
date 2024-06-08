import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CatFoodCard } from "@components";
import { IResult as ICatFood } from "@/App";

export function CatFoodCards({
	results,
	productCount,
	handleNextPageLoad,
}: {
	results: (ICatFood | undefined)[];
	productCount: number;
	handleNextPageLoad: () => void;
}) {
	const hasMore = results.length < productCount;

	return (
		<InfiniteScroll
			dataLength={results.length}
			next={handleNextPageLoad}
			hasMore={hasMore}
			loader={<span className="loading loading-dots loading-lg"></span>}
			scrollThreshold={0.9}>
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 300: 1, 680: 2, 1080: 3, 1200: 4 }}>
				<Masonry gutter="10px">
					{results.map((catFood: ICatFood | undefined) => {
						if (!catFood) return null;
						return <CatFoodCard key={catFood.id} {...catFood} />;
					})}
				</Masonry>
			</ResponsiveMasonry>
		</InfiniteScroll>
	);
}
