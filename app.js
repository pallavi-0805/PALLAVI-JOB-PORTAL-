const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS and JavaScript files
app.use(express.static("Public"));

// Database table name
const TABLE = "`pallavi job portal`.`job portal`";

// 1. Get all jobs
app.get("/api/jobs", (req, res) => {
    const sql = `SELECT * FROM ${TABLE}`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch jobs",
                error: err.message
            });
        }

        res.json(results);
    });
});

// 2. Get a single job by ID
app.get("/api/jobs/:id", (req, res) => {
    const sql = `SELECT * FROM ${TABLE} WHERE job_id = ?`;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch job",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(results[0]);
    });
});

// 3. Add a new job
app.post("/api/jobs", (req, res) => {
    const {
        title,
        company,
        location,
        salary,
        skills,
        interviewDate
    } = req.body;

    if (!title || !company || !location ||
        salary === undefined || salary === "" ||
        !skills || !interviewDate) {
        return res.status(400).json({
            message: "Please fill in all job details"
        });
    }

    const sql = `
        INSERT INTO ${TABLE}
        (
            \`title of the job\`,
            company,
            location,
            salary,
            skills,
            \`interview date\`
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        company,
        location,
        salary,
        skills,
        interviewDate
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to add job",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Job added successfully",
            job_id: result.insertId
        });
    });
});

// 4. Update an existing job
app.put("/api/jobs/:id", (req, res) => {
    const {
        title,
        company,
        location,
        salary,
        skills,
        interviewDate
    } = req.body;

    if (!title || !company || !location ||
        salary === undefined || salary === "" ||
        !skills || !interviewDate) {
        return res.status(400).json({
            message: "Please fill in all job details"
        });
    }

    const sql = `
        UPDATE ${TABLE}
        SET
            \`title of the job\` = ?,
            company = ?,
            location = ?,
            salary = ?,
            skills = ?,
            \`interview date\` = ?
        WHERE job_id = ?
    `;

    const values = [
        title,
        company,
        location,
        salary,
        skills,
        interviewDate,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to update job",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job updated successfully"
        });
    });
});

// 5. Delete a job
app.delete("/api/jobs/:id", (req, res) => {
    const sql = `DELETE FROM ${TABLE} WHERE job_id = ?`;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to delete job",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});