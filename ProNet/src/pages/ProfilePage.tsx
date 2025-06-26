import React, { useEffect, useRef, useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { db } from '../firebase/config';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  photoBase64?: string;
}

export default function ProfilePage() {
  const currentUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    handle: '',
    bio: '',
    photoBase64: '',
  });

  const [connectionCount, setConnectionCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<string[]>([]); // Placeholder for future posts

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data() as ProfileData;

      setProfile({
        name: userData?.name || '',
        handle: userData?.handle || '',
        bio: userData?.bio || '',
        photoBase64: userData?.photoBase64 || '',
      });

      const connSnap = await getDocs(
        collection(db, 'users', currentUser.uid, 'connections')
      );
      setConnectionCount(connSnap.size);
      setUserPosts([]);
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentUser) return;

    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: profile.name,
      handle: profile.handle,
      bio: profile.bio,
    });

    setUser({ ...currentUser, name: profile.name });
    setEditMode(false);
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !currentUser) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;

      await updateDoc(doc(db, 'users', currentUser.uid), {
        photoBase64: base64String,
      });

      setProfile((prev) => ({ ...prev, photoBase64: base64String }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    if (!currentUser) return;

    await updateDoc(doc(db, 'users', currentUser.uid), {
      photoBase64: '',
    });

    setProfile((prev) => ({ ...prev, photoBase64: '' }));
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="relative group">
          <img
            src={
              profile.photoBase64 ||
              'https://placehold.co/150x150/8B5CF6/FFFFFF?text=You'
            }
            alt="Profile"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-gray-800 -mt-16 md:-mt-20 shadow-lg object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity cursor-pointer">
            <button
              className="text-white text-xs font-semibold bg-black bg-opacity-50 px-2 py-1 rounded"
              onClick={handleProfilePicClick}
            >
              Change
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left w-full">
          {editMode ? (
            <>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="block w-full text-2xl font-bold bg-transparent border-b focus:outline-none"
              />
              <input
                name="handle"
                value={profile.handle}
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 bg-transparent border-b focus:outline-none"
              />
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="mt-2 w-full bg-transparent border p-2 rounded"
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                @{profile.handle || 'not_set'}
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {profile.bio || 'No bio yet.'}
              </p>
            </>
          )}

          <div className="mt-4 flex justify-center md:justify-start space-x-6 text-center">
            <div>
              <p className="text-xl font-bold">{userPosts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold">{connectionCount}</p>
              <p className="text-sm text-gray-500">Connections</p>
            </div>
            <div>
              <p className="text-xl font-bold">543</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            )}

            {profile.photoBase64 && (
              <button
                onClick={handleRemovePhoto}
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Your Posts</h3>
        {userPosts.length === 0 ? (
          <p className="text-gray-500">You haven’t posted anything yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {userPosts.map((postSrc, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  src={postSrc}
                  alt={`User post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
