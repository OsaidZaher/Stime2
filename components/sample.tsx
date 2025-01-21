{
  showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-black rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create an Account</h3>
        <p className="mb-4">Sign up form will be here!</p>
        <button
          onClick={() => setShowPopup(false)} // Close the pop-up
          className="bg-blue-600 text-white rounded-md px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Track pop-up visibility
