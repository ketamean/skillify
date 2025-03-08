CREATE OR REPLACE FUNCTION get_sections_with_videos_by_course(courseid INT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(section_data) INTO result
    FROM (
        SELECT
            jsonb_build_object(
                'sectionName', cvs.name,
                'videos', (
                    SELECT jsonb_agg(video_data)
                    FROM (
                        SELECT
                            jsonb_build_object(
                                'id', cv.id,
                                'name', cv.title,
                                'coverImageLink', cv.thumbnail_link,
                                'visibility', cv.is_public,
                                'duration', cv.duration,
                                'link', cvp.link
                            ) AS video_data
                        FROM coursevideos cv
                        LEFT JOIN coursevideos_public cvp ON cv.id = cvp.id
                        WHERE cv.course_id = courseid AND cv.section_id = cvs.id -- added filter by section
                    ) AS video_list
                )
            ) AS section_data
        FROM coursevideosections cvs
        WHERE cvs.course_id = courseid
        ORDER BY cvs.order
    ) AS section_list;

    RETURN result;
END;
$$;