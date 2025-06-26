import React from 'react';

const HomePage = () => {
    const posts = [
        { id: 1, user: 'Elena Voyager', handle: 'elenavoyager', time: '2h', content: 'Just finished a 10km hike through the mountains! The view from the top was absolutely breathtaking. 🏔️ #hiking #nature #adventure', avatar: 'https://placehold.co/100x100/A855F7/FFFFFF?text=EV' },
        { id: 2, user: 'Marcus Greene', handle: 'marcusg', time: '5h', content: 'My new article on the future of sustainable architecture is live! Check it out and let me know your thoughts. Link in bio. 📝 #sustainability #architexture', avatar: 'https://placehold.co/100x100/22C55E/FFFFFF?text=MG' },
        { id: 3, user: 'Aisha Khan', handle: 'aishacodes', time: '1d', content: 'After weeks of work, I finally deployed my new portfolio website built with React and Three.js. So proud of how it turned out! ✨ #webdev #reactjs #threejs', avatar: 'https://placehold.co/100x100/F97316/FFFFFF?text=AK' },
    ];

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
             <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Recent Posts from Connections</h2>
             <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-start">
                             <img src={post.avatar} alt={post.user} className="w-12 h-12 rounded-full mr-4"/>
                             <div className="flex-1">
                                <div className="flex items-baseline space-x-2">
                                    <p className="font-bold text-gray-900 dark:text-white">{post.user}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">@{post.handle} · {post.time}</p>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{post.content}</p>
                             </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default HomePage;