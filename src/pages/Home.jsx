import React from "react";
import { useState } from "react";
function HomePage(){
  const [formData, setFormData] = useState({
    companyName: "",
    applyingAsA: "Experienced",
    coverLetterTone: "Formal",
    jobDescription: "",
    currentResume: ""
  });

  const [geminiResponse, setGeminiResponse] = useState("");
  async function handleGenerateData(){
    console.log("FormDATA: ",formData);
    setGeminiResponse("Generating response, please wait...");
    const prompt = `
    You are a professional career coach and resume optimization expert. 
Your task is to generate a personalized cover letter, improve the resume content, 
and provide an ATS (Applicant Tracking System) analysis.

Inputs:
Company Name: ${formData.companyName}
Experience Level: ${formData.applyingAsA}  (Fresher / Experienced)
Job Description: ${formData.jobDescription}
Current Resume: ${formData.currentResume} (If empty, assume no resume exists and create a draft)
Preferred Tone: ${formData.coverLetterTone}

Output (format clearly in sections):

1. Tailored Cover Letter  
Write a professional cover letter addressed to ${formData.companyName}.  
Use the specified tone: ${formData.coverLetterTone}.  
Highlight relevant skills and experiences based on the job description.  

2. Updated Resume Content  
Suggest optimized resume summary, bullet points, and skills tailored to ${formData.jobDescription}.  
Ensure the content is concise, achievement-focused, and ATS-friendly.  

3. Keyword Match Analysis  
Extract the most important keywords from the job description.  
Check if they exist in the provided resume (if given).  
List missing keywords that should be added.  

4. ATS Score Estimate (0–100)  
Provide a rough ATS match score for the current resume against the job description.  
Explain the reasoning briefly (e.g., missing keywords, formatting issues, irrelevant content).  

Ensure the response is structured, clear, and easy to display in a React app. 
    `;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
      },
      body: `{"contents":[{"parts":[{"text":"${prompt}"}]}]}`
    };

    try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log('Generated Gemini Data: ', data.candidates[0].content.parts[0].text);
  setGeminiResponse(data.candidates[0].content.parts[0].text);
} catch (error) {
  console.error(error);
}
  
}
return(
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-2">Smart Resume Builder</h1>
            <p className="lead text-muted">Create a professional cover letter and optimize your resume with AI assistance</p>
            <hr className="my-4" />
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form className="row g-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="companyName" className="form-label fw-bold">Company Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      id="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName} 
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    />
                    <small className="text-muted">Enter the company you're applying to</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="applyingAsA" className="form-label fw-bold">Experience Level</label>
                    <select 
                      className="form-select form-select-lg" 
                      id="applyingAsA"
                      value={formData.applyingAsA} 
                      onChange={(e) => setFormData({...formData, applyingAsA: e.target.value})}
                    >
                      <option value="" disabled>Select level</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Experienced">Experienced</option>
                    </select>
                    <small className="text-muted">Your experience level</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="coverLetterTone" className="form-label fw-bold">Letter Tone</label>
                    <select 
                      className="form-select form-select-lg" 
                      id="coverLetterTone"
                      value={formData.coverLetterTone} 
                      onChange={(e) => setFormData({...formData, coverLetterTone: e.target.value})}
                    >
                      <option value="" disabled>Select tone</option>
                      <option value="Formal">Formal</option>
                      <option value="Informal">Informal</option>
                      <option value="Casual">Casual</option>
                    </select>
                    <small className="text-muted">Choose writing style</small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="jobDescription" className="form-label fw-bold">Job Description</label>
                    <textarea 
                      className="form-control" 
                      id="jobDescription" 
                      rows="6"
                      placeholder="Paste the job description here..."
                      value={formData.jobDescription} 
                      onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="currentResume" className="form-label fw-bold">Current Resume</label>
                    <textarea 
                      className="form-control" 
                      id="currentResume" 
                      rows="6"
                      placeholder="Paste your current resume content here..."
                      value={formData.currentResume} 
                      onChange={(e) => setFormData({...formData, currentResume: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="col-12 text-center mt-4">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                    onClick={handleGenerateData}
                  >
                    <i className="bi bi-magic me-2"></i>
                    Generate Cover Letter & Analysis
                  </button>
                </div>
              </form>
            </div>
          </div>

          {geminiResponse && (
            <div className="response-container mt-5">
              <h2 className="h3 text-center mb-4">Generated Content</h2>
              
              {/* Cover Letter Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white py-3">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-envelope-paper me-2"></i>
                    Tailored Cover Letter
                  </h3>
                </div>
                <div className="card-body bg-light">
                  <pre className="response-text mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {geminiResponse.split('2. Updated Resume Content')[0].replace('1. Tailored Cover Letter', '')}
                  </pre>
                </div>
              </div>

              {/* Resume Content Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-success text-white py-3">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-file-text me-2"></i>
                    Updated Resume Content
                  </h3>
                </div>
                <div className="card-body bg-light">
                  <pre className="response-text mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {geminiResponse.split('2. Updated Resume Content')[1]?.split('3. Keyword Match Analysis')[0]}
                  </pre>
                </div>
              </div>

              {/* Keyword Analysis Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-info text-white py-3">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-key me-2"></i>
                    Keyword Match Analysis
                  </h3>
                </div>
                <div className="card-body bg-light">
                  <pre className="response-text mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {geminiResponse.split('3. Keyword Match Analysis')[1]?.split('4. ATS Score Estimate')[0]}
                  </pre>
                </div>
              </div>

              {/* ATS Score Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-warning py-3">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    ATS Score Estimate
                  </h3>
                </div>
                <div className="card-body bg-light">
                  <pre className="response-text mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {geminiResponse.split('4. ATS Score Estimate')[1]}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
