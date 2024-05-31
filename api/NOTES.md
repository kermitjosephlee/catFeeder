[2024-05-31]: notes on search scoring

to solve the issue of just showing products by alphabetical order

Case 1: if user is not logged in OR user has no search history

- take the aggregate score of all included and excluded terms in all searches,
- score each product row accordingly,
- return products by score DESC

Case 2: if user is logged in AND has search history

- take either just user's aggregate search term scores OR combine with all searches score weighted
- score each product row by searches score
- return products by score DESC
