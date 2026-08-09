import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  const complaints = [];
  const notes = [];

  // --- API Routes ---

  // Public APIs
  app.post("/api/complaints", (req, res) => {
    const { title, description, category, priority } = req.body;
    const trackingId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newComplaint = {
      id: complaints.length + 1,
      trackingId,
      title,
      description,
      category,
      priority: priority || "Medium",
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    complaints.push(newComplaint);
    res.json({ success: true, data: { trackingId } });
  });

  app.get("/api/complaints/track/:trackingId", (req, res) => {
    const complaint = complaints.find(c => c.trackingId === req.params.trackingId);
    if (complaint) {
      res.json({ success: true, data: complaint });
    } else {
      res.status(404).json({ success: false, message: "Complaint not found" });
    }
  });

  // Auth APIs (Mock)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@campusecho.com" && password === "admin123") {
      res.json({
        success: true,
        data: {
          user: { id: 1, name: "Admin", email: "admin@campusecho.com", role: "admin" },
          token: "mock-jwt-token"
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token === "mock-jwt-token") {
      res.json({
        success: true,
        data: { user: { id: 1, name: "Admin", email: "admin@campusecho.com", role: "admin" } }
      });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  });

  // Admin APIs
  app.get("/api/admin/dashboard", (req, res) => {
    res.json({
      success: true,
      data: {
        totalComplaints: complaints.length,
        pending: complaints.filter(c => c.status === "Pending").length,
        underReview: complaints.filter(c => c.status === "Under_Review").length,
        investigating: complaints.filter(c => c.status === "Investigating").length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
        rejected: complaints.filter(c => c.status === "Rejected").length,
      }
    });
  });

  app.get("/api/admin/complaints", (req, res) => {
    res.json({
      success: true,
      data: {
        complaints: complaints,
        pagination: { total: complaints.length, page: 1, limit: 10 }
      }
    });
  });

  app.get("/api/admin/complaints/:id", (req, res) => {
    const complaint = complaints.find(c => c.id === parseInt(req.params.id));
    if (complaint) {
      const complaintNotes = notes.filter(n => n.complaintId === complaint.id);
      res.json({ success: true, data: { ...complaint, notes: complaintNotes, statusHistory: [] } });
    } else {
      res.status(404).json({ success: false, message: "Not found" });
    }
  });

  app.patch("/api/admin/complaints/:id/status", (req, res) => {
    const { status } = req.body;
    const complaint = complaints.find(c => c.id === parseInt(req.params.id));
    if (complaint) {
      complaint.status = status;
      res.json({ success: true, data: { complaint } });
    } else {
      res.status(404).json({ success: false, message: "Not found" });
    }
  });

  app.patch("/api/admin/complaints/:id/assign", (req, res) => {
    const { staffId } = req.body;
    const complaint = complaints.find(c => c.id === parseInt(req.params.id));
    if (complaint) {
      complaint.assignedTo = staffId;
      res.json({ success: true, data: { complaint } });
    } else {
      res.status(404).json({ success: false, message: "Not found" });
    }
  });

  app.post("/api/admin/complaints/:id/notes", (req, res) => {
    const { content } = req.body;
    const newNote = {
      id: notes.length + 1,
      complaintId: parseInt(req.params.id),
      content,
      createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    res.json({ success: true, data: { note: newNote } });
  });

  app.delete("/api/admin/complaints/:id", (req, res) => {
    const idx = complaints.findIndex(c => c.id === parseInt(req.params.id));
    if (idx !== -1) {
      complaints.splice(idx, 1);
      res.json({ success: true, message: "Deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Not found" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
