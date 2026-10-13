/** Version 1 records bytes and Git's executable bit, not ownership or full POSIX permissions. */
export interface FileRecord { path: string; sha256: string; executable: boolean }
export interface Manifest { version: 1; sourceCommit: string; files: FileRecord[] }
export interface Snapshot { [path: string]: { sha256: string; executable: boolean } | undefined }
export interface Operation { kind: 'add' | 'replace' | 'delete'; path: string }
export interface CopyPlan { previous: Manifest | null; next: Manifest; operations: Operation[] }
