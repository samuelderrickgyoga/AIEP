import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChapterPage = () => {
    const { courseId, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}`);
                setChapter(response.data);
            } catch (error) {
                console.error('Error fetching chapter:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [courseId, chapterId]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">Course Contents</h2>
                    {/* Chapter list goes here */}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{chapter?.title}</h1>
                        
                        {/* Chapter Content */}
                        <div className="prose prose-blue max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: chapter?.content }} />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-12">
                            <button 
                                onClick={() => navigate(`/course/${courseId}/chapter/${parseInt(chapterId) - 1}`)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={chapter?.isFirst}
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => navigate(`/course/${courseId}/chapter/${parseInt(chapterId) + 1}`)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={chapter?.isLast}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterPage;
