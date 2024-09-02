const apiUrl = 'http://localhost:3000/students';
const authUrl = 'http://localhost:3000/auth';

document.addEventListener('DOMContentLoaded', () => {
    const studentSection = document.getElementById('studentSection');
    const authSection = document.getElementById('authSection');

    const token = localStorage.getItem('token');
    if (token) {
        studentSection.style.display = 'block';
        authSection.style.display = 'none';
        fetchStudents();
    } else {
        studentSection.style.display = 'none';
        authSection.style.display = 'block';
    }

    // Register a new user
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        try {
            await fetch(`${authUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            alert('Registration successful. Please log in.');
            document.getElementById('registerForm').reset();
        } catch (error) {
            console.error('Error registering user:', error);
        }
    });

    // Log in
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${authUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                console.log(response);
                const { token } = await response.json();
                localStorage.setItem('token', token);
                studentSection.style.display = 'block';
                authSection.style.display = 'none';
                fetchStudents();
            } else {
                const { error } = await response.json();
                document.getElementById('loginError').textContent = error;
                document.getElementById('loginError').style.display = 'block';
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    // Logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        studentSection.style.display = 'none';
        authSection.style.display = 'block';
    });

    // Fetch and display students
    async function fetchStudents() {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const students = await response.json();
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';

            students.forEach(student => {
                const li = document.createElement('li');
                li.textContent = `ID: ${student._id}, Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`;
                studentList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    // Handle adding a student
    document.getElementById('studentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const grade = document.getElementById('grade').value;

        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, age, grade })
            });
            document.getElementById('studentForm').reset();
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    });

    // Handle updating a student
    document.getElementById('updateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('updateId').value;
        const name = document.getElementById('updateName').value;
        const age = document.getElementById('updateAge').value;
        const grade = document.getElementById('updateGrade').value;

        const updates = {};
        if (name) updates.name = name;
        if (age) updates.age = age;
        if (grade) updates.grade = grade;

        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updates)
            });
            document.getElementById('updateForm').reset();
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    });

    // Handle deleting a student
    document.getElementById('deleteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('deleteId').value;

        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            document.getElementById('deleteForm').reset();
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    });
});







// const apiUrl = 'http://localhost:3000/students';

// // Function to fetch and display students
// async function fetchStudents() {
//     try {
//         const response = await fetch(apiUrl);
//         const students = await response.json();

//         const studentList = document.getElementById('studentList');
//         studentList.innerHTML = '';

//         students.forEach(student => {
//             const li = document.createElement('li');
//             li.textContent = `ID: ${student._id}, Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`;
//             studentList.appendChild(li);
//         });
//     } catch (error) {
//         console.error('Error fetching students:', error);
//     }
// }

// // Function to handle adding a student
// document.getElementById('studentForm').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const name = document.getElementById('name').value;
//     const age = document.getElementById('age').value;
//     const grade = document.getElementById('grade').value;

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ name, age, grade })
//         });

//         if (!response.ok) {
//             throw new Error('Failed to add student');
//         }

//         document.getElementById('studentForm').reset();
//         fetchStudents();
//     } catch (error) {
//         console.error('Error adding student:', error);
//     }
// });

// // Function to handle updating a student
// document.getElementById('updateForm').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const id = document.getElementById('updateId').value;
//     const name = document.getElementById('updateName').value;
//     const age = document.getElementById('updateAge').value;
//     const grade = document.getElementById('updateGrade').value;

//     const updates = {};
//     if (name) updates.name = name;
//     if (age) updates.age = age;
//     if (grade) updates.grade = grade;

//     try {
//         const response = await fetch(`${apiUrl}/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updates)
//         });

//         if (!response.ok) {
//             throw new Error('Failed to update student');
//         }

//         document.getElementById('updateForm').reset();
//         fetchStudents();
//     } catch (error) {
//         console.error('Error updating student:', error);
//     }
// });

// // Function to handle deleting a student
// document.getElementById('deleteForm').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const id = document.getElementById('deleteId').value;

//     try {
//         const response = await fetch(`${apiUrl}/${id}`, {
//             method: 'DELETE'
//         });

//         if (!response.ok) {
//             throw new Error('Failed to delete student');
//         }

//         document.getElementById('deleteForm').reset();
//         fetchStudents();
//     } catch (error) {
//         console.error('Error deleting student:', error);
//     }
// });

// // Initial fetch
// fetchStudents();
