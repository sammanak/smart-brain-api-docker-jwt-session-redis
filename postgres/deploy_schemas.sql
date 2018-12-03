-- Deploy Fresh Database Tables
\i '/docker-entrypoint-initdb.d/tables/tbusers.sql'
\i '/docker-entrypoint-initdb.d/tables/tblogin.sql'
\i '/docker-entrypoint-initdb.d/seed/seed.sql'