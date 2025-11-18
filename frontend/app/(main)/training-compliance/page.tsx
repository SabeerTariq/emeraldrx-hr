"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function TrainingPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["training"],
    queryFn: async () => {
      const response = await api.get("/training");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Training & Compliance</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Training & Compliance</h1>
        <div className="text-red-500">Error loading training records</div>
      </div>
    );
  }

  const trainings = data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Training & Compliance</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Assign Training
        </button>
      </div>
      
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Training</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {trainings.map((training: any) => (
                <tr key={training.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {training.firstName} {training.lastName} ({training.employeeId})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{training.trainingTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{training.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(training.status)}`}>
                      {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {training.dueDate ? new Date(training.dueDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {training.score !== null ? `${training.score}%` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {trainings.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No training records found</div>
        )}
      </div>
    </div>
  );
}
