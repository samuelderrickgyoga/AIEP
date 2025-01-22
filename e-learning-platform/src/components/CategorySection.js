import React, { useState } from 'react';
import axios from 'axios';

const CategorySection = ({ categories }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async (category_id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/courses/${category_id}`);
            setCourses(response.data);
            setSelectedCategory(category_id);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg">
                <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">
                    Explore Categories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.id} className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <img src={category.image} alt={category.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 group-hover:ring-blue-200" />
                                    <span className="absolute -bottom-2 -right-2 text-3xl">{category.icon}</span>
                                </div>
                                <h4 className="text-xl font-bold text-blue-600 mb-3 group-hover:text-blue-700">{category.name}</h4>
                                <p className="text-gray-600 text-center leading-relaxed">{category.description}</p>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button 
                                    onClick={() => fetchCourses(category.id)}
                                    className="text-blue-500 group-hover:text-blue-600 font-medium inline-flex items-center"
                                >
                                    Explore Courses
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Fancy Course Display Section */}
            {selectedCategory && (
                <section className="mt-8 bg-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8">
                        Available Courses
                        {loading && <span className="ml-4 inline-block animate-spin">⚡</span>}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.course_id} className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg">
                                    {course.difficulty}
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{course.course_name}</h4>
                                    <p className="text-gray-600 mb-4">{course.features}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{course.content_type}</span>
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-gray-700">{course.rating}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                            Start Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default CategorySection;
