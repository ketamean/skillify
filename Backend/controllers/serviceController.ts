// import { Request, Response } from "express";
// import stripe from "../services/stripe";
// import supabase from "../config/database/supabase";
// const DEFAULT_REDIRECT_DOMAIN = 'http://localhost:3000';

// export const handleStripeRedirect = async (req: Request, res: Response)  => {
//     try {
//         const { success, canceled, session_id } = req.query;
//         if (canceled)
//         {
//             res.status(400).json({ error: "Payment was canceled." });
//             return;
//         }
//         if (success) {
//             if (!session_id) {
//                 res.status(400).json({ error: "Missing session ID" });
//                 return;
//             }

//             const session = await stripe.checkout.sessions.retrieve(session_id);
//             if (session.payment_status !== "paid") {
//                 res.status(400).json({ error: "Payment not completed" });
//                 return;
//             }

//             const {  metadata } = session;
//             const { course_id, learner_id, client_origin } = metadata || {};

//             const clientOrigin = client_origin || req.headers.origin || req.headers.referer;

//             if (!course_id || !learner_id) {
//                 res.status(400).json({ error: "Missing course ID or learner ID" });
//                 return;
//             }

//             const { data, error } = await supabase.from("learnerenrolments").insert([
//                 {
//                     course_id,
//                     learner_id,
//                 },
//             ]).select();
//             if (error) {
//                 console.error("Supabase insert error:", error.message);
//                 res.redirect(`${clientOrigin}/course?payment=error`);
//                 return;
//             }
//             if (data) {
//                 console.log("Order stored successfully.", data);
//             }

//             res.redirect(`${clientOrigin}/course?payment=success`);
//         }
//     } catch (error) {
//         console.error("Error verifying payment:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// export const createCheckoutSession =  async (req: Request, res: Response)  => {
//     try {
//         const { learner_id, course_id, courseName, price, client_origin } = req.body;

//         if (!learner_id || !course_id) {
//             res.status(400).json({ error: "Learner ID and Course ID are required" });
//             return;
//         }

//         const { data } = await supabase
//             .from("learnerenrolments")
//             .select("id")
//             .eq("learner_id", learner_id)
//             .eq("course_id", course_id)
//             .single();

//         if (data) {
//             res.status(400).json({ error: "You have already purchased this course." });
//             return;
//         }

//         if (price === undefined || price < 0) {
//             res.status(400).json({ error: "Invalid price" });
//             return;
//         }

//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "vnd",
//                         product_data: {
//                             name: courseName || "Course",
//                         },
//                         unit_amount: price,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             metadata: {
//                 learner_id,
//                 course_id,
//                 client_origin,
//             },
//             success_url: `${DEFAULT_REDIRECT_DOMAIN}/service/stripe?success=true&session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${DEFAULT_REDIRECT_DOMAIN}/service/stripe?canceled=true`,
//         });

//         res.json({ url: session.url });
//     } catch (error: any) {
//         console.error("Error creating checkout session:", error);
//         res.status(500).json({ error: error.message });
//     }
// }
