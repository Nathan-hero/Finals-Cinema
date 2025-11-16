import React from "react";

export default function AddMovieModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Modal Box */}
            <div className="bg-[#121212] text-white w-[1250px] max-h-[90vh] rounded-xl shadow-xl p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold">Add Movie</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-6">

                    {/* ROW 1 */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* Featured */}
                        <div>
                            <label className="block mb-1 text-sm">Featured</label>
                            <input
                                type="text"
                                value="Auto"
                                disabled
                                className="w-full p-2 rounded bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block mb-1 text-sm">Title</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Showing Date */}
                        <div>
                            <label className="block mb-1 text-sm">Showing Date</label>
                            <input
                                type="date"
                                className="w-full p-2 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                            />
                        </div>

                    </div>

                    {/* ROW 2 */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* Duration */}
                        <div>
                            <label className="block mb-1 text-sm">Duration (mins)</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Movie Rating */}
                        <div>
                            <label className="block mb-1 text-sm">Movie Rating</label>
                            <input
                                type="text"
                                placeholder="PG-13, R, G..."
                                className="w-full p-2 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Banner URL + Attach */}
                        <div>
                            <label className="block mb-1 text-sm">Banner URL</label>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="15:9 aspect ratio recommended"
                                    className="w-full p-2 pr-24 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                                />

                                {/* Hidden file input */}
                                <input
                                    id="bannerFile"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) alert("Banner Selected: " + file.name);
                                    }}
                                />

                                {/* Attach Button */}
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("bannerFile").click()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                    Attach
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* Poster URL + Attach */}
                        <div>
                            <label className="block mb-1 text-sm">Poster URL</label>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="3:2 aspect ratio recommended"
                                    className="w-full p-2 pr-24 rounded bg-[#1a1a1a] focus:outline-none focus:border-red-500"
                                />

                                {/* Hidden file input */}
                                <input
                                    id="posterFile"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) alert("Poster Selected: " + file.name);
                                    }}
                                />

                                {/* Attach Button */}
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("posterFile").click()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                    Attach
                                </button>
                            </div>
                        </div>

                        {/* Created At */}
                        <div>
                            <label className="block mb-1 text-sm">Created At</label>
                            <input
                                type="text"
                                value="Auto"
                                disabled
                                className="w-full p-2 rounded bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Updated At */}
                        <div>
                            <label className="block mb-1 text-sm">Updated At</label>
                            <input
                                type="text"
                                value="Auto"
                                disabled
                                className="w-full p-2 rounded bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>


                    {/* ROW 4 — DESCRIPTION FULL ROW */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3">
                            <label className="block mb-1 text-sm">Description</label>
                            <textarea
                                className="w-full p-2 rounded bg-[#1a1a1a] h-32 resize-none focus:outline-none focus:border-red-500"
                            ></textarea>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700"
                        >
                            Add Movie
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
