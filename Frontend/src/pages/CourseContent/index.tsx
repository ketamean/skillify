import React from "react";
import { FaPlay, FaXTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function CourseContentPage() {
  const courseData = {
    title: "How to Create an Online Course: The Official Udemy Course",
    description:
      "rickrolled",
    rating: 4.6,
    students: 227156,
    duration: "1.5 hours",
    lastUpdated: "January 2022",
    skillLevel: "Beginner Level",
    languages: "English",
    captions: "Yes",
    lectures: 32,
    fullDescription:"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla",
    sections: [
      { title: "Introduction", lessons: 4, duration: "9min" },
      { title: "Getting Started", lessons: 3, duration: "7min" },
      { title: "Structure Your Course", lessons: 7, duration: "18min" },
      { title: "Create Your Content", lessons: 10, duration: "32min" },
      { title: "Launch Your Course", lessons: 4, duration: "13min" },
      { title: "What's next?", lessons: 4, duration: "9min" },
    ],
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-900 text-white p-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-purple-400">Skillify</span>
          <span className="text-sm">{courseData.title}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm">Leave a rating</button>
          <div className="w-6 h-6 border rounded-full border-gray-400"></div>
          <button className="text-sm">Your progress ▼</button>
          <button className="bg-gray-700 px-3 py-1 rounded">Share</button>
          <button className="text-lg">⋮</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-2/3 p-6 text-black">
          <div className="relative w-full aspect-video flex items-center">
            <button className="absolute left-0 bg-gray-700 text-white px-3 py-2 rounded-l">❮ Prev</button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="absolute right-0 bg-gray-700 text-white px-3 py-2 rounded-r">Next ❯</button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center justify-around mt-4 border-b text-black">
            <button className="px-4 py-2 text-gray-700 hover:text-purple-600"><FaSearch /></button>
            {["Overview", "Notes", "Announcements", "Reviews", "Learning Tools"].map((tab) => (
              <button key={tab} className="px-4 py-2 text-gray-700 hover:text-purple-600">{tab}</button>
            ))}
          </div>
          <h3 className="mt-2 text-black">{courseData.description}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-700 text-black border-b pb-4">
            ⭐ {courseData.rating} ({courseData.students} students) | {courseData.duration} | Last updated: {courseData.lastUpdated}
          </div>

          {/* Additional Course Details */}
          <div className="mt-2 pt-2 pb-2 text-black border-b">
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600 text-black">
            <h3 className="text-lg font-semibold text-black">By the numbers</h3>
              <div>
                <p><strong>Skill level:</strong> {courseData.skillLevel}</p>
                <p><strong>Students:</strong> {courseData.students}</p>
                <p><strong>Languages:</strong> {courseData.languages}</p>
                <p><strong>Captions:</strong> {courseData.captions}</p>
              </div>
              <div>
                <p><strong>Lectures:</strong> {courseData.lectures}</p>
                <p><strong>Video:</strong> {courseData.duration} total hours</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black border-b">
            <h3 className="text-lg font-semibold mt-2 text-black">Features</h3>
            <p className="text-sm text-gray-600 mt-2 text-black">Available on iOS and Android</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black border-b">
            <h3 className="text-lg font-semibold mt-2 col-span-1 text-black">Description</h3>
            <p className="text-sm text-gray-600 mt-2 text-black col-span-2" dangerouslySetInnerHTML={{ __html: courseData.fullDescription.replace(/\n/g, '<br/>') }}></p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black">
            <h3 className="text-lg font-semibold mt-4">Instructor</h3>
            <div>
            <button className="text-sm text-gray-600 text-black ">Udemy Instructor Team - Official Udemy Instructor Account</button>
            <div className="flex space-x-4 mt-2">
              <button className="text-gray-600"><FaXTwitter size={20} /></button>
              <button className="text-gray-600"><FaFacebook size={20} /></button>
              <button className="text-gray-600"><FaLinkedin size={20} /></button>
              <button className="text-gray-600"><FaLink size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 text-black">The Udemy Instructor Team has one passion: Udemy's instructors! We'll work with you to help you create an online course—along the way, we'll also help you become an integral member of the Udemy community, a promotional whiz, a teaching star, and an all-around amazing instructor. We're excited to help you succeed on Udemy!</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/3 p-4 text-black sticky top-0 self-start border-l h-screen">
        <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Course content</h3>
            <button className="text-xl">✕</button>
          </div>
          {courseData.sections.map((section, index) => (
            <div key={index} className="mt-2 border-b pb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Section {index + 1}: {section.title}</h3>
                <button className="text-xl">▼</button>
              </div>
              <p className="text-sm text-gray-600">0 / {section.lessons} | {section.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}