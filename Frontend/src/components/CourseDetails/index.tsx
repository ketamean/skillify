import { ReactElement, useRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import LockIcon from "./LockIcon";
import PlayIcon from "./PlayIcon";
import DOMPurify from 'dompurify'
import { axiosForm } from "../../config/axios";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
interface Video {
    name: string;
    duration: string;
    visibility: boolean;
    link?: string;
    coverImageLink?: string;
}

// parse md to html on server side
// fe: only sanitize

interface VideoSection {
    sectionName: string;
    videos: Video[];
}

interface CourseDescriptionSection {
    header: string;
    content: string; // markdown supported, were CONVERTED to html
}

interface RelatedTopic {
    name: string;
    link: string;
}

interface CourseDetailsProps {
    courseId: string;
    courseName: string;
    courseImageLink: string;
    shortDescription?: string; // the max number of characters: 180
    relatedTopics: RelatedTopic[];
    numberOfEnrollments: number;
    content: VideoSection[];
    linkToInstructorPage: string;
    // linkToInstructorAvatar: string;
    courseDescriptionSections?: CourseDescriptionSection[];
    instructorName: string;
    fee: number;
}

interface CourseVideoSectionProps extends VideoSection {
    index: number;
}

function HTMLInjector(props: { content: string }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.content) }} />
    )
}

function CourseVideoSection(props: CourseVideoSectionProps) {
    const iconColor: string = "#002333"; // deepteal
    const linkColor: string = "#155775";
    return (
        <div className="w-full flex flex-col gap-y-4">
            <h3 className="bg-[#ededed] py-2 px-4 flex gap-x-2"><td><span>{props.index + 1}.</span></td>{props.sectionName}</h3>
            <table className="w-full flex flex-col gap-y-4 px-4 pb-2 rounded-2xl">
                <tbody>
                    {props.videos.map((video, index) => {
                        const anchorRef = useRef<HTMLAnchorElement>(null)
                        return (
                        <tr key={index} className={`w-full min-w-full flex flex-row gap-x-4 border-b-1 border-b-zinc-300 py-2 ${video.visibility? "cursor-pointer" : ""}`}
                            onClick={
                                video.visibility?
                                    () => {
                                        anchorRef.current?.click();
                                    }:
                                    () => null
                            }
                        >
                            <td className="w-6 h-full flex items-center">
                                {
                                    video.visibility?
                                        <PlayIcon fillColor={iconColor} strokeColor={iconColor} /> :
                                        <LockIcon fillColor={iconColor} strokeColor={iconColor}/>
                                }
                            </td>
                            <td className="w-full">
                                {
                                    video.visibility?
                                        <a ref={anchorRef} className={`text-[${linkColor}]! underline!`} href={video.link} target="_blank">{video.name}</a>:
                                        <span className="text-black">{video.name}</span>
                                }
                            </td>
                            <td className="w-fit text-black">{video.duration}</td>
                        </tr>

                    )})}
                </tbody>
            </table>
        </div>
    )
}

