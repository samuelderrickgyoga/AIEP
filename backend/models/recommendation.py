from sklearn.metrics.pairwise import cosine_similarity

def recommend_courses(student_id, num_recommendations=3):
    # Filter engagement for the given student
    student_engagement = engagement[engagement['student_id'] == student_id]
    interacted_courses = student_engagement['course_id'].unique()

    # Calculate course similarities
    course_features = courses[['course_id', 'content_type', 'rating']].set_index('course_id')
    course_features_encoded = pd.get_dummies(course_features)
    course_similarity = cosine_similarity(course_features_encoded)
    
    # Recommend courses not yet interacted with
    recommendations = []
    for course_id in course_features_encoded.index:
        if course_id not in interacted_courses:
            score = course_similarity[course_id].sum()
            recommendations.append((course_id, score))
    
    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)
    return [course_id for course_id, _ in recommendations[:num_recommendations]]
