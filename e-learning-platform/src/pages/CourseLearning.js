// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { FiMonitor, FiCode, FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

// const CourseLearning = () => {
//   const { courseId } = useParams();
//   const [activeTab, setActiveTab] = useState('learn'); // learn, practice, test

//   const tabs = [
//     { id: 'learn', label: 'Learn', icon: FiMonitor },
//     { id: 'practice', label: 'Practice', icon: FiCode },
//     { id: 'test', label: 'Test', icon: FiCheckCircle }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="w-64 bg-white h-screen fixed left-0 border-r">
//           <div className="p-4 border-b">
//             <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
//           </div>
//           <div className="overflow-y-auto h-full pb-20">
//             <div className="p-4">
//               <div className="space-y-2">
//                 {/* Course chapters */}
//                 {Array.from({ length: 10 }, (_, i) => (
//                   <button
//                     key={i}
//                     className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
//                   >
//                     Chapter {i + 1}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="ml-64 flex-1">
//           {/* Top navigation */}
//           <div className="bg-white border-b">
//             <div className="flex justify-between items-center px-6 py-4">
//               <div className="flex space-x-4">
//                 {tabs.map(tab => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
//                       activeTab === tab.id 
//                         ? 'bg-blue-100 text-blue-600' 
//                         : 'text-gray-600 hover:bg-gray-100'
//                     }`}
//                   >
//                     <tab.icon className="w-5 h-5" />
//                     <span>{tab.label}</span>
//                   </button>
//                 ))}
//               </div>
//               <div className="flex space-x-2">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <FiArrowLeft className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <FiArrowRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Content area */}
//           <div className="p-8">
//             <div className="max-w-3xl mx-auto">
//               <h1 className="text-3xl font-bold text-gray-800 mb-6">Introduction to HTML</h1>
              
//               <div className="prose max-w-none">
//                 <p className="text-lg text-gray-600 mb-4">
//                   HTML is the standard markup language for creating Web pages.
//                 </p>

//                 <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
//                   <h2 className="text-xl font-semibold mb-4">Example</h2>
//                   <div className="bg-gray-800 text-white p-4 rounded-lg font-mono">
//                     <pre>{`<!DOCTYPE html>
// <html>
// <head>
// <title>Page Title</title>
// </head>
// <body>

// <h1>My First Heading</h1>
// <p>My first paragraph.</p>

// </body>
// </html>`}</pre>
//                   </div>
//                   <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//                     Try it Yourself
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <h2 className="text-2xl font-bold">HTML Elements</h2>
//                   <p>HTML elements are represented by tags:</p>
//                   <ul className="list-disc pl-6">
//                     <li>Start tag to end tag</li>
//                     <li>Some elements have empty content</li>
//                     <li>Empty elements are closed in the start tag</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseLearning;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMonitor, FiCode, FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { dummyCourses } from '../data/DummyCourses';

const CourseLearning = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('learn');
  const [courseData, setCourseData] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  const courseChapters = [
    {
      title: "Getting Started",
      content: "Introduction to the basics and setup instructions.",
      examples: ["Example 1", "Example 2"],
      practice: ["Practice Exercise 1", "Practice Exercise 2"]
    },
    {
      title: "Core Concepts",
      content: "Understanding fundamental principles and key concepts.",
      examples: ["Example 3", "Example 4"],
      practice: ["Practice Exercise 3", "Practice Exercise 4"]
    },
    // Add more chapters as needed
  ];

  useEffect(() => {
    // Find the course from dummy data
    const course = dummyCourses.recommendations.find(
      course => course.course_id.toString() === courseId
    );
    setCourseData(course);
  }, [courseId]);

  const tabs = [
    { id: 'learn', label: 'Learn', icon: FiMonitor },
    { id: 'practice', label: 'Practice', icon: FiCode },
    { id: 'test', label: 'Test', icon: FiCheckCircle }
  ];

  const renderContent = () => {
    const chapter = courseChapters[currentChapter];
    
    switch (activeTab) {
      case 'learn':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{chapter.title}</h2>
            <p className="text-lg text-gray-600">{chapter.content}</p>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Examples</h3>
              {chapter.examples.map((example, index) => (
                <div key={index} className="mb-4">
                  <p>{example}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'practice':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Practice Exercises</h2>
            {chapter.practice.map((exercise, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Exercise {index + 1}</h3>
                <p>{exercise}</p>
              </div>
            ))}
          </div>
        );
      case 'test':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Chapter Test</h2>
            <p>Test your knowledge of {chapter.title}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen fixed left-0 border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">{courseData.course_name}</h2>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <div className="p-4">
              <div className="space-y-2">
                {courseChapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChapter(index)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      currentChapter === index ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area remains the same but uses dynamic content */}
        <div className="ml-64 flex-1">
          <div className="bg-white border-b">
            {/* Your existing navigation code */}
          </div>
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
