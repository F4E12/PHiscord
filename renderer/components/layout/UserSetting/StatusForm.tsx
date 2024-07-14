import updateUserStatus from "@/lib/updateuserstatus";
import React, { useState, useEffect } from "react";

interface StatusFormProps {
  userData: any;
}

const predefinedStatuses = ["Do Not Disturb", "Idle"];

const StatusForm: React.FC<StatusFormProps> = ({ userData }) => {
  const [status, setStatus] = useState("");
  const [customStatus, setCustomStatus] = useState("");
  const [counter2, setCounter2] = useState(0);

  useEffect(() => {
    if (predefinedStatuses.includes(userData.status)) {
      setStatus(userData.status);
    } else {
      setStatus("Custom");
      setCustomStatus(userData.status);
    }
  }, [userData]);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
    if (selectedStatus !== "Custom") {
      await updateStatusInFirestore(selectedStatus);
      setCustomStatus("");
    }
  };

  const handleCustomStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounter2(counter2 + 1);
    setCustomStatus(e.target.value);
  };

  const handleCustomStatusSubmit = async (e: React.FormEvent) => {
    setCounter2(0);
    e.preventDefault();
    if (status === "Custom" && customStatus) {
      await updateStatusInFirestore(customStatus);
    }
  };

  const updateStatusInFirestore = async (status: string) => {
    try {
      await updateUserStatus(userData.id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className=" text-2xl text-foreground font-semibold">
        SET YOUR STATUS
      </h1>
      <div>
        <label htmlFor="status" className="block text-foreground mb-2">
          Choose your status:
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="w-full px-4 py-2 bg-primary text-foreground rounded focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="Do Not Disturb">Do Not Disturb</option>
          <option value="Idle">Idle</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      {status === "custom" && (
        <form onSubmit={handleCustomStatusSubmit} className="space-y-4">
          <div>
            <label htmlFor="customStatus" className="block text-gray-400 mb-2">
              Enter custom status:
            </label>
            <input
              id="customStatus"
              type="text"
              value={customStatus}
              onChange={handleCustomStatusChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            />
          </div>
          {counter2 > 0 && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Custom Status
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default StatusForm;
