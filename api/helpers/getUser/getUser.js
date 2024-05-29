export const USER_SUB_QUERY = `SELECT 
    u.id AS user_id, 
    u.first_name, 
    u.last_name, 
    u.email, 
    u.is_admin,
    u.password, 
    s.id AS search_id,
    s.include_terms, 
    s.exclude_terms
    FROM users u 
    LEFT JOIN searches s 
    ON u.id = s.user_id 
    WHERE u.id = $1 
    AND s.deleted_at IS NULL;`;

export function userReturnObjMaker(results) {
	const user = results.rows[0];
	const searches = results.rows.map((row) => {
		return {
			id: row.search_id,
			include: JSON.parse(row.include_terms),
			exclude: JSON.parse(row.exclude_terms),
		};
	});

	return {
		id: user.user_id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		isAdmin: user.is_admin,
		searches,
	};
}
