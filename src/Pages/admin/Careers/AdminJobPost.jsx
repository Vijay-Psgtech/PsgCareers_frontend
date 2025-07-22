import React, { useState,useEffect,useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate,useParams } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Select from 'react-select'

export default function JobPostingForm() {
  const [isformVaild,setIsFormValid] = useState(true);
 
  const [jobTitle,setJobTitle] = useState("");
  const [locationOptions,setLocationOptions]  = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [institutionOptions,setInstitutionOptions] = useState([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState(null);
  const [department,setDepartment] = useState('');
  const [jobCategory, setJobCategory] = useState("");
  const [designation,setDesignation] = useState('');
  const [grade,setGrade] = useState('');
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedHiringType, setSelectedHiringType] = useState(null);
  const [numberOfOpenings,setNumberOfOpenings] = useState('1');
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCtcOptions, setSelectedCtcOptions] = useState(null);
  const [selectedCtcMin, setSelectedCtcMin] = useState(null);
  const [selectedCtcMax, setSelectedCtcMax] = useState(null);
  const [experienceMin,setExperienceMin] = useState('');
  const [experienceMax,setExperienceMax] = useState('');
  const [skills,setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills,setSuggestedSkills] = useState([]);
  
  const navigate = useNavigate();
  const {auth} = useAuth();
  const quillRef = useRef(null);
  const { jobId } = useParams();

  const jobTitleSkillsMap = {
    'web developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node', 'Php'],
    'HR' : ['Talent acqusition','Strong interpersonal skills','Communication Skills'],
    'Professor': ['passion for teaching', 'research work', 'written and oral communication skills',],
  };

  {/*--DropDown options--*/}
  const genderOptions = ["Male","Female"].map(gen=>({
    label:gen,
    value:gen
  }));
  const jobTypeOptions = [
    'Full Time', 'Internship', 'Contract', 'Part Time', 
    'Temporary', 'Seasonal', 'Volunteer'
  ].map((jbType=>({
    label:jbType,
    value:jbType
  })));
  const hiringTypeOptions = [
    'Lateral', 'Campus'
  ].map((hire=>({
    label:hire,
    value:hire
  })));
  const ctcOptions = [
    'INR - Indian Rupee', 'USD - Dollar'
  ].map((ctc=>({
    label:ctc,
    value:ctc
  })));
  const ctcMinOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1) * 50000,
    label: ((i + 1) * 50000).toLocaleString(),
  }));
  const ctcMaxOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1) * 100000,
    label: ((i + 1) * 100000).toLocaleString(),
  }));

  const fetchLocations = async() =>{
    try{
      const res = await axiosInstance.get('/api/dropDown/getLocations');
      const formattedOptions = res.data.map((loc) => ({
        label: loc.name,
        value: loc.name
      }));
      setLocationOptions(formattedOptions);
    }catch(err){
      console.error("failed to fetch locations",err);
    }
  }
  const fetchInstitutions = async() => {
    try{
      const res = await axiosInstance.get('/api/dropDown/getInstitutions');
      const formattedOptions = res.data.map((inst)=>({
        label: inst.name,
        value: inst.name
      }));
      setInstitutionOptions(formattedOptions);
    } catch(err) {
      console.error("failed to fetch institutions",err);
    }
  }
  {/*--DropDown options--*/}


  useEffect(() => {
    const isValid =
      jobTitle?.trim() &&
      jobCategory?.trim() &&
      experienceMin !== null &&
      experienceMin !== undefined && experienceMin!== '';

    setIsFormValid(Boolean(isValid));
  }, [jobTitle, jobCategory, experienceMin]);
  

  const ResetSelectedForms = () =>{
    setJobTitle('');
    setDepartment('');
    setDesignation('');
    setNumberOfOpenings('1');
    setGrade('');
    setExperienceMin('');
    setExperienceMax('');
    setSelectedLocation(null);
    setSelectedGender(null);
    setSelectedCtcMin(null);
    setSelectedCtcMax(null);
    setSelectedInstitutions(null);
    setSelectedJobType(null);
    setSelectedHiringType(null);
    setSelectedCtcOptions(null);
    setSkills([]);
    setSkillInput("");
    setSuggestedSkills([]);
    setJobDescription("");
    // Reset Quill editor manually
    if (quillRef.current && quillRef.current.__quill) {
      quillRef.current.__quill.setText("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ctcMin = parseFloat(selectedCtcMin);
    const ctcMax = parseFloat(selectedCtcMax);
    const minExperience = experienceMin !== '' ? parseInt(experienceMin, 10) : null;
    const maxExperience = experienceMax !== '' ? parseInt(experienceMax, 10) : null;

    if (ctcMin && ctcMax && ctcMin > ctcMax) {
      toast.error("CTC Min cannot be greater than Max");
      return;
    }

    if (maxExperience === null || isNaN(maxExperience)) {
      toast.error("Maximum experience is required");
      return;
    }

    if (minExperience > maxExperience) {
      toast.error("Minimum experience cannot be greater than maximum experience");
      return;
    }

    if(!selectedInstitutions){
      toast.error("Select Institution");
      return;
    }
    
    const formData = {
      jobTitle,
      location:selectedLocation?.value || '',
      gender:selectedGender?.value || '',
      institution:selectedInstitutions.value,
      department,
      jobCategory,
      designation,
      grade,
      jobType:selectedJobType?.value || '',
      hiringType:selectedHiringType?.value || '',
      numberOfOpenings: parseInt(numberOfOpenings),
      jobDescription,
      ctcCurrency:selectedCtcOptions?.value || '',
      ctcMin: parseFloat(selectedCtcMin?.value || ''),
      ctcMax: parseFloat(selectedCtcMax?.value || ''),
      experienceMin: parseInt(experienceMin),
      experienceMax: parseInt(experienceMax),
      importantSkills: skills
    };

    try {
      if(jobId!==undefined && jobId!==null && jobId!==''){
        const res = await axiosInstance.put(`/api/jobPost/updateByJobId/${jobId}`, formData , {
          headers:{
            Authorization: `Bearer ${auth.token}`,
          }
        });
        toast.success("Job modified successfully");
        setTimeout(()=>{
          navigate('/admin/jobs-list');
        },1000)
      }else {
        const res = await axiosInstance.post('/api/jobPost/addJobPost', formData, {
          headers:{
            Authorization: `Bearer ${auth.token}`,
          }
        });
        toast.success("Job saved with ID: " + res.data.jobId);
      } 

      //Reset form fiels after submitting
      ResetSelectedForms();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save job posting");
    }
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const getRelevantSkills = (jobTitle) => {
    const lowerTitle = jobTitle.toLowerCase();
    for (const [title, skills] of Object.entries(jobTitleSkillsMap)) {
      if (lowerTitle.includes(title.toLowerCase())) {
        return skills;
      }
    }
    return [];
  };

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  useEffect(() => {
    if (jobId!==undefined && jobId!==null && jobId!=='') {
      axiosInstance.get(`/api/jobPost/getJobs/${jobId}`).then(res => {
        console.log('JobEdit-data',res.data);
        const job = res.data;
        setJobCategory(job.jobCategory || "");
        setJobDescription(job.jobDescription || "");
        setJobTitle(job.jobTitle || "");
        setSkills(job.importantSkills || []);
        setSelectedLocation({ label: job.location, value: job.location });
        setSelectedGender({ label: job.gender, value: job.gender });
        setSelectedInstitutions({ label: job.institution, value: job.institution });
        setSelectedJobType({ label: job.jobType, value: job.jobType });
        setSelectedHiringType({ label: job.hiringType, value: job.hiringType });
        setSelectedCtcOptions({ label: job.ctcCurrency, value: job.ctcCurrency });
        setSelectedCtcMin({ label: job.ctcMin, value: job.ctcMin });
        setSelectedCtcMax({ label: job.ctcMax, value: job.ctcMax });
        setSuggestedSkills([]);
        setSkillInput("");
        setDepartment(job.department);
        setDesignation(job.designation);
        setGrade(job.grade);
        setNumberOfOpenings(job.numberOfOpenings);
        setExperienceMin(job.experienceMin);
        setExperienceMax(job.experienceMax);
      }).catch(err => {
        console.error('Failed to fetch job:', err);
      });
        setTimeout(()=>{
          setIsFormValid(true);
        },2000);
    }
  }, [jobId]);


  useEffect(() => {
    const matchedSkills = getRelevantSkills(jobTitle);
    console.log('matchedSkills',matchedSkills);
    setSuggestedSkills(matchedSkills);
  }, [jobTitle]);

 

  useEffect(()=>{
    fetchLocations();
    fetchInstitutions();
    // react quill text-editor
    if (quillRef.current && !quillRef.current.__quill) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Enter job description...",
      });

      quill.on("text-change", () => {
        setJobDescription(quill.root.innerHTML);
      });

      // Store instance to avoid reinitializing
      quillRef.current.__quill = quill;
    }
    
  },[navigate]);

  useEffect(() => {
    // Only populate once on first load or edit
    if (quillRef.current?.__quill && jobDescription && !quillRef.current.__isPopulated) {
      quillRef.current.__quill.root.innerHTML = jobDescription;
      quillRef.current.__isPopulated = true; // Mark as done
    }
  }, [jobDescription]);
  
  return auth.role !=='superadmin' ? (  <h2 className="p-4 font-bold text-lg">Admin Job Post - Restricted Access</h2> ) : (
    <div className="p-6">
        <div className="flex flex-col mb-4 lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className='flex gap-2'>
            <h2 className="text-2xl font-semibold">Jobs</h2>
            <p className="text-xl italic mt-1">{(jobId!==undefined && jobId!==null && jobId!=='') ? 'Edit jobs' : 'Add jobs'}</p>
          </div>
          <button onClick={()=>navigate('/admin/jobs-list')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Job posted lists
          </button>
        </div>
      <div className="min-h-screen flex items-center justify-center ">
        <form onSubmit={handleSubmit} className="p-12 max-w-full bg-white rounded-lg shadow-md grid justify-center grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Job Posting</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-semibold">Job title</label>
                  <input 
                    type="text" 
                    name="jobTitle" 
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                    }}
                    placeholder="Enter title" 
                    className="border p-2 rounded w-full mt-1" 
                  />
                </div>
                <div>
                  <label className="text-lg font-semibold">Job ID</label>
                  <input 
                    placeholder="Job ID" 
                    disabled 
                    className="border p-2 rounded w-full bg-gray-100 mt-1" 
                    value={jobId}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-semibold">Location</label>
                  <Select 
                    name="location" 
                    options={locationOptions} 
                    value={selectedLocation} 
                    onChange={setSelectedLocation}
                    placeholder="Select location" 
                    className="min-h-[40px] border rounded w-full mt-1" 
                    isClearable 
                  />
                </div>
                <div> 
                  <label className="text-lg font-semibold">Gender <span className="text-gray-500">(Optional)</span></label>
                  <Select 
                    name="gender"
                    options={genderOptions}
                    value={selectedGender}
                    onChange={setSelectedGender}
                    placeholder="Select Gender"
                    className="min-h-[40px] border rounded w-full mt-1" 
                    isClearable
                  />
                    
                </div>
                
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-semibold">Institutions</label>
                  <Select
                    name="institution"
                    options={institutionOptions}
                    value={selectedInstitutions}
                    onChange={setSelectedInstitutions}
                    placeholder="Select Institution"
                    className="min-h-[40px] border rounded w-full mt-1"
                    isClearable
                  />
                </div>
                <div>
                  <label className="text-lg font-semibold">Department</label>
                  <input 
                    type="text" 
                    placeholder="Department" 
                    name="department" 
                    className="border p-2 rounded w-full mt-1"
                    value={department}
                    onChange={(e)=>setDepartment(e.target.value)}
                  />
                </div>
                
              </div>
              <div>
                <label className="text-lg font-semibold">Job Category</label>
                <div className="flex space-x-4 text-lg mt-1">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="jobCategory"
                      value="Teaching"
                      checked={jobCategory === "Teaching"}
                      onChange={(e) => {
                        setJobCategory(e.target.value);
                      }}
                      className="accent-blue-600"
                    />
                    <span>Teaching</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="jobCategory"
                      value="Non Teaching"
                      checked={jobCategory === "Non Teaching"}
                      onChange={(e) => {
                        setJobCategory(e.target.value);
                      }}
                      className="accent-blue-600"
                    />
                    <span>Non Teaching</span>
                  </label>
                </div>
              </div>
            
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-semibold">Designation <span className="text-gray-500">(Optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Designation" 
                    name="designation" 
                    className="border p-2 rounded w-full mt-1"
                    value={designation}
                    onChange={(e)=>setDesignation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-lg font-semibold">Grade <span className="text-gray-500">(Optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Grade" 
                    name="grade" 
                    className="border p-2 rounded w-full mt-1"
                    value={grade}
                    onChange={(e)=>setGrade(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-lg font-semibold">Job Type</label>
                  <Select 
                    name="jobType"
                    options={jobTypeOptions}
                    value={selectedJobType}
                    onChange={setSelectedJobType}
                    placeholder="Select Job type"
                    className="min-h-[40px] border rounded w-full mt-1" 
                    isClearable
                  />
                </div>
                <div>
                  <label className="text-lg font-semibold">Hire Type</label>
                  <Select 
                    name="hiringType"
                    options={hiringTypeOptions}
                    value={selectedHiringType}
                    onChange={setSelectedHiringType}
                    placeholder="Select Hiring type"
                    className="min-h-[40px] border rounded w-full mt-1" 
                    isClearable
                  />
                </div>
              
              </div>
              <div>
                <label className="text-lg font-semibold">No. of Openings <span className="text-gray-500">(For internal use)</span></label>
                <input 
                  name="numberOfOpenings" 
                  type="number"  
                  className="border p-2 rounded w-full mt-1" 
                  value={numberOfOpenings}
                  onChange={(e)=>setNumberOfOpenings(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Job Description and Skills */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Job Description</h2>
            <div
              ref={quillRef}
              className="bg-white border rounded h-[300px] p-2"
            />

            <div className="mt-4">
              <label className="text-lg font-semibold">CTC Details [LPA] <span className="text-gray-500">(Optional: For internal use)</span></label>
              <div className="flex gap-4 mt-2">
                <Select 
                  name="ctcCurrency" 
                  options={ctcOptions} 
                  value={selectedCtcOptions} 
                  onChange={setSelectedCtcOptions}
                  placeholder="Select Currency" 
                  className="min-h-[40px] border rounded w-full mt-1" 
                  isClearable
                />
                <Select 
                  name="ctcMin" 
                  options={ctcMinOptions} 
                  value={selectedCtcMin} 
                  onChange={(option) => setSelectedCtcMin(option)}
                  placeholder="Min" 
                  className="min-h-[40px] border rounded w-full mt-1" 
                  isClearable
                />
                <Select 
                  name="ctcMax" 
                  options={ctcMaxOptions} 
                  value={selectedCtcMax}
                  onChange={(option) => setSelectedCtcMax(option)}
                  placeholder="Max" 
                  className="min-h-[40px] border rounded w-full mt-1" 
                  isClearable
                />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold">Experience & Skills</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <input 
                  type="number" 
                  name="experienceMin" 
                  placeholder="Min" 
                  className="border p-2 rounded w-full" 
                  value={experienceMin}
                  onChange={(e)=>{
                    setExperienceMin(e.target.value);
                  }}
                />
                <input 
                  type="number" 
                  name="experienceMax" 
                  placeholder="Max" 
                  className="border p-2 rounded w-full" 
                  value={experienceMax}
                  onChange={(e)=>{
                    setExperienceMax(e.target.value)
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">in Years</div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Important Skills</h2>
                <div className="border rounded p-2 flex flex-wrap gap-2 min-h-[44px]">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-red-500 hover:text-red-700"
                        onClick={() => removeSkill(skill)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="flex-1 p-1 outline-none text-sm"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please Note: These skills will be weighted more while evaluating stack-ranking.
                </p>
              </div>
              {suggestedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className="bg-gray-200 hover:bg-blue-100 text-sm px-2 py-1 rounded-full"
                      onClick={() => handleAddSkill(skill)}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save and Proceed Button */}
          <div className="md:col-span-2 flex justify-end mt-12">
            <button 
              type="submit" 
              className={`px-4 py-4 rounded text-white ${isformVaild ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!isformVaild}
            >
              Save and Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
    
  );
}
