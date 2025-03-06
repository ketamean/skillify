revoke select on table public.coursedescriptions from anon;

grant
select (id, course_id, header, content)
  on table public.coursedescriptions to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.coursematerials from anon;

grant
select (id, type, course_id, title, description)
  on table public.coursematerials to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.courserelatedtopics from anon;

grant
select
  on table public.courserelatedtopics to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.courses from anon;

grant
select (id, short_description, image_link, instructor_id, fee, name)
  on table public.courses to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.coursestatus from anon;

grant
select (id, name)
  on table public.coursestatus to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.coursevideos from anon;

grant
select (id, is_public, thumbnail_link, is_public)
  on table public.coursevideos to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.instructors from anon;

grant
select (id, first_name, last_name, avatar_image_link, accepted, bio)
  on table public.instructors to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.learnerenrolments from anon;

grant
select (id, course_id, learner_id)
  on table public.learnerenrolments to anon;

select * from learnerenrolments;
select id from learnerenrolments;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.learners from anon;

grant
select (id, first_name, last_name, avatar_image_link, bio)
  on table public.learners to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------
revoke select on table public.topics from anon;

grant
select (id, name)
  on table public.topics to anon;
--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------