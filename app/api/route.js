// Function to get the room data from the database

const BACKEND_API_URL = 'https://api.example.com';

// Returns the next camera id
const createRoom = async () => {
    resp = await fetch("http://localhost:8080/askChatGPT",
        {    method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            body: JSON.stringify({request:"Salutare!"})
        })
        .then( response => response.json())
        console.log(resp["response"])

    return resp;
}

const getRoomData = async (roomId) => {
    const response = await fetch(`${BACKEND_API_URL}/room/${roomId}`);
    const data = await response.json();
    return data;
}