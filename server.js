// dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const getConnections = require('./db/connection');
let connection;

//main menu
const mainMenu = async () => {
    const menu = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "What would you like do",
            choices: [
                { name: 'View employees', value: viewEmployees },

                { name: 'Add employee', value: addEmployee },

                { name: 'Change emplyee role', value: changeEmployeeRole },

                { name: 'Add role', value: addRole },

                { name: 'View roles', value: viewRoles },

                { name: 'Add department', value: addDepartment },

                { name: 'View departments', value: viewDepartments },

                { name: 'Display department budgets', value: viewBudgets },

                { name: 'Exit', value: 'exit' },
            ]
        }
    ]);
    if (menu.action === 'exit') {
        await endProgram();
    }else{
        const functname = menu.action;
        await functname();
        await mainMenu();
    }
    return menu.action;
}

// add all the queries first
const queryRoles = async () => {
    const [rows] = await connection.execute(
        `SELECT r.id, r.title, r.salary, d.name department
        FROM role r
        JOIN department d ON r.department_id = d.id
        ORDER BY r.id`);
    return rows;
}

const queryDepartments = async () => {
    const [rows] = await connection.execute(
        `SELECT * FROM department
        ORDER BY id`);
    return rows;
}

const queryEmployees = async () => {
    const [rows] = await connection.execute(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name)  manager
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        ORDER BY e.id`);
    return rows;
};




// now onto the main functions
const viewEmployees = async () => {
    const rows = await queryEmployees();
    console.table(rows);
};

const addEmployee = async () => {

    const roles = await queryRoles();
    if (roles.length === 0) {
        console.log('You must first create a role.');
        return;
    }
    const employees = await queryEmployees();
    const answer = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's last name?",
        },
        {
            name: 'role_id',
            type: 'list',
            message: "What is their job title?",
            choices: roles.map(r => ({ name: r.title, value: r.id })),
        },
        {
            name: 'manager_id',
            type: 'list',
            message: "What is their manager's name?",
            choices: [{ name: "none", value: null }].concat(employees.map(r => ({ name: r.first_name + " " + r.last_name, value: r.id })))
        }
    ]);
    await connection.query(
        'INSERT INTO employee SET ?',
        {
            ...answer
        });
    console.log('Your employee was added successfully!');
}


const changeEmployeeRole = async () => {
    const employees = await queryEmployees();
    const roles = await queryRoles();
    const answer = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: "Which employee would you like to update?",
            choices: employees.map(r => ({ name: r.first_name + " " + r.last_name, value: r.id }))
        },
        {
            name: 'role_id',
            type: 'list',
            message: "What is the employee's new role?",
            choices: roles.map(r => ({ name: r.title, value: r.id }))
        }
    ]);
    await connection.query(
        'UPDATE employee SET role_id = ? WHERE id= ?',
        [answer.role_id, answer.employee_id]
    );
    console.log('The employee role was successfully updated!')
}


const addRole = async () => {
    const rows = await queryDepartments();
    if (rows.length === 0) {
        console.log('You must first create a department.');
        return;
    }
    const answer = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: "What is the job title?",
        },
        {
            name: 'salary',
            type: 'input',
            message: "What is the salary for this role?",
            validate(value) {
                return isNaN(value) === false;
            },
        },
        {
            name: 'department_id',
            type: 'list',
            message: "To which department does this role belong?",
            choices: rows.map(r => ({ name: r.name, value: r.id }))
        },
    ]);
    await connection.query(
        'INSERT INTO role SET ?',
        {
            ...answer
        });
    console.log('The role was added successfully!');
};

const viewRoles = async () => {
    const rows = await queryRoles();
    console.table(rows);
}

const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: "What is the name of the department?",
        },
    ]);

    await connection.query(
        'INSERT INTO department SET ?',
        {
            ...answer
        });
    console.log('The department was added successfully!');

}

const viewDepartments = async () => {
    const rows = await queryDepartments();

    console.table(rows);
}

const viewBudgets = async () => {
    const [rows] = await connection.execute(
        `SELECT d.name department, SUM(salary) budget  
        FROM role r
        JOIN department d ON r.department_id = d.id
        JOIN employee e ON r.id = e.role_id
        
        GROUP BY d.name
        ORDER BY budget DESC`
    );

    console.table(rows);
};


const endProgram = async () => {
    await connection.end();
};


async function init() {
    connection = await getConnections();
    await mainMenu();
};

init();



