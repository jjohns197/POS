import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
    const [reports, setReports] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newReport, setNewReport] = useState({
        employee_id: '',
        report_date: '',
        report_type: '',
        report_message: '',
        comments: ''
    });
    const [selectedReport, setSelectedReport] = useState(null); // Store the selected report

    useEffect(() => {
        fetchReports();
        fetchEmployees();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats as MM/DD/YYYY
      };

    const fetchReports = () => {
        axios
            .get('http://localhost:5001/reports')
            .then((response) => setReports(response.data))
            .catch((error) => console.error('Error fetching reports:', error));
    };

    const fetchEmployees = () => {
        axios
            .get('http://localhost:5001/employees')
            .then((response) => setEmployees(response.data))
            .catch((error) => console.error('Error fetching employees:', error));
    };

    const addReport = () => {
        if (!newReport.employee_id || !newReport.report_date || !newReport.report_type) {
            alert('Please fill in all required fields.');
            return;
        }

        axios
            .post('http://localhost:5001/reports', newReport)
            .then(() => {
                fetchReports();
                setNewReport({ employee_id: '', report_date: '', report_type: '', report_message: '', comments: '' });
            })
            .catch((error) => console.error('Error adding report:', error));
    };

    const deleteReport = () => {
        if (!selectedReport) {
            alert('Please select a report to delete.');
            return;
        }

        axios
            .delete(`http://localhost:5001/reports/${selectedReport.report_id}`)
            .then(() => {
                alert('Report deleted successfully');
                fetchReports();
                setSelectedReport(null); // Clear the selected report
            })
            .catch((error) => console.error('Error deleting report:', error));
    };

    return (
        <div className="reports-page">
            <h1 style={{ textAlign: 'center' }}>Reports</h1>

            <div className="reports-preview">
                <h2>Reports List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Message</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr
                                key={report.report_id}
                                onClick={() => setSelectedReport(report)} // Select the report on row click
                                style={{
                                    backgroundColor: selectedReport?.report_id === report.report_id ? 'lightgray' : 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                <td>{report.report_id}</td>
                                <td>{`${report.employee_fName} ${report.employee_lName}`}</td>
                                <td>{formatDate(report.report_date)}</td>
                                <td>{report.report_type}</td>
                                <td>{report.report_message}</td>
                                <td>{report.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedReport && (
                    <p>
                        Selected Report ID: {selectedReport.report_id} — Type: {selectedReport.report_type}
                    </p>
                )}

                <button
                    onClick={deleteReport}
                    disabled={!selectedReport} // Disable the button if no report is selected
                    style={{
                        backgroundColor: selectedReport ? 'red' : 'gray',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        cursor: selectedReport ? 'pointer' : 'not-allowed',
                        marginTop: '10px',
                    }}
                >
                    Delete Selected Report
                </button>
            </div>

            <div className="add-report">
                <h2>Add a New Report</h2>
                <select
                    onChange={(e) =>
                        setNewReport({ ...newReport, employee_id: e.target.value })
                    }
                    value={newReport.employee_id}
                >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                        <option key={employee.employee_id} value={employee.employee_id}>
                            {`${employee.employee_fName} ${employee.employee_lName}`}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={newReport.report_date}
                    onChange={(e) =>
                        setNewReport({ ...newReport, report_date: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Report Type"
                    value={newReport.report_type}
                    onChange={(e) =>
                        setNewReport({ ...newReport, report_type: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Report Message"
                    value={newReport.report_message}
                    onChange={(e) =>
                        setNewReport({ ...newReport, report_message: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Comments"
                    value={newReport.comments}
                    onChange={(e) =>
                        setNewReport({ ...newReport, comments: e.target.value })
                    }
                />
                <button className="add-button" onClick={addReport}>Add Report</button>
            </div>
        </div>
    );
}

export default Reports;
