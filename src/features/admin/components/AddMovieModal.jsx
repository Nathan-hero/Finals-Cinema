import React, { useState } from "react";
import { adminAPI } from "../../../utils/adminAPI";
import AddMovieStatus from "./AddMovieStatus"; // NEW IMPORT
// Admin only access
// Summary of file: Add movie modal component located in admin dashboard

// Updated Schedule Item Component
function ScheduleItemUpdated({ schedule, onRemove, index }) {
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="group relative px-4 py-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">🎬 {schedule.cinema}</div>
          <div className="text-lg font-bold text-white">
            {formatDateTime(schedule.date)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            💺 {schedule.availableSeats} seats
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center bg-red-600/20 hover:bg-red-600 rounded-full transition-all duration-300"
        >
          <svg
            className="w-4 h-4 text-red-500 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AddMovieModal({ isOpen, onClose, onMovieAdded }) {
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // NEW — Uses AddMovieStatus.jsx
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    movieRating: "",
    duration: "",
    genre: [],
    language: "",
    starring: [],
    creators: [],
    posterURL: "",
    bannerURL: "",
    featured: false,
    schedules: [],
  });

  const [newSchedule, setNewSchedule] = useState({
    datetime: "",
    cinema: "",
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  if (!isOpen) return null;

  const showNotification = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSchedule = () => {
    if (!newSchedule.datetime || !newSchedule.cinema) {
      showNotification(
        "Please select date/time and cinema for the schedule",
        "error"
      );
      return;
    }

    const scheduleDate = new Date(newSchedule.datetime);

    const hours = scheduleDate.getHours().toString().padStart(2, "0");
    const minutes = scheduleDate.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    const scheduleObj = {
      date: scheduleDate.toISOString(),
      time: timeString,
      cinema: newSchedule.cinema,
      availableSeats: 100,
    };

    const isDuplicate = formData.schedules.some((s) => {
      const existingDate = new Date(s.date).toISOString();
      const newDate = scheduleDate.toISOString();
      return (
        existingDate === newDate &&
        s.time === scheduleObj.time &&
        s.cinema === scheduleObj.cinema
      );
    });

    if (isDuplicate) {
      showNotification("This schedule already exists", "error");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, scheduleObj].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    }));

    setNewSchedule({ datetime: "", cinema: "" });
  };

  const removeSchedule = (index) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const setUploading =
      type === "banner" ? setUploadingBanner : setUploadingPoster;
    const setPreview =
      type === "banner" ? setBannerPreview : setPosterPreview;
    const urlField = type === "banner" ? "bannerURL" : "posterURL";

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const url = await adminAPI.uploadImage(file, `movies/${type}s`);
      setFormData((prev) => ({ ...prev, [urlField]: url }));
      showNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`
      );
    } catch (error) {
      showNotification(
        `Error uploading ${type}: ${error.message}`,
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleImageLinkChange = (type, url) => {
    const trimmedUrl = url.trim();
    const urlField = type === "banner" ? "bannerURL" : "posterURL";
    const setPreview = type === "banner" ? setBannerPreview : setPosterPreview;

    setFormData((prev) => ({
      ...prev,
      [urlField]: trimmedUrl,
    }));

    setPreview(trimmedUrl || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.releaseDate ||
      !formData.movieRating ||
      !formData.duration ||
      !formData.posterURL ||
      !formData.bannerURL
    ) {
      showNotification(
        "Please fill in all required fields and upload images",
        "error"
      );
      return;
    }

    if (formData.schedules.length === 0) {
      showNotification("Please add at least one showtime schedule", "error");
      return;
    }

    const movieData = {
      title: formData.title,
      description: formData.description,
      releaseDate: formData.releaseDate,
      movieRating: formData.movieRating,
      duration: parseInt(formData.duration),
      genre: formData.genre.length > 0 ? formData.genre : ["General"],
      language: formData.language || "English",
      starring: formData.starring.length > 0 ? formData.starring : ["Unknown"],
      creators: formData.creators.length > 0 ? formData.creators : ["Unknown"],
      posterURL: formData.posterURL,
      bannerURL: formData.bannerURL,
      featured: formData.featured,
      schedules: formData.schedules,
    };

    try {
      setLoading(true);
      await adminAPI.addMovie(movieData);
      showNotification("Movie added successfully!", "success");

      setTimeout(() => {
        handleClose();
        if (onMovieAdded) onMovieAdded();
      }, 2000);
    } catch (error) {
      showNotification(
        "Error adding movie: " + (error.message || "Unknown error"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      releaseDate: "",
      movieRating: "",
      duration: "",
      genre: [],
      language: "",
      starring: [],
      creators: [],
      posterURL: "",
      bannerURL: "",
      featured: false,
      schedules: [],
    });

    setBannerPreview(null);
    setPosterPreview(null);
    setNewSchedule({ datetime: "", cinema: "" });
    onClose();
  };

  const ImageUpload = ({ type, preview, uploading, imageUrl, onLinkChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {type.charAt(0).toUpperCase() + type.slice(1)} Image{" "}
        <span className="text-red-500">*</span>
      </label>

      <div className="relative group">
        <input
          id={`${type}File`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, type)}
        />
        <button
          type="button"
          onClick={() => document.getElementById(`${type}File`).click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-gray-700 hover:border-red-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {preview ? (
            <img
              src={preview}
              alt={`${type} preview`}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <>
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-400">
                {uploading
                  ? "Uploading..."
                  : `Click to upload ${type} (${type === "banner" ? "16:9" : "2:3"
                  })`}
              </span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-400">
          Or paste an image link
        </label>
        <input
          type="url"
          placeholder={`https://example.com/${type}.jpg`}
          value={imageUrl}
          onChange={(e) => onLinkChange(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-gray-700/50 animate-scale-in">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-8 pb-4">
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Movie
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
          </div>

          <div className="p-8 pt-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUpload
                type="banner"
                preview={bannerPreview}
                uploading={uploadingBanner}
                imageUrl={formData.bannerURL}
                onLinkChange={(value) => handleImageLinkChange("banner", value)}
              />
              <ImageUpload
                type="poster"
                preview={posterPreview}
                uploading={uploadingPoster}
                imageUrl={formData.posterURL}
                onLinkChange={(value) => handleImageLinkChange("poster", value)}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Release Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Duration (mins) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Movie Rating <span className="text-red-500">*</span>
                </label>
                <select
                  name="movieRating"
                  value={formData.movieRating}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                  required
                >
                  <option value="" disabled>
                    Select rating
                  </option>
                  <option value="G">G - General Audiences</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                  <option value="R">R - Restricted</option>
                  <option value="NC-17">NC-17 - Adults Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="English"
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Genre", field: "genre", placeholder: "Action, Drama" },
                { label: "Starring", field: "starring", placeholder: "Actor 1, Actor 2" },
                { label: "Directors", field: "creators", placeholder: "Director 1, Director 2" },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {label} (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <label className="block text-lg font-semibold text-white">
                  Showtimes <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="datetime-local"
                  value={newSchedule.datetime}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      datetime: e.target.value,
                    }))
                  }
                  className="md:col-span-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                />

                <select
                  value={newSchedule.cinema}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      cinema: e.target.value,
                    }))
                  }
                  className="md:col-span-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
                >
                  <option value="" disabled>
                    Select Cinema
                  </option>
                  <option value="Cinema 1">Cinema 1</option>
                  <option value="Cinema 2">Cinema 2</option>
                  <option value="Cinema 3">Cinema 3</option>
                  <option value="Cinema 4">Cinema 4</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>

                <button
                  type="button"
                  onClick={addSchedule}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add
                </button>
              </div>

              {formData.schedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.schedules.map((schedule, index) => (
                    <ScheduleItemUpdated
                      key={index}
                      schedule={schedule}
                      index={index}
                      onRemove={() => removeSchedule(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                  <svg
                    className="w-12 h-12 text-gray-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No showtimes added yet</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300 resize-none"
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploadingBanner || uploadingPoster}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding Movie...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Add Movie
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>

      {/* Replaced SuccessModal with AddMovieStatus */}
      <AddMovieStatus
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </>
  );
}
