export default function handler(req, res) {  
    if (req.method === "POST") {  
      const { message } = req.body;  
      console.log("Received message:", message);  
      // Here you can handle the message, e.g., save it to a database or send it to another API  
      res.status(200).json({ status: "Message received", message });  
    } else {  
      res.status(405).json({ error: "Method not allowed" });  
    }  
  }  