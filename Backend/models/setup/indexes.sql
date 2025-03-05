-- coupons
create index IF not exists coupons_code_idx on public.coupons using hash (code) TABLESPACE pg_default;

create index IF not exists coupons_instructor_id_idx on public.coupons using btree (instructor_id) TABLESPACE pg_default;