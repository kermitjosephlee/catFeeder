export type SearchType = {
	id: number | string;
	pet_id: number | string | null;
	include?: string[];
	exclude?: string[];
};
