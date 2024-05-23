interface IProps {
	checked: boolean;
	handleToggle: () => void;
	handleIngredients: (ingredient: string) => void;
}

export function TopNav({ checked, handleToggle, handleIngredients }: IProps) {
	return (
		<div className="navbar bg-red-100 h-36 flex items-center justify-between">
			<div>
				<a className="text-xl flex items-center" href="/">
					<img className="h-16" src="/logo-brown.svg" alt="cat-feeder-logo" />
				</a>
			</div>
			<form>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						className="toggle toggle-lg"
						checked={checked}
						onChange={handleToggle}
					/>
					<label className="input input-bordered flex items-center gap-2">
						<input
							type="text"
							className="grow"
							placeholder={checked ? "Include" : "Exclude"}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="w-4 h-4 opacity-70"
						>
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</label>
				</div>
			</form>
		</div>
	);
}
