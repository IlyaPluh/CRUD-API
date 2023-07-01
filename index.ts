import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Database
const users: User[] = [];

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

// Routes
app.get('/api/users', (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.get('/api/users/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

app.post('/api/users', (req: Request, res: Response) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required' });
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

app.put('/api/users/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.username = username || user.username;
  user.age = age || user.age;
  user.hobbies = hobbies || user.hobbies;

  res.status(200).json(user);
});

app.delete('/api/users/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.status(204).end();
});

// Handle non-existing endpoints
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
