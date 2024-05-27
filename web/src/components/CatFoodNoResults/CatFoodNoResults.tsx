export function CatFoodNoResults() {
	return (
		<div className="flex items-center">
			<svg
				width="200"
				height="200"
				viewBox="0 0 200 200"
				fill="none"
				stroke="black"
				strokeWidth={2}
				xmlns="http://www.w3.org/2000/svg">
				<g>
					<circle cx="100" cy="60" r="30" className="line" />
					<circle cx="90" cy="55" r="5" className="line" />
					<circle cx="110" cy="55" r="5" className="line" />
					<path d="M 90 70 Q 100 80 110 70" className="line" />
					<path d="M 70 90 Q 100 110 130 90" className="line" />
					<path
						d="M 70 90 L 70 140 Q 100 150 130 140 L 130 90"
						className="line"
					/>
					<path d="M 70 100 Q 50 110 70 120" className="line" />
					<path d="M 130 100 Q 150 110 130 120" className="line" />
					<path d="M 80 140 Q 90 160 100 140" className="line" />
					<path d="M 120 140 Q 110 160 100 140" className="line" />
					<path d="M 130 140 Q 160 150 130 160" className="line" />
				</g>
			</svg>
			<div>Sorry, no results</div>
		</div>
	);
}
