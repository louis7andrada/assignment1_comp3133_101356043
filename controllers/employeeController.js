const Employee = require('../models/Employee');

const employeeController = {
    // Add a new employee
    addNewEmployee: async ({ first_name, last_name, email, gender, salary }) => {
        try {
            const newEmployee = new Employee({
                first_name,
                last_name,
                email,
                gender,
                salary,
            });

            const result = await newEmployee.save();
            return { ...result._doc, id: result.id };
        } catch (err) {
            throw err;
        }
    },

    // Get all employees
    getAllEmployees: async () => {
        try {
            const employees = await Employee.find();
            return employees.map(employee => {
                return { ...employee._doc, id: employee.id };
            });
        } catch (err) {
            throw err;
        }
    },

    // Get an employee by ID
    getEmployeeById: async (id) => {
        try {
            const employee = await Employee.findById(id);
            if (!employee) {
                throw new Error('No employee found.');
            }
            return { ...employee._doc, id: employee.id };
        } catch (err) {
            throw err;
        }
    },

    // Update an employee by ID
    updateEmployeeById: async (id, employeeUpdateInput) => {
        try {
            const updatedEmployee = await Employee.findByIdAndUpdate(id, employeeUpdateInput, { new: true });
            return updatedEmployee;
        } catch (err) {
            throw err;
        }
    },

    // Delete an employee by ID
    deleteEmployeeById: async (id) => {
        try {
            const deletedEmployee = await Employee.findByIdAndRemove(id);
            if (!deletedEmployee) {
                throw new Error('No employee found with this ID.');
            }
            return deletedEmployee;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = employeeController;
