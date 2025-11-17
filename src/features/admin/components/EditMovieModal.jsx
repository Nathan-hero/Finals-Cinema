import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";

function SuccessModal({ isOpen, onClose, message, type = "success" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50">
        <div className="p-8 text-center">
          <div className={`mx-auto w-20 h-20 ${type === "success" ? "bg-green-500/20" : "bg-red-500/20"} rounded-full flex items-center justify-center mb-4`}>
            <svg className={`w-10 h-10 ${type === "success" ? "text-green-500" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">{type === "success" ? "Success!" : "Error"}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <button onClick={onClose} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all duration-300">Close</button>
        </div>
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}

function ScheduleItem({ schedule, onRemove, index }) {
  const formatDateTime = (datetime) => new Date(datetime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  return (
    <div className="group relative px-4 py-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">Showtime {index + 1}</div>
          <div className="text-lg font-bold text-white">{formatDateTime(schedule)}</div>
        </div>
        <button type="button" onClick={onRemove} className="w-8 h-8 flex items-center justify-center bg-red-600/20 hover:bg-red-600 rounded-full transition-all duration-300">
          <svg className="w-4 h-4 text-red-500 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function EditMovieModal({ isOpen, onClose, movieData, onMovieUpdated }) {
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [newSchedule, setNewSchedule] = useState("");
  const [bannerPreview, setBannerPreview] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", releaseDate: "", movieRating: "", duration: "",
    genre: [], language: "", starring: [], creators: [], posterURL: "", bannerURL: "", featured: false, schedules: []
  });

  useEffect(() => {
    if (movieData && isOpen) {
      setFormData({
        title: movieData.title || "", description: movieData.description || "",
        releaseDate: movieData.releaseDate ? movieData.releaseDate.split('T')[0] : "",
        movieRating: movieData.movieRating || "", duration: movieData.duration || "",
        genre: Array.isArray(movieData.genre) ? movieData.genre : [],
        language: movieData.language || "",
        starring: Array.isArray(movieData.starring) ? movieData.starring : [],
        creators: Array.isArray(movieData.creators) ? movieData.creators : [],
        posterURL: movieData.posterURL || "", bannerURL: movieData.bannerURL || "",
        featured: movieData.featured || false,
        schedules: Array.isArray(movieData.schedules) ? movieData.schedules : []
      });
      setBannerPreview(movieData.bannerURL || null);
      setPosterPreview(movieData.posterURL || null);
    }
  }, [movieData, isOpen]);

  if (!isOpen) return null;

  const showNotification = (message, type = "success") => { setModalMessage(message); setModalType(type); setShowModal(true); };
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  const addSchedule = () => {
    if (!newSchedule) return showNotification("Please select a date and time for the schedule", "error");
    if (formData.schedules.includes(newSchedule)) return showNotification("This schedule already exists", "error");
    setFormData(prev => ({ ...prev, schedules: [...prev.schedules, newSchedule].sort() }));
    setNewSchedule("");
  };

  const removeSchedule = (scheduleToRemove) => setFormData(prev => ({ ...prev, schedules: prev.schedules.filter(s => s !== scheduleToRemove) }));

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => type === "banner" ? setBannerPreview(reader.result) : setPosterPreview(reader.result);
    reader.readAsDataURL(file);
    try {
      type === "banner" ? setUploadingBanner(true) : setUploadingPoster(true);
      const url = await adminAPI.uploadImage(file, `movies/${type}s`);
      setFormData(prev => ({ ...prev, [`${type}URL`]: url }));
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
    } catch (error) {
      showNotification(`Error uploading ${type}: ` + error.message, "error");
    } finally {
      type === "banner" ? setUploadingBanner(false) : setUploadingPoster(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.posterURL || !formData.bannerURL) return showNotification("Please fill in all required fields and upload images", "error");
    if (formData.schedules.length === 0) return showNotification("Please add at least one schedule", "error");
    
    const movieDataToUpdate = {
      ...formData,
      genre: formData.genre.length > 0 ? formData.genre : ["General"],
      starring: formData.starring.length > 0 ? formData.starring : ["Unknown"],
      creators: formData.creators.length > 0 ? formData.creators : ["Unknown"],
      language: formData.language || "English"
    };

    try {
      setLoading(true);
      await adminAPI.updateMovie(movieData._id, movieDataToUpdate);
      showNotification("Movie updated successfully!");
      setTimeout(() => { onClose(); if (onMovieUpdated) onMovieUpdated(); }, 2000);
    } catch (error) {
      showNotification("Error updating movie: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadButton = ({ id, preview, type, uploading }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{type} Image <span className="text-red-500">*</span></label>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, type.toLowerCase())} />
      <button type="button" onClick={() => document.getElementById(id).click()} disabled={uploading}
        className="w-full h-40 border-2 border-dashed border-gray-700 hover:border-red-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50">
        {preview ? <img src={preview} alt={`${type} preview`} className="w-full h-full object-cover rounded-xl" /> : (
          <>
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-400">{uploading ? "Uploading..." : `Click to upload ${type.toLowerCase()} (${type === "Banner" ? "16:9" : "2:3"})`}</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-gray-700/50">
          <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm group">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 pb-4">
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Movie
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploadButton id="bannerFile" preview={bannerPreview} type="Banner" uploading={uploadingBanner} />
              <ImageUploadButton id="posterFile" preview={posterPreview} type="Poster" uploading={uploadingPoster} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Release Date <span className="text-red-500">*</span></label>
                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Duration (mins) <span className="text-red-500">*</span></label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Movie Rating <span className="text-red-500">*</span></label>
                <select name="movieRating" value={formData.movieRating} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" required>
                  <option value="" disabled>Select rating</option>
                  {["G", "PG", "PG-13", "R", "NC-17"].map(r => <option key={r} value={r}>{r} - {r === "G" ? "General Audiences" : r === "PG" ? "Parental Guidance" : r === "PG-13" ? "Parents Strongly Cautioned" : r === "R" ? "Restricted" : "Adults Only"}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Language</label>
                <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="English" className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {["genre", "starring", "creators"].map(field => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">{field.charAt(0).toUpperCase() + field.slice(1)} (comma-separated)</label>
                  <input type="text" placeholder={field === "genre" ? "Action, Drama" : field === "starring" ? "Actor 1, Actor 2" : "Director 1, Director 2"}
                    value={formData[field].join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                    className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300" />
                </div>
              ))}
            </div>

{/* ---------------- SHOWTIMES SECTION (FIXED) ---------------- */}
<div className="space-y-4">
  <div className="flex items-center gap-3">
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <label className="block text-lg font-semibold text-white">
      Showtimes <span className="text-red-500">*</span>
    </label>
  </div>

  {/* INPUTS */}
  <div className="grid md:grid-cols-3 gap-3">
    <input
      type="date"
      value={newSchedule.date || ""}
      onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
      className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500"
      placeholder="Date"
    />

    <input
      type="time"
      value={newSchedule.time || ""}
      onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
      className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500"
      placeholder="Time"
    />

    <select
      value={newSchedule.cinema}
      onChange={(e) => setNewSchedule(prev => ({ ...prev, cinema: e.target.value }))}
      className="md:col-span-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
    >
      <option value="" disabled>Select Cinema</option>
      <option value="Cinema 1">Cinema 1</option>
      <option value="Cinema 2">Cinema 2</option>
      <option value="Cinema 3">Cinema 3</option>
      <option value="Cinema 4">Cinema 4</option>
      <option value="IMAX">IMAX</option>
      <option value="4DX">4DX</option>
      </select>
  </div>

  {/* ADD BUTTON */}
  <button
    type="button"
    onClick={() => {
      if (!newSchedule.date || !newSchedule.time || !newSchedule.cinema) {
        return showNotification("Complete date, time, and cinema", "error");
      }

      const scheduleObj = {
        date: [newSchedule.date],
        time: newSchedule.time,
        cinema: newSchedule.cinema,
        availableSeats: 100
      };

      setFormData(prev => ({
        ...prev,
        schedules: [...prev.schedules, scheduleObj]
      }));

      setNewSchedule({});
    }}
    className="px-6 py-3 mt-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl"
  >
    Add Showtime
  </button>

  {/* EXISTING SHOWTIMES */}
  {formData.schedules.length > 0 ? (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {formData.schedules.map((sch, index) => (
        <div
          key={index}
          className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
        >
          <div className="text-gray-300 text-sm">Showtime {index + 1}</div>
          <div className="text-white font-bold">{sch.date[0]}</div>
          <div className="text-white">{sch.time}</div>
          <div className="text-gray-400 text-sm">{sch.cinema}</div>

          <button
            type="button"
            onClick={() =>
              setFormData(prev => ({
                ...prev,
                schedules: prev.schedules.filter((_, i) => i !== index)
              }))
            }
            className="mt-2 w-full py-2 bg-red-600/20 hover:bg-red-600 rounded-lg text-red-400"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-6 bg-gray-700/20 border border-gray-700 rounded-xl">
      <p className="text-gray-400">No showtimes added yet</p>
    </div>
  )}
</div>


            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300 resize-none" required></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} disabled={loading} className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              <button type="submit" disabled={loading || uploadingBanner || uploadingPoster} className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Movie
                  </>
                )}
              </button>
            </div>
          </form>
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} message={modalMessage} type={modalType} />
    </>
  );
}