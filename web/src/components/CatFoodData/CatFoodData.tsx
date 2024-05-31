/* eslint-disable @typescript-eslint/no-explicit-any */
import { CatFoodCard, CatFoodSkeletons, CatFoodNoResults } from "@components";
import {
	AutoSizer,
	IndexRange,
	InfiniteLoader,
	List,
	WindowScroller,
} from "react-virtualized";
import { IResult as ICatFood } from "../../App";

interface IProps {
	results: ICatFood[];
	isLoading: boolean;
	isFirstLoading: boolean;
	handleNewPageLoad: () => Promise<void>;
}

function CatFoodCards({
	results,
	isLoading,
	handleNewPageLoad,
}: {
	results: ICatFood[];
	isLoading: boolean;
	handleNewPageLoad: (params: IndexRange) => Promise<void> | (() => void);
}) {
	function rowRenderer({ index, key, style }: any) {
		const catFood = results[index];
		return (
			<div key={key} style={style}>
				<CatFoodCard {...catFood} />
			</div>
		);
	}

	function isRowLoaded({ index }: { index: number }) {
		return !!results[index];
	}

	const loadMoreRows = isLoading ? () => {} : handleNewPageLoad;

	return (
		<div id="cat-food-cards">
			<AutoSizer disableHeight={true}>
				{({ width }) => (
					<WindowScroller>
						{({ height, isScrolling, onChildScroll, scrollTop }) => (
							<InfiniteLoader
								isRowLoaded={isRowLoaded}
								loadMoreRows={loadMoreRows}
								rowCount={1000}>
								{({
									onRowsRendered,
									registerChild,
								}: {
									onRowsRendered: any;
									registerChild: any;
								}) => (
									<List
										autoHeight
										onRowsRendered={onRowsRendered}
										ref={registerChild}
										height={height}
										isScrolling={isScrolling}
										onScroll={onChildScroll}
										rowCount={results.length}
										rowHeight={42}
										rowRenderer={rowRenderer}
										scrollTop={scrollTop}
										width={width}
									/>
								)}
							</InfiniteLoader>
						)}
					</WindowScroller>
				)}
			</AutoSizer>
		</div>
	);

	// return results.map((catFood: ICatFood) => {
	// 	return <CatFoodCard key={catFood.id} {...catFood} />;
	// });
}

export function CatFoodData({
	results,
	isLoading,
	isFirstLoading,
	handleNewPageLoad,
}: IProps) {
	const noResults = results.length === 0;
	const showSkeletons = isLoading && noResults;
	const showResults = results.length > 0;
	const showNoResults = !isLoading && !isFirstLoading && noResults;

	return (
		<div className="columns-sm p-4 gap-4">
			{showResults && (
				<CatFoodCards
					results={results}
					handleNewPageLoad={handleNewPageLoad}
					isLoading={isLoading}
				/>
			)}
			{showSkeletons && <CatFoodSkeletons />}
			{showNoResults && <CatFoodNoResults />}
		</div>
	);
}
