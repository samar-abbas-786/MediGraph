"use client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

const AddForm = ({ onClose }) => {
  const [name, setName] = useState(null);
  const [age, setAge] = useState(null);

  const handleAdd = async () => {
    try {
      if (!name || !age) {
        toast.error("Missing fields");
      }
      const response = await axios.post("/api/add-member", { name, age });
      console.log("Data", response.data);
      if (response.status != 200) {
        toast.error(response?.data?.message || "Error occur in adding member");
      } else {
        toast.success(response?.data?.message);
      }

      onClose();
    } catch (error) {
      console.log("error in catch of handleAdd", error);
      toast.error(error);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 w-80 flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-gray-700">Add New Member</h1>

        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of member"
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        <input
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter the age of member"
          type="number"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        <div className="flex justify-between w-full mt-2">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [member, setMember] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getAllMember = async () => {
      const response = await axios.get("/api/get_members");
      if (response.data.members) {
        setMember(response.data.members);
      } else {
        toast.dark("No Member added");
        setMember([]);
      }
    };
    getAllMember();
  }, []);

  const onClose = () => setShow(!show);

  return (
    <div className="p-4">
      {member.map((m, i) => (
        <div key={i} className="mb-1">
          <a
            href={`/test_categories?id=${m._id}`}
            className="text-blue-600 hover:underline"
          >
            {m.name} - {m.age}
          </a>
        </div>
      ))}

      <button
        onClick={() => setShow(!show)}
        className="border border-blue-400 text-blue-600 px-3 py-1 rounded mt-4 hover:bg-blue-50"
      >
        Add Member
      </button>

      <ToastContainer />
      {show && <AddForm onClose={onClose} />}
    </div>
  );
};

export default HomePage;
