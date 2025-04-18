import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { axiosForm } from "../../config/axios";
import { supabase } from "../../supabaseClient";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar
        user={{
          fname: "Ariana",
          lname: "Grande",
          avatarUrl:
            "https://static.vecteezy.com/system/resources/thumbnails/041/880/991/small_2x/ai-generated-pic-artistic-depiction-of-sunflowers-under-a-vast-cloudy-sky-photo.jpg",
        }}
      />

      <main className="container mx-auto mt-8 px-[4%] pb-12">
        <div className="mb-8">
          <h1 className="text-deepteal text-3xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mb-6">
            {searchResults.length} courses found
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No courses found</h2>
              <p className="text-gray-600 mb-6">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
