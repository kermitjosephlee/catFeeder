import { useForm, SubmitHandler } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

interface IFormInput {
	searchTerm: string;
}

export function SearchBar({
	checked,
	resultsLength,
	productCount,
	handleSearchTerm,
	handleToggle,
}: {
	checked: boolean;
	resultsLength: number | undefined;
	productCount: number;
	handleSearchTerm: (searchTerm: string) => void;
	handleToggle: () => void;
}) {
	const { register, handleSubmit, reset } = useForm<IFormInput>();

	// Hotkey to toggle include/exclude
	useHotkeys("mod+k", () => {
		handleToggle();
	});

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		if (data.searchTerm !== "") {
			handleSearchTerm(data.searchTerm);
		}
		reset();
	};

	const toggleClassName = checked
		? "toggle toggle-lg toggle-success"
		: "toggle toggle-lg toggle-error";

	return (
		<div
			id="search bar"
			className="flex justify-between items-center sticky top-0 bg-white p-4 pt-6">
			{resultsLength ? (
				<div>
					Showing {resultsLength} of {productCount}
				</div>
			) : (
				<div></div>
			)}
			<form className="w-1/2 min-w-96" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex items-center gap-2">
					<div
						className="tooltip tooltip-primary"
						data-tip="Press Ctrl/Cmd + K to Toggle">
						<input
							type="checkbox"
							className={toggleClassName}
							checked={checked}
							onChange={handleToggle}
						/>
					</div>
					<label className="input input-bordered flex items-center gap-2 w-full">
						<input
							type="text"
							className="grow w-full"
							placeholder={checked ? "Include" : "Exclude"}
							{...register("searchTerm")}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="w-4 h-4 opacity-70">
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</label>
					<input type="submit" className="btn btn-primary" value="Search" />
				</div>
			</form>
		</div>
	);
}
