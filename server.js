// dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const getConnections = require('./db/connection');
let connection;






//main menu
mainMenu = async () => {
    const menu = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "What would you like do",
            choices: [
                { name: 'View employees', value: viewEmployees },

                { name: 'Add employee', value: insertEmployee },

                { name: 'Remove employee', value: deleteEmployee },

                { name: 'Change employee role', value: changeEmployeeRole },

                { name: 'Change employee manager', value: changeEmployeeManager },

                { name: 'View employees by manager', value: viewEmployeesByManager },

                { name: 'Add role', value: addRole },

                { name: 'View roles', value: viewRoles },

                { name: 'Add department', value: addDepartment },

                { name: 'View departments', value: viewDepartments },

                { name: 'Display department budgets', value: viewBudgets },

                { name: 'Exit', value: 'exit' },
            ]
        }
    ]);
    if (answer.action === 'exit') {
        await endProgram();
    }
    //will re-prompt main menu after the selected function runs 
    else {
        const functname = answer.action;
        await functname();
        await mainPrompt();
    }

    return menu.action;
}






const viewEmployees = async () => {
    const [rows] = await connection.execute(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name)  manager
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        ORDER BY e.id`);

    return rows;
}

const insertEmployee = async () => {

}

const deleteEmployee = async () => {

}

const changeEmployeeRole = async () => {

}

const changeEmployeeManager = async () => {

}

const viewEmployeesByManager = async () => {

}

const addRole = async () => {

}

const viewRoles = async () => {

}

const addDepartment = async () => {

}

const viewDepartments = async () => {

}

const viewBudgets = async () => {

}




const endProgram = async () => {
    await connection.end();
};


async function init() {
    connection = await getConnection();
    await mainMenu();
};

init();



