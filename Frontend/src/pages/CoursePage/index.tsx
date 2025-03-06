import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import CourseDetails from "../../components/CourseDetails";

const data = {
    name: "The Complete Full-Stack Web Development Bootcamp",
    //shortDescription: "Learn full-stack web development with HTML, CSS, Bootstrap, JavaScript, jQuery, Node.js, MongoDB, Express, and React",
    shortDescription: "Lorem ipsum dolor sit amet amet amet amet amet amet amet amet amet amet amet consectetur adipisicing elit. Nisi, quasi? Laboriosam consequuntur",
    numberOfEnrollments: 100,
    courseImageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCViFCnLqddCN7uHZrEQ1u20IOBbAzvM4JA&s",
    courseDescriptionSections: [
        {
            header: "What you'll learn",
            content: `
* Learn HTML, CSS, Flexbox, CSS Grid, and Bootstrap 5
* Build responsive websites from scratch
* Learn JavaScript, ES6, and DOM manipulation
* Build full-stack web applications with Node.js, Express, and MongoDB
* Learn React, React Hooks, and Web Design
* Learn Blockchain technology and Web3 development on the Internet Computer
* Build NFT minting, buying, and selling logic
* Learn how to deploy your websites online
* Learn how to use Git, GitHub, and command line
* Learn how to create your own APIs
* Learn how to use SQL and PostgreSQL
* Learn how to use authentication and security
* Learn how to use React Hooks
* Learn how to use Web3 development on the Internet Computer
* Learn how to use Blockchain technology
* Learn how to use Token contract development`
        },
        {
            header: "Description",
            content: `
* Learn full-stack web development with HTML, CSS, Bootstrap, JavaScript, jQuery, Node.js, MongoDB, Express, and React
* Learn how to build websites from scratch
* Learn how to build apps from scratch
* Learn how to build full-stack web applications
* Learn how to build full-stack web applications with Node.js, Express, and MongoDB`
        },
        {
            header: "Requirements",
            content: `
* No programming experience needed - I'll teach you everything you need to know
* A computer with access to the internet
* No paid software required
* I'll walk you through, step-by-step how to get all the software installed and set up` 
        },
        {
            header: "Pre-requisites",
            content: `
* No programming experience needed - I'll teach you everything you need to know
* A computer with access to the internet
* No paid software required
* I'll walk you through, step-by-step how to get all the software installed and set up` 
        }
    ],
    relatedTopics: [{name: "Web Development", link: "#"}, {name: "Development", link: "#"}],
    content: [
        {
            sectionName: "Introduction",
            videos: [
                {name: "Lorem ipsum dolor sit amet amet amet amet amet amet amet amet amet amet amet consectetur adipisicing elit. Nisi, quasi? Laboriosam consequuntur Lorem ipsum dolor sit amet amet amet amet amet amet amet amet amet amet amet consectetur adipisicing elit. Nisi, quasi? Laboriosam consequuntur", duration: "03:08", visibility:true, link: "", coverImageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCViFCnLqddCN7uHZrEQ1u20IOBbAzvM4JA&s"}, {name: "This is what you will get", duration: "03:08", visibility:false, link: "", coverImageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCViFCnLqddCN7uHZrEQ1u20IOBbAzvM4JA&s"}]
        },
        {
            sectionName: "Start",
            videos: [{name: "This is what you will get", duration: "03:08", visibility:true, link: "", coverImageLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCViFCnLqddCN7uHZrEQ1u20IOBbAzvM4JA&s"}, {name: "This is what you will get", duration: "03:08", visibility:false, link: ""}]
        },
    ],
    linkToInstructor: "link:to:instr",
    linkToInstructorAvatar: "link:to:instr:avatar",
    instructorName: "Angela Yu",
    isFree: false
}

export default function CoursePage() {
    return (
        <>
            <NavBar
                user={{
                fname: "Ariana", lname: "Grande",
                avatarUrl: "https://static.vecteezy.com/system/resources/thumbnails/041/880/991/small_2x/ai-generated-pic-artistic-depiction-of-sunflowers-under-a-vast-cloudy-sky-photo.jpg"
                }}
            />
            <div className="h-full w-full">
                <CourseDetails courseName={data.name}
                    shortDescription={data.shortDescription}
                    courseImageLink={data.courseImageLink}
                    numberOfEnrollments={data.numberOfEnrollments}
                    courseDescriptionSections={data.courseDescriptionSections}
                    relatedTopics={data.relatedTopics}
                    content={data.content}
                    linkToInstructorPage={data.linkToInstructor}
                    // linkToInstructorAvatar={data.linkToInstructorAvatar}
                    instructorName={data.instructorName}
                    isFree={data.isFree}
                />
            </div>
            <Footer />
        </>
    )
}