// frontend/src/components/EditableTable.js
import { useState } from "react";
import { toast } from "react-toastify";

const EditableTable = ({
  data,
  columns,
  editableFields = [],
  onUpdate,
  itemsField = null,
}) => {
  const [tableData, setTableData] = useState(data);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const rowsPerPage = 10;

  const handleChange = (rowId, field, value) => {
    const updatedData = tableData.map((row) =>
      row.id === rowId || row.orderId === rowId
        ? { ...row, [field]: value }
        : row
    );
    setTableData(updatedData);
  };

  const handleUpdate = (row) => {
    if (onUpdate) {
      onUpdate(row.id || row.orderId, row);
    }
  };

  const toggleExpand = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Filter & sort
  const filteredSortedData = tableData
    .filter((row) =>
      search
        ? Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "number") valA = Number(valA);
      if (typeof valB === "number") valB = Number(valB);
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredSortedData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSortedData.length / rowsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
        <div>
          <label className="mr-2 font-semibold">Search:</label>
          <input
            type="text"
            className="border rounded p-1"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="mr-2 font-semibold">Sort by:</label>
          <select
            className="border rounded p-1"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">None</option>
            {columns.map((col) => (
              <option key={col.accessor} value={col.accessor}>
                {col.header}
              </option>
            ))}
          </select>
          {sortField && (
            <button
              className="ml-2 px-2 py-1 bg-gray-200 rounded"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          )}
        </div>
      </div>

      {currentRows.length === 0 ? (
        <p className="text-gray-500">No data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} className="py-2 px-4 text-left">
                    {col.header}
                  </th>
                ))}
                {itemsField && <th className="py-2 px-4">Details</th>}
                {editableFields.length > 0 && <th className="py-2 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <React.Fragment key={row.id || row.orderId}>
                  <tr className="border-b">
                    {columns.map((col) => (
                      <td key={col.accessor} className="py-2 px-4">
                        {editableFields.includes(col.accessor) ? (
                          <input
                            type={col.type || "text"}
                            value={row[col.accessor]}
                            className="border rounded p-1 w-full"
                            onChange={(e) =>
                              handleChange(
                                row.id || row.orderId,
                                col.accessor,
                                col.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value
                              )
                            }
                          />
                        ) : (
                          row[col.accessor]
                        )}
                      </td>
                    ))}
                    {itemsField && (
                      <td className="py-2 px-4">
                        <button
                          className="bg-gray-600 text-white px-2 py-1 rounded"
                          onClick={() =>
                            toggleExpand(row.id || row.orderId)
                          }
                        >
                          {expandedRows.includes(row.id || row.orderId)
                            ? "Hide"
                            : "View"}
                        </button>
                      </td>
                    )}
                    {editableFields.length > 0 && (
                      <td className="py-2 px-4">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => handleUpdate(row)}
                        >
                          Update
                        </button>
                      </td>
                    )}
                  </tr>

                  {itemsField &&
                    expandedRows.includes(row.id || row.orderId) && (
                      <tr className="bg-gray-50">
                        <td colSpan={columns.length + 2} className="px-4 py-2">
                          <table className="w-full border rounded">
                            <thead className="bg-gray-100">
                              <tr>
                                {row[itemsField][0] &&
                                  Object.keys(row[itemsField][0]).map((key) => (
                                    <th key={key} className="py-1 px-2 text-left">
                                      {key}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {row[itemsField].map((item, idx) => (
                                <tr key={idx} className="border-t">
                                  {Object.values(item).map((val, i) => (
                                    <td key={i} className="py-1 px-2">
                                      {val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3 py-1 border rounded ${
                  num === currentPage ? "bg-gray-300 font-bold" : ""
                }`}
                onClick={() => goToPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTable;