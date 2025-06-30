import { exec } from 'child_process';

export async function executeCommand(command: string) {
  return new Promise<void>((resolve, reject) => {
    const child = exec(command, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    child.stdout?.on('data', data => {
      process.stdout.write(data);
    });

    child.stderr?.on('data', data => {
      process.stderr.write(data);
    });
  });
}
