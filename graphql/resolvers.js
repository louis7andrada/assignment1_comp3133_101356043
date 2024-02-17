console.log('Resolvers file is run')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User does not exist!');
            }

            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
                expiresIn: '1h'
            });

            return { userId: user.id, token: token, tokenExpiration: 1 };
        },

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

        getEmployeeById: async (_, { id }) => {
            try {
                const employee = await Employee.findById(id);
                return { ...employee._doc, id: employee.id };
            } catch (err) {
                throw err;
            }
        },
    },

    Mutation: {
        signup: async (_, { userInput }) => {
            const existingUser = await User.findOne({ email: userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const hashedPassword = await bcrypt.hash(userInput.password, 12);

            const user = new User({
                username: userInput.username,
                email: userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc, password: null, id: result.id };
        },

        addNewEmployee: async (_, { employeeInput }) => {
            try {
                const employee = new Employee({
                    first_name: employeeInput.first_name,
                    last_name: employeeInput.last_name,
                    email: employeeInput.email,
                    gender: employeeInput.gender,
                    salary: employeeInput.salary
                });

                const result = await employee.save();
                return { ...result._doc, id: result.id };
            } catch (err) {
                throw new Error('Error adding new employee: ' + err.message);
            }
        },

        updateEmployeeById: async (_, { id, employeeUpdateInput }) => {
            try {
                const employee = await Employee.findByIdAndUpdate(id, employeeUpdateInput, { new: true });
                if (!employee) {
                    throw new Error('Employee not found.');
                }
                return employee;
            } catch (err) {
                throw new Error('Error updating employee: ' + err.message);
            }
        },

        deleteEmployeeById: async (_, { id }) => {
            try {
                const employee = await Employee.findByIdAndRemove(id);
                if (!employee) {
                    throw new Error('No employee found with this ID.');
                }
                return employee;
            } catch (err) {
                throw new Error('Error deleting employee: ' + err.message);
            }
        },
    },
};

console.log('resolvers is loaded:', resolvers);


module.exports = resolvers;