export default function CourseDetails(props: CourseDetailsProps): ReactElement {
    const [message, setMessage] = useState("");
    const user = useAuth();
    const location = useLocation();
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [showCouponField, setShowCouponField] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const courseId = props.courseId;

    useEffect(() => {
        const cached = sessionStorage.getItem(`enrolled-${courseId}`);
        if (cached === "true") {
            setIsEnrolled(true);
            return;
        }

        const fetchEnrollment = async () => {
            const enrolled = await checkEnrollment(user.user.id, courseId);
            if (enrolled) sessionStorage.setItem(`enrolled-${courseId}`, "true");
            setIsEnrolled(enrolled);
        };

        fetchEnrollment();
    }, [user, courseId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get("payment");

        if (paymentStatus === "success") {
            setMessage("Payment Successful! You are now enrolled.")
        } else if (paymentStatus === "error") {
            setMessage("Payment succeeded, but an error occurred during enrollment. Please contact support.");
        }
        else if (paymentStatus === "canceled") {
            setMessage("Payment was canceled. You have not been charged.");
        }
    }, [location]);
    async function checkEnrollment(learnerId: string, courseId: string) {
        const { data, error } = await supabase
            .from("learnerenrolments")
            .select("id")
            .eq("learner_id", learnerId)
            .eq("course_id", courseId)
            .maybeSingle();

        return !!data && !error;
    };

    async function handleApplyCoupon() {
        if (!couponCode || !user?.user?.id) {
            setCouponMessage('Please enter a valid coupon');
            return;
        }

        try {
            const { data } = await axiosForm.post('/api/coupons/apply', {
                code: couponCode,
                course_id: courseId
            });
            if (data.valid) {
                let price = props.fee;
                if (data.discount_type === 'PercentageBased') {
                    price = price * (1 - data.discount_value / 100);
                } else if (data.discount_type === 'ValueBased') {
                    price = Math.max(0, 19000 - data.discount_value);
                }

                setDiscountedPrice(price);
                setCouponMessage('✅ Coupon applied successfully!');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to apply coupon.';
            setCouponMessage(`❌ ${msg}`);
            setDiscountedPrice(null);
        }
    }

    async function handleCheckout() {
        try {
            const { data } = await axiosForm.post("/api/create-checkout-session", {
                learner_id: user?.user?.id,
                course_id: courseId,
                courseName: props.courseName,
                price: discountedPrice ?? props.fee,
                couponCode: couponCode,
                client_origin: window.location.origin,
            });

            window.location.href = data.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    }
    return (
        <div className="w-full h-full flex flex-col">
            {/* header */}
            <div className="bg-deepteal w-full h-full flex flex-col gap-y-8 pt-2 pb-8 px-0
                md:py-12">
                <div className="flex flex-col gap-y-8 text-white w-full h-full px-0
                    md:px-40 md:flex-row md:gap-x-8">
                    <div className="w-full h-full
                        md:max-w-[350px] md:flex-none">
                        <img className="w-full h-full" src={props.courseImageLink} title={props.courseName} alt={`${props.courseName}`} />
                    </div>
                    <div className="w-full h-full flex flex-col gap-y-4 px-6 md:px-0">
                        <p className="font-bold text-4xl">{props.courseName}</p>
                        {
                            props.shortDescription ?
                                <p className="font-medium text-xl">{String(props.shortDescription)}</p>
                                :
                                <></>
                        }
                        <div className="w-full h-full px-0 flex flex-col gap-y-1">
                            <div className="w-full flex flex-row gap-x-2">
                                <div className="w-6 h-6">
                                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#ffffff" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" /></svg>
                                </div>
                                <div>
                                    <span>{props.numberOfEnrollments} student{props.numberOfEnrollments >= 2 ? "s" : ""}</span>
                                </div>
                            </div>
                            <div>
                                Created by <a href={props.linkToInstructorPage}><span className="text-white underline hover:text-zinc-400!">{props.instructorName}</span></a>
                            </div>
                        </div>
                    </div>
                </div>
                {!isEnrolled && (
                    <div className="w-full px-4 md:px-40">
                        <button
                            className="text-indigo-400 text-sm underline hover:text-indigo-300 mb-3"
                            onClick={() => setShowCouponField(prev => !prev)}
                        >
                            {showCouponField ? "Hide coupon" : "Have a coupon?"}
                        </button>
                        {/* Coupon Input and Apply Button */}
                        {showCouponField && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon"
                                    className="px-4 py-2 text-white placeholder-gray-300 bg-transparent border border-white rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                >
                                    Apply
                                </button>
                                {couponMessage && (
                                    <p
                                        className={`text-sm ${couponMessage.startsWith("✅") ? "text-green-300" : "text-red-300"
                                            }`}
                                    >
                                        {couponMessage}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                            {/* Price */}
                            {props.fee > 0 && (
                                <p className="text-3xl text-white font-bold sm:mb-0">
                                    {discountedPrice !== null && discountedPrice !== props.fee && (
                                        <span className="line-through text-gray-400 mr-2">
                                            {props.fee.toLocaleString()}₫
                                        </span>
                                    )}
                                    {discountedPrice !== null
                                        ? `${discountedPrice.toLocaleString()}₫`
                                        : `${props.fee.toLocaleString()}₫`}
                                </p>
                            )}

                            {/* Checkout Button */}
                            <button
                                type="button"
                                className="bg-light-green hover:bg-vibrant-green w-full sm:w-40 px-6 py-3 rounded-lg cursor-pointer"
                                onClick={handleCheckout}
                            >
                                <span className="text-deepteal text-xl font-semibold">
                                    {props.fee === 0 ? "Enroll for Free" : "Buy Now"}
                                </span>
                            </button>
                        </div>
                        {message && <p className="text-white">{message}</p>}
                    </div>
                )}
                {isEnrolled && (
                    <div className="w-full px-4 md:px-40 mt-4">
                        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg cursor-default" disabled>
                            Go to course
                        </button>
                    </div>
                )}
            </div>


            {/* body */}
            <div className="text-black py-8 px-4 flex flex-col gap-y-8 text-justify
                md:px-40">

                {/* related topics */}
                {
                    props.relatedTopics?
                        <div className="flex flex-col gap-y-4">
                            <h2>Related topics</h2>
                            <div className="flex flex-row gap-x-6">
                                {
                                    props.relatedTopics.map((topic) => (
                                        <a className="py-2 px-4 text-lg text-black! font-medium cursor-pointer border-1 border-zinc-500 rounded-lg hover:border-zinc-500! hover:bg-zinc-200"
                                            href={topic.link} target="_blank"
                                        >
                                            {topic.name}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                        : <></>
                }

                {/* videos */}
                {
                    props.content?
                        <div className="flex flex-col gap-y-4">
                            <h2>Course content</h2>
                            {/* VideoSections container */}
                            <table className="flex flex-col border-collapse border border-deepteal">
                                <tbody>
                                    {props.content.map((section: VideoSection, index: number) => (
                                        <tr className={`${index === props.content.length - 1 ? "" : ""}`}>
                                            <CourseVideoSection
                                                sectionName={section.sectionName}
                                                videos={section.videos}
                                                index={index}
                                            />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>:
                        <></>
                }

                {/* course description created by Instructor */}
                {
                    props.courseDescriptionSections?
                        props.courseDescriptionSections.map((section) => (
                            <div className="w-full flex flex-col gap-y-4">
                                <h2>{section.header}</h2>
                                <p>
                                    {<HTMLInjector content={section.content}/>}
                                </p>
                            </div>
                        ))
                        : <></>
                }
                
            </div>
        </div>
    )
}