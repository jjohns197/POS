// Updated Employee.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Employee() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        employee_fName: '',
        employee_lName: '',
        employee_dob: '',
        dept_id: ''
    });
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats as MM/DD/YYYY
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const fetchEmployees = () => {
        axios
            .get('http://localhost:5001/employees')
            .then((response) => setEmployees(response.data))
            .catch((error) => console.error('Error fetching employees:', error));
    };

    const fetchDepartments = () => {
        axios
            .get('http://localhost:5001/departments')
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error('Error fetching departments:', error));
    };

    const addEmployee = () => {
        if (!newEmployee.employee_fName || !newEmployee.employee_lName || !newEmployee.employee_dob || !newEmployee.dept_id) {
            alert('Please fill out all fields.');
            return;
        }
        axios
            .post('http://localhost:5001/employees', newEmployee)
            .then(() => {
                fetchEmployees();
                setNewEmployee({ employee_fName: '', employee_lName: '', employee_dob: '', dept_id: '' });
            })
            .catch((error) => console.error('Error adding employee:', error));
    };

    const deleteEmployee = () => {
        if (!selectedEmployee) {
            alert('Please select an employee to delete.');
            return;
        }
        axios
            .delete(`http://localhost:5001/employees/${selectedEmployee.employee_id}`)
            .then(() => {
                fetchEmployees();
                setSelectedEmployee(null);
            })
            .catch((error) => console.error('Error deleting employee:', error));
    };

    return (
        <div className="employee-page">
            <h1 style={{ textAlign: 'center' }}>Employees</h1>

            <div className="employees-preview">
                <h2>Employees List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Department ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr
                                key={employee.employee_id}
                                onClick={() => setSelectedEmployee(employee)}
                                style={{
                                    backgroundColor:
                                        selectedEmployee?.employee_id === employee.employee_id
                                            ? '#f0f0f0'
                                            : 'white'
                                }}
                            >
                                <td>{employee.employee_fName}</td>
                                <td>{employee.employee_lName}</td>
                                <td>{formatDate(employee.employee_dob)}</td>
                                <td>{employee.dept_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="delete-employee">
                <button onClick={deleteEmployee}>Delete Selected Employee</button>
            </div>

            <div className="add-employee">
                <h2>1: Select Department</h2>
                <select
                    value={newEmployee.dept_id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, dept_id: e.target.value })}
                >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                            {dept.dept_name}
                        </option>
                    ))}
                </select>

                <h2>2: Add Employee</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newEmployee.employee_fName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employee_fName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newEmployee.employee_lName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employee_lName: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={newEmployee.employee_dob}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employee_dob: e.target.value })}
                />

                <button onClick={addEmployee}>Add Employee</button>
            </div>
        </div>
    );
}

export default Employee;

