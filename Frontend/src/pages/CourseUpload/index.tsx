import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import CourseEditHeader from "../CourseEdit/CourseEditHeader";
import CourseEditSideBar from '../CourseEdit/CourseEditSideBar'
import { Quiz, Section, Document, SendAPICourse, CourseDescription, CourseTopic } from "../CourseEdit/types";
import ItemPortalProvider, { CurrentSelectedItem } from "../CourseEdit/context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import CourseEditorMainArea from '../CourseEdit/CourseEditorMainArea'
import { axiosForm } from "@/config/axios";
// import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { getVideoDuration } from "../CourseEdit/handlers";
import { useNavigate } from "react-router-dom";

export default function CourseUpload() {
	const [courseName, setCourseName] = useState<string>('')
	const [courseDescription, setCourseDescription] = useState<string>('')
	const [courseFee, setCourseFee] = useState<number>(0)
	const [sections, setSections] = useState<Section[]>([])
	const [documents, setDocuments] = useState<Document[]>([])
	const [quizzes, setQuizzes] = useState<Quiz[]>([])
	const [currentSelectedItem, setCurrentSelectedItem] = useState<CurrentSelectedItem | null>(null)
	const [hasChanged, setHasChanged] = useState<boolean>(false)
	const [tempChangedSelectedItem, setTempChangedSelectedItem] = useState<Section | Document | Quiz | CourseDescription | null>(null)
	const [isError, setIsError] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string>('')
	const [courseDescriptionList, setCourseDescriptionList] = useState<CourseDescription[]>([])
	const [courseTopics,setCourseTopics] = useState<CourseTopic[]>([])
	const [allTopicList, setAllTopicList] = useState<CourseTopic[]>([])
	const [coursePicture, setCoursePicture] = useState<File | null>(null)
	const [courseStatus, setCourseStatus] = useState('')

	const navigate = useNavigate()

	useEffect(() => {
		if (isError) setIsLoading(false)
	}, [isError])

	useEffect(() => {
		console.log(isLoading)
	}, [isLoading])

	/////////////////////////////////////////////
	/////////////////////////////////////////////
	// fetch topic list
	useEffect(() => {
		try {
			supabase.from('topics').select('id, name')
			.then((res) => {
				if (res.error) {
					console.log(res.error)
					throw {
						error: "Cannot get topic list"
					}
				}
				const _allTopics = res.data
				setAllTopicList(_allTopics)
				setIsLoading(false)
			})
		} catch (err) {
			const { error } = err as {error: string}
			setErrorMsg(error)
			setIsError(true);
		}
	}, [1])
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	useEffect(() => {
        // console.log('currentSelectedItem type: ', currentSelectedItem?.type)
        if (!currentSelectedItem) {
            setTempChangedSelectedItem(null)
        } else {
            switch(currentSelectedItem.type) {
                case 'section':
                    const section = sections.find((section) => section.id === currentSelectedItem.id)
                    if (section) setTempChangedSelectedItem(section)
                    else setTempChangedSelectedItem(null)
                    break;
                case 'document':
                    const document = documents.find((document) => document.id === currentSelectedItem.id)
                    if (document) setTempChangedSelectedItem(document)
                    else setTempChangedSelectedItem(null)
                    break;
                case 'quiz':
                    const quiz = quizzes.find((quiz) => quiz.id === currentSelectedItem.id)
                    if (quiz) setTempChangedSelectedItem(quiz)
                    else setTempChangedSelectedItem(null)
                    break;
				case 'description':
					const descr = courseDescriptionList.find((d) => d.id === currentSelectedItem.id)
					if (descr) setTempChangedSelectedItem(descr)
					else setTempChangedSelectedItem(null)
					break;
            }
        }
    }, [currentSelectedItem]);
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	return (
		<>
			<NavBar />
			<ItemPortalProvider value={{
				courseName,
				setCourseName,

				courseDescription,
				setCourseDescription,

				courseStatus,
				setCourseStatus,

				coursePicture,
				setCoursePicture,

				sections,
				setSections,
				setSectionAtIndex: (newSection: Section, atIndex: number) => {
					const newSections = [...sections]
					newSections[atIndex] = newSection
					setSections(newSections)
				},

				documents,
				setDocuments,
				setDocumentAtIndex: (newDocument: Document, atIndex: number) => {
					const newDocuments = [...documents]
					newDocuments[atIndex] = newDocument
					setDocuments(newDocuments)
				},

				quizzes,
				setQuizzes,
				setQuizAtIndex: (newQuiz: Quiz, atIndex: number) => {
					const newQuizzes = [...quizzes]
					newQuizzes[atIndex] = newQuiz
					setQuizzes(newQuizzes)
				},

				currentSelectedItem,
				setCurrentSelectedItem,

				hasChanged,
				setHasChanged,

				tempChangedSelectedItem,
				setTempChangedSelectedItem,

				courseFee,
				setCourseFee,

				courseDescriptionList,
				setCourseDescriptionList,
				setCourseDescriptionListAtIndex: (newItem: CourseDescription, atIndex: number) => {
					const newCourseDescriptionList = [...courseDescriptionList]
					newCourseDescriptionList[atIndex] = newItem
					setCourseDescriptionList(newCourseDescriptionList)
				},

				courseTopics,
				setCourseTopics
			}}>
				{
					isError ? <div className="flex flex-row gap-x-2 items-center p-4 text-2xl">
						<button onClick={() => window.location.reload()}><FontAwesomeIcon icon={faRotateLeft}/></button>
						<p className="text-red-600">{ errorMsg ? errorMsg : 'Error' }</p>
					</div> : 
					isLoading ? <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div></div>: //<p className="text-blue-500 p-4 text-xl">Loading...</p> :
						<div className="max-w-full flex flex-col text-black w-full lg:px-40 px-4 py-8 gap-y-4">
							{/* header */}
							<CourseEditHeader
								allTopics={allTopicList}

								courseTopics={courseTopics}
								setCourseTopics={setCourseTopics}
							/>

							{/* body */}
							<div className='flex flex-row gap-x-4 w-full'>
								{/* Side bar */}
								<div className='w-1/4 min-w-60'>
									<CourseEditSideBar />
								</div>

								{/* Main content */}
								<div className="w-3/4">
									<CourseEditorMainArea />
								</div>
							</div>

							{/* "Save" button */}
							<button className="ml-auto bg-light-green flex-none font-semibold rounded-md w-fit px-2 hover:bg-mint p-2 flex flex-row items-center gap-x-2 cursor-pointer"
								onClick={async () => {
									const confirm = window.confirm("This action will overide your course and remove all quiz attemps")
									if (!confirm) return;
									setIsLoading(true)
									try {
										if (isError) {
											throw {
												error: 'Error. Please try again'
											}
										}
										// validate videos
										sections.forEach((section) => {
											section.content.forEach((video) => {
												if (!video.file) {
													throw {
														error: 'Please refresh and upload video file'
													}
												}
												if (!video.title) {
													throw {
														error: 'Please enter video title'
													}
												}
											})
										})
	
										// validate documents
										documents.forEach((document) => {
											if (!document.file) {
												throw {
													error: 'Please refresh and upload document file'
												}
											}
										})
	
										// validates metadata
										if (!courseName) {
											throw {
												error: 'Please enter course name'
											}
										}
										if (!courseDescription) {
											throw {
												error: 'Please enter course description'
											}
										}
										if (courseFee < 0) {
											throw {
												error: 'Please enter course fee'
											}
										}
										// upload files
										const videoPublicBucket = 'coursevideospublic'
										const videoPrivateBucket = 'coursevideosprivate'
	
										const newSections = await Promise.all(sections.map(async (section) => {
											return {
												...section,
												content: await Promise.all(section.content.map(async (video) => {
													const filePath = `${Date.now()}` // -${video.file?.name}
													let bucketName = ''
													if (video.isPublic) {
														bucketName = videoPublicBucket
													} else {
														bucketName = videoPrivateBucket
													}
													const { data, error: fileError } = await supabase
														.storage
														.from(bucketName)
														.upload(filePath, video.file as File, {
															cacheControl: '3600',
															upsert: true
														})
													if (fileError) {
														throw{
															error: fileError.message
														}
													}
													return {
														...video,
														link: data? data.path : '',
														duration: await getVideoDuration(video.file as File)
													}
												}))
											}
										}))
	
										const newDocuments = await Promise.all(documents.map(async (document) => {
											const filePath = `${Date.now()}` // -${document.file?.name}
											const { data: documentUploadData, error: documentUploadError } = await supabase
												.storage
												.from('coursedocuments')
												.upload(filePath, document.file as File, {
													cacheControl: '3600',
													upsert: true
												})
											if (documentUploadError) {
												throw {
													error: documentUploadError.message
												}
											}
											return {
												...document,
												link: documentUploadData? documentUploadData.path : ''
											}
										}))

										let coursePictureLink = ''
										if (coursePicture) {
											const filePath = `${Date.now()}` // -${coursePicture.name}
											const { error: pictureUploadError } = await supabase
												.storage
												.from('courseimages')
												.upload(filePath, coursePicture as File, {
													cacheControl: '3600',
													upsert: true
												})
											if (pictureUploadError) {
												throw {
													error: pictureUploadError.message
												}
											}

											const {data: urlData} = supabase.storage.from('courseimages').getPublicUrl(filePath)
											coursePictureLink = urlData.publicUrl
										}
	
										// set up sent data
										const course: SendAPICourse = {
											course_id: -1,
											fee: courseFee,
											title: courseName,
											image_link: coursePictureLink,
											short_description: courseDescription,
											descriptions: courseDescriptionList.map((item) => ({
												header: item.title,
												content: item.description
											})),
											sections: newSections.map((sec) => {
												return {
													title: sec.title,
													videos: sec.content.map((video) => {
														return {
															title: video.title,
															duration: video.duration,
															description: video.description,
															link: video.link,
															isPublic: video.isPublic,
														}
													})
												}
											}),
											documents: newDocuments,
											quizzes: quizzes.map((quiz) => {
												return {
													title: quiz.title,
													description: quiz.description,
													duration: quiz.duration,
													questions: quiz.content.map((question) => {
														return {
															question: question.question,
															choices: question.answers,
															answer: question.key
														}
													})
												}
											}),
											topics: courseTopics.map((tp) => ({id: tp.id}))
										};
										axiosForm
											.put(`/api/courses/`, course)
											.then(() => {
												setIsLoading(false)
												console.log('Course added successfully!');
												// window.location.href = 'http://localhost:5173/instructor/dashboard';
												navigate('/instructor/dashboard')
											})
											.catch((err) => {
												if (err?.response?.data?.error) {
													throw {
														error: err.response.data.error
													}
												}
												if (err?.request?.data?.error) {
													throw {
														error: err.request.data.error
													}
												}
											})
									} catch (err) {
										const {error} = err as {error: string}
										setErrorMsg(error)
										setIsError(true)
									}
								}}
								disabled={isLoading}
							>
								<FontAwesomeIcon icon={faCheck} /> Save
							</button>
						</div>
				}
			</ItemPortalProvider>
			<Footer/>
		</>
	)
}