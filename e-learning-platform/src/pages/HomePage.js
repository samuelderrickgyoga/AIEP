import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import CourseList from '../components/CourseList';

const categories = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Build modern and responsive websites.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '🌐'
  },
  {
    id: 2,
    name: 'Mobile Development',
    description: 'Create apps for Android and iOS platforms.',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '📱'
  },
  {
    id: 3,
    name: 'Database Management',
    description: 'Master database design and SQL.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '🗄️'
  },
  {
    id: 4,
    name: 'Desktop Applications',
    description: 'Develop software for desktop environments.',
    image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '💻'
  },
  {
    id: 5,
    name: 'Programming Languages',
    description: 'Learn Python, Java, C++, and more.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '⌨️'
  },
  {
    id: 6,
    name: 'Artificial Intelligence',
    description: 'Learn AI, Machine learning, and more.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    icon: '🤖'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Bob K',
    role: 'Web Developer',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    testimony: 'Phoenix has transformed the way I learn. The courses are easy to follow and very engaging! I went from beginner to professional in just 6 months.',
  },
  {
    id: 2,
    name: 'Dero Samy',
    role: 'Mobile Developer',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    testimony: 'The instructors are world-class and the community support is amazing. I landed my dream job thanks to the skills I gained here.',
  },
  {
    id: 3,
    name: 'Taby Alupo',
    role: 'Data Scientist',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    testimony: 'The project-based learning approach made complex concepts easy to grasp. Phoenix is definitely worth every penny!',
  },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-lg">
  <div className="container mx-auto flex justify-between items-center py-4 px-6">
    {/* Platform Name */}
    <div className="flex items-center space-x-2">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h1 className="text-2xl text-blue-600 font-bold tracking-tight">Phoenix</h1>
    </div>

    {/* Search Bar */}
    <div className="hidden md:flex items-center flex-1 max-w-md mx-12">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 pl-10"
        />
        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Nav Links */}
    <div className="flex items-center space-x-8">
      <Link to="/" className="nav-link text-gray-700 hover:text-blue-600">
        Home
      </Link>
      <Link to="/about" className="nav-link text-gray-700 hover:text-blue-600">
        About
      </Link>
      <Link to="/courses" className="nav-link text-gray-700 hover:text-blue-600">
        Courses
      </Link>
      <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
        Register
      </Link>
    </div>
  </div>

  <style jsx>{`
    .nav-link {
      position: relative;
      padding: 0.5rem 0;
      font-weight: 500;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #2563eb;
      transition: width 0.3s ease-in-out;
    }
    .nav-link:hover::after {
      width: 100%;
    }
  `}</style>
</nav>


      <header className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
  {/* Background Image with Overlay */}
  <div 
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Enhanced overlay with darker gradient for better text visibility */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/65 to-cyan-900/65 backdrop-blur-sm"></div>
  </div>

  {/* Content with enhanced text visibility */}
  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in text-white drop-shadow-lg">
        Empower Your Learning Journey
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white font-medium drop-shadow-md">
        Join Phoenix today and unlock a world of possibilities. Access hundreds of expert-led courses, 
        gain hands-on experience, and connect with a global community of learners.
      </p>
      
      <p className="text-lg mb-12 text-white font-medium tracking-wide drop-shadow-md">
        🚀 Learn at your pace | 💡 Industry-relevant skills | 🏆 Earn certificates
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:space-x-6">
        <Link
          to="/register"
          className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:from-yellow-500 hover:to-yellow-600 transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Start Learning Now
        </Link>
        
        <button
          className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/30 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
        >
          Try 7 Days Free
        </button>
      </div>

      <div className="mt-16 flex items-center justify-center space-x-12 text-white">
        <div className="text-center backdrop-blur-sm bg-white/10 px-8 py-4 rounded-2xl">
          <div className="font-bold text-3xl drop-shadow-md">500+</div>
          <div className="text-sm font-medium mt-1">Courses</div>
        </div>
        <div className="text-center backdrop-blur-sm bg-white/10 px-8 py-4 rounded-2xl">
          <div className="font-bold text-3xl drop-shadow-md">50k+</div>
          <div className="text-sm font-medium mt-1">Students</div>
        </div>
        <div className="text-center backdrop-blur-sm bg-white/10 px-8 py-4 rounded-2xl">
          <div className="font-bold text-3xl drop-shadow-md">100+</div>
          <div className="text-sm font-medium mt-1">Instructors</div>
        </div>
      </div>
    </div>
  </div>
</header>



      {/* Sections */}
      <main className="container mx-auto py-12 space-y-12">
        {/* Categories Section */}
        <section className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg">
  <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">
    Explore Categories
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {categories.map((category) => (
      <div
        key={category.id}
        className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
        onClick={() => setSelectedCategory(category.id)}
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 group-hover:ring-blue-200"
            />
            <span className="absolute -bottom-2 -right-2 text-3xl">
              {category.icon}
            </span>
          </div>
          <h4 className="text-xl font-bold text-blue-600 mb-3 group-hover:text-blue-700">
            {category.name}
          </h4>
          <p className="text-gray-600 text-center leading-relaxed">
            {category.description}
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <span className="text-blue-500 group-hover:text-blue-600 font-medium inline-flex items-center">
            Explore Courses
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* Course List Section */}
        {selectedCategory && (
          <section className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-3xl font-bold text-gray-700 mb-4 text-center">Courses</h3>
            <CourseList categoryId={selectedCategory} />
          </section>
        )}

       {/* Testimonials Section */}
<section className="bg-gradient-to-b from-gray-50 to-gray-100 p-12 rounded-xl">
  <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">
    What Our Students Say
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {testimonials.map((testimonial) => (
      <div 
        key={testimonial.id}
        className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center"
      >
        <div className="relative mb-6">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
            </svg>
          </div>
        </div>
        <p className="text-gray-600 text-center mb-6 italic">
          "{testimonial.testimony}"
        </p>
        <div className="mt-auto">
          <h4 className="font-bold text-xl text-blue-600">{testimonial.name}</h4>
          <p className="text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* Registration Link Section */}
        <section className="bg-white p-6 shadow-md rounded-md text-center">
          <h3 className="text-3xl font-bold text-gray-700 mb-4">Ready to Join?</h3>
          <Link
            to="/register"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Register Now
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
