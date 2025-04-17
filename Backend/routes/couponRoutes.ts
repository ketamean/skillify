import express from 'express';
import {
    getAllCoupons,
    getInstructorCoupons,
    createCoupon,
    updateCoupon,
    applyCoupon,
    deleteCoupon
} from '../controllers/couponController';

const router = express.Router();

router.get('/', getAllCoupons);
router.get('/instructor/:instructorId', getInstructorCoupons);
router.post('/apply', applyCoupon);
router.post('/', createCoupon);
router.delete('/:id', deleteCoupon);
router.put('/:id', updateCoupon);

export default router;