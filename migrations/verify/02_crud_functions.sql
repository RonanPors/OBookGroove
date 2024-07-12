-- Verify obookgroove:02_crud_functions on pg

BEGIN;

-- XXX Add verifications here.

SELECT *
FROM insert_user (
        '{"pseudo": "pseudo", "email": "email", "password": "password", "phone_number": "phone_number", "profile_picture": "profile_picture"}'::json
    )
WHERE
    false;

SELECT *
FROM insert_book (
        '{"isbn": "isbn", "title": "title", "author": "author", "resume": "resume", "genre": [ "genre1", "genre2", "genre3" ], "cover": "cover", "year": 2024, "number_of_pages": 12}'::json
    )
WHERE
    false;

SELECT *
FROM insert_user_has_book (
        '{"book_id": 1, "user_id": 1, "is_active": true, "is_favorite": false, "is_blacklisted": false }'::json
    )
WHERE
    false;

ROLLBACK;