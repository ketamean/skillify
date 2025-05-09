import { Request, Response } from 'express';
import supabase from "../config/database/supabase";
export const getAllCoupons = async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('coupons').select('*');
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json(data);
};
export const getInstructorCoupons = async (req: Request, res: Response): Promise<void> => {
    const { instructorId } = req.params;

    try {
        const now = new Date().toISOString();

        await supabase
            .schema('private')
            .from('coupons')
            .update({ status: 'OutOfUse' })
            .or(`expiration_time.lt.${now},n_used.gte.max_n_usage`)
            .eq('status', 'InUse');

        // Fetch coupons directly assigned to instructor
        const { data: instructorCouponLinks, error: linkError } = await supabase
            .schema('private')
            .from('instructorcoupons')
            .select(`
                coupons (
                    id,
                    code,
                    discount_type,
                    discount_value,
                    max_n_usage,
                    n_used,
                    expiration_time,
                    status,
                    coupon_type
                ),
                instructor_id
            `)
            .eq('instructor_id', instructorId);

        if (linkError || !instructorCouponLinks) {
            console.error('Error fetching instructor coupons:', linkError?.message);
            res.status(500).json({ error: 'Failed to fetch instructor coupons' });
            return;
        }

        const instructorCoupons = instructorCouponLinks.map(link => ({
            ...link.coupons,
            coupon_type: (link.coupons as any).coupon_type,
            course_name: null // no course name
        }));

        // Fetch all courses taught by the instructor
        const { data: instructorCourses, error: courseFetchError } = await supabase
            .from('courses')
            .select('id, name')
            .eq('instructor_id', instructorId);

        if (courseFetchError) {
            console.error('Error fetching instructor courses:', courseFetchError.message);
            res.status(500).json({ error: 'Failed to fetch courses' });
            return;
        }

        // Fetch all course-specific coupons
        const { data: courseCouponLinks, error: courseError } = await supabase
            .schema('private')
            .from('coursecoupons')
            .select('id, course_id');

        if (courseError) {
            console.error('Error fetching course coupons:', courseError.message);
            res.status(500).json({ error: 'Failed to fetch course coupons' });
            return;
        }

        // Filter course-specific coupons to only include those linked to courses taught by the instructor
        const instructorCourseIds = instructorCourses.map(course => course.id);
        const courseCouponIds = courseCouponLinks
            .filter(link => instructorCourseIds.includes(link.course_id))
            .map(link => link.id);

        // Fetch course-specific coupons linked to the instructor's courses
        const { data: courseCoupons, error: couponError } = await supabase
            .schema('private')
            .from('coupons')
            .select('*')
            .in('id', courseCouponIds);

        if (couponError) {
            console.error('Error fetching course-specific coupons:', couponError.message);
            res.status(500).json({ error: 'Failed to fetch coupons' });
            return;
        }

        // Merge course name with course-specific coupons
        const courseCouponsWithNames = courseCoupons.map(coupon => {
            const link = courseCouponLinks.find(l => l.id === coupon.id);
            const course = instructorCourses.find(c => c.id === link?.course_id);
            return {
                ...coupon,
                course_id: link?.course_id ?? null,
                course_name: course?.name ?? null
            };
        });

        // Merge instructor-specific coupons and course-specific coupons
        const allCoupons = [...instructorCoupons, ...courseCouponsWithNames];

        res.status(200).json(allCoupons);
    } catch (error) {
        console.error('Error fetching all instructor coupons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// export const getInstructorSpecificCoupons = async (req: Request, res: Response): Promise<void> => {
//     const { instructorId } = req.params; 

//     try {
//         const now = new Date().toISOString();

//         await supabase
//             .schema('private')
//             .from('coupons')
//             .update({ status: 'OutOfUse' })
//             .or(`expiration_time.lt.${now},n_used.gte.max_n_usage`)
//             .eq('status', 'InUse');

//             const { data: instructorCouponLinks, error }  = await supabase
//             .schema('private')
//             .from('instructorcoupons')
//             .select(`
//             coupons (
//                 id,
//                 code,
//                 discount_type,
//                 discount_value,
//                 max_n_usage,
//                 n_used,
//                 expiration_time,
//                 status,
//                 coupon_type
//             ),
//             instructor_id
//         `)
//             .eq('instructor_id', instructorId);
//         if (error) {
//             console.error('Error fetching coupons:', error.message);
//             res.status(500).json({ error: 'Failed to fetch instructor coupons' });
//             return;
//         }

//         const flatCoupons = instructorCouponLinks.map(link => ({
//             ...link.coupons,
//             instructor_id: link.instructor_id
//         }));

//         res.status(200).json(flatCoupons);
//     } catch (error) {
//         console.error('Error fetching instructor coupons:', error);
//         res.status(500).json({ error: 'Failed to fetch instructor coupons' });
//     }
// };
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    const {
        code,
        discount_type,
        discount_value,
        coupon_type,
        course_id,
        max_n_usage,
        expiration_time,
        instructor_id,
    } = req.body;
    const now = new Date().toISOString();
    const isExpired = expiration_time < now;

    const status = isExpired ? 'OutOfUse' : 'InUse';

    const { data: coupon, error } = await supabase.schema('private').from('coupons').insert([
        {
            code,
            discount_type,
            discount_value,
            coupon_type,
            max_n_usage,
            expiration_time,
            status
        }
    ]).select().single();

    if (error || !coupon) {
        res.status(400).json({ error: error?.message || 'Failed to create coupon' });
        return;
    }
    // if (coupon_type === 'ParticularInstructor' && instructor_id) {
    //     const { error: insertError } = await supabase
    //         .schema('private')
    //         .from('instructorcoupons')
    //         .insert([{ id: coupon.id, instructor_id }]);

    //     if (insertError) {
    //         console.error('Instructor_Coupon insert error:', JSON.stringify(insertError, null, 2));
    //         res.status(500).json({ error: insertError.message });
    //         return;
    //     }
    // }
    if (coupon_type === 'ParticularInstructor' && instructor_id) {
        await supabase.schema('private').from('instructorcoupons').insert([
            { id: coupon.id, instructor_id }
        ]);
    } else if (coupon_type === 'ParticularCourse' && course_id) {
        await supabase.schema('private').from('coursecoupons').insert([
            { id: coupon.id, course_id }
        ]);
    }
    res.status(201).json(coupon);
};
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
        code,
        discount_type,
        discount_value,
        max_n_usage,
        expiration_time,
    } = req.body;

    const { data: duplicateCheck, error: checkError } = await supabase
        .schema('private')
        .from('coupons')
        .select('id')
        .eq('code', code)
        .neq('id', id) // allow same record to keep its code

    if (checkError) {
        res.status(500).json({ error: 'Error validating coupon code' });
        return;
    }

    if (duplicateCheck && duplicateCheck.length > 0) {
        res.status(400).json({ error: 'Coupon code already exists' });
        return;
    }

    const { data, error } = await supabase
        .schema('private')
        .from('coupons')
        .update({
            code,
            discount_type,
            discount_value,
            max_n_usage,
            expiration_time,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating coupon:', error.message);
        res.status(500).json({ error: 'Failed to update coupon' });
        return;
    }

    const now = new Date().toISOString();

    const { data: updatedCoupon } = await supabase
        .schema('private')
        .from('coupons')
        .select('n_used, max_n_usage, expiration_time, status')
        .eq('id', id)
        .single();

    if (
        updatedCoupon &&
        updatedCoupon.status === 'OutOfUse' &&
        updatedCoupon.n_used < updatedCoupon.max_n_usage &&
        updatedCoupon.expiration_time > now
    ) {
        await supabase
            .schema('private')
            .from('coupons')
            .update({ status: 'InUse' })
            .eq('id', id);
    }
    res.status(200).json({ message: 'Coupon updated successfully' });
};

export const applyCoupon = async (req: Request, res: Response): Promise<void> => {
    const { code, course_id } = req.body;
    const now = new Date().toISOString();

    const { data: coupon, error } = await supabase
        .schema('private')
        .from('coupons')
        .select('*')
        .eq('code', code)
        .maybeSingle();

    if (error || !coupon) {
        res.status(404).json({ message: 'Invalid or expired coupon' });
        return;
    }

    const isExpired = coupon.expiration_time && coupon.expiration_time <= now;
    const isUsedUp = coupon.n_used >= coupon.max_n_usage;
    const shouldBeOutOfUse = isExpired || isUsedUp;

    // Auto-update status if incorrect
    if (coupon.status === 'InUse' && shouldBeOutOfUse) {
        await supabase
            .schema('private')
            .from('coupons')
            .update({ status: 'OutOfUse' })
            .eq('id', coupon.id);

        res.status(400).json({ message: 'Coupon is expired or usage limit reached' });
        return;
    }

    if (coupon.status === 'OutOfUse') {
        res.status(400).json({ message: 'Coupon is expired or usage limit reached' });
        return;
    }

    if (coupon.coupon_type === 'ParticularCourse') {
        const { data: link } = await supabase
            .schema('private')
            .from('coursecoupons')
            .select('id')
            .eq('id', coupon.id)
            .eq('course_id', course_id)
            .maybeSingle();
        if (!link) {
            res.status(400).json({ message: 'Coupon not valid for this course' });
            return;
        }
    }

    if (coupon.coupon_type === 'ParticularInstructor') {
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('instructor_id')
            .eq('id', course_id)
            .single();

        if (courseError || !course) {
            res.status(400).json({ message: 'Invalid course' });
            return;
        }

        const { data: link } = await supabase
            .schema('private')
            .from('instructorcoupons')
            .select('id')
            .eq('id', coupon.id)
            .eq('instructor_id', course.instructor_id)
            .maybeSingle();

        if (!link) {
            res.status(400).json({ message: 'Coupon not valid for this instructor' });
            return;
        }
    }
    res.status(200).json({
        valid: true,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
    });
};
export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const { error: instructorDeleteError } = await supabase
            .schema('private')
            .from('instructorcoupons')
            .delete()
            .eq('id', id);

        if (instructorDeleteError) {
            console.error('Failed to delete instructor_coupon:', instructorDeleteError.message);
            res.status(400).json({ error: instructorDeleteError.message });
            return;
        }

        const { error: couponDeleteError } = await supabase
            .schema('private')
            .from('coupons')
            .delete()
            .eq('id', id);

        if (couponDeleteError) {
            console.error('Failed to delete coupon:', couponDeleteError.message);
            res.status(400).json({ error: couponDeleteError.message });
            return;
        }

        res.status(204).send();
    } catch (err) {
        console.error('Unexpected delete error:', err);
        res.status(500).json({ error: 'Unexpected error deleting coupon' });
    }
};
