import React, { useState, useEffect } from 'react';

const CMSDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [about, setAbout] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    organization: '',
    duration: ''
  });
  
  const [newExperience, setNewExperience] = useState({
    year: '',
    title: '',
    subtitle: '',
    description: '',
    details: ''
  });
  
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'https://portfolio-cms-ncqv.onrender.com';//'http://localhost:5001'; 
  const ENDPOINTS = {
    projects: `${API_BASE}/projects`,
    experiences: `${API_BASE}/experiences`,
    about: `${API_BASE}/about`
  };

  useEffect(() => {
    fetchProjects();
    fetchExperiences();
    fetchAbout();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.projects);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      console.log(data);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    try {
      setLoading(true);
      if (editingProject) {
        const response = await fetch(`${ENDPOINTS.projects}/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });
        if (!response.ok) throw new Error('Failed to update project');
      } else {
        const response = await fetch(ENDPOINTS.projects, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });
        if (!response.ok) throw new Error('Failed to add project');
      }
      fetchProjects(); 
      setEditingProject(null);
      setNewProject({ title: '', description: '', organization: '', duration: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINTS.projects}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete project');
      fetchProjects(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.experiences);
      if (!response.ok) throw new Error('Failed to fetch experiences');
      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async () => {
    try {
      setLoading(true);
      if (editingExperience) {
        const response = await fetch(`${ENDPOINTS.experiences}/${editingExperience.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExperience)
        });
        if (!response.ok) throw new Error('Failed to update experience');
      } else {
        const response = await fetch(ENDPOINTS.experiences, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExperience)
        });
        if (!response.ok) throw new Error('Failed to add experience');
      }
      fetchExperiences();
      setEditingExperience(null);
      setNewExperience({ year: '', title: '', subtitle: '', description: '', details: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINTS.experiences}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete experience');
      fetchExperiences();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.about);
      if (!response.ok) throw new Error('Failed to fetch about');
      const data = await response.json();
      setAbout(data.content); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.about, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: about })
      });
      if (!response.ok) throw new Error('Failed to update about');
      setEditingAbout(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
        <button 
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setError(null)}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Management System</h1>
      
      <div className="flex gap-4 mb-6 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'projects' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'experiences' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('experiences')}
        >
          Experiences
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={newProject.title}
              onChange={e => setNewProject({...newProject, title: e.target.value})}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
            <input
              type="text"
              placeholder="Organization"
              className="w-full p-2 border rounded"
              value={newProject.organization}
              onChange={e => setNewProject({...newProject, organization: e.target.value})}
            />
            <input
              type="text"
              placeholder="Duration"
              className="w-full p-2 border rounded"
              value={newProject.duration}
              onChange={e => setNewProject({...newProject, duration: e.target.value})}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addProject}
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
          </div>

          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.organization}</p>
                    <p className="text-sm text-gray-600">{project.duration}</p>
                    <p className="mt-2">{project.description}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        setEditingProject(project);
                        setNewProject(project);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <input
              type="text"
              placeholder="Year"
              className="w-full p-2 border rounded"
              value={newExperience.year}
              onChange={e => setNewExperience({...newExperience, year: e.target.value})}
            />
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={newExperience.title}
              onChange={e => setNewExperience({...newExperience, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Subtitle"
              className="w-full p-2 border rounded"
              value={newExperience.subtitle}
              onChange={e => setNewExperience({...newExperience, subtitle: e.target.value})}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={newExperience.description}
              onChange={e => setNewExperience({...newExperience, description: e.target.value})}
            />
            <textarea
              placeholder="Details"
              className="w-full p-2 border rounded"
              value={newExperience.details}
              onChange={e => setNewExperience({...newExperience, details: e.target.value})}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addExperience}
            >
              {editingExperience ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>

          <div className="space-y-4">
            {experiences.map(experience => (
              <div key={experience.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{experience.title}</h3>
                    <p className="text-sm text-gray-600">{experience.year}</p>
                    <p className="text-sm text-gray-600">{experience.subtitle}</p>
                    <p className="mt-2">{experience.description}</p>
                    <p className="mt-2 text-sm">{experience.details}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        setEditingExperience(experience);
                        setNewExperience(experience);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteExperience(experience.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'about' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {editingAbout ? (
            <div className="space-y-4">
              <textarea
                value={about}
                onChange={e => setAbout(e.target.value)}
                className="w-full p-2 border rounded min-h-[200px]"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={updateAbout}
              >
                Save About
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="min-h-[100px]">{about}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setEditingAbout(true)}
              >
                Edit About
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSDashboard;