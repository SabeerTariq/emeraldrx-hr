"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, CheckCircle2, AlertCircle, Clock, Edit, Trash2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { hasPermission, getUserPermissions } from "@/lib/permissions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function TrainingPage() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"records" | "modules">("records");

  // Fetch user permissions
  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissions,
  });

  const canAssign = permissions && hasPermission(permissions, "training", "assign");
  const canCreate = permissions && hasPermission(permissions, "training", "create");
  const canUpdate = permissions && hasPermission(permissions, "training", "update");
  const canDelete = permissions && hasPermission(permissions, "training", "delete");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["training"],
    queryFn: async () => {
      const res = await api.get(`/training`);
      return res.data.data;
    },
  });

  const { data: modules, refetch: refetchModules } = useQuery({
    queryKey: ["training-modules"],
    queryFn: async () => {
      const response = await api.get("/training/modules");
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
  const pendingTrainings = trainings.filter((t: any) => t.status === "pending" || t.status === "overdue");
  const completedTrainings = trainings.filter((t: any) => t.status === "completed");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Training & Compliance</h1>
          <p className="text-muted-foreground mt-1">Track employee training completion and compliance</p>
        </div>
        {activeTab === "records" && canAssign && (
          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Training
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Training</DialogTitle>
              </DialogHeader>
              <AssignTrainingForm onSuccess={() => setIsAssignModalOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
        {activeTab === "modules" && canCreate && (
          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Module
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Training Module</DialogTitle>
                <DialogDescription>Create a new training module template</DialogDescription>
              </DialogHeader>
              <TrainingModuleForm onSuccess={() => { setIsAssignModalOpen(false); refetchModules(); }} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "records" ? "default" : "ghost"}
          onClick={() => setActiveTab("records")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Training Records
        </Button>
        <Button
          variant={activeTab === "modules" ? "default" : "ghost"}
          onClick={() => setActiveTab("modules")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Training Modules
        </Button>
      </div>

      {activeTab === "records" ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Trainings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingTrainings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedTrainings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trainings.filter((t: any) => t.status === "overdue").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Training Records</CardTitle>
            </CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No training records found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((training: any) => (
                      <TableRow key={training.id}>
                        <TableCell>
                          {training.firstName} {training.lastName}
                          <div className="text-sm text-muted-foreground">({training.employeeId})</div>
                        </TableCell>
                        <TableCell className="font-medium">{training.trainingTitle}</TableCell>
                        <TableCell>
                          {training.status === "completed" ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          ) : training.status === "overdue" ? (
                            <Badge variant="destructive">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Overdue
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              <Clock className="mr-1 h-3 w-3" />
                              {training.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {training.dueDate ? format(new Date(training.dueDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {training.score !== null ? `${training.score}%` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {training.certificateUrl ? (
                            <a
                              href={training.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {training.status !== "completed" && (
                              <CompleteTrainingButton trainingId={training.id} onComplete={refetch} />
                            )}
                            {canUpdate && (
                              <EditTrainingRecordButton training={training} onSuccess={refetch} />
                            )}
                            {canDelete && (
                              <DeleteTrainingRecordButton trainingId={training.id} onSuccess={refetch} />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Training Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {modules && modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No training modules found. Create your first module.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Supports</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules?.map((module: any) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.title}</TableCell>
                      <TableCell>{module.duration ? `${module.duration} min` : "N/A"}</TableCell>
                      <TableCell>
                        {module.isRequired ? (
                          <Badge className="bg-green-500">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {module.supportsVideo && <Badge variant="secondary">Video</Badge>}
                          {module.supportsPDF && <Badge variant="secondary">PDF</Badge>}
                          {module.supportsQuiz && <Badge variant="secondary">Quiz</Badge>}
                          {!module.supportsVideo && !module.supportsPDF && !module.supportsQuiz && (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {canUpdate && (
                            <EditTrainingModuleButton module={module} onSuccess={refetchModules} />
                          )}
                          {canDelete && (
                            <DeleteTrainingModuleButton moduleId={module.id} onSuccess={refetchModules} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Training Module Form Component
function TrainingModuleForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    duration: initialData?.duration || "",
    isRequired: initialData?.isRequired || false,
    supportsVideo: initialData?.supportsVideo || false,
    supportsPDF: initialData?.supportsPDF || false,
    supportsQuiz: initialData?.supportsQuiz || false,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/training/modules", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-modules"] });
      toast.success("Training module created successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create training module");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/training/modules/${initialData.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-modules"] });
      toast.success("Training module updated successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update training module");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };
    if (initialData) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          min="0"
        />
      </div>
      <div>
        <Label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isRequired}
            onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
            className="rounded"
          />
          Required Training
        </Label>
      </div>
      <div>
        <Label>Supports</Label>
        <div className="flex gap-4 mt-2">
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.supportsVideo}
              onChange={(e) => setFormData({ ...formData, supportsVideo: e.target.checked })}
              className="rounded"
            />
            Video
          </Label>
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.supportsPDF}
              onChange={(e) => setFormData({ ...formData, supportsPDF: e.target.checked })}
              className="rounded"
            />
            PDF
          </Label>
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.supportsQuiz}
              onChange={(e) => setFormData({ ...formData, supportsQuiz: e.target.checked })}
              className="rounded"
            />
            Quiz
          </Label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {initialData ? (updateMutation.isPending ? "Updating..." : "Update") : (createMutation.isPending ? "Creating..." : "Create")}
        </Button>
      </div>
    </form>
  );
}

// Edit Training Module Button
function EditTrainingModuleButton({ module, onSuccess }: { module: any; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Training Module</DialogTitle>
          <DialogDescription>Update training module details</DialogDescription>
        </DialogHeader>
        <TrainingModuleForm initialData={module} onSuccess={() => { setIsOpen(false); onSuccess(); }} />
      </DialogContent>
    </Dialog>
  );
}

// Delete Training Module Button
function DeleteTrainingModuleButton({ moduleId, onSuccess }: { moduleId: string; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/training/modules/${moduleId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-modules"] });
      toast.success("Training module deleted successfully");
      setIsOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete training module");
    },
  });

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this training module? This action cannot be undone.
              Make sure no employees have been assigned this training.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Edit Training Record Button
function EditTrainingRecordButton({ training, onSuccess }: { training: any; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    trainingId: training.trainingId || "",
    employeeId: training.employeeId || "",
    dueDate: training.dueDate ? format(new Date(training.dueDate), "yyyy-MM-dd") : "",
    status: training.status || "pending",
    score: training.score || "",
    notes: training.notes || "",
  });

  const { data: trainingModules } = useQuery({
    queryKey: ["training-modules"],
    queryFn: async () => {
      const response = await api.get("/training/modules");
      return response.data.data;
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const { data: permissions } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: async () => {
      const response = await api.get("/auth/permissions");
      return response.data.data.permissions;
    },
  });

  const queryClient = useQueryClient();
  const isAdmin = permissions && hasPermission(permissions, "training", "update");
  const canChangeEmployee = isAdmin; // Only admins can change employee assignment

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/training/records/${training.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training record updated successfully");
      setIsOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update training record");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: any = {
      dueDate: formData.dueDate || null,
      status: formData.status,
      score: formData.score ? parseInt(formData.score) : null,
      notes: formData.notes || null,
    };

    // Only include trainingId and employeeId if they've changed and user has permission
    if (formData.trainingId && formData.trainingId !== training.trainingId) {
      updateData.trainingId = formData.trainingId;
    }
    if (canChangeEmployee && formData.employeeId && formData.employeeId !== training.employeeId) {
      updateData.employeeId = formData.employeeId;
    }

    updateMutation.mutate(updateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Training Record</DialogTitle>
          <DialogDescription>Update training record details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {canChangeEmployee && (
            <div>
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="trainingId">Training Module</Label>
            <Select
              value={formData.trainingId}
              onValueChange={(value) => setFormData({ ...formData, trainingId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select training module" />
              </SelectTrigger>
              <SelectContent>
                {trainingModules?.map((module: any) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="score">Score (%)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Training Record Button
function DeleteTrainingRecordButton({ trainingId, onSuccess }: { trainingId: string; onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/training/records/${trainingId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training record deleted successfully");
      setIsOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete training record");
    },
  });

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this training record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AssignTrainingForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    trainingId: "",
    employeeIds: [] as string[],
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data.data;
    },
  });

  const { data: trainingModules } = useQuery({
    queryKey: ["training-modules"],
    queryFn: async () => {
      const response = await api.get("/training/modules");
      return response.data.data;
    },
  });

  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/training/assign", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training assigned successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to assign training");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeIds.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }
    assignMutation.mutate(formData);
  };

  const toggleEmployee = (employeeId: string) => {
    setFormData({
      ...formData,
      employeeIds: formData.employeeIds.includes(employeeId)
        ? formData.employeeIds.filter((id) => id !== employeeId)
        : [...formData.employeeIds, employeeId],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="trainingId">Training Module *</Label>
        <Select
          value={formData.trainingId}
          onValueChange={(value) => setFormData({ ...formData, trainingId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select training module" />
          </SelectTrigger>
          <SelectContent>
            {trainingModules?.map((module: any) => (
              <SelectItem key={module.id} value={module.id}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Select Employees *</Label>
        <div className="border rounded-md p-4 max-h-60 overflow-y-auto mt-2">
          {employees?.map((emp: any) => (
            <div key={emp.id} className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id={`emp-${emp.id}`}
                checked={formData.employeeIds.includes(emp.id)}
                onChange={() => toggleEmployee(emp.id)}
                className="rounded"
              />
              <label htmlFor={`emp-${emp.id}`} className="text-sm cursor-pointer">
                {emp.firstName} {emp.lastName} ({emp.employeeId})
              </label>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {formData.employeeIds.length} employee(s) selected
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={assignMutation.isPending}>
          {assignMutation.isPending ? "Assigning..." : "Assign Training"}
        </Button>
      </div>
    </form>
  );
}

function CompleteTrainingButton({ trainingId, onComplete }: { trainingId: string; onComplete: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    score: "",
    certificateUrl: "",
    notes: "",
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/training/${trainingId}/complete`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      toast.success("Training marked as completed");
      setIsModalOpen(false);
      onComplete();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to complete training");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ ...formData, certificateUrl: response.data.data.url });
      toast.success("Certificate uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload certificate");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeMutation.mutate({
      score: formData.score ? parseInt(formData.score) : null,
      certificateUrl: formData.certificateUrl || null,
      notes: formData.notes || null,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Mark Complete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Training</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="score">Score (%)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="certificate">Upload Certificate</Label>
            <Input
              id="certificate"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {formData.certificateUrl && (
              <div className="mt-2">
                <a
                  href={formData.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Certificate uploaded
                </a>
              </div>
            )}
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Optional notes about completion"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={completeMutation.isPending}>
              {completeMutation.isPending ? "Completing..." : "Mark Complete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
