"use client";

const EntryHistory = ({
  entries,
  loading,
  selectedCategory,
  selectedParameter,
  editingEntryId,
  onEdit,
  onDelete,
  onCancelEdit,
}) => {
  const hasSelection = selectedCategory && selectedParameter;
  const title = selectedParameter || "this parameter";

  return (
    <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Previous Entries
          </h2>
          <p className="text-sm text-gray-500">
            {hasSelection
              ? `Showing entries for ${title}`
              : "Select category and parameter to load history."}
          </p>
        </div>
        {editingEntryId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="self-start sm:self-auto px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel edit
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading previous entries...</div>
      ) : !hasSelection ? (
        <div className="text-sm text-gray-500">
          Please choose a category and parameter first.
        </div>
      ) : entries.length === 0 ? (
        <div className="text-sm text-gray-500">
          No previous entries found for this selection.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sm text-gray-500 uppercase">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2">Where</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry._id}
                    className="bg-white border border-gray-200 rounded-xl"
                  >
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {new Date(entry.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {entry.value}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {entry.where}
                    </td>
                    <td className="px-3 py-3 text-sm space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(entry)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(entry._id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 sm:hidden">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white border border-gray-200 rounded-2xl p-4"
              >
                <div className="mb-3 text-sm text-gray-500">Date</div>
                <div className="mb-2 text-sm text-gray-700 font-medium">
                  {new Date(entry.date).toLocaleDateString("en-IN")}
                </div>
                <div className="mb-3 text-sm text-gray-500">Value</div>
                <div className="mb-2 text-sm text-gray-700 font-medium">
                  {entry.value}
                </div>
                <div className="mb-3 text-sm text-gray-500">Where</div>
                <div className="mb-4 text-sm text-gray-700 font-medium">
                  {entry.where}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry._id)}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EntryHistory;
