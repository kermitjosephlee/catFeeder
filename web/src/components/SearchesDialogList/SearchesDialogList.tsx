import { useGetUser } from "@/hooks";
import { SearchType } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-regular-svg-icons";

export function SearchesDialogList() {
	const user = useGetUser();
	const searches = user?.searches;

	if (!searches || searches.length === 0) {
		return <div>No searches found</div>;
	}

	const handleSearch = (search: SearchType) => {
		console.log(search);
	};

	return (
		<div className="pt-6">
			{searches.map((search, index) => (
				<div
					className="flex justify-between items-center mt-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
					key={index}
					onClick={() => handleSearch(search)}>
					<div>
						{search.include?.map((each) => (
							<p key={each} className="btn btn-outline btn-success mr-1">
								{each}
							</p>
						))}
						{search.exclude?.map((each) => (
							<p key={each} className="btn btn-outline btn-error mr-1">
								{each}
							</p>
						))}
					</div>
					<div>
						<FontAwesomeIcon size="lg" icon={faCircleRight} />
					</div>
				</div>
			))}
		</div>
	);
}
