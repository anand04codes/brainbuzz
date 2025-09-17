import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Profile() {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    location: '',
    birthday: '',
    summary: '',
    linkedin: '',
    github: '',
    website: '',
    education: '',
    skills: '',
    photoURL: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate('/login');
    }
  }, [user, loadingAuth, navigate]);

  // Load user profile data when user logs in
  useEffect(() => {
    if (user && !loadingAuth) {
      const userKey = `userProfile_${user.uid}`;
      try {
        const storedProfile = localStorage.getItem(userKey);
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          setFormData(profileData);
          console.log('Profile: Loaded saved data for user', user.uid);
        } else {
          console.log('Profile: No saved data found for user', user.uid);
        }
      } catch (error) {
        console.error('Profile: Error loading saved data:', error);
      }
      setLoadingProfile(false);
    }
  }, [user, loadingAuth]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Convert file to base64 for local display + storage
    if (selectedFile && user) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedData = { ...formData, photoURL: event.target.result };
        setFormData(updatedData);
        // Save to user-specific localStorage
        const userKey = `userProfile_${user.uid}`;
        localStorage.setItem(userKey, JSON.stringify(updatedData));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save to user-specific localStorage
      const userKey = `userProfile_${user.uid}`;
      localStorage.setItem(userKey, JSON.stringify(formData));

      // Create/update user-specific JSON file (only once per user)
      const userId = user?.uid || user?.email || 'anonymous';
      const fileName = `profile_${userId}.json`;

      // Check if file already exists for this user
      const existingFile = localStorage.getItem(`fileCreated_${userId}`);
      if (!existingFile) {
        // Download JSON file only once
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        // Mark file as created for this user
        localStorage.setItem(`fileCreated_${userId}`, 'true');
        setMessage(`✅ Profile data saved and ${fileName} created.`);
      } else {
        setMessage(`✅ Profile data saved locally.`);
      }

      // Dispatch custom event to update navbar immediately
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error) {
      console.error("Error saving profile locally:", error);
      setMessage(`❌ Failed to save locally: ${error.message}`);
    }
  };

  if (loadingAuth || loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">🔄 Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">👤 Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" onChange={handleFileChange} className="w-full" />
          <input name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="Full Name" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="location" value={formData.location} onChange={handleChange} className="input" placeholder="Location" />
          <input name="birthday" value={formData.birthday} onChange={handleChange} type="date" className="input" />
          <textarea name="summary" value={formData.summary} onChange={handleChange} className="input" placeholder="Short Summary" />
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="input" placeholder="LinkedIn URL" />
          <input name="github" value={formData.github} onChange={handleChange} className="input" placeholder="GitHub URL" />
          <input name="website" value={formData.website} onChange={handleChange} className="input" placeholder="Personal Website URL" />
          <textarea name="education" value={formData.education} onChange={handleChange} className="input" placeholder="Work / Education" />
          <input name="skills" value={formData.skills} onChange={handleChange} className="input" placeholder="Technical Skills (comma separated)" />
          <button type="submit" className="btn w-full bg-[var(--primary)] hover:bg-[#10b981]">Save Profile</button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export default Profile;
