import React from 'react';
import { FiUsers, FiBook, FiAward, FiTarget } from 'react-icons/fi';
import Layout from '../components/Layout';

const AboutUs = () => {
  const stats = [
    { icon: FiUsers, count: '10,000+', label: 'Active Students' },
    { icon: FiBook, count: '500+', label: 'Courses' },
    { icon: FiAward, count: '50+', label: 'Expert Instructors' },
    { icon: FiTarget, count: '95%', label: 'Success Rate' }
  ];

  const teamMembers = [
    {
      name: 'Sirajje K',
      role: 'Founder & CEO',
      image: '/images/photo_2024-03-16_22-52-00.jpg',
      bio: 'Educational technology expert with 15 years of experience'
    },
    {
      name: 'Dero Samy',
      role: 'Head of Education',
      image: '/images/WhatsApp Image 2025-01-16 at 10.21.08_074de606.jpg',
      bio: 'Former university professor passionate about online learning'
    },
    {
      name: 'Taby Alupo',
      role: 'Technical Director',
      image: '/images/WhatsApp Image 2025-01-16 at 10.20.40_7855e0ed.jpg',
      bio: 'Software architect specialized in educational platforms'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-6">
              Transforming Education Through Technology
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to everyone, everywhere.
              Our platform combines cutting-edge technology with expert instruction to deliver
              an unmatched learning experience.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900">{stat.count}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4">
                  We believe that education is a fundamental right, not a privilege. Our platform
                  is designed to break down barriers to learning and create opportunities for
                  everyone to achieve their full potential.
                </p>
                <p className="text-lg text-gray-600">
                  Through innovative technology and partnerships with industry experts, we're
                  building a future where quality education is accessible, engaging, and effective.
                </p>
              </div>
              <div className="bg-blue-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What Sets Us Apart</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Personalized Learning Paths
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Industry-Leading Instructors
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Interactive Learning Experience
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Career-Focused Curriculum
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
