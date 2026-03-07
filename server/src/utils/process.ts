import { spawn, type ChildProcess } from "node:child_process";

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export const spawnWithTimeout = (
  command: string,
  args: ReadonlyArray<string>,
  timeoutMs: number,
): Promise<ProcessResult> => {
  return new Promise((resolve, reject) => {
    const child: ChildProcess = spawn(command, [...args], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    const chunks: Buffer[] = [];
    const errorChunks: Buffer[] = [];
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      child.kill("SIGTERM");
      reject(new Error("Process timed out"));
    }, timeoutMs);

    child.stdout?.on("data", (chunk: Buffer) => chunks.push(chunk));
    child.stderr?.on("data", (chunk: Buffer) => errorChunks.push(chunk));

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return;
      resolve({
        stdout: Buffer.concat(chunks).toString("utf-8"),
        stderr: Buffer.concat(errorChunks).toString("utf-8"),
        exitCode: code,
      });
    });
  });
};
