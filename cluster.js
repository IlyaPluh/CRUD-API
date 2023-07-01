import cluster from 'cluster';
import os from 'os';
import app from './index';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Create a new worker if one dies
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  app.listen(4000 + cluster.worker.id, () => {
    console.log(`Worker ${cluster.worker.id} is running`);
  });
}
