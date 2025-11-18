"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EvaluationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: async () => {
      const response = await api.get("/evaluations");
      return response.data.data;
    },
  });

  const evaluations = data || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Performance Evaluations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Evaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Performance Evaluation</DialogTitle>
            </DialogHeader>
            <EvaluationForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Evaluations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No evaluations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Evaluator</TableHead>
                  <TableHead>Overall Rating</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation: any) => {
                  const ratings = typeof evaluation.ratings === "string" ? JSON.parse(evaluation.ratings) : evaluation.ratings;
                  const overallRating = ratings?.overall || "N/A";
                  
                  return (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        {evaluation.firstName} {evaluation.lastName} ({evaluation.employeeId})
                      </TableCell>
                      <TableCell>{evaluation.period}</TableCell>
                      <TableCell>
                        {evaluation.evaluatorFirstName} {evaluation.evaluatorLastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{overallRating}/5</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(evaluation.createdAt), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EvaluationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    employeeId: "",
    period: "",
    evaluatorId: "f50c3257-7329-4cbb-b21c-beddc84a3455",
    communication: 4,
    teamwork: 4,
    technical_skills: 4,
    compliance: 5,
    overall: 4,
    goals: [""],
    notes: "",
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const employees = employeesData || [];
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const ratings = {
        communication: data.communication,
        teamwork: data.teamwork,
        technical_skills: data.technical_skills,
        compliance: data.compliance,
        overall: data.overall,
      };
      
      const response = await api.post("/evaluations", {
        employeeId: data.employeeId,
        period: data.period,
        evaluatorId: data.evaluatorId,
        ratings,
        goals: data.goals.filter((g: string) => g.trim() !== ""),
        notes: data.notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Evaluation created successfully");
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employee">Employee</Label>
          <Select
            value={formData.employeeId}
            onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp: any) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="period">Period</Label>
          <Input
            id="period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g., Q1 2024"
            required
          />
        </div>
      </div>

      <div>
        <Label>Ratings (1-5 scale)</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="communication" className="text-sm">Communication</Label>
            <Input
              id="communication"
              type="number"
              min="1"
              max="5"
              value={formData.communication}
              onChange={(e) => setFormData({ ...formData, communication: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="teamwork" className="text-sm">Teamwork</Label>
            <Input
              id="teamwork"
              type="number"
              min="1"
              max="5"
              value={formData.teamwork}
              onChange={(e) => setFormData({ ...formData, teamwork: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="technical" className="text-sm">Technical Skills</Label>
            <Input
              id="technical"
              type="number"
              min="1"
              max="5"
              value={formData.technical_skills}
              onChange={(e) => setFormData({ ...formData, technical_skills: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="compliance" className="text-sm">Compliance</Label>
            <Input
              id="compliance"
              type="number"
              min="1"
              max="5"
              value={formData.compliance}
              onChange={(e) => setFormData({ ...formData, compliance: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="overall" className="text-sm">Overall Rating</Label>
            <Input
              id="overall"
              type="number"
              min="1"
              max="5"
              value={formData.overall}
              onChange={(e) => setFormData({ ...formData, overall: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="goals">Goals</Label>
        {formData.goals.map((goal, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={goal}
              onChange={(e) => {
                const newGoals = [...formData.goals];
                newGoals[index] = e.target.value;
                setFormData({ ...formData, goals: newGoals });
              }}
              placeholder="Enter goal"
            />
            {formData.goals.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    goals: formData.goals.filter((_, i) => i !== index),
                  });
                }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setFormData({ ...formData, goals: [...formData.goals, ""] })}
        >
          Add Goal
        </Button>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Evaluation"}
        </Button>
      </div>
    </form>
  );
}
