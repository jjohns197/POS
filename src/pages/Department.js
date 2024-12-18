// Updated Department.js modeled after Customers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Department() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    dept_name: '',
    dept_phone: ''
  });
  const [editDepartment, setEditDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    console.log('Fetching departments...');
    axios
      .get('http://localhost:5001/departments')
      .then((response) => {
        console.log('Departments fetched:', response.data);
        setDepartments(response.data);
      })
      .catch((error) => console.error('Error fetching departments:', error));
  };

  const addDepartment = () => {
    console.log('Adding department:', newDepartment);
    axios
      .post('http://localhost:5001/departments', newDepartment)
      .then(() => {
        console.log('Department added successfully');
        fetchDepartments();
        setNewDepartment({ dept_name: '', dept_phone: '' });
      })
      .catch((error) => console.error('Error adding department:', error));
  };

  const updateDepartment = (deptId) => {
    axios
      .put(`http://localhost:5001/departments/${deptId}`, editDepartment)
      .then(() => {
        fetchDepartments();
        setEditDepartment(null);
      })
      .catch((error) => console.error('Error updating department:', error));
  };

  const deleteDepartment = (deptId) => {
    axios
      .delete(`http://localhost:5001/departments/${deptId}`)
      .then(() => fetchDepartments())
      .catch((error) => console.error('Error deleting department:', error));
  };

  return (
    <div className="department-page">
      <h1 style={{ textAlign: 'center' }}>Departments</h1>

      <div className="departments-preview">
        <h2>Departments List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.dept_id}>
                <td>{department.dept_id}</td>
                <td>{department.dept_name}</td>
                <td>{department.dept_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="department-actions">
        <h2>Add a Department</h2>
        <input
          type="text"
          placeholder="Department Name"
          value={editDepartment ? editDepartment.dept_name : newDepartment.dept_name}
          onChange={(e) => {
            if (editDepartment) {
              setEditDepartment({ ...editDepartment, dept_name: e.target.value });
            } else {
              setNewDepartment({ ...newDepartment, dept_name: e.target.value });
            }
          }}
        />
        <input
          type="text"
          placeholder="Phone"
          value={editDepartment ? editDepartment.dept_phone : newDepartment.dept_phone}
          onChange={(e) => {
            if (editDepartment) {
              setEditDepartment({ ...editDepartment, dept_phone: e.target.value });
            } else {
              setNewDepartment({ ...newDepartment, dept_phone: e.target.value });
            }
          }}
        />
        {editDepartment ? (
          <>
            <button onClick={() => updateDepartment(editDepartment.dept_id)}>Update</button>
            <button onClick={() => setEditDepartment(null)}>Cancel</button>
          </>
        ) : (
          <button className="add-button" onClick={addDepartment}>Add</button>
        )}
      </div>

      <div className="delete-department">
        <h2>Delete Department</h2>
        <select
          onChange={(e) => {
            const deptId = e.target.value;
            if (deptId) deleteDepartment(deptId);
          }}
        >
          <option value="">-- Select Department to Delete --</option>
          {departments.map((department) => (
            <option key={department.dept_id} value={department.dept_id}>
              {department.dept_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Department;
