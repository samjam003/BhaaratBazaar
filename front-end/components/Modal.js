"use client"
export const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white w-[500px] h-[500px] rounded-lg shadow-lg p-4 relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
                    <p>This is your modal content. You can add anything here!</p>
                </div>
            </div>
        </div>
    );
};