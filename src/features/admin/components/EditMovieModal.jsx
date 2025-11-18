// EditMovieModal.jsx
import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";
import { EditConfirmModal, EditStatusModal } from "./EditMovieStatus";

function ScheduleItem({ schedule, onRemove, index }) {
  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="group relative px-4 py-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">Showtime {index + 1}</div>
          <div className="text-lg font-bold text-white">
            {formatDateTime(schedule)}
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center bg-red-600/20 hover:bg-red-600 rounded-full transition-all duration-300">
          <svg
            className="w-4 h-4 text-red-500 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
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

export default function EditMovieModal({
  isOpen,
  onClose,
  movieData,
  onMovieUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const [newSchedule, setNewSchedule] = useState("");
  const [bannerPreview, setBannerPreview] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

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

  // NEW STATES FOR CONFIRMATION AND STATUS
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const showStatus = (message, type = "success") => {
    setStatusMessage(message);
    setStatusType(type);
    setShowStatusModal(true);
  };

  useEffect(() => {
    if (movieData && isOpen) {
      setFormData({
        title: movieData.title || "",
        description: movieData.description || "",
        releaseDate: movieData.releaseDate
          ? movieData.releaseDate.split("T")[0]
          : "",
        movieRating: movieData.movieRating || "",
        duration: movieData.duration || "",
        genre: Array.isArray(movieData.genre) ? movieData.genre : [],
        language: movieData.language || "",
        starring: Array.isArray(movieData.starring)
          ? movieData.starring
          : [],
        creators: Array.isArray(movieData.creators)
          ? movieData.creators
          : [],
        posterURL: movieData.posterURL || "",
        bannerURL: movieData.bannerURL || "",
        featured: movieData.featured || false,
        schedules: Array.isArray(movieData.schedules)
          ? movieData.schedules.map((s) => ({
              ...s,
              date: Array.isArray(s.date) ? s.date : [s.date],
            }))
          : [],
      });

      setBannerPreview(movieData.bannerURL || null);
      setPosterPreview(movieData.posterURL || null);
    }
  }, [movieData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      type === "banner"
        ? setBannerPreview(reader.result)
        : setPosterPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      type === "banner"
        ? setUploadingBanner(true)
        : setUploadingPoster(true);

      const url = await adminAPI.uploadImage(file, `movies/${type}s`);
      setFormData((prev) => ({ ...prev, [`${type}URL`]: url }));

      showStatus(`Uploaded ${type} image successfully`);
    } catch (error) {
      showStatus(`Error uploading ${type}: ${error.message}`, "error");
    } finally {
      type === "banner"
        ? setUploadingBanner(false)
        : setUploadingPoster(false);
    }
  };

  const attemptUpdate = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.posterURL ||
      !formData.bannerURL
    ) {
      return showStatus("Please fill all required fields", "error");
    }

    if (formData.schedules.length === 0) {
      return showStatus("Please add at least one schedule", "error");
    }

    const movieDataToUpdate = {
      ...formData,
      genre: formData.genre.length > 0 ? formData.genre : ["General"],
      starring:
        formData.starring.length > 0 ? formData.starring : ["Unknown"],
      creators:
        formData.creators.length > 0 ? formData.creators : ["Unknown"],
      language: formData.language || "English",
    };

    try {
      setLoading(true);
      await adminAPI.updateMovie(movieData._id, movieDataToUpdate);

      showStatus("Movie updated successfully!", "success");

      setTimeout(() => {
        onClose();
        if (onMovieUpdated) onMovieUpdated();
      }, 1200);
    } catch (error) {
      showStatus("Error updating movie: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const ImageUploadButton = ({ id, preview, type, uploading }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {type} Image <span className="text-red-500">*</span>
      </label>

      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          handleImageUpload(e, type.toLowerCase())
        }
      />

      <button
        type="button"
        onClick={() => document.getElementById(id).click()}
        disabled={uploading}
        className="w-full h-40 border-2 border-dashed border-gray-700 hover:border-red-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50">
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
              viewBox="0 0 24 24">
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
                : `Click to upload ${type}`}
            </span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm group">
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
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
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Movie
            </h2>

            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 pt-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploadButton
                id="bannerFile"
                preview={bannerPreview}
                type="Banner"
                uploading={uploadingBanner}
              />

              <ImageUploadButton
                id="posterFile"
                preview={posterPreview}
                type="Poster"
                uploading={uploadingPoster}
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
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
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
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
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
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
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
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
                  required>
                  <option value="" disabled>
                    Select rating
                  </option>

                  {["G", "PG", "PG-13", "R", "NC-17"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Language
                </label>

                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="English"
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {["genre", "starring", "creators"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    (comma-separated)
                  </label>

                  <input
                    type="text"
                    value={formData[field].join(", ")}
                    placeholder={
                      field === "genre"
                        ? "Action, Drama"
                        : field === "starring"
                        ? "Actor 1, Actor 2"
                        : "Director 1, Director 2"
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500"
                  />
                </div>
              ))}
            </div>

            {/* SHOWTIMES */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <label className="text-lg font-semibold text-white">
                  Showtimes <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="date"
                  value={newSchedule.date || ""}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500"
                />

                <input
                  type="time"
                  value={newSchedule.time || ""}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500"
                />

                <select
                  value={newSchedule.cinema || ""}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      cinema: e.target.value,
                    }))
                  }
                  className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500">
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
              </div>

              <button
                type="button"
                onClick={() => {
                  if (
                    !newSchedule.date ||
                    !newSchedule.time ||
                    !newSchedule.cinema
                  ) {
                    return showStatus(
                      "Complete date, time and cinema",
                      "error"
                    );
                  }

                  const scheduleObj = {
                    date: [newSchedule.date],
                    time: newSchedule.time,
                    cinema: newSchedule.cinema,
                    availableSeats: 100,
                  };

                  setFormData((prev) => ({
                    ...prev,
                    schedules: [...prev.schedules, scheduleObj],
                  }));

                  setNewSchedule({});
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl">
                Add Showtime
              </button>

              {formData.schedules.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.schedules.map((sch, index) => {
                    const dateStr = Array.isArray(sch.date)
                      ? sch.date[0]
                      : sch.date;

                    const formatted = dateStr
                      ? new Date(dateStr).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "";

                    return (
                      <div
                        key={index}
                        className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                        <div className="text-gray-300 text-sm">
                          Showtime {index + 1}
                        </div>

                        <div className="text-white font-bold">
                          {formatted || dateStr}
                        </div>

                        <div className="text-white">{sch.time}</div>

                        <div className="text-gray-400 text-sm">
                          {sch.cinema}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              schedules: prev.schedules.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="mt-2 w-full py-2 bg-red-600/20 hover:bg-red-600 rounded-lg text-red-400">
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-700/20 border border-gray-700 rounded-xl">
                  <p className="text-gray-400">No showtimes yet</p>
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
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-red-500 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold disabled:opacity-50">
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading || uploadingBanner || uploadingPoster
                }
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                          5.291A7.962 7.962 0 014 12H0c0 
                          3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
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

      {/* NEW CONFIRMATION MODAL */}
      <EditConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={attemptUpdate}
      />

      {/* STATUS (SUCCESS/ERROR) MODAL */}
      <EditStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        message={statusMessage}
        type={statusType}
      />
    </>
  );
}
